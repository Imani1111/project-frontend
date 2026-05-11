import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateAdmin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");

  // Validate form
  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    return newErrors;
  };

  // Handle input change
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMessage("");
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0)
      return setErrors(validationErrors);

    setErrors({});
    setLoading(true);

    try {
      const res = await fetch(
        "https://mybackend-uk1u.onrender.com/api/admin/create-admin",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to create admin");

      setServerMessage("Admin created successfully!");
      setFormData({ name: "", email: "", password: "" });

      navigate("/admin-login");
    } catch (err) {
      setServerMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="glass-card">
        <form onSubmit={handleSubmit}>
          <h2>Create New Admin</h2>

          {serverMessage && (
            <p
              className={
                serverMessage.includes("success") ? "success" : "error"
              }
            >
              {serverMessage}
            </p>
          )}

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="error">{errors.name}</p>}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error">{errors.email}</p>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="error">{errors.password}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Admin"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAdmin;
