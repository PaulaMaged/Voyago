import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EditProduct = ({ product, fetchProducts }) => {
  const { productId } = useParams();
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    available_quantity: '',
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (product) {
      setProductData(product);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(productData).forEach(key => {
        formData.append(key, productData[key]);
      });
      if (file) {
        formData.append('picture', file);
      }

      await axios.put(`http://localhost:8000/api/seller/update-product/${productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div>
      <h1>Edit Product</h1>
      <hr />
      <br />
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
            required
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
            required
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
            required
          />
        </label>
        <label style={{ marginLeft: '5px' }}>
          Available Quantity:
          <input
            type="number"
            name="available_quantity"
            value={productData.available_quantity}
            onChange={handleChange}
            placeholder="Available Quantity"
            style={{ marginLeft: '5px' }}
            required
          />
        </label>
        <label style={{ marginLeft: '5px' }}>
          Product Image:
          <input
            type="file"
            name="picture"
            onChange={handleFileChange}
            accept="image/*"
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