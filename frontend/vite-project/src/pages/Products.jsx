import { useEffect, useState } from "react";
import { axiosInstance } from "../services/api";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import ProductCard from "../components/ProductCard";

function Products() {

    const [products, setProducts] = useState([])
    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("")

    const [errorMsg, setErrorMsg] = useState("")
    const [loader, setLoader] = useState(true)

    useEffect(() => {

        const fetchProducts = async () => {
            setLoader(true)
            setErrorMsg("")

            try {
                const response = await axiosInstance.get("/products", {
                    params: { search, category }
                });

                setProducts(response.data.products)

            } catch (error) {
                console.log(error)
                setProducts([])
                setErrorMsg("Something went wrong while loading products.")
            } finally {
                setLoader(false)
            }
        };

        fetchProducts();

    }, [search, category])

    return (
        <div className="page">

            <Navbar />

            <div className="page-content">

                <h1>Products</h1>

                <SearchBar
                    search={search}
                    setSearch={setSearch}
                    category={category}
                    setCategory={setCategory}
                />

                {loader && (
                    <p className="status-message">Loading products...</p>
                )}

                {errorMsg && (
                    <p className="error">{errorMsg}</p>
                )}

                {!loader && !errorMsg && products.length === 0 && (
                    <p className="status-message">No products found.</p>
                )}

                {!loader && !errorMsg && products.length > 0 && (
                    <div className="product-grid">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}

            </div>

        </div>
    );
}

export default Products;
