import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API, { BASE_URL } from "../api";
import "./Payment.css";

const Payment = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const product = state?.product;

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  if (!product) {
    return (
      <div className="payment-error">
        <h3>No product data found</h3>
        <button onClick={() => navigate("/")}>Go Back</button>
      </div>
    );
  }

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!phone) {
      alert("Please enter phone number");
      return;
    }

    setLoading(true);

    try {
      const totalAmount = product.price * (product.quantity || 1);
      const res = await API.post(
        "/mpesa/stk",
        {
          phone,
          productId: product.id || product.productID,
          amount: totalAmount,
        },
      );

      console.log(res.data);

      alert("Payment successful!");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  const BASE_URL_IMG = BASE_URL;
  const totalAmount = product.price * (product.quantity || 1);

  return (
    <div className="payment-wrapper">
      <div className="payment-card">
        <h2 className="payment-title">Checkout</h2>

        <img
          src={
            product.image
              ? (product.image.startsWith('http') ? product.image : `${BASE_URL_IMG}/uploads/${product.image.replace("/uploads/", "")}`)
              : "https://via.placeholder.com/300"
          }
          alt={product.name}
          className="payment-image"
        />

        <div className="payment-info">
          <h3>{product.name}</h3>
          {product.quantity && (
            <p className="payment-qty">Quantity: {product.quantity}</p>
          )}
          <div className="payment-total">
            <span>Total Amount:</span>
            <b>Ksh {totalAmount}</b>
          </div>
        </div>

        <form onSubmit={handlePayment} className="payment-form">
          <input
            type="text"
            placeholder="Enter phone number (2547XXXXXXXX)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : `Pay Ksh ${totalAmount}`}
          </button>
        </form>

        <button
          type="button"
          className="payment-back"
          onClick={() => navigate(-1)}
        >
          ← Go Back
        </button>
      </div>
    </div>
  );
};

export default Payment;
