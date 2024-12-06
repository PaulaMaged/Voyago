import React, { useState, useEffect } from "react";
import axios from "axios";
import currencyConversions from "../helpers/currencyConversions";
import "./viewProductTourist.css";
import { FaStar, FaStarHalf, FaRegStar } from 'react-icons/fa';
import "./product.css";
export default function ViewProductTourist() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortRating, setSortRating] = useState("none");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    fetchProducts();
    fetchTouristData();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8000/api/seller/get-all-products"
      );
      const productsWithRatings = response.data
        .filter((product) => !product.archived)
        .map((product) => ({
          ...product,
          rating: calculateAverageRating(product.reviews),
        }));
      setProducts(productsWithRatings);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products. Please try again later.");
      setLoading(false);
    }
  };

  const fetchTouristData = async () => {
    const touristId = localStorage.getItem("roleId");
    try {
      const response = await axios.get(
        `http://localhost:8000/api/tourist/get-tourist/${touristId}`
      );
      setWalletBalance(response.data.wallet);
    } catch (error) {
      console.error("Error fetching tourist data:", error);
    }
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) => {
      const productPrice = parseFloat(
        currencyConversions.convertFromDB(product.price)
      );
      const min = minPrice ? parseFloat(minPrice) : 0;
      const max = maxPrice ? parseFloat(maxPrice) : Infinity;
      return productPrice >= min && productPrice <= max;
    });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortRating === "asc") {
      return a.rating - b.rating;
    } else if (sortRating === "desc") {
      return b.rating - a.rating;
    }
    return 0;
  });

  const addToWishlist = async (productId) => {
    try {
      const touristId = localStorage.getItem("roleId");
      if (!touristId) {
        alert("Please log in to add items to your wishlist");
        return;
      }
      
      await axios.post(`http://localhost:8000/api/wishlist/${touristId}/${productId}`);
      alert("Product added to wishlist!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add product to wishlist");
    }
  };

  const RatingStars = ({ rating }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStarHalf key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }

    return <div className="flex gap-1">{stars}</div>;
  };

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container">
      <h1 className="title">Product List</h1>
      <p className="wallet-balance">
        Wallet Balance:{" "}
        {currencyConversions.convertFromDB(walletBalance).toFixed(2)}{" "}
        {localStorage.getItem("currency")}
      </p>

      <div className="filters">
        <input
          type="text"
          placeholder="Search product by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="price-input"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="price-input"
        />
        <select
          value={sortRating}
          onChange={(e) => setSortRating(e.target.value)}
          className="sort-select"
        >
          <option value="none">Sort by Rating</option>
          <option value="asc">Low to High</option>
          <option value="desc">High to Low</option>
        </select>
      </div>

      {sortedProducts.length > 0 ? (
        <div className="product-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
          {sortedProducts.map((product) => (
            <div key={product._id} className="product-card group h-[600px] flex flex-col">
              <div className="relative w-full h-[240px] overflow-hidden">
                <img
                  src={
                    product.images && 
                    Array.isArray(product.images) && 
                    product.images.length > 0
                      ? `http://localhost:8000/${product.images[0].image_url}`
                      : "https://via.placeholder.com/200"
                  }
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/200";
                  }}
                />
              </div>
              
              <div className="flex flex-col flex-grow p-4">
                <div className="flex-grow">
                  <h2 className="product-name text-xl font-bold mb-2 line-clamp-1">{product.name}</h2>
                  <p className="product-description text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  <p className="product-price text-2xl font-bold text-accent mb-3">
                    {currencyConversions.formatPrice(product.price)}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <RatingStars rating={product.rating} />
                    <span className="text-sm text-gray-600">
                      ({product.reviews && Array.isArray(product.reviews) ? product.reviews.length : 0})
                    </span>
                  </div>

                  {/* Hidden details section */}
                  <div className="overflow-hidden transition-all duration-300 max-h-0 opacity-0 group-hover:max-h-[200px] group-hover:opacity-100">
                    <div className="flex flex-col gap-2 text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between">
                        <span className="font-medium">Available:</span>
                        <span>{product.available_quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Seller:</span>
                        <span className="truncate ml-2">{product.seller.store_name || "Unknown Seller"}</span>
                      </div>
                      
                      {product.reviews.length > 0 && (
                        <div className="mt-2 border-t border-gray-200 pt-2">
                          <h3 className="font-medium mb-1">Recent Reviews:</h3>
                          <ul className="space-y-1">
                            {product.reviews.slice(0, 1).map((review) => (
                              <li key={review._id} className="text-sm line-clamp-2">
                                <span className="font-medium">
                                  {review.reviewer && review.reviewer.user
                                    ? review.reviewer.user.username
                                    : "Anonymous"}
                                </span>
                                : {review.comment}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action buttons in a fixed position at the bottom */}
                <div className="mt-auto pt-4 space-y-2">
                  <button
                    onClick={() => addToWishlist(product._id)}
                    className="wishlist-button w-full py-2 px-4 rounded-lg bg-accent text-white font-semibold
                               transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
                               relative overflow-hidden group/btn"
                  >
                    <span className="relative z-10">Add to Wishlist</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-accent to-accentLight 
                                  transform scale-x-0 group-hover/btn:scale-x-100 
                                  transition-transform duration-300 origin-left">
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      const touristId = localStorage.getItem("roleId");
                      if (!touristId) {
                        alert("Please log in to add items to your cart");
                        return;
                      }
                      
                      axios.post(
                        `http://localhost:8000/api/cart/${touristId}/${product._id}`,
                        { quantity: 1 }
                      )
                      .then(() => {
                        alert("Product added to cart successfully!");
                      })
                      .catch((err) => {
                        alert(err.response?.data?.message || "Failed to add product to cart");
                      });
                    }}
                    className="cart-button w-full py-2 px-4 rounded-lg bg-primary text-white font-semibold
                               transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
                               relative overflow-hidden group/btn"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <i className="fas fa-shopping-cart"></i>
                      Add to Cart
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-primaryLight 
                                  transform scale-x-0 group-hover/btn:scale-x-100 
                                  transition-transform duration-300 origin-left">
                    </div>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-products">
          No products available within the specified criteria.
        </p>
      )}
    </div>
  );
}
