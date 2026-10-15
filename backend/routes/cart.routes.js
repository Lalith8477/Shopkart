import express from 'express'
import { addToCart, getCart, updateQuantity, removeFromCart } from '../controllers/cart.controller.js'
import { isAuthenticated } from '../middlewares/authMiddleware.js'

const cartRoutes = express.Router()

cartRoutes.post("/:productId", isAuthenticated, addToCart)
cartRoutes.get("/", isAuthenticated, getCart)
cartRoutes.patch("/:productId", isAuthenticated, updateQuantity)
cartRoutes.delete("/:productId", isAuthenticated, removeFromCart)


export default cartRoutes
