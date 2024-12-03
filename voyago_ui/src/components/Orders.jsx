import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Orders.css';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const touristId = localStorage.getItem('roleId');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/product/retrieve-all-orders-by-touristid/${touristId}`);
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const handleViewDetails = (orderId) => {
    navigate(`/order-details/${orderId}`);
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.post(`http://localhost:8000/api/orders/cancel/${orderId}`);
      fetchOrders(); // Refresh orders after cancellation
    } catch (error) {
      console.error('Error canceling order:', error);
      alert('Failed to cancel order. ' + error.response?.data?.message || 'Please try again.');
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="orders-container">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <h3>Order #{order._id.slice(-6)}</h3>
                <span className="order-date">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="order-details">
                <p>Product: {order.product.name}</p>
                <p>Quantity: {order.quantity}</p>
                <p>Status: {order.status || 'Processing'}</p>
              </div>
              <div className="order-actions">
                <button 
                  onClick={() => handleViewDetails(order._id)}
                  className="view-button"
                >
                  View Details
                </button>
                {!order.status || order.status === 'Processing' ? (
                  <button 
                    onClick={() => handleCancelOrder(order._id)}
                    className="cancel-button"
                  >
                    Cancel Order
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 