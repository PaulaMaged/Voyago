import React, { useState, useEffect } from "react";
import axios from "axios";
import AddProduct from "./addProduct";
import EditProduct from "./editProduct";
import currencyConversions from "../helpers/currencyConversions";

const ViewProductAdmin = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortRating, setSortRating] = useState("none");
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingProductData, setEditingProductData] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/seller/get-all-products"
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
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
      await axios.put(
        `http://localhost:8000/api/seller/update-product/${productId}`,
        {
          archived: !currentStatus,
        }
      );
      fetchProducts(); // Refresh the product list
    } catch (error) {
      console.error("Error toggling archive status:", error);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/seller/delete-product/${productId}`
      );
      fetchProducts(); // Refresh the product list after deletion
    } catch (error) {
      console.error("Error deleting product:", error);
    }
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
      return (
        calculateAverageRating(a.reviews) - calculateAverageRating(b.reviews)
      );
    } else if (sortRating === "desc") {
      return (
        calculateAverageRating(b.reviews) - calculateAverageRating(a.reviews)
      );
    }
    return 0;
  });

  return (
    <div>
      <AddProduct fetchProducts={fetchProducts} />

      {editingProductId && (
        <EditProduct
          product={editingProductData}
          fetchProducts={fetchProducts}
          onCancel={handleCancelEdit}
        />
      )}

      <h1>Product List</h1>
      <hr />
      <br />

      <div
        style={{
          marginBottom: "20px",
          display: "inline-block",
          marginLeft: "10px",
        }}
      >
        <input
          type="text"
          placeholder="Search product by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "10px", width: "300px" }}
        />
      </div>

      <div
        style={{
          marginBottom: "20px",
          display: "inline-block",
          marginLeft: "20px",
        }}
      >
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          style={{ padding: "10px", width: "120px", marginRight: "10px" }}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={{ padding: "10px", width: "120px" }}
        />
      </div>

      <div
        style={{
          marginBottom: "20px",
          display: "inline-block",
          marginLeft: "20px",
        }}
      >
        <label htmlFor="ratingSort" style={{ marginRight: "10px" }}>
          Sort by Rating:
        </label>
        <select
          id="ratingSort"
          value={sortRating}
          onChange={(e) => setSortRating(e.target.value)}
          style={{ padding: "10px", width: "150px" }}
        >
          <option value="none">No Sort</option>
          <option value="asc">Low to High</option>
          <option value="desc">High to Low</option>
        </select>
      </div>

      {sortedProducts.length > 0 ? (
        <div
          className="productsList"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "15px",
          }}
        >
          {sortedProducts.map((product) => (
            <div
              key={product._id}
              style={{
                border: "1px solid",
                borderColor:
                  product._id === editingProductId ? "blue" : "lightgray",
                borderWidth: product._id === editingProductId ? "2px" : "1px",
                padding: "15px",
                backgroundColor: product.archived ? "#f0f0f0" : "white",
              }}
            >
              <img
                src={product.picture}
                alt={product.name}
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
              />
              <h2>{product.name}</h2>
              <p>Description: {product.description}</p>
              <p>
                Price:{" "}
                {currencyConversions.convertFromDB(product.price).toFixed(2) +
                  " " +
                  localStorage.getItem("currency")}
              </p>
              <p>Available Quantity: {product.available_quantity}</p>
              <p>Seller: {product.seller.store_name || "External Seller"}</p>
              <p>Rating: {calculateAverageRating(product.reviews)} stars</p>
              <p>Reviews: {product.reviews.length} reviews</p>
              <p>Status: {product.archived ? "Archived" : "Active"}</p>
              <ul>
                {product.reviews.map((review) => (
                  <li key={review._id}>
                    <strong>
                      {review.reviewer && review.reviewer.user
                        ? review.reviewer.user.username
                        : "Anonymous"}
                      :
                    </strong>{" "}
                    {review.comment}
                  </li>
                ))}
              </ul>
              <button onClick={() => handleEditClick(product)}>Edit</button>
              <button
                onClick={() =>
                  toggleArchiveStatus(product._id, product.archived)
                }
                style={{ marginLeft: "10px" }}
              >
                {product.archived ? "Unarchive" : "Archive"}
              </button>
              <button
                onClick={() => deleteProduct(product._id)}
                style={{
                  marginLeft: "10px",
                  backgroundColor: "red",
                  color: "white",
                }}
              >
                Delete
              </button>
              <button
                onClick={() => deleteProduct(product._id)}
                style={{
                  marginLeft: "10px",
                  backgroundColor: "red",
                  color: "white",
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No products available within the specified criteria.</p>
      )}
    </div>
  );
};

export default ViewProductAdmin;
