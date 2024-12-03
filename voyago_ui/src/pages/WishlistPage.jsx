import React, { useState, useEffect } from "react";
import axios from "axios";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newProductId, setNewProductId] = useState("");

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/wishlist");
      setWishlist(data.products || []);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      setError("Unable to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const addProductToWishlist = async () => {
    if (!newProductId.trim()) {
      setError("Please enter a product ID");
      return;
    }

    setError("");
    setSuccess("");
    try {
      const { data } = await axios.post("http://localhost:8000/api/wishlist/add", { 
        productId: newProductId 
      });
      await fetchWishlist();
      setSuccess("Product added to wishlist");
      setNewProductId("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product to wishlist");
    }
  };

  const removeProductFromWishlist = async (productId) => {
    if (!productId) return;
    
    setError("");
    setSuccess("");
    try {
      await axios.post("http://localhost:8000/api/wishlist/remove", { productId });
      await fetchWishlist();
      setSuccess("Product removed from wishlist");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove product from wishlist");
    }
  };

  if (loading) {
    return <div style={styles.container}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>My Wishlist</h1>
      
      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}
      
      {wishlist.length === 0 ? (
        <p style={styles.emptyMessage}>Your wishlist is empty</p>
      ) : (
        <ul style={styles.list}>
          {wishlist.map((product) => (
            <li key={product._id} style={styles.listItem}>
              <span>{product.name || `Product ID: ${product._id}`}</span>
              <button
                style={styles.removeButton}
                onClick={() => removeProductFromWishlist(product._id)}
              >
                Remove
              </button>
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
        <button 
          style={styles.addButton}
          onClick={addProductToWishlist}
          disabled={!newProductId.trim()}
        >
          Add to Wishlist
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    color: '#333',
  },
  error: {
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: '10px',
  },
  success: {
    color: '#28a745',
    textAlign: 'center',
    marginBottom: '10px',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    margin: '5px 0',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
  },
  removeButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  addSection: {
    marginTop: '20px',
    display: 'flex',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  addButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default WishlistPage;

