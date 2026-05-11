import React, { useState, useEffect, useMemo } from "react";
import ProductCard from "./ProductCard";
import { io } from "socket.io-client";
import "./Home.css";

const socket = io("https://mybackend-uk1u.onrender.com");

const categories = [
  "All",
  "Cleansers",
  "Exfoliators",
  "Toners & Essences",
  "Serums & Ampoules",
  "Moisturizers",
  "Spot Treatments / Acne Products",
  "Masks",
  "Eye & Lip Care",
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "https://mybackend-uk1u.onrender.com/api/products/getproducts",
        );
        const data = await res.json();
        setProducts(Array.isArray(data.products) ? data.products : []);
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    socket.on("productAdded", (product) =>
      setProducts((prev) => [...prev, product]),
    );
    socket.on("productUpdated", (updatedProduct) => {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p,
        ),
      );
    });
    socket.on("productDeleted", ({ id }) => {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    });

    return () => {
      socket.off("productAdded");
      socket.off("productUpdated");
      socket.off("productDeleted");
    };
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term),
      );
    }

    return filtered;
  }, [products, searchTerm, selectedCategory]);

  return (
    <div className="home-container fade-in">
      <div className="home-header">
        <div className="header-content">
          <h1>Discover Amazing Products</h1>
          <p>Handpicked quality items just for you.</p>
        </div>

        <div className="controls-wrapper">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="categories-wrapper">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-chip ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loader-container">
          <div className="home-spinner" />
          <p>Fetching products...</p>
        </div>
      ) : (
        <div className="product-grid-section">
          <div className="grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))
            ) : (
              <div className="no-results">
                <span className="no-results-icon">🛍️</span>
                <p>No products found in this category</p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
