import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { axiosInstance } from "../services/api"
import Navbar from "../components/Navbar"
import OrderCard from "../components/OrderCard"

function Orders() {

    const navigate = useNavigate()

    const [orders, setOrders] = useState([])
    const [errorMsg, setErrorMsg] = useState("")
    const [loader, setLoader] = useState(true)

    useEffect(() => {

        const fetchOrders = async () => {
            try {
                const response = await axiosInstance.get("/orders")

                setOrders(response.data.orders)

            } catch (error) {
                console.log(error)
                setErrorMsg("Unable to load your orders.")
            } finally {
                setLoader(false)
            }
        }

        fetchOrders()

    }, [])

    return (
        <div className="page">

            <Navbar />

            <div className="page-content">

                <h1>My Orders</h1>

                {loader && (
                    <p className="status-message">Loading your orders...</p>
                )}

                {errorMsg && (
                    <p className="error">{errorMsg}</p>
                )}

                {!loader && !errorMsg && orders.length === 0 && (
                    <div className="empty-state">
                        <h2>You have not placed any orders yet.</h2>
                        <p>Your orders will show up here.</p>
                        <button onClick={() => navigate("/products")}>Start Shopping</button>
                    </div>
                )}

                {!loader && !errorMsg && orders.length > 0 && (
                    <div className="order-list">
                        {orders.map((order) => (
                            <OrderCard key={order._id} order={order} />
                        ))}
                    </div>
                )}

            </div>

        </div>
    )
}

export default Orders