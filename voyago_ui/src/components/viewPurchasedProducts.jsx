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
  const [error, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const touristId = localStorage.getItem("roleId");

  useEffect(() => {
    if (touristId) {
      fetchPurchasedProducts();
    } else {
      setError("Please log in to view your orders");
      setLoading(false);
    }
  }, [touristId]);

  const fetchPurchasedProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8000/api/orders/${touristId}`
      );

      setPurchasedProducts(response.data);
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

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-gradient">
        My Purchases
      </h1>

      {error && (
        <div className="relative overflow-hidden rounded-lg mb-4">
          <div className="absolute inset-0 bg-error/20 animate-pulse"></div>
          <p className="text-center p-4 text-error relative z-10">{error}</p>
        </div>
      )}

      {!touristId ? (
        <div className="text-center p-8 bg-surface rounded-xl shadow-lg">
          <p className="text-error font-medium">Please log in to view your orders</p>
        </div>
      ) : purchasedProducts.length === 0 ? (
        <div className="text-center p-8 bg-surface rounded-xl shadow-lg">
          <p className="text-secondary italic">You haven't made any purchases yet</p>
        </div>
      ) : (
        <div className="product-grid">
          {purchasedProducts.map((product) => (
            <div key={product._id} className="product-card">
              <img
                src={
                  product.product.images?.length > 0
                    ? `http://localhost:8000/${product.product.images[0].image_url}`
                    : product.product.picture || "/placeholder.svg?height=200&width=200"
                }
                alt={product.product.name}
                className="product-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder.svg?height=200&width=200";
                }}
              />
              <div className="product-details">
                <h2 className="product-name">{product.product.name}</h2>
                <p className="product-description">{product.product.description}</p>
                <p className="product-price">
                  {currencyConversions.formatPrice(product.product.price)}
                </p>
                <p className="product-seller">
                  Seller: {product.product.seller?.store_name || "Unknown Seller"}
                </p>
                <p className="product-rating">
                  Rating: {calculateAverageRating(product.product.reviews).toFixed(1)} stars
                </p>
                <p className="product-reviews">
                  Reviews: {product.product.reviews?.length || 0}
                </p>
                <p className="product-order-date">
                  Arrival Date: {new Date(product.arrival_date).toLocaleDateString()}
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