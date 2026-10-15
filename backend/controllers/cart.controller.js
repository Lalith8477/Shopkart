import Customer from '../models/user.model.js'
import Product from '../models/product.model.js'
import mongoose from 'mongoose'

const getPopulatedCart = async (customerId) => {
    const customer = await Customer.findById(customerId).populate({
        path : "cart.product",
        select : "name price category image stock"
    })

    return customer.cart
}


export const addToCart = async (req, res) => {
    try {
        const { productId } = req.params

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({ message: "Invalid product id" })
        }

        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        const cartItem = req.customer.cart.find((item) => item.product.toString() === productId)

        let newQuantity = 1

        if (cartItem) {
            newQuantity = cartItem.quantity + 1
        }

        if (newQuantity > product.stock) {
            return res.status(400).json({ message: "Not enough stock available" })
        }

        if (cartItem) {
            cartItem.quantity = newQuantity
        } else {
            req.customer.cart.push({ product : productId, quantity : 1 })
        }

        await req.customer.save()

        const cart = await getPopulatedCart(req.customer._id)

        res.status(200).json({ success : true, message: "Cart updated", cart : cart })

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error })
    }
}


export const getCart = async (req, res) => {
    try {
        const cart = await getPopulatedCart(req.customer._id)

        res.status(200).json({ success : true, cart : cart })

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error })
    }
}


export const updateQuantity = async (req, res) => {
    try {
        const { productId } = req.params
        const { quantity } = req.body

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({ message: "Invalid product id" })
        }

        if (!Number.isInteger(quantity)) {
            return res.status(400).json({ message: "Quantity must be a whole number" })
        }

        if (quantity < 1) {
            return res.status(400).json({ message: "Quantity must be at least 1" })
        }

        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        const cartItem = req.customer.cart.find((item) => item.product.toString() === productId)

        if (!cartItem) {
            return res.status(404).json({ message: "Product not in cart" })
        }

        if (quantity > product.stock) {
            return res.status(400).json({ message: "Not enough stock available" })
        }

        cartItem.quantity = quantity
        await req.customer.save()

        const cart = await getPopulatedCart(req.customer._id)

        res.status(200).json({ success : true, message: "Quantity updated", cart : cart })

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error })
    }
}


export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({ message: "Invalid product id" })
        }

        const cartItem = req.customer.cart.find((item) => item.product.toString() === productId)

        if (!cartItem) {
            return res.status(404).json({ message: "Product not in cart" })
        }

        req.customer.cart = req.customer.cart.filter((item) => item.product.toString() !== productId)
        await req.customer.save()

        const cart = await getPopulatedCart(req.customer._id)

        res.status(200).json({ success : true, message: "Product removed from cart", cart : cart })

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error })
    }
}
