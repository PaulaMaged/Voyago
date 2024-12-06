import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddProduct from './addProduct';
import EditProduct from './editProduct';
import { FaSearch, FaDollarSign, FaStar, FaEdit, FaArchive, FaTrash } from 'react-icons/fa';

const ViewProducts = () => {
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
      const endpoint = currentStatus 
        ? `http://localhost:8000/api/product/unarchive-product/${productId}/unarchive`
        : `http://localhost:8000/api/product/archive-product/${productId}`;

      const response = await axios.patch(endpoint);
      
      if (response.status === 200) {
        fetchProducts(); // Refresh the product list
      } else {
        throw new Error('Failed to update archive status');
      }
    } catch (error) {
      console.error('Error toggling archive status:', error);
      alert('Failed to update product archive status');
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
    <div className="w-full">
      <div className="mb-8">
        <AddProduct fetchProducts={fetchProducts} />
        
        {editingProductId && (
          <EditProduct 
            product={editingProductData} 
            fetchProducts={fetchProducts} 
            onCancel={handleCancelEdit}
          />
        )}

        <h1 className="text-2xl font-bold text-[var(--textPrimary)] mb-6">
          Product List
        </h1>
      </div>

      <div className="bg-[var(--surface)] p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--textSecondary)]" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] 
                bg-[var(--background)] text-[var(--textPrimary)]
                focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          <div className="flex gap-4">
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-[var(--border)]
                bg-[var(--background)] text-[var(--textPrimary)]
                focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-[var(--border)]
                bg-[var(--background)] text-[var(--textPrimary)]
                focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-[var(--textSecondary)]">Sort by Rating:</label>
            <select
              value={sortRating}
              onChange={(e) => setSortRating(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border border-[var(--border)]
                bg-[var(--background)] text-[var(--textPrimary)]
                focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value="none">No Sort</option>
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map((product) => (
            <div 
              key={product._id} 
              className={`bg-[var(--surface)] rounded-lg overflow-hidden shadow-md
                transition-all duration-300 hover:shadow-lg
                ${product.archived ? 'opacity-75' : ''}`}
            >
              <img
                src={
                  product.images && 
                  Array.isArray(product.images) && 
                  product.images.length > 0
                    ? `http://localhost:8000/${product.images[0].image_url}`
                    : "https://via.placeholder.com/300"
                }
                alt={product.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/300";
                }}
              />
              
              <div className="p-6">
                <h2 className="text-xl font-semibold text-[var(--textPrimary)] mb-2">
                  {product.name}
                </h2>
                <p className="text-[var(--textSecondary)] mb-4">
                  {product.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <FaDollarSign className="text-[var(--primary)]" />
                    <span className="text-[var(--textPrimary)]">${product.price}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaStar className="text-[var(--secondary)]" />
                    <span className="text-[var(--textPrimary)]">
                      {calculateAverageRating(product.reviews)}
                    </span>
                  </div>
                </div>

                {product.reviews.length > 0 && (
                  <div className="mb-4 p-4 bg-[var(--background)] rounded-lg">
                    <h3 className="font-semibold text-[var(--textPrimary)] mb-2">
                      Recent Reviews
                    </h3>
                    <ul className="space-y-2">
                      {product.reviews.slice(0, 2).map((review) => (
                        <li 
                          key={review._id}
                          className="text-sm text-[var(--textSecondary)]"
                        >
                          "{review.comment}"
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-2 mt-4 pt-4 border-t border-[var(--border)]">
                  <button
                    onClick={() => handleEditClick(product)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 
                      bg-[var(--primary)] text-white rounded-lg
                      hover:bg-[var(--primaryDark)] transition-colors"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => toggleArchiveStatus(product._id, product.archived)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2
                      bg-[var(--secondary)] text-white rounded-lg
                      hover:bg-[var(--secondaryDark)] transition-colors"
                  >
                    <FaArchive /> {product.archived ? 'Unarchive' : 'Archive'}
                  </button>
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2
                      bg-red-500 text-white rounded-lg
                      hover:bg-red-600 transition-colors"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-[var(--surface)] rounded-lg">
          <p className="text-[var(--textSecondary)]">
            No products available within the specified criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default ViewProducts;
