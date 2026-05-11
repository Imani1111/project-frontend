import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../api";

const AdminRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const verifyAdmin = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        const res = await API.get("/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // If we get here, the request was successful (status 2xx)
        setIsAdmin(true);
      } catch (err) {
        console.error("Verification error:", err);
        // If we get a 401 or 403, remove token and redirect to login
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          console.error("Verification failed: Unauthorized");
          localStorage.removeItem("adminToken");
        }
        // For other errors (including network errors), don't remove token
        // just don't authorize yet
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAdmin();
  }, []);

  if (isLoading) return <p>Loading...</p>;

  return isAdmin ? children : <Navigate to="/admin-login" />;
};

export default AdminRoute;