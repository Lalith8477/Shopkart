import { useState } from "react"
import { useCart } from "../context/CartContext"

function CartItem({ item }) {

    const { updateQuantity, removeFromCart } = useCart()

    const [loader, setLoader] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    const product = item.product

    const handleQuantity = async (newQuantity) => {
        setLoader(true)
        setErrorMsg("")

        try {
            await updateQuantity(product._id, newQuantity)

        } catch (error) {
            console.log(error)
            setErrorMsg("Unable to update quantity. Please try again.")
        } finally {
            setLoader(false)
        }
    }

    const handleRemove = async () => {
        setLoader(true)
        setErrorMsg("")

        try {
            await removeFromCart(product._id)

        } catch (error) {
            console.log(error)
            setErrorMsg("Unable to remove product. Please try again.")
            setLoader(false)
        }
    }

    return (
        <div className="cart-item">

            <img src={product.image} alt={product.name} />

            <div className="cart-item-info">

                <h3>{product.name}</h3>

                <p className="product-price">
                    ₹{product.price.toLocaleString("en-IN")}
                </p>

                <div className="quantity-controls">

                    <button
                        onClick={() => handleQuantity(item.quantity - 1)}
                        disabled={loader || item.quantity <= 1}
                    >
                        -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                        onClick={() => handleQuantity(item.quantity + 1)}
                        disabled={loader || item.quantity >= product.stock}
                    >
                        +
                    </button>

                </div>

                {item.quantity >= product.stock && (
                    <p className="stock out-of-stock">Only {product.stock} in stock</p>
                )}

                {errorMsg && (
                    <p className="card-error">{errorMsg}</p>
                )}

                <button className="remove-link" onClick={handleRemove} disabled={loader}>
                    {loader ? "Please wait..." : "Remove"}
                </button>

            </div>

            <p className="cart-item-total">
                ₹{(product.price * item.quantity).toLocaleString("en-IN")}
            </p>

        </div>
    )
}

export default CartItem
