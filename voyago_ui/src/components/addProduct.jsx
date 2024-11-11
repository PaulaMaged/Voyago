import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = ({ fetchProducts }) => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    available_quantity: '',
    archived: false,
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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

  const createProduct = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    try {
      const formData = new FormData();
      Object.keys(productData).forEach(key => {
        formData.append(key, productData[key]);
      });
      if (file) {
        formData.append('picture', file);
      }

      const response = await axios.post('http://localhost:8000/api/seller/create-product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        fetchProducts();
        setSuccess(true);
        setProductData({
          name: '',
          description: '',
          price: '',
          available_quantity: '',
          archived: false,
        });
        setFile(null);
      } else {
        setError('Failed to add product. Please try again.');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setError('An error occurred while adding the product. Please try again.');
    }
  };

  return (
    <div>
      <h2>Add New Product</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Product added successfully!</p>}
      <form onSubmit={createProduct}>
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
            min="0"
            step="0.01"
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
            min="0"
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
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;