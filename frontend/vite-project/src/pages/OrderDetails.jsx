import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { axiosInstance } from "../services/api"
import Navbar from "../components/Navbar"

function OrderDetails() {

    const { id } = useParams()
    const navigate = useNavigate()

    const [order, setOrder] = useState(null)
    const [errorMsg, setErrorMsg] = useState("")
    const [loader, setLoader] = useState(true)

    useEffect(() => {

        const fetchOrder = async () => {
            try {
                const response = await axiosInstance.get(`/orders/${id}`)

                setOrder(response.data.order)

            } catch (error) {
                console.log(error)
                setErrorMsg("Unable to load this order.")
            } finally {
                setLoader(false)
            }
        }

        fetchOrder()

    }, [id])

    return (
        <div className="page">

            <Navbar />

            <div className="page-content">

                <button className="back-button" onClick={() => navigate("/orders")}>
                    Back to Orders
                </button>

                {loader && (
                    <p className="status-message">Loading order...</p>
                )}

                {errorMsg && (
                    <p className="error">{errorMsg}</p>
                )}

                {order && (
                    <div className="order-details">

                        <h1>Order #{order._id.slice(-8)}</h1>

                        <p className="order-meta">
                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric"
                            })}
                            {" · "}
                            <span className="status-badge">{order.status}</span>
                            {" · Payment: "}
                            {order.paymentStatus}
                        </p>

                        <div className="details-section">

                            <h2>Items</h2>

                            {order.items.map((item) => (
                                <div className="order-item" key={item._id}>

                                    <img src={item.image} alt={item.name} />

                                    <div>
                                        <h3>{item.name}</h3>
                                        <p>₹{item.price.toLocaleString("en-IN")} × {item.quantity}</p>
                                    </div>

                                    <p className="cart-item-total">
                                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                                    </p>

                                </div>
                            ))}

                            <p className="order-total">
                                <span>Total</span>
                                <span>₹{order.totalAmount.toLocaleString("en-IN")}</span>
                            </p>

                        </div>

                        <div className="details-section">

                            <h2>Shipping Address</h2>

                            <p>{order.shippingAddress.fullName}</p>
                            <p>{order.shippingAddress.addressLine1}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                            <p>Phone: {order.shippingAddress.phone}</p>

                        </div>

                    </div>
                )}

            </div>

        </div>
    )
}

export default OrderDetails