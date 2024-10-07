// src/components/ProductComponent.jsx

import { useState, useEffect } from "react";
import axios from "axios";

function ProductComponent() {
  const [result, setResult] = useState("");
  const [allProducts, setAllProducts] = useState([]);

  const API_BASE_URL = "http://localhost:5000/api/seller/products";

  // Create Product
  const createProduct = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const data = {
      seller: formData.get("seller"),
      name: formData.get("name"),
      description: formData.get("description"),
      picture: formData.get("picture"),
      price: parseFloat(formData.get("price")),
      available_quantity: parseInt(formData.get("available_quantity"), 10),
    };

    try {
      const response = await axios.post(API_BASE_URL, data);
      setResult(JSON.stringify(response.data, null, 2));
      fetchAllProducts(); // Refresh the list
    } catch (error) {
      console.error("Error creating product:", error);
      setResult(JSON.stringify(error.response?.data || error.message, null, 2));
    }
  };

  // Get Product by ID
  const getProduct = async (event) => {
    event.preventDefault();
    const id = event.target.id.value;

    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error("Error fetching product:", error);
      setResult(JSON.stringify(error.response?.data || error.message, null, 2));
    }
  };

  // Update Product by ID
  const updateProduct = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const id = formData.get("id");
    const data = {
      seller: formData.get("seller"),
      name: formData.get("name"),
      description: formData.get("description"),
      picture: formData.get("picture"),
      price: formData.get("price") ? parseFloat(formData.get("price")) : undefined,
      available_quantity: formData.get("available_quantity")
        ? parseInt(formData.get("available_quantity"), 10)
        : undefined,
    };

    // Remove undefined fields
    Object.keys(data).forEach((key) => data[key] === undefined && delete data[key]);

    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, data);
      setResult(JSON.stringify(response.data, null, 2));
      fetchAllProducts(); // Refresh the list
    } catch (error) {
      console.error("Error updating product:", error);
      setResult(JSON.stringify(error.response?.data || error.message, null, 2));
    }
  };

  // Delete Product by ID
  const deleteProduct = async (event) => {
    event.preventDefault();
    const id = event.target.id.value;

    try {
      const response = await axios.delete(`${API_BASE_URL}/${id}`);
      setResult(JSON.stringify(response.data, null, 2));
      fetchAllProducts(); // Refresh the list
    } catch (error) {
      console.error("Error deleting product:", error);
      setResult(JSON.stringify(error.response?.data || error.message, null, 2));
    }
  };

  // Get All Products
  const fetchAllProducts = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setAllProducts(response.data);
    } catch (error) {
      console.error("Error fetching all products:", error);
      setResult(JSON.stringify(error.response?.data || error.message, null, 2));
    }
  };

  // Fetch all products on component mount
  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <div>
      <h2>Create Product (POST Request)</h2>
      <form onSubmit={createProduct}>
        <label>
          Seller ID:
          <input type="text" name="seller" required />
        </label>
        <br />
        <label>
          Name:
          <input type="text" name="name" required />
        </label>
        <br />
        <label>
          Description:
          <input type="text" name="description" />
        </label>
        <br />
        <label>
          Picture URL:
          <input type="text" name="picture" />
        </label>
        <br />
        <label>
          Price:
          <input type="number" step="0.01" name="price" required />
        </label>
        <br />
        <label>
          Available Quantity:
          <input type="number" name="available_quantity" required />
        </label>
        <br />
        <button type="submit">Create Product</button>
      </form>

      <h2>Get Product (GET Request)</h2>
      <form onSubmit={getProduct}>
        <label>
          Product ID:
          <input type="text" name="id" required />
        </label>
        <br />
        <button type="submit">Get Product</button>
      </form>

      <h2>Update Product (PUT Request)</h2>
      <form onSubmit={updateProduct}>
        <label>
          Product ID:
          <input type="text" name="id" required />
        </label>
        <br />
        <label>
          Seller ID:
          <input type="text" name="seller" />
        </label>
        <br />
        <label>
          Name:
          <input type="text" name="name" />
        </label>
        <br />
        <label>
          Description:
          <input type="text" name="description" />
        </label>
        <br />
        <label>
          Picture URL:
          <input type="text" name="picture" />
        </label>
        <br />
        <label>
          Price:
          <input type="number" step="0.01" name="price" />
        </label>
        <br />
        <label>
          Available Quantity:
          <input type="number" name="available_quantity" />
        </label>
        <br />
        <button type="submit">Update Product</button>
      </form>

      <h2>Delete Product (DELETE Request)</h2>
      <form onSubmit={deleteProduct}>
        <label>
          Product ID:
          <input type="text" name="id" required />
        </label>
        <br />
        <button type="submit">Delete Product</button>
      </form>

      <h2>All Products (GET Request)</h2>
      <button onClick={fetchAllProducts}>Fetch All Products</button>
      <ul>
        {allProducts.map((product) => (
          <li key={product._id}>
            <strong>ID:</strong> {product._id} |{" "}
            <strong>Name:</strong> {product.name} |{" "}
            <strong>Price:</strong> {product.price} |{" "}
            <strong>Available Quantity:</strong> {product.available_quantity}
          </li>
        ))}
      </ul>

      {/* Display the result */}
      <h3>Response:</h3>
      <pre>{result}</pre>
    </div>
  );
}

export default ProductComponent;
