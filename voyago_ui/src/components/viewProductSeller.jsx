import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddProduct from './addProduct';
import EditProduct from './editProduct';
import './viewProductSeller.css';

const ViewProductSeller = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortRating, setSortRating] = useState('none');
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingProductData, setEditingProductData] = useState(null);

  const fetchProducts = async () => {
    let sellerId = localStorage.getItem('roleId'); // Retrieve seller ID from local storage  localStorage.getItem('roleId')
    if (!sellerId) {
      console.error('Seller ID not found in local storage');
      return;
    }
    try {
      const response = await axios.get(`http://localhost:8000/api/seller/get-all-seller-products/${sellerId}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEditClick = (product) => {
    setEditingProductId(product._id);
    setEditingProductData(product);
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setEditingProductData(null);
  };

  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  const toggleArchiveStatus = async (productId, currentStatus) => {
    try {
      await axios.put(`http://localhost:8000/api/seller/update-product/${productId}`, {
        archived: !currentStatus
      });
      fetchProducts(); // Refresh the product list
    } catch (error) {
      console.error('Error toggling archive status:', error);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:8000/api/seller/delete-product/${productId}`);
      fetchProducts(); // Refresh the product list after deletion
    } catch (error) {
      console.error('Error deleting product:', error);
    }
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
      return calculateAverageRating(a.reviews) - calculateAverageRating(b.reviews);
    } else if (sortRating === 'desc') {
      return calculateAverageRating(b.reviews) - calculateAverageRating(a.reviews);
    }
    return 0;
  });

  return (
    <div className="seller-dashboard">
      <div className="dashboard-header">
        <AddProduct fetchProducts={fetchProducts} />
        
        {editingProductId && (
          <EditProduct 
            product={editingProductData} 
            fetchProducts={fetchProducts} 
            onCancel={handleCancelEdit}
          />
        )}

        <h1 className="dashboard-title">Product List</h1>
      </div>

      <div className="filters-container">
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

        <div>
          <label htmlFor="ratingSort">Sort by Rating:</label>
          <select
            id="ratingSort"
            value={sortRating}
            onChange={(e) => setSortRating(e.target.value)}
            className="sort-select"
          >
            <option value="none">No Sort</option>
            <option value="asc">Low to High</option>
            <option value="desc">High to Low</option>
          </select>
        </div>
      </div>

      {sortedProducts.length > 0 ? (
        <div className="products-grid">
          {sortedProducts.map((product) => (
            <div key={product._id} className={`product-card ${product.archived ? 'archived' : ''}`}>
<img
  src={
    product.images && 
    Array.isArray(product.images) && 
    product.images.length > 0
      ? `http://localhost:8000/${product.images[0].image_url}`
      : "https://via.placeholder.com/200"
  }
  alt={product.name}
  className="product-image"
  onError={(e) => {
    console.log('Image failed to load:', e.target.src);
    console.log('Product images:', product.images);
    e.target.src = "https://via.placeholder.com/200";
  }}
/>
              <div className="product-info">
                <h2 className="product-name">{product.name}</h2>
                <p className="product-description">{product.description}</p>
                
                <div className="product-meta">
                  <div className="meta-item">
                    <span>Price:</span>
                    <span>${product.price}</span>
                  </div>
                  <div className="meta-item">
                    <span>Available:</span>
                    <span>{product.available_quantity}</span>
                  </div>
                  <div className="meta-item">
                    <span>Rating:</span>
                    <span>{calculateAverageRating(product.reviews)} ⭐</span>
                  </div>
                  <div className="meta-item">
                    <span>Status:</span>
                    <span>{product.archived ? 'Archived' : 'Active'}</span>
                  </div>
                </div>

                <div className="reviews-section">
                  <ul className="review-list">
                    {product.reviews.map((review) => (
                      <li key={review._id} className="review-item">
                        <strong>{review.reviewer?.user?.username || 'Anonymous'}:</strong> {review.comment}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="product-actions">
                  <button onClick={() => handleEditClick(product)} className="btn btn-edit">
                    Edit
                  </button>
                  <button 
                    onClick={() => toggleArchiveStatus(product._id, product.archived)}
                    className="btn btn-archive"
                  >
                    {product.archived ? 'Unarchive' : 'Archive'}
                  </button>
                  <button 
                    onClick={() => deleteProduct(product._id)}
                    className="btn btn-delete"
                  >
                    Delete
                  </button>
                </div>
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

export default ViewProductSeller;
