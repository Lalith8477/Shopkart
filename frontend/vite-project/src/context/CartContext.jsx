import { createContext, useContext, useEffect, useState } from "react"
import { axiosInstance } from "../services/api"
import { useAuth } from "./AuthContext"

const CartContext = createContext()

export const CartProvider = ({ children }) => {

    const { user } = useAuth()
    const customerId = user?._id

    const [cartItems, setCartItems] = useState([])
    const [loader, setLoader] = useState(true)
    const [errorMsg, setErrorMsg] = useState("")
    const [retry, setRetry] = useState(0)

    useEffect(() => {

        const fetchCart = async () => {
            if (!customerId) {
                setCartItems([])
                return
            }

            try {
                const response = await axiosInstance.get("/cart")

                setCartItems(response.data.cart)
                setErrorMsg("")

            } catch (error) {
                console.log(error)
                setErrorMsg("Unable to load your cart.")
            } finally {
                setLoader(false)
            }
        }

        fetchCart()

    }, [customerId, retry])

    const refreshCart = () => {
        setLoader(true)
        setErrorMsg("")
        setRetry(retry + 1)
    }

    const addToCart = async (productId) => {
        const response = await axiosInstance.post(`/cart/${productId}`)

        setCartItems(response.data.cart)
    }

    const updateQuantity = async (productId, quantity) => {
        const response = await axiosInstance.patch(`/cart/${productId}`, { quantity })

        setCartItems(response.data.cart)
    }

    const removeFromCart = async (productId) => {
        const response = await axiosInstance.delete(`/cart/${productId}`)

        setCartItems(response.data.cart)
    }

    const clearCart = () => {
        setCartItems([])
    }

    let totalItems = 0
    let subtotal = 0

    cartItems.forEach((item) => {
        totalItems = totalItems + item.quantity
        subtotal = subtotal + item.product.price * item.quantity
    })

    return (
        <CartContext.Provider value={{
            cartItems,
            loader,
            errorMsg,
            refreshCart,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
            totalItems,
            subtotal
        }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext)