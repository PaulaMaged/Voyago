import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './viewProductTourist.css';

const ViewProductTourist = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortRating, setSortRating] = useState('none');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/seller/get-all-products');
      const productsWithRatings = response.data.map(product => ({
        ...product,
        rating: calculateAverageRating(product.reviews)
      }));
      setProducts(productsWithRatings);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products. Please try again later.');
      setLoading(false);
    }
  };

  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) => {
      const productPrice = parseFloat(product.price);
      const min = minPrice ? parseFloat(minPrice) : 0;
      const max = maxPrice ? parseFloat(maxPrice) : Infinity;
      return productPrice >= min && productPrice <= max;
    });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortRating === 'asc') {
      return a.rating - b.rating;
    } else if (sortRating === 'desc') {
      return b.rating - a.rating;
    }
    return 0;
  });

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container">
      <h1 className="title">Product List</h1>

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
        <div className="product-grid">
          {sortedProducts.map((product) => (
            <div key={product._id} className="product-card">
              <img
                src={product.picture || '/placeholder.svg?height=200&width=200'}
                alt={product.name}
                className="product-image"
              />
              <div className="product-details">
                <h2 className="product-name">{product.name}</h2>
                <p className="product-description">{product.description}</p>
                <p className="product-price">${product.price.toFixed(2)}</p>
                <p className="product-availability">Available: {product.available_quantity}</p>
                <p className="product-seller">Seller: {product.seller.store_name || 'Unknown Seller'}</p>
                <p className="product-rating">Rating: {product.rating.toFixed(1)} stars</p>
                <p className="product-reviews">Reviews: {product.reviews.length}</p>
                {product.reviews.length > 0 && (
                  <div className="product-reviews-section">
                    <h3 className="reviews-title">Recent Reviews:</h3>
                    <ul className="reviews-list">
                      {product.reviews.slice(0, 3).map((review) => (
                        <li key={review._id} className="review-item">
                          <span className="reviewer-name">{review.reviewer.user.username }:</span> {review.comment}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-products">No products available within the specified criteria.</p>
      )}
    </div>
  );
};

export default ViewProductTourist;