import React, { useState, useEffect } from "react";
import axios from "axios";
import "./WishlistPage.css";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const touristId = localStorage.getItem("roleId");

  useEffect(() => {
    if (touristId) {
      fetchWishlist();
    } else {
      setError("Please log in to view your wishlist");
      setLoading(false);
    }
  }, [touristId]);

  const fetchWishlist = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8000/api/wishlist/${touristId}`);
      console.log('Wishlist data:', data);
      setWishlist(data.items || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const removeProductFromWishlist = async (productId) => {
    if (!productId || !touristId) return;
    
    setError("");
    setSuccess("");
    try {
      await axios.delete(`http://localhost:8000/api/wishlist/${touristId}/${productId}`);
      await fetchWishlist();
      setSuccess("Product removed from wishlist");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove product from wishlist");
    }
  };

  if (loading) {
    return <div className="wishlist-container">Loading...</div>;
  }

  return (
    <div className="wishlist-container">
      <h1 className="wishlist-header">My Wishlist</h1>
      
      {error && <p className="wishlist-message error">{error}</p>}
      {success && <p className="wishlist-message success">{success}</p>}
      
      {!touristId ? (
        <p className="wishlist-message error">Please log in to view your wishlist</p>
      ) : wishlist.length === 0 ? (
        <p className="wishlist-empty">Your wishlist is empty</p>
      ) : (
        <ul className="wishlist-items">
          {wishlist.map((item) => (
            <li key={item._id} className="wishlist-item">
              <div className="item-info">
                {item.picture && (
                  <img 
                    src={item.picture} 
                    alt={item.name} 
                    className="item-image"
                  />
                )}
                <div className="item-details">
                  <h3 className="item-name">{item.name}</h3>
                  <div className="item-attribute">
                    <span className="attribute-label">Description:</span>
                    <p className="attribute-value">{item.description}</p>
                  </div>
                  <div className="item-attribute">
                    <span className="attribute-label">Price:</span>
                    <p className="attribute-value item-price">${item.price}</p>
                  </div>
                  <div className="item-attribute">
                    <span className="attribute-label">Seller:</span>
                    <p className="attribute-value">{item.seller?.store_name || 'Unknown Seller'}</p>
                  </div>
                </div>
              </div>
              <button
                className="remove-button"
                onClick={() => removeProductFromWishlist(item._id)}
              >
                Remove from Wishlist
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WishlistPage;

