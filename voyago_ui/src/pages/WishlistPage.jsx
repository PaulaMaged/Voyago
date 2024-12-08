import React, { useState, useEffect } from "react";
import axios from "axios";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
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

  const handleAddToCart = async (productId) => {
    try {
      const touristId = localStorage.getItem('roleId');
      if (!touristId) {
        alert('Please log in to add items to your cart');
        return;
      }

      setAddingToCart(true);
      await axios.post(
        `http://localhost:8000/api/cart/${touristId}/${productId}`,
        { quantity: 1 }
      );

      setSuccess("Product added to cart successfully!");
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-gradient">
        My Wishlist
      </h1>

      {error && (
        <div className="relative overflow-hidden rounded-lg mb-4">
          <div className="absolute inset-0 bg-error/20 animate-pulse"></div>
          <p className="text-center p-4 text-error relative z-10">{error}</p>
        </div>
      )}

      {success && (
        <div className="relative overflow-hidden rounded-lg mb-4">
          <div className="absolute inset-0 bg-success/20 animate-pulse"></div>
          <p className="text-center p-4 text-success relative z-10">{success}</p>
        </div>
      )}

      {!touristId ? (
        <div className="text-center p-8 bg-surface rounded-xl shadow-lg">
          <p className="text-error font-medium">Please log in to view your wishlist</p>
        </div>
      ) : wishlist.length === 0 ? (
        <div className="text-center p-8 bg-surface rounded-xl shadow-lg">
          <p className="text-secondary italic">Your wishlist is empty</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {wishlist.map((item) => (
            <li key={item._id} className="group relative">
              <div className="relative bg-surface rounded-2xl shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl">
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden rounded-t-2xl">
                  {item.images?.length > 0 ? (
                    <img
                      src={`http://localhost:8000/${item.images[0].image_url}`}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 
                                group-hover:scale-110"
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = item.picture || '/default-product-image.jpg'; // Fallback to picture or default
                      }}
                    />
                  ) : item.picture ? (
                    <img
                      src={item.picture}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 
                                group-hover:scale-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/default-product-image.jpg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No image available</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <h3 className="absolute bottom-0 left-0 right-0 p-4 text-white font-semibold text-lg">
                    {item.name}
                  </h3>
                </div>

                {/* Details Section */}
                <div className="p-4 bg-surface rounded-b-2xl">
                  <div className="space-y-2">
                    <div className="bg-background/50 p-2 rounded-lg">
                      <span className="text-sm font-medium text-secondary uppercase">Description:</span>
                      <p className="mt-1 text-primary/90 text-sm">{item.description}</p>
                    </div>

                    <div className="bg-background/50 p-2 rounded-lg">
                      <span className="text-sm font-medium text-secondary uppercase">Price:</span>
                      <p className="mt-1 text-accent font-bold">${item.price}</p>
                    </div>

                    <div className="bg-background/50 p-2 rounded-lg">
                      <span className="text-sm font-medium text-secondary uppercase">Seller:</span>
                      <p className="mt-1 text-primary/90 text-sm">
                        {item.seller?.store_name || 'Unknown Seller'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between p-4 bg-surface rounded-b-2xl gap-4">
                  <button
                    onClick={() => removeProductFromWishlist(item._id)}
                    className="group relative p-2 bg-rose-500 text-white rounded-lg 
                              font-semibold transition-all duration-300 ease-in-out
                              hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-500/30
                              active:scale-90 transform w-12 h-12
                              hover:rotate-12"
                    title="Remove from Wishlist"
                  >
                    {/* Tooltip */}
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 
                                    bg-black/80 text-white text-sm py-1 px-2 rounded-md 
                                    opacity-0 group-hover:opacity-100 transition-opacity 
                                    whitespace-nowrap pointer-events-none z-20">
                      Remove from Wishlist
                    </span>
                    
                    {/* Button icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" 
                         className="h-6 w-6 transition-transform group-hover:scale-110 m-auto" 
                         fill="none" viewBox="0 0 24 24" 
                         stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" 
                            strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>

                  <button
                    onClick={() => handleAddToCart(item._id)}
                    disabled={addingToCart}
                    className={`group relative p-2 bg-violet-500 text-white 
                                rounded-lg font-semibold transition-all duration-300 ease-in-out
                                hover:bg-violet-600 hover:shadow-lg hover:shadow-violet-500/30
                                active:scale-90 transform w-12 h-12
                                disabled:opacity-70 disabled:cursor-not-allowed 
                                disabled:hover:shadow-none disabled:hover:scale-100
                                hover:-rotate-12
                                ${addingToCart ? 'animate-pulse' : ''}`}
                    title="Add to Cart"
                  >
                    {/* Tooltip */}
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 
                                    bg-black/80 text-white text-sm py-1 px-2 rounded-md 
                                    opacity-0 group-hover:opacity-100 transition-opacity 
                                    whitespace-nowrap pointer-events-none z-20">
                      Add to Shopping Cart
                    </span>

                    {/* Button icon */}
                    {addingToCart ? (
                      <span className="flex space-x-1 justify-center items-center h-full">
                        <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                      </span>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" 
                           className="h-6 w-6 transition-transform group-hover:scale-110 m-auto" 
                           fill="none" viewBox="0 0 24 24" 
                           stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" 
                              strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    )}
                    
                    {/* Animated background gradient */}
                    <span className="absolute inset-0 rounded-lg overflow-hidden">
                      <span className="absolute inset-0 bg-gradient-to-r from-violet-400/0 
                                      via-violet-400/30 to-violet-400/0 animate-shimmer"></span>
                    </span>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WishlistPage;

