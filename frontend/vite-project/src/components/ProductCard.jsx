import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { axiosInstance } from "../services/api"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"

function ProductCard({ product }) {

    const navigate = useNavigate()
    const { user, setUser } = useAuth()
    const { addToCart } = useCart()

    const [loader, setLoader] = useState(false)
    const [cartLoader, setCartLoader] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    const isSaved = user?.wishlist?.includes(product._id)

    const handleWishlist = async () => {
        setLoader(true)
        setErrorMsg("")

        try {
            await axiosInstance.post(`/wishlist/${product._id}`)

            const response = await axiosInstance.get("/customers/me")
            setUser(response.data.customerProfile)

        } catch (error) {
            console.log(error)
            setErrorMsg("Unable to save product. Please try again.")
        } finally {
            setLoader(false)
        }
    }

    const handleAddToCart = async () => {
        setCartLoader(true)
        setErrorMsg("")

        try {
            await addToCart(product._id)

        } catch (error) {
            console.log(error)
            setErrorMsg("Unable to add to cart. Please try again.")
        } finally {
            setCartLoader(false)
        }
    }

    let wishlistText = "♡ Add to Wishlist"

    if (loader) {
        wishlistText = "⏳ Saving..."
    } else if (isSaved) {
        wishlistText = "♥ Added to Wishlist"
    }

    return (
        <div className="product-card">

            <img src={product.image} alt={product.name} />

            <div className="product-info">

                <h3>{product.name}</h3>

                <p className="product-category">{product.category}</p>

                <p className="product-price">
                    ₹{product.price.toLocaleString("en-IN")}
                </p>

                <p className={product.stock > 0 ? "stock in-stock" : "stock out-of-stock"}>
                    {product.stock > 0 ? `${product.stock} units left` : "Out of stock"}
                </p>

                {errorMsg && (
                    <p className="card-error">{errorMsg}</p>
                )}

                <div className="card-buttons">

                    <button onClick={() => navigate(`/products/${product._id}`)}>
                        View Details
                    </button>

                    <button
                        className="cart-add"
                        onClick={handleAddToCart}
                        disabled={cartLoader || product.stock === 0}
                    >
                        {cartLoader ? "Adding..." : "Add to Cart"}
                    </button>

                    <button
                        className={isSaved ? "wishlist-button saved" : "wishlist-button"}
                        onClick={handleWishlist}
                        disabled={loader || isSaved}
                    >
                        {wishlistText}
                    </button>

                </div>

            </div>

        </div>
    )
}

export default ProductCard