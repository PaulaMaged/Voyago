import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/OrderDetails.css';

export default function OrderDetails() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { orderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/product/retrieve-order-by-id/${orderId}`);
      setOrder(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/orders');
  };

  if (loading) return <div>Loading order details...</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="order-details-container">
      <button onClick={handleBack} className="back-button">
        ← Back to Orders
      </button>
      
      <h2>Order Details</h2>
      <div className="order-info">
        <div className="order-section">
          <h3>Order Information</h3>
          <p><strong>Order ID:</strong> #{order._id}</p>
          <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
          <p><strong>Status:</strong> {order.status || 'Processing'}</p>
        </div>

        <div className="order-section">
          <h3>Product Details</h3>
          <p><strong>Product:</strong> {order.product.name}</p>
          <p><strong>Quantity:</strong> {order.quantity}</p>
          <p><strong>Price per unit:</strong> ${order.product.price}</p>
          <p><strong>Total:</strong> ${order.product.price * order.quantity}</p>
        </div>

        {order.arrival_location && (
          <div className="order-section">
            <h3>Delivery Information</h3>
            <p><strong>Delivery Address:</strong> {order.arrival_location.street}</p>
            <p><strong>City:</strong> {order.arrival_location.city}</p>
            <p><strong>Expected Arrival:</strong> {new Date(order.arrival_date).toLocaleDateString()}</p>
          </div>
        )}
      </div>
    </div>
  );
} 