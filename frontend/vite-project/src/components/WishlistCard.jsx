import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../services/api";
import { useAuth } from "../context/AuthContext";

function WishlistCard({ product, onRemove}) {

    const navigate = useNavigate();
    const { setUser } = useAuth();

    const [loader, setLoader] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    const handleRemove = async () => {
        setLoader(true);
        setErrorMsg("");
        try {
            await axiosInstance.delete(`/wishlist/${product._id}`)

            const response = await axiosInstance.get("/customers/me")
            setUser(response.data.customerProfile)
            onRemove(product._id)

        } catch (error) {
            console.log(error)
            setErrorMsg("Unable to remove product. Please try again.")
            setLoader(false);
        }
    };

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
                        className="wishlist-button remove"
                        onClick={handleRemove}
                        disabled={loader}
                    >
                        {loader ? "Removing..." : "Remove ♥"}
                    </button>

                </div>

            </div>

        </div>
    );
}

export default WishlistCard;