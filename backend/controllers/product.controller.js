import Product from '../models/product.model.js'
import mongoose from 'mongoose'

export const createProduct = async(req, res) => {
    try{
        const {name, description, price, category, image, stock} = req.body

        if (!name || !description || !category || !image || price === undefined || stock === undefined) {
            return res.status(400).json({ message: "All fields Required" })
        }
        if (isNaN(price) || price <= 0) {
            return res.status(400).json({ message: "Price must be greater than 0" })
        }
        if (isNaN(stock) || stock < 0) {
            return res.status(400).json({ message: "Stock cannot be negative" })
        }
        const product = await Product.create({
            name,
            description,
            price,
            category,
            image,
            stock
        })

        res.status(201).json({
            success : true,
            message: "Product created successfully",
            product : product })

    }catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err })
    }
}


export const getAllProducts = async (req, res) => {
    try {
        const { search, category } = req.query

        const filter = {}

        if (search) {
            filter.name = { $regex: search, $options: "i" }
        }
        if (category) {
            filter.category = category
        }
        const products = await Product.find(filter).select("name price category image stock")

        res.status(200).json({
            success : true,
            count : products.length,
            products : products })

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error })
    }
}


export const getProductById = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid product id" })
        }
        const product = await Product.findById(id)

        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }
        res.status(200).json({ success : true, product : product })

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error })
    }
}
