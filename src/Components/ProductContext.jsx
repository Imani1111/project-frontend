import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://mybackend-uk1u.onrender.com/api/products/getproducts",
      );
      if (res.data.success && Array.isArray(res.data.products)) {
        setProducts(res.data.products);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <ProductsContext.Provider
      value={{ products, setProducts, fetchProducts, loading }}
    >
      {children}
    </ProductsContext.Provider>
  );
};
