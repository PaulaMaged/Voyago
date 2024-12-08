import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import currencyConversions from "../helpers/currencyConversions";

const EditProduct = ({ product, fetchProducts, onCancel }) => {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    available_quantity: "",
    archived: false,
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setProductData(product);
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

  const handleFileChange = useCallback((e) => {
    setFile(e.target.files[0]);
  }, []);

  const updateProductFields = async () => {
    try {
      const updates = {};
      Object.keys(productData).forEach((key) => {
        if (productData[key] !== product[key]) {
          updates[key] = productData[key];
        }
      });

      if (Object.keys(updates).length > 0) {
        if (updates.price)
          updates.price = currencyConversions.convertToDB(updates.price);

        const response = await axios.put(
          `http://localhost:8000/api/seller/update-product/${product._id}`,
          updates
        );
        console.log("Product fields updated:", response.data);
        return response.data;
      }
      return product;
    } catch (error) {
      console.error("Error updating product fields:", error);
      throw error;
    }
  };

  const updateProductPicture = async () => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("picture", file);

    try {
      const response = await axios.put(
        `http://localhost:8000/api/seller/update-product-picture/${product._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Product picture updated:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating product picture:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const updatedFields = await updateProductFields();
      let updatedPicture = null;
      if (file) {
        updatedPicture = await updateProductPicture();
      }

      fetchProducts();
      onCancel();
    } catch (error) {
      setError(
        "An error occurred while updating the product. Please try again."
      );
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
        <div className="form-group">
          <label htmlFor="picture">Product Image:</label>
          <input
            type="file"
            id="picture"
            name="picture"
            onChange={handleFileChange}
            accept="image/*"
          />
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
