import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { axiosInstance } from "../services/api"
import { useCart } from "../context/CartContext"
import Navbar from "../components/Navbar"

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true)
            return
        }

        const script = document.createElement("script")
        script.src = "https://checkout.razorpay.com/v1/checkout.js"

        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)

        document.body.appendChild(script)
    })
}

function Checkout() {

    const navigate = useNavigate()
    const { cartItems, loader: cartLoader, errorMsg: cartError, subtotal, clearCart } = useCart()

    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        addressLine1: "",
        city: "",
        state: "",
        pincode: ""
    })

    const [errorMsg, setErrorMsg] = useState("")
    const [loader, setLoader] = useState(false)

    const handleChange = (e) => {
        setForm({...form,
            [e.target.name]: e.target.value
        })

        setErrorMsg("")
    }

    const validateForm = () => {
        if (!form.fullName.trim() || !form.phone.trim() || !form.addressLine1.trim() || !form.city.trim() || !form.state.trim() || !form.pincode.trim()) {
            return "Please fill in all fields."
        }
        if (!/^\d{10}$/.test(form.phone.trim())) {
            return "Phone number must contain 10 digits."
        }
        if (!/^\d{6}$/.test(form.pincode.trim())) {
            return "Pincode must contain 6 digits."
        }
        return ""
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const validationError = validateForm()

        if (validationError) {
            setErrorMsg(validationError)
            return
        }

        setLoader(true)
        setErrorMsg("")

        try {
            const scriptLoaded = await loadRazorpayScript()

            if (!scriptLoaded) {
                setErrorMsg("Unable to load Razorpay. Please check your internet and try again.")
                setLoader(false)
                return
            }

            const response = await axiosInstance.post("/orders/create-payment-order", {
                shippingAddress: form
            })

            const data = response.data

            const options = {
                key: data.key,
                amount: data.amount,
                currency: data.currency,
                name: "ShopKart",
                description: "ShopKart Order",
                order_id: data.razorpayOrderId,

                handler: async (paymentResponse) => {
                    try {
                        await axiosInstance.post("/orders/verify-payment", {
                            shopKartOrderId: data.shopKartOrderId,
                            razorpay_order_id: paymentResponse.razorpay_order_id,
                            razorpay_payment_id: paymentResponse.razorpay_payment_id,
                            razorpay_signature: paymentResponse.razorpay_signature
                        })

                        clearCart()
                        navigate(`/order-success/${data.shopKartOrderId}`)

                    } catch (error) {
                        console.log(error)
                        setErrorMsg("Payment could not be verified. Your cart has not been cleared.")
                        setLoader(false)
                    }
                },

                prefill: {
                    name: form.fullName,
                    contact: form.phone
                },

                modal: {
                    ondismiss: () => setLoader(false)
                }
            }

            const paymentObject = new window.Razorpay(options)

            paymentObject.on("payment.failed", (failure) => {
                console.log(failure.error)
                setErrorMsg("Payment failed. Your cart has not been cleared. Please try again.")
                setLoader(false)
            })

            paymentObject.open()

        } catch (error) {
            console.log(error)

            setErrorMsg(
                error.response?.data?.message ||
                "Something went wrong while placing the order."
            )
            setLoader(false)
        }
    }

    return (
        <div className="page">

            <Navbar />

            <div className="page-content">

                <h1>Checkout</h1>

                {cartLoader && (
                    <p className="status-message">Loading your cart...</p>
                )}

                {cartError && (
                    <p className="error">{cartError}</p>
                )}

                {!cartLoader && !cartError && cartItems.length === 0 && (
                    <div className="empty-state">
                        <h2>Your cart is empty 🛒</h2>
                        <p>Add some products before checking out.</p>
                        <button onClick={() => navigate("/products")}>Browse Products</button>
                    </div>
                )}

                {!cartLoader && !cartError && cartItems.length > 0 && (
                    <form className="cart-layout" onSubmit={handleSubmit}>

                        <div className="checkout-form">

                            <h2>Shipping Details</h2>

                            {errorMsg && (
                                <p className="error">{errorMsg}</p>
                            )}

                            <input
                                type="text"
                                name="fullName"
                                placeholder="Full Name"
                                value={form.fullName}
                                onChange={handleChange}
                            />

                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone Number"
                                value={form.phone}
                                onChange={handleChange}
                            />

                            <input
                                type="text"
                                name="addressLine1"
                                placeholder="Address"
                                value={form.addressLine1}
                                onChange={handleChange}
                            />

                            <input
                                type="text"
                                name="city"
                                placeholder="City"
                                value={form.city}
                                onChange={handleChange}
                            />

                            <input
                                type="text"
                                name="state"
                                placeholder="State"
                                value={form.state}
                                onChange={handleChange}
                            />

                            <input
                                type="text"
                                name="pincode"
                                placeholder="Pincode"
                                value={form.pincode}
                                onChange={handleChange}
                            />

                        </div>

                        <div className="order-summary">

                            <h2>Order Summary</h2>

                            {cartItems.map((item) => (
                                <p key={item.product._id}>
                                    <span>{item.product.name} × {item.quantity}</span>
                                    <span>₹{(item.product.price * item.quantity).toLocaleString("en-IN")}</span>
                                </p>
                            ))}

                            <p>
                                <span>Total</span>
                                <span>₹{subtotal.toLocaleString("en-IN")}</span>
                            </p>

                            <button type="submit" disabled={loader}>
                                {loader ? "Processing..." : "Place Order"}
                            </button>

                        </div>

                    </form>
                )}

            </div>

        </div>
    )
}

export default Checkout