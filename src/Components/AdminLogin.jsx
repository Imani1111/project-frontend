import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email";
    }

    if (!formData.password) {
      newErrors.password = "Password required";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setServerError("");

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await API.post("/admin/admin-login", {
        email: formData.email,
        password: formData.password,
      });

      if (res.data.token) {
        localStorage.setItem("adminToken", res.data.token);
        if (res.data.admin) {
          localStorage.setItem("admin", JSON.stringify(res.data.admin));
        }
        alert("Login successful");
        navigate("/admin-dashboard");
      } else {
        setServerError("Login failed: No token received from server");
      }
    } catch (err) {
      console.error(err);

      setServerError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="glass-card">
        <form onSubmit={handleSubmit}>
          <h2>Admin Login</h2>

          {/* SERVER ERROR */}
          {serverError && <p className="error">{serverError}</p>}

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />

          {errors.email && <p className="error">{errors.email}</p>}

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          {errors.password && <p className="error">{errors.password}</p>}

          {/* SUBMIT BUTTON */}
          <button type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
