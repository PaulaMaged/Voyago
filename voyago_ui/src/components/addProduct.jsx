import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = ({ fetchProducts }) => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    available_quantity: '',
  });
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const createProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(productData).forEach(key => {
        formData.append(key, productData[key]);
      });
      if (file) {
        formData.append('picture', file);
      }

      await axios.post('http://localhost:8000/api/seller/create-product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchProducts();
      setProductData({
        name: '',
        description: '',
        price: '',
        available_quantity: '',
      });
      setFile(null);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div>
      <h1>Add New Product</h1>
      <hr />
      <br />
      <form onSubmit={createProduct}>
        <input
          type="text"
          name="name"
          value={productData.name}
          onChange={handleChange}
          placeholder="Product Name"
          style={{ marginLeft: '10px' }}
          required
        />
        <input
          type="text"
          name="description"
          value={productData.description}
          onChange={handleChange}
          placeholder="Description"
          style={{ marginLeft: '10px' }}
          required
        />
        <input
          type="number"
          name="price"
          value={productData.price}
          onChange={handleChange}
          placeholder="Price"
          min="0"
          style={{ marginLeft: '10px' }}
          required
        />
        <input
          type="number"
          name="available_quantity"
          value={productData.available_quantity}
          onChange={handleChange}
          placeholder="Available Quantity"
          min="0"
          style={{ marginLeft: '10px' }}
          required
        />
        <input
          type="file"
          name="picture"
          onChange={handleFileChange}
          accept="image/*"
          style={{ marginLeft: '10px' }}
        />
        <button type="submit" style={{ marginLeft: '10px' }}>
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;