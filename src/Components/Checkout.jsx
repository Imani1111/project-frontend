import { useCart } from "./CartContext";
import API from "../api";
import "./Checkout.css";

const Checkout = () => {
    const { cart } = useCart();

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const placeOrder = async () => {
        await API.post("/orders/create");
        alert("Order placed successfully");
    };

    return (
        <div className="checkout-container">
            <h1 className="checkout-title">Checkout</h1>

            <div className="checkout-items">
                {cart.map((item) => (
                    <div key={item.id} className="checkout-item">
                        <span className="checkout-item-name">{item.name}</span>
                        <span className="checkout-item-quantity">× {item.quantity}</span>
                    </div>
                ))}
            </div>

            <div className="checkout-total">Total: Ksh {total.toFixed(2)}</div>

            <button className="checkout-btn" onClick={placeOrder}>
                Place Order
            </button>
        </div>
    );
};

export default Checkout;