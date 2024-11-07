import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EditProduct = ({ product, fetchProducts }) => {
  const { productId } = useParams(); 
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    available_quantity: '', // Updated field name to match schema
    picture: '', // Updated field name to match schema
  });

  useEffect(() => {
    if (product) {
      setProductData(product);
    }
  }, [product]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Update product
  const updateProduct = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page
    try {
      await axios.put(`http://localhost:8000/api/seller/update-product/${productId}`, productData); // Update product by ID
      fetchProducts(); // Refresh product list after update
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div>
      <h1>Edit Product</h1>
      <form onSubmit={updateProduct}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            placeholder="Product Name"
            style={{ marginLeft: '5px' }}
          />
        </label>
        <label style={{ marginLeft: '5px' }}>
          Description:
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            placeholder="Description"
            style={{ marginLeft: '5px', width: '300px', height: '100px' }}
          />
        </label>
        <label style={{ marginLeft: '5px' }}>
          Price:
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            placeholder="Price"
            style={{ marginLeft: '5px' }}
          />
        </label>
        <label style={{ marginLeft: '5px' }}>
          Available Quantity:
          <input
            type="number"
            name="available_quantity" // Updated field name to match schema
            value={productData.available_quantity}
            onChange={handleChange}
            placeholder="Available Quantity"
            style={{ marginLeft: '5px' }}
          />
        </label>
        <label style={{ marginLeft: '5px' }}>
          Image URL:
          <input
            type="text"
            name="picture" // Updated field name to match schema
            value={productData.picture}
            onChange={handleChange}
            placeholder="Image URL"
            style={{ marginLeft: '5px' }}
          />
        </label>
        <button type="submit" style={{ marginLeft: '10px' }}>
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
