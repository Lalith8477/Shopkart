import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../services/api";
import Navbar from "../components/Navbar";

function ProductDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null)
    const [errorMsg, setErrorMsg] = useState("")
    const [loader, setLoader] = useState(true)

    useEffect(() => {

        const fetchProduct = async () => {
            try {
                const response = await axiosInstance.get(`/products/${id}`)
                setProduct(response.data.product);

            } catch (error) {
                console.log(error);
                setErrorMsg("Something went wrong while loading the product.")
            } finally {
                setLoader(false)
            }
        };
        fetchProduct();
    }, [id])

    return (
        <div className="page">

            <Navbar />

            <div className="page-content">

                <button className="back-button" onClick={() => navigate("/products")}>
                    Back to Products
                </button>

                {loader && (
                    <p className="status-message">Loading product...</p>
                )}

                {errorMsg && (
                    <p className="error">{errorMsg}</p>
                )}

                {product && (
                    <div className="details-card">

                        <img src={product.image} alt={product.name} />

                        <div className="details-info">

                            <h1>{product.name}</h1>

                            <p className="product-category">{product.category}</p>

                            <p className="product-price">
                                ₹{product.price.toLocaleString("en-IN")}
                            </p>

                            <p className="details-description">{product.description}</p>

                            <p className={product.stock > 0 ? "stock in-stock" : "stock out-of-stock"}>
                                {product.stock > 0 ? `${product.stock} units left` : "Out of stock"}
                            </p>

                            <button className="cart-button">
                                Add to Cart
                            </button>

                        </div>

                    </div>
                )}

            </div>

        </div>
    );
}

export default ProductDetails;
