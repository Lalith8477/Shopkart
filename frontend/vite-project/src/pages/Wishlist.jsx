import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../services/api";
import Navbar from "../components/Navbar";
import WishlistCard from "../components/WishlistCard";

function Wishlist() {

    const navigate = useNavigate();

    const [wishlist, setWishlist] = useState([])
    const [errorMsg, setErrorMsg] = useState("")
    const [loader, setLoader] = useState(true)
    const [retry, setRetry] = useState(0)

    useEffect(() => {

        const fetchWishlist = async () => {
            try {
                const response = await axiosInstance.get("/wishlist")
                setWishlist(response.data.wishlist)
            } catch (error) {
                console.log(error);
                setErrorMsg("We couldn't load your wishlist.")
            } finally {
                setLoader(false);
            }
        };
        fetchWishlist();

    }, [retry]);

    const handleRetry = () => {
        setLoader(true);
        setErrorMsg("");
        setRetry(retry + 1)
    };

    const handleRemove = (productId) => {
        setWishlist(wishlist.filter((product) => product._id !== productId))
    };

    return (
        <div className="page">

            <Navbar />

            <div className="page-content">

                <h1>My Wishlist</h1>

                {loader && (
                    <p className="status-message">Loading your wishlist...</p>
                )}

                {errorMsg && (
                    <div className="empty-state">
                        <h2>Something went wrong.</h2>
                        <p>{errorMsg}</p>
                        <button onClick={handleRetry}>Try Again</button>
                    </div>
                )}

                {!loader && !errorMsg && wishlist.length === 0 && (
                    <div className="empty-state">
                        <h2>Your wishlist is empty ❤️</h2>
                        <p>Start saving products you love.</p>
                        <button onClick={() => navigate("/products")}>Browse Products</button>
                    </div>
                )}

                {!loader && !errorMsg && wishlist.length > 0 && (
                    <>
                        <p className="wishlist-count">
                            {wishlist.length} {wishlist.length === 1 ? "product" : "products"} saved
                        </p>

                        <div className="product-grid">
                            {wishlist.map((product) => (
                                <WishlistCard
                                    key={product._id}
                                    product={product}
                                    onRemove={handleRemove}
                                />
                            ))}
                        </div>
                    </>
                )}

            </div>

        </div>
    );
}

export default Wishlist;
