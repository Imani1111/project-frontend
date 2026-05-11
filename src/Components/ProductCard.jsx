import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { BASE_URL } from "../api";
import "./Product.css";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/product/${product.id}`)}
    >
       <div className="image-wrapper">
         <img
             src={
              product.image
                ? product.image.startsWith('http')
                  ? product.image
                  : `${BASE_URL}/uploads/${product.image}`
                : "/placeholder.png"
            }
           alt={product.name}
           className="product-image"
         />
        <div className="price-badge">Ksh {product.price}</div>
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>

        <div className="product-actions">
          <button
            className="product-button"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
          >
            Add to Cart
          </button>

          <button
            className="product-button secondary"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/payment", { state: { product } });
            }}
          >
            Purchase
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
