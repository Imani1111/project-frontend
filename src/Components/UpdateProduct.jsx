import React, { useState, useEffect, useRef } from "react";
import API, { BASE_URL } from "../api";
import imageCompression from "browser-image-compression";
import "./ProductForm.css";

const categories = ["Cleansers", "Exfoliators", "Toners & Essences", "Serums & Ampoules", "Moisturizers", "Spot Treatments / Acne Products", "Masks", "Eye & Lip Care"];

const UpdateProduct = ({ product, onClose, onProductUpdated }) => {
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category || categories[0],
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };
    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.log("Compression error:", error);
      return file;
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFile = async (file) => {
    if (!file) return;
    const compressed = await compressImage(file);
    setImage(compressed);
    setPreview(URL.createObjectURL(compressed));
  };

  const handleFileChange = (e) => handleFile(e.target.files[0]);
  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };
  const handleDragOver = (e) => e.preventDefault();
  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      alert("Unauthorized. Please login as admin.");
      return;
    }

    setLoading(true);
    setProgress(0);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    if (image) data.append("image", image);

    try {
      await API.put(
        `/products/update/${product.id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${adminToken}`,
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setProgress(percent);
          },
        },
      );

      alert("Product updated successfully!");
      if (onProductUpdated) onProductUpdated();
      if (onClose) onClose();
    } catch (error) {
      console.error("Update error:", error);
      alert(error.response?.data?.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-card">
      <h2>Update Product</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <div
          className="add-product-drag-box"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById("updateFileInput").click()}
        >
          {preview ? (
            <div className="add-product-preview-wrapper">
              <img src={preview} alt="preview" />
              <button
                type="button"
                className="add-product-remove-btn"
                onClick={handleRemoveImage}
              >
                ×
              </button>
            </div>
          ) : (
            "Drag & Drop Image or Click to Upload"
          )}
        </div>

        <input
          id="updateFileInput"
          type="file"
          hidden
          accept="image/*"
          onChange={handleFileChange}
        />

        {loading && (
          <div className="add-product-progress-bar">
            <div
              className="add-product-progress"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="modal-buttons">
          <button type="submit" disabled={loading}>
            {loading ? `Updating ${progress}%` : "Update Product"}
          </button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;