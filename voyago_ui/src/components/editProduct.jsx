import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditProduct = ({ product, fetchProducts, onCancel }) => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    available_quantity: '',
    archived: false,
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (product) {
      setProductData(product);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setProductData(prevData => ({
      ...prevData,
      [name]: checked,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const formData = new FormData();
      Object.keys(productData).forEach(key => {
        if (key === 'archived') {
          formData.append(key, productData[key].toString());
        } else {
          formData.append(key, productData[key]);
        }
      });
      if (file) {
        formData.append('picture', file);
      }

      const response = await axios.put(`http://localhost:8000/api/seller/update-product/${product._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Server response:', response.data);

      if (response.status === 200) {
        fetchProducts();
        onCancel();
      } else {
        setError('Failed to update product. Please try again.');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setError('An error occurred while updating the product. Please try again.');
    }
  };

  return (
    <div>
      <h2>Edit Product</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={updateProduct}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Available Quantity:
          <input
            type="number"
            name="available_quantity"
            value={productData.available_quantity}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Archived:
          <input
            type="checkbox"
            name="archived"
            checked={productData.archived}
            onChange={handleCheckboxChange}
          />
        </label>
        <label>
          Product Image:
          <input
            type="file"
            name="picture"
            onChange={handleFileChange}
            accept="image/*"
          />
        </label>
        <button type="submit">Update Product</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default EditProduct;