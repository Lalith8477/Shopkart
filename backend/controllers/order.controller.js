import Order from '../models/order.model.js'
import Product from '../models/product.model.js'
import razorpay from '../config/razorpay.js'
import mongoose from 'mongoose'
import crypto from 'crypto'

const isEmpty = (value) => !value || String(value).trim() === ""


export const createPaymentOrder = async (req, res) => {
    try {
        const { shippingAddress } = req.body

        if (!shippingAddress) {
            return res.status(400).json({ message: "Shipping address is required" })
        }

        const { fullName, phone, addressLine1, city, state, pincode } = shippingAddress

        if (isEmpty(fullName) || isEmpty(phone) || isEmpty(addressLine1) || isEmpty(city) || isEmpty(state) || isEmpty(pincode)) {
            return res.status(400).json({ message: "All shipping details are required" })
        }
        if (!/^\d{10}$/.test(String(phone).trim())) {
            return res.status(400).json({ message: "Phone number must contain 10 digits" })
        }
        if (!/^\d{6}$/.test(String(pincode).trim())) {
            return res.status(400).json({ message: "Pincode must contain 6 digits" })
        }

        if (req.customer.cart.length === 0) {
            return res.status(400).json({ message: "Your cart is empty" })
        }

        const items = []
        let totalAmount = 0

        for (const cartItem of req.customer.cart) {
            const product = await Product.findById(cartItem.product)

            if (!product) {
                return res.status(400).json({ message: "A product in your cart is no longer available" })
            }
            if (cartItem.quantity > product.stock) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}.` })
            }

            items.push({
                product : product._id,
                name : product.name,
                price : product.price,
                quantity : cartItem.quantity,
                image : product.image
            })

            totalAmount = totalAmount + product.price * cartItem.quantity
        }

        const order = await Order.create({
            user : req.customer._id,
            items : items,
            shippingAddress : {
                fullName : String(fullName).trim(),
                phone : String(phone).trim(),
                addressLine1 : String(addressLine1).trim(),
                city : String(city).trim(),
                state : String(state).trim(),
                pincode : String(pincode).trim()
            },
            totalAmount : totalAmount
        })

        const razorpayOrder = await razorpay.orders.create({
            amount : Math.round(totalAmount * 100),
            currency : "INR",
            receipt : order._id.toString()
        })

        order.razorpayOrderId = razorpayOrder.id
        await order.save()

        res.status(200).json({
            success : true,
            shopKartOrderId : order._id,
            razorpayOrderId : razorpayOrder.id,
            amount : razorpayOrder.amount,
            currency : razorpayOrder.currency,
            key : process.env.RAZORPAY_KEY_ID })

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error })
    }
}


export const verifyPayment = async (req, res) => {
    try {
        const { shopKartOrderId, razorpay_payment_id, razorpay_signature } = req.body

        if (!shopKartOrderId || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: "Payment details are required" })
        }

        if (!mongoose.isValidObjectId(shopKartOrderId)) {
            return res.status(400).json({ message: "Invalid order id" })
        }

        const order = await Order.findOne({ _id : shopKartOrderId, user : req.customer._id })

        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }

        if (order.paymentStatus === "PAID") {
            return res.status(400).json({ message: "Order is already paid" })
        }

        const body = order.razorpayOrderId + "|" + razorpay_payment_id

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex")

        if (expectedSignature !== razorpay_signature) {
            order.paymentStatus = "FAILED"
            await order.save()

            return res.status(400).json({ success : false, message: "Invalid payment signature" })
        }

        order.paymentStatus = "PAID"
        order.status = "PLACED"
        order.razorpayPaymentId = razorpay_payment_id
        await order.save()

        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, { $inc : { stock : -item.quantity } })
        }

        req.customer.cart = []
        await req.customer.save()

        res.status(200).json({ success : true, message: "Payment verified, order placed", order : order })

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error })
    }
}


export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user : req.customer._id, paymentStatus : "PAID" }).sort({ createdAt : -1 })

        res.status(200).json({ success : true, orders : orders })

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error })
    }
}


export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid order id" })
        }

        const order = await Order.findOne({ _id : id, user : req.customer._id })

        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }

        res.status(200).json({ success : true, order : order })

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error })
    }
}