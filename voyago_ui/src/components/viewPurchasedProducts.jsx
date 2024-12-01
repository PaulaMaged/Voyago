import React, { useState, useEffect } from "react";
import axios from "axios";
import currencyConversions from "../helpers/currencyConversions";
import "./viewPurchasedProducts.css";

export default function ViewPurchasedProducts() {
  const [purchasedProducts, setPurchasedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortRating, setSortRating] = useState("none");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPurchasedProducts();
  }, []);

  const fetchPurchasedProducts = async () => {
    try {
      setLoading(true);
      let touristId = localStorage.getItem("roleId");
      if (!touristId) {
        throw new Error("Tourist ID not found");
      }
      const response = await axios.get(
        `http://localhost:8000/api/product/retrieve-all-orders-by-touristid/${touristId}`
      );

      // Modify how we process the orders
      const productsWithDetails = response.data.map((order) => ({
        orderId: order._id,
        orderDate: new Date(order.arrival_date).toLocaleDateString(),
        quantity: order.quantity,
        rating: calculateAverageRating(order.product.reviews),
        userReview: order.product.reviews.find(
          (review) => review.reviewer === touristId
        ),
        // Spread the product details, but after our custom fields to avoid overwrites
        ...order.product,
      }));

      setPurchasedProducts(productsWithDetails);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching purchased products:", error);
      setError("Failed to fetch purchased products. Please try again later.");
      setLoading(false);
    }
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  const getFilteredAndSortedProducts = () => {
    // Start with a fresh copy of purchasedProducts
    let result = [...purchasedProducts];
    
    // Apply filters
    result = result.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply price filter
    if (minPrice || maxPrice) {
      result = result.filter(product => {
        const productPrice = parseFloat(currencyConversions.convertFromDB(product.price));
        const min = minPrice ? parseFloat(minPrice) : 0;
        const max = maxPrice ? parseFloat(maxPrice) : Infinity;
        return productPrice >= min && productPrice <= max;
      });
    }

    // Apply sorting
    if (sortRating !== "none") {
      result.sort((a, b) => {
        if (sortRating === "asc") {
          return a.rating - b.rating;
        }
        return b.rating - a.rating;
      });
    }

    return result;
  };

  const handleRateProduct = async (productId) => {
    try {
      let touristId = localStorage.getItem("roleId");

      if (!touristId) {
        throw new Error("Tourist ID not found");
      }

      const response = await axios.post(
        `http://localhost:8000/api/tourist/tourist-rate-product/${touristId}`,
        {
          product: productId,
          rating: rating,
          comment: review,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        await fetchPurchasedProducts();
        setRating(0);
        setReview("");
        setSelectedProduct(null);
        setIsModalOpen(false);
        setErrorMessage("");
      } else {
        throw new Error("Failed to submit rating and review");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.message);
      } else {
        console.error("Error rating product:", error);
        setErrorMessage(
          "An unexpected error occurred. Please try again later."
        );
      }
    }
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    if (product.userReview) {
      setRating(product.userReview.rating);
      setReview(product.userReview.comment);
    } else {
      setRating(0);
      setReview("");
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
    setRating(0);
    setReview("");
  };

  if (loading) return <div className="loading">Loading purchased products...</div>;
  if (error) return <div className="error">{error}</div>;

  const displayProducts = getFilteredAndSortedProducts();

  return (
    <div className="container">
      <h1 className="title">Your Purchased Products</h1>

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

      {displayProducts.length > 0 ? (
        <div className="product-grid">
          {displayProducts.map((product) => (
            <div key={product.orderId} className="product-card">
              <img
                src={product.picture || "/placeholder.svg?height=200&width=200"}
                alt={product.name}
                className="product-image"
              />
              <div className="product-details">
                <h2 className="product-name">{product.name}</h2>
                <p className="product-description">{product.description}</p>
                <p className="product-price">
                  {currencyConversions
                    .convertFromDB(product.price)
                    .toFixed(2) +
                    " " +
                    localStorage.getItem("currency")}
                </p>
                <p className="product-seller">
                  Seller: {product.seller.store_name || "Unknown Seller"}
                </p>
                <p className="product-rating">
                  Rating: {product.rating.toFixed(1)} stars
                </p>
                <p className="product-reviews">
                  Reviews: {product.reviews ? product.reviews.length : 0}
                </p>
                <p className="product-order-date">
                  Arrival Date: {product.orderDate}
                </p>
                <p className="product-quantity">Quantity: {product.quantity}</p>
                {product.userReview ? (
                  <div className="user-review">
                    <p>Your review: {product.userReview.rating} stars</p>
                    <p>{product.userReview.comment}</p>
                    <p>
                      Reviewed on:{" "}
                      {new Date(
                        product.userReview.review_date
                      ).toLocaleDateString()}
                    </p>
                    <button
                      className="update-review-button"
                      onClick={() => openModal(product)}
                    >
                      Update Review
                    </button>
                  </div>
                ) : (
                  <button
                    className="rate-button"
                    onClick={() => openModal(product)}
                  >
                    Rate & Review
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-products">
          No purchased products found within the specified criteria.
        </p>
      )}

      {isModalOpen && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>
              {selectedProduct.userReview ? "Update" : "Add"} Review for{" "}
              {selectedProduct.name}
            </h2>

            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}

            <div className="rating-input">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= rating ? "filled" : ""}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write your review here..."
              className="review-input"
            />
            <div className="modal-buttons">
              <button
                onClick={() => handleRateProduct(selectedProduct._id)}
                className="submit-button"
              >
                Submit Review
              </button>
              <button onClick={closeModal} className="cancel-button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}