import React, { useState, useEffect } from "react";
import API, { BASE_URL } from "../api";

import "./AdminDashboard.css";
import "./ProductForm.css";

import AddProduct from "./AddProduct";
import UpdateProduct from "./UpdateProduct";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const [activeTab, setActiveTab] = useState("products"); // NEW

  // ---------------- FETCH PRODUCTS ----------------
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get("/products/getproducts");
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- FETCH ORDERS (NEW) ----------------
  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  // ---------------- UPDATE PRODUCT ----------------
  const openUpdateModal = (product) => {
    setCurrentProduct(product);
    setUpdateModalOpen(true);
  };

  // ---------------- DELETE PRODUCT ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await API.delete(`/products/delete/${id}`);
      alert("Product deleted!");
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* ================= TAB SWITCH ================= */}
      <div className="admin-tabs">
        <button onClick={() => setActiveTab("products")}>Products</button>

        <button onClick={() => setActiveTab("orders")}>Orders</button>
      </div>

      {/* ================= PRODUCTS SECTION ================= */}
      {activeTab === "products" && (
        <>
          <button onClick={() => setAddModalOpen(true)}>Add Product</button>

          {loading ? (
            <p>Loading products...</p>
          ) : products.length === 0 ? (
            <p>No products found</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.description}</td>
                    <td>Ksh {p.price}</td>
                    <td>{p.category || "General"}</td>
                    <td>
                      {p.image && (
                        <img
                          src={`${BASE_URL}/uploads/${p.image}`}
                          alt={p.name}
                          width={50}
                        />
                      )}
                    </td>
                    <td>
                      <button onClick={() => openUpdateModal(p)}>Update</button>

                      <button onClick={() => handleDelete(p.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {/* ================= ORDERS SECTION (NEW) ================= */}
      {activeTab === "orders" && (
        <div>
          <h2>Orders</h2>

          {orders.length === 0 ? (
            <p>No orders yet</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>User ID</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.user_id}</td>
                    <td>Ksh {o.total}</td>
                    <td>{o.status}</td>
                    <td>{o.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ================= MODALS ================= */}
      {addModalOpen && (
        <div className="modal">
          <AddProduct
            onClose={() => setAddModalOpen(false)}
            onProductAdded={fetchProducts}
          />
        </div>
      )}

      {updateModalOpen && currentProduct && (
        <div className="modal">
          <UpdateProduct
            product={currentProduct}
            onClose={() => setUpdateModalOpen(false)}
            onProductUpdated={fetchProducts}
          />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
