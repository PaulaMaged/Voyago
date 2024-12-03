import React, { useState, useEffect } from "react";
import axios from "axios";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [newProductId, setNewProductId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get("/api/wishlist", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setWishlist(data.products);
    } catch (err) {
      setError("Failed to fetch wishlist");
    } finally {
      setLoading(false);
    }
  };

  const addProductToWishlist = async () => {
    if (!newProductId.trim()) return;
    setError("");
    setSuccess("");
    try {
      const { data } = await axios.post(
        "/api/wishlist/add",
        { productId: newProductId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setWishlist(data.wishlist.products);
      setNewProductId("");
      setSuccess("Product added to wishlist");
    } catch (err) {
      setError("Failed to add product to wishlist");
    }
  };

  const removeProductFromWishlist = async (productId) => {
    setError("");
    setSuccess("");
    try {
      const { data } = await axios.post(
        "/api/wishlist/remove",
        { productId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setWishlist(data.wishlist.products);
      setSuccess("Product removed from wishlist");
    } catch (err) {
      setError("Failed to remove product from wishlist");
    }
  };

  const addToCart = async (productId) => {
    setError("");
    setSuccess("");
    try {
      await axios.post(
        "/api/cart/add",
        { productId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setSuccess("Product added to cart");
    } catch (err) {
      setError("Failed to add product to cart");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>My Wishlist</h1>
      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul style={styles.list}>
          {wishlist.map((product) => (
            <li key={product._id} style={styles.listItem}>
              <span>{product.name || `Product ID: ${product._id}`}</span>
              <div>
                <button
                  style={styles.cartButton}
                  onClick={() => addToCart(product._id)}
                >
                  Add to Cart
                </button>
                <button
                  style={styles.removeButton}
                  onClick={() => removeProductFromWishlist(product._id)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div style={styles.addSection}>
        <input
          style={styles.input}
          type="text"
          placeholder="Enter Product ID"
          value={newProductId}
          onChange={(e) => setNewProductId(e.target.value)}
        />
        <button style={styles.addButton} onClick={addProductToWishlist}>
          Add to Wishlist
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "1rem",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    textAlign: "center",
    color: "#0078d7",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  success: {
    color: "green",
    textAlign: "center",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.5rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    marginBottom: "0.5rem",
  },
  cartButton: {
    background: "green",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "0.3rem 0.5rem",
    marginRight: "0.5rem",
    cursor: "pointer",
  },
  removeButton: {
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "0.3rem 0.5rem",
    cursor: "pointer",
  },
  addSection: {
    marginTop: "1rem",
    display: "flex",
    gap: "0.5rem",
  },
  input: {
    flex: 1,
    padding: "0.5rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  addButton: {
    background: "#0078d7",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "0.5rem",
    cursor: "pointer",
  },
};

export default Wishlist;

