import React, { useState, useRef } from "react";
import API, { BASE_URL } from "../api";
import imageCompression from "browser-image-compression";
import "./ProductForm.css";

const categories = [
  "Cleansers",
  "Exfoliators",
  "Toners & Essences",
  "Serums & Ampoules",
  "Moisturizers",
  "Spot Treatments / Acne Products",
  "Masks",
  "Eye & Lip Care",
];

const AddProduct = ({ onClose, onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: categories[0],
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  const handleFile = async (file) => {
    if (!file) return;

    const compressed = await compressImage(file);

    setImage(compressed);
    setPreview(URL.createObjectURL(compressed));
  };

  const handleFileChange = (e) =>
    handleFile(e.target.files[0]);

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

    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.category
    ) {
      alert("Please fill all fields");
      return;
    }

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

    if (image) {
      data.append("image", image);
    }

    try {
      const response = await API.post(
        "/products/addproduct",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${adminToken}`,
          },

          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) /
                progressEvent.total,
            );

            setProgress(percent);
          },
        },
      );

      console.log(response.data);

      alert("Product added successfully!");

      setFormData({
        name: "",
        description: "",
        price: "",
        category: categories[0],
      });

      setImage(null);
      setPreview(null);

      if (onProductAdded) {
        onProductAdded();
      }

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Upload error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to add product",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-card">
      <h2>Add Product</h2>

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
          onClick={() =>
            document
              .getElementById("fileInput")
              .click()
          }
        >
          {preview ? (
            <div className="add-product-preview-wrapper">
              <img
                src={preview}
                alt="preview"
              />

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
          id="fileInput"
          type="file"
          hidden
          accept="image/*"
          onChange={handleFileChange}
        />

        {loading && (
          <div className="add-product-progress-bar">
            <div
              className="add-product-progress"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        )}

        <div className="modal-buttons">
          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? `Uploading ${progress}%`
              : "Add Product"}
          </button>

          <button
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
