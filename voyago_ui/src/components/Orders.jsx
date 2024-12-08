import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Orders.css';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
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
      setError('Error fetching orders: ' + error.message);
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      if (!window.confirm('Are you sure you want to cancel this order?')) {
        return;
      }

      const response = await axios.post(`http://localhost:8000/api/orders/cancel/${orderId}`);
      
      // Update wallet balance in localStorage
      const currentBalance = parseFloat(localStorage.getItem('walletBalance') || 0);
      const newBalance = currentBalance + response.data.refundAmount;
      localStorage.setItem('walletBalance', newBalance);

      // Show success message
      alert(`Order cancelled successfully. $${response.data.refundAmount} has been refunded to your wallet.`);
      
      // Refresh orders list
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const filteredOrders = orders.filter(order => {
    switch(filter) {
      case 'active':
        return order.status !== 'cancelled';
      case 'cancelled':
        return order.status === 'cancelled';
      default:
        return true;
    }
  });

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            All Orders
          </button>
          <button 
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded ${filter === 'active' ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            Active Orders
          </button>
          <button 
            onClick={() => setFilter('cancelled')}
            className={`px-4 py-2 rounded ${filter === 'cancelled' ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            Cancelled Orders
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No {filter !== 'all' ? filter : ''} orders found
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredOrders.map((order) => (
            <div 
              key={order._id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{order.product.name}</h3>
                  <p className="text-gray-600">
                    Quantity: {order.quantity}
                  </p>
                  <p className="text-gray-600">
                    Total: ${order.product.price * order.quantity}
                  </p>
                  <p className="text-gray-600">
                    Order Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status || 'Processing'}
                  </span>
                  {(!order.status || order.status === 'Processing') && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="mt-2 text-red-600 hover:text-red-800"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 