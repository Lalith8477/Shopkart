import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import customerRoutes from './routes/user.routes.js'
import productRoutes from './routes/product.routes.js'
import wishlistRoutes from './routes/wishlist.routes.js'
import cartRoutes from './routes/cart.routes.js'
import orderRoutes from './routes/order.routes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()

dotenv.config()
const port = 8058

app.use(express.json())
app.use(cookieParser())

mongoose.connect(process.env.dbUrl).then(() => {
    console.log("DB Connected")
}).catch((err) => {
    console.log(err)
})

app.use(cors({
    origin : 'http://localhost:5173',
    credentials : true
}))


app.use('/customers' , customerRoutes)
app.use('/products' , productRoutes)
app.use('/wishlist' , wishlistRoutes)
app.use('/cart' , cartRoutes)
app.use('/orders' , orderRoutes)

app.listen(port, () => {
    console.log("Server Started")
})