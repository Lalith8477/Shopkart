import { useNavigate } from "react-router-dom"

function OrderCard({ order }) {

    const navigate = useNavigate()

    const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    })

    return (
        <div className="order-card">

            <div className="order-card-header">
                <h3>Order #{order._id.slice(-8)}</h3>
                <p>{orderDate}</p>
            </div>

            <div className="order-card-items">
                {order.items.map((item) => (
                    <p key={item._id}>{item.name} × {item.quantity}</p>
                ))}
            </div>

            <div className="order-card-footer">

                <div>
                    <p className="product-price">₹{order.totalAmount.toLocaleString("en-IN")}</p>
                    <span className="status-badge">{order.status}</span>
                </div>

                <button onClick={() => navigate(`/orders/${order._id}`)}>
                    View Details
                </button>

            </div>

        </div>
    )
}

export default OrderCard