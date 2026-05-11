import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./Components/MainLayout";
import AuthLayout from "./Components/AuthLayout";

import Home from "./Components/Home";
import Signup from "./Components/Signup";
import Signin from "./Components/Signin";
import Payment from "./Components/Payment";
import AddProduct from "./Components/AddProduct";
import AdminLogin from "./Components/AdminLogin";
import AdminDashboard from "./Components/AdminDashboard";
import CreateAdmin from "./Components/CreateAdmin";
import CartDrawer from "./Components/CartDrawer";
import ProductDetails from "./Components/ProductDetails";
import Chatbot from "./Components/Chatbot";

import "./App.css";
import { ProductsProvider } from "./Components/ProductContext";
import AdminRoute from "./Components/AdminRoute";
import { CartProvider } from "./Components/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
        <ProductsProvider>
          <Routes>
            {/* MAIN APP (with navbar) */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetails />} />
            </Route>

            {/* AUTH PAGES (no navbar) */}
            <Route element={<AuthLayout />}>
              <Route path="/payment" element={<Payment />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signin" element={<Signin />} />

              {/* ADMIN ROUTES */}
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin-dashboard" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="/admin-register" element={
                <AdminRoute>
                  <CreateAdmin />
                </AdminRoute>
              } />
              <Route path="/add-product" element={
                <AdminRoute>
                  <AddProduct />
                </AdminRoute>
              }
              />
            </Route>
          </Routes>
          <CartDrawer />
          {/* Chatbot Floating Button */}
          <button 
            className="chatbot-toggle-btn" 
            onClick={() => setIsChatbotOpen(!isChatbotOpen)}
            aria-label="Toggle Chatbot"
          >
            💬
          </button>
          
          {/* Chatbot Modal */}
          {isChatbotOpen && <Chatbot onClose={() => setIsChatbotOpen(false)} />}
        </ProductsProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>

  );
}

export default App;
