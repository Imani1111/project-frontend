import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";

import { useAuth } from "../context/AuthContext";

// Create context
const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { token } = useAuth();
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    if (!token) {
      setCart([]);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        "https://mybackend-uk1u.onrender.com/api/cart",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setCart(Array.isArray(res.data) ? res.data : res.data.cart || []);
    } catch (err) {
      console.error("Cart error:", err.response?.data || err.message);
      setCart([]); // clear cart on error
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Add item to cart
  const addToCart = async (product) => {
    if (!token) return alert("You must be logged in to add items to cart");

    try {
      await axios.post(
        "https://mybackend-uk1u.onrender.com/api/cart/add",
        { product },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchCart();
      setIsOpen(true); // open cart after adding
    } catch (err) {
      console.error("Add to cart error:", err.response?.data || err.message);
      alert("Failed to add item to cart");
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    if (!token) return alert("You must be logged in to remove items");

    try {
      await axios.delete(
        `https://mybackend-uk1u.onrender.com/api/cart/remove/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      fetchCart();
    } catch (err) {
      console.error(
        "Remove from cart error:",
        err.response?.data || err.message,
      );
      alert("Failed to remove item from cart");
    }
  };

  // Clear cart (e.g., after checkout)
  const clearCart = () => setCart([]);

  // Load cart on mount
  useEffect(() => {
    fetchCart();
  }, [token, fetchCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        isOpen,
        setIsOpen,
        loading,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
