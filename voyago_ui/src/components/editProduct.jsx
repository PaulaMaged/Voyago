import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import currencyConversions from "../helpers/currencyConversions";
import { FaTrash, FaPlus } from 'react-icons/fa';
import './editProduct.css';

const EditProduct = ({ product, fetchProducts, onCancel }) => {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    available_quantity: "",
    archived: false,
    images: []
  });
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setProductData(product);
      // Set existing images if they exist
      if (product.images && product.images.length > 0) {
        setExistingImages(product.images);
        setPreviewUrls(product.images.map(img => `http://localhost:8000/${img.image_url}`));
      }
    }
  }, [product]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);
    
    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index, isExisting = false) => {
    if (isExisting) {
      setExistingImages(prev => prev.filter((_, i) => i !== index));
      setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    } else {
      const newImageIndex = index - existingImages.length;
      setNewImages(prev => prev.filter((_, i) => i !== newImageIndex));
      setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('price', productData.price);
      formData.append('available_quantity', productData.available_quantity);
      formData.append('archived', productData.archived);
      
      // Append existing images
      formData.append('existingImages', JSON.stringify(existingImages));

      // Append each new image
      newImages.forEach((image) => {
        formData.append('images', image);
      });

      await axios.put(
        `http://localhost:8000/api/seller/update-product/${productData._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      fetchProducts();
      onCancel();
    } catch (error) {
      console.error('Error updating product:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.message || 'Error updating product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="edit-product-form">
      <h2>Edit Product</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={productData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={productData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={productData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="available_quantity">Available Quantity:</label>
          <input
            type="number"
            id="available_quantity"
            name="available_quantity"
            value={productData.available_quantity}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="archived">
            <input
              type="checkbox"
              id="archived"
              name="archived"
              checked={productData.archived}
              onChange={handleChange}
            />
            Archived
          </label>
        </div>
        <div className="image-upload-section">
          <label className="image-upload-label">
            <FaPlus className="upload-icon" />
            <span>Add Product Images</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden-input"
            />
          </label>

          <div className="image-preview-grid">
            {previewUrls.map((url, index) => (
              <div key={index} className="image-preview-item">
                <img 
                  src={url} 
                  alt={`Preview ${index + 1}`} 
                />
                <button
                  type="button"
                  onClick={() => removeImage(index, index < existingImages.length)}
                  className="remove-image-btn"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-update" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Product"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn-cancel"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
