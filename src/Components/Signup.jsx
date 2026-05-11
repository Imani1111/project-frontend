import React, { useState } from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address!";
    }

    if (!formData.password) {
      newErrors.password = "Password Required!";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters!";
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
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
    setSuccess(false);

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await fetch(
        "https://mybackend-uk1u.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Signup failed");
      }

      if (res.ok) {
        setSuccess(true);
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        navigate("/");
      }
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="glass-card">
        <form onSubmit={handleSubmit}>
          <h2>Signup</h2>

          {serverError && <p className="error">{serverError}</p>}
          {success && <p className="success">Account created!</p>}

          <input
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />

          {errors.name && <p className="error">{errors.name}</p>}

          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error">{errors.email}</p>}

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="error">{errors.password}</p>}

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword}</p>
          )}

          <button type="submit" disabled={loading}>
            {loading && <div className="spinner" />}
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
