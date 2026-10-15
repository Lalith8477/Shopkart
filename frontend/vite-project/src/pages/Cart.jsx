import { useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import Navbar from "../components/Navbar"
import CartItem from "../components/CartItem"

function Cart() {

    const navigate = useNavigate()
    const { cartItems, loader, errorMsg, refreshCart, totalItems, subtotal } = useCart()

    return (
        <div className="page">

            <Navbar />

            <div className="page-content">

                <h1>My Cart</h1>

                {loader && (
                    <p className="status-message">Loading your cart...</p>
                )}

                {errorMsg && (
                    <div className="empty-state">
                        <h2>Unable to load your cart.</h2>
                        <p>Something went wrong on our side.</p>
                        <button onClick={refreshCart}>Try Again</button>
                    </div>
                )}

                {!loader && !errorMsg && cartItems.length === 0 && (
                    <div className="empty-state">
                        <h2>Your cart is empty 🛒</h2>
                        <p>Looks like you haven't added anything yet.</p>
                        <button onClick={() => navigate("/products")}>Browse Products</button>
                    </div>
                )}

                {!loader && !errorMsg && cartItems.length > 0 && (
                    <div className="cart-layout">

                        <div className="cart-list">
                            {cartItems.map((item) => (
                                <CartItem key={item.product._id} item={item} />
                            ))}
                        </div>

                        <div className="order-summary">

                            <h2>Order Summary</h2>

                            <p>
                                <span>Items</span>
                                <span>{totalItems}</span>
                            </p>

                            <p>
                                <span>Subtotal</span>
                                <span>₹{subtotal.toLocaleString("en-IN")}</span>
                            </p>

                            <button onClick={() => navigate("/checkout")}>Proceed to Checkout</button>

                        </div>

                    </div>
                )}

            </div>

        </div>
    )
}

export default Cart