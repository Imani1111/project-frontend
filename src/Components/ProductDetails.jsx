import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { BASE_URL } from "../api";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `https://mybackend-uk1u.onrender.com/api/products/product/${id}`,
        );
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data.product);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
  };

  const handleQuantityChange = (type) => {
    if (type === "inc") setQuantity((prev) => prev + 1);
    if (type === "dec" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  if (loading)
    return (
      <div className="loader-container">
        <div className="home-spinner" />
      </div>
    );
  if (error)
    return (
      <div className="error-container">
        <h2>{error}</h2>
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  if (!product) return null;

  return (
    <div className="product-details-container fade-in">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <span className="back-icon">←</span> Back to Shopping
      </button>

      <div className="details-grid">
        <div className="details-image-wrapper">
           <img
                src={
                 product.image
                   ? product.image.startsWith('http')
                     ? product.image
                     : `${BASE_URL}/uploads/${product.image}`
                   : "/placeholder.png"
               }
             alt={product.name}
           />
        </div>

        <div className="details-info">
          <div className="info-header">
            <span className="category-tag">
              {product.category || "General"}
            </span>
            <div className="stock-status">In Stock</div>
          </div>

          <h1>{product.name}</h1>
          <p className="details-price">Ksh {product.price}</p>

          <div className="divider"></div>

          <div className="description-section">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="quantity-section">
            <span className="label">Quantity</span>
            <div className="quantity-controls">
              <button onClick={() => handleQuantityChange("dec")}>−</button>
              <span>{quantity}</span>
              <button onClick={() => handleQuantityChange("inc")}>+</button>
            </div>
          </div>

          <div className="details-actions">
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button
              className="buy-now-btn"
              onClick={() =>
                navigate("/payment", {
                  state: { product: { ...product, quantity } },
                })
              }
            >
              Buy Now
            </button>
          </div>

          <div className="shipping-info">
            <div className="info-item">
              <span className="icon">🚚</span>
              <div>
                <h4>Free Shipping</h4>
                <p>On orders over Ksh 5,000</p>
              </div>
            </div>
            <div className="info-item">
              <span className="icon">🛡️</span>
              <div>
                <h4>2-Year Warranty</h4>
                <p>Full coverage protection</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
