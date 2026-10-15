import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { axiosInstance } from "../services/api"
import Navbar from "../components/Navbar"

function OrderSuccess() {

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
                setErrorMsg("Unable to load your order.")
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

                {loader && (
                    <p className="status-message">Loading your order...</p>
                )}

                {errorMsg && (
                    <p className="error">{errorMsg}</p>
                )}

                {order && (
                    <div className="success-card">

                        <h1>✅ Order Placed Successfully</h1>

                        <p>Order ID</p>
                        <h3>{order._id}</h3>

                        <p>Total</p>
                        <h3>₹{order.totalAmount.toLocaleString("en-IN")}</h3>

                        <p>Status</p>
                        <h3>{order.status}</h3>

                        <p className="success-note">Your order has been saved successfully.</p>

                        <div className="success-buttons">
                            <button onClick={() => navigate("/orders")}>View My Orders</button>
                            <button className="light" onClick={() => navigate("/products")}>Continue Shopping</button>
                        </div>

                    </div>
                )}

            </div>

        </div>
    )
}

export default OrderSuccess