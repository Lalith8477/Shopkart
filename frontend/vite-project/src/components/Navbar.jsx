import { Link, useNavigate } from "react-router-dom"
import { axiosInstance } from "../services/api"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"

function Navbar() {

    const navigate = useNavigate()
    const { user, setUser } = useAuth()
    const { totalItems } = useCart()

    const handleLogout = async () => {
        try {
            await axiosInstance.post("/customers/logout")

            setUser(null)
            navigate("/login")

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <nav className="navbar">
            <h2>ShopKart</h2>

            <div className="nav-links">
                <Link to="/home">Home</Link>
                <Link to="/products">Products</Link>
                <Link to="/wishlist">
                    Wishlist ({user?.wishlist?.length || 0})
                </Link>
                <Link to="/cart">Cart ({totalItems})</Link>
                <Link to="/orders">Orders</Link>
            </div>

            <button onClick={handleLogout}>
                Logout
            </button>
        </nav>
    )
}

export default Navbar
