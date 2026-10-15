import Customer from '../models/user.model.js'
import Product from '../models/product.model.js'
import mongoose from 'mongoose'

export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.params

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({ message: "Invalid product id" })
        }
        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }
        const alreadySaved = req.customer.wishlist.some((id) => id.toString() === productId)

        if (alreadySaved) {
            return res.status(409).json({ message: "Product already in wishlist" })
        }
        req.customer.wishlist.push(productId)
        await req.customer.save()

        res.status(200).json({ success : true, message: "Product added to wishlist" })

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error })
    }
}


export const getWishlist = async (req, res) => {
    try {
        const customer = await Customer.findById(req.customer._id).populate({
            path : "wishlist",
            select : "name price category image stock"
        })

        res.status(200).json({
            success : true,
            count : customer.wishlist.length,
            wishlist : customer.wishlist }) 

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error })
    }
}


export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({ message: "Invalid product id" })
        }
        const alreadySaved = req.customer.wishlist.some((id) => id.toString() === productId)

        if (!alreadySaved) {
            return res.status(404).json({ message: "Product not in wishlist" })
        }
        req.customer.wishlist = req.customer.wishlist.filter((id) => id.toString() !== productId)
        await req.customer.save()

        res.status(200).json({ success : true, message: "Product removed from wishlist" })

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error })
    }
}
