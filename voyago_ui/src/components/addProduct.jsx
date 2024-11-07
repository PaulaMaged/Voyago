import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = ({ fetchProducts }) => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    available_quantity: '', // Updated field name
    picture: '', // Updated field name
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  // Function to handle product creation
  const createProduct = async () => {
    try {
      await axios.post('http://localhost:8000/api/seller/create-product', productData); // Make API call
      fetchProducts(); // Refresh products list
      setProductData({
        name: '',
        description: '',
        price: '',
        available_quantity: '', // Reset field name
        picture: '', // Reset field name
      });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div>
      <h1>Add New Product</h1>
      <form>
        <input
          type="text"
          name="name"
          value={productData.name}
          onChange={handleChange}
          placeholder="Product Name"
          style={{ marginLeft: '10px' }}
        />
        <input
          type="text"
          name="description"
          value={productData.description}
          onChange={handleChange}
          placeholder="Description"
          style={{ marginLeft: '10px' }}
        />
        <input
          type="number"
          name="price"
          value={productData.price}
          onChange={handleChange}
          placeholder="Price"
          min="0"
          style={{ marginLeft: '10px' }}
        />
        <input
          type="number"
          name="available_quantity" // Updated field name
          value={productData.available_quantity}
          onChange={handleChange}
          placeholder="Available Quantity"
          min="0"
          style={{ marginLeft: '10px' }}
        />
        <input
          type="text"
          name="picture" // Updated field name
          value={productData.picture}
          onChange={handleChange}
          placeholder="Image URL"
          style={{ marginLeft: '10px' }}
        />
        <button type="button" onClick={createProduct} style={{ marginLeft: '10px' }}>
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
