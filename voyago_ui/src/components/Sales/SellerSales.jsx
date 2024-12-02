import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SellerSales.css';

const SellerSales = () => {
  const [salesData, setSalesData] = useState({
    totalRevenue: 0,
    products: [],
    filteredRevenue: 0,
    productSales: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    date: '',
    month: ''
  });

  const sellerId = localStorage.getItem('roleId');

  // Add the formatCurrency function
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0); // Added || 0 to handle undefined values
  };

  useEffect(() => {
    if (!sellerId) {
      setError('Seller ID not found');
      setLoading(false);
      return;
    }
    fetchSalesData();
  }, [sellerId]);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      
      // Get products belonging to seller
      const productsResponse = await axios.get(
        `http://localhost:8000/api/seller/get-products-belonging-to-seller/${sellerId}`
      );

      // Get all orders for this seller's products
      const ordersPromises = productsResponse.data.map(product => 
        axios.get(`http://localhost:8000/api/seller/product-orders/${product._id}`)
      );
      
      const ordersResponses = await Promise.all(ordersPromises);
      
      // Calculate sales per product
      const productSales = {};
      let totalRevenue = 0;

      productsResponse.data.forEach((product, index) => {
        const productOrders = ordersResponses[index].data;
        const productRevenue = productOrders.reduce((sum, order) => 
          sum + (order.quantity * product.price), 0
        );
        
        productSales[product._id] = {
          totalSales: productRevenue,
          orderCount: productOrders.length,
          soldQuantity: productOrders.reduce((sum, order) => sum + order.quantity, 0)
        };
        
        totalRevenue += productRevenue;
      });

      // Get filtered revenue if date or month is selected
      let filteredRevenue = totalRevenue;
      if (filter.date || filter.month) {
        const queryParams = new URLSearchParams(filter).toString();
        const filteredResponse = await axios.get(
          `http://localhost:8000/api/seller/sales-report/${sellerId}?${queryParams}`
        );
        filteredRevenue = filteredResponse.data.totalRevenue;
      }

      setSalesData({
        totalRevenue,
        products: productsResponse.data,
        filteredRevenue,
        productSales
      });
    } catch (err) {
      setError('Failed to fetch sales data');
      console.error('Error fetching sales:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading sales data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="sales-report">
      <h1 className="title">My Sales Report</h1>

      {/* Filter Controls */}
      <div className="filter-controls">
        <div className="filter-item">
          <label>Filter by Date:</label>
          <input
            type="date"
            value={filter.date}
            onChange={(e) => setFilter({ ...filter, date: e.target.value, month: '' })}
          />
        </div>
        <div className="filter-item">
          <label>Filter by Month:</label>
          <select
            value={filter.month}
            onChange={(e) => setFilter({ ...filter, month: e.target.value, date: '' })}
          >
            <option value="">Select Month</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>
        <button onClick={fetchSalesData} className="filter-button">Apply Filter</button>
      </div>

      {/* Revenue Summary Cards */}
      <div className="revenue-summary">
        <div className="summary-card total">
          <h2>Total Revenue</h2>
          <p>{formatCurrency(salesData.totalRevenue)}</p>
        </div>

        <div className="summary-card filtered">
          <h2>{filter.date ? 'Daily Revenue' : filter.month ? 'Monthly Revenue' : 'Current Revenue'}</h2>
          <p>{formatCurrency(salesData.filteredRevenue)}</p>
        </div>

        <div className="summary-card products">
          <h2>Total Products</h2>
          <p>{salesData.products.length}</p>
        </div>
      </div>

      {/* Products Table */}
      <div className="revenue-details">
        <h2>Products Breakdown</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Price</th>
                <th>Available Quantity</th>
                <th>Sold Quantity</th>
                <th>Total Sales</th>
              </tr>
            </thead>
            <tbody>
              {salesData.products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{formatCurrency(product.price)}</td>
                  <td>{product.available_quantity}</td>
                  <td>{salesData.productSales[product._id]?.soldQuantity || 0}</td>
                  <td>{formatCurrency(salesData.productSales[product._id]?.totalSales || 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerSales;