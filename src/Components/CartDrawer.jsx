import React from "react";
import { useCart } from "./CartContext";
import { BASE_URL } from "../api";
import "./CartDrawer.css";

const CartDrawer = () => {
  const { cart, isOpen, setIsOpen, removeFromCart } = useCart();

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <>
      {/* Overlay */}
      <div
        className={`cart-overlay ${isOpen ? "visible" : ""}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className={`cart-drawer ${isOpen ? "open" : "closed"}`}>
        <button className="close-btn" onClick={() => setIsOpen(false)}>
          ✖
        </button>

        <h2>Your Cart</h2>

        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <>
            <ul className="cart-items">
              {cart.map((item) => (
                <li key={item.id} className="cart-item">
                  <img
                    src={
                      item.image
                        ? item.image.startsWith('http') ? item.image : `${BASE_URL}/uploads/${item.image.replace("/uploads/", "")}`
                        : "/placeholder.png"
                    }
                    alt={item.name}
                    width={50}
                  />
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p>
                      {item.quantity} × Ksh {item.price}
                    </p>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.product_id || item.id)}
                  >
                    🗑
                  </button>
                </li>
              ))}
            </ul>

            <div className="cart-total">
              <strong>Total:</strong> Ksh {totalPrice.toFixed(2)}
            </div>

            <button className="checkout-btn">Proceed to Checkout</button>
          </>
        )}
      </div>
    </>
  );
};

export default CartDrawer;