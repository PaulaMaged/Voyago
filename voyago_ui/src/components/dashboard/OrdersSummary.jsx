import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaShoppingBag, FaWallet } from 'react-icons/fa';

const OrdersSummary = () => {
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState(0);
  const navigate = useNavigate();
  const touristId = localStorage.getItem('roleId');

  useEffect(() => {
    fetchRecentOrders();
    fetchWalletBalance();
  }, []);

  const fetchWalletBalance = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/tourist/get-tourist/${touristId}`);
      setWalletBalance(response.data.wallet);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/product/retrieve-all-orders-by-touristid/${touristId}`);
      // Get only the 3 most recent active orders
      const activeOrders = response.data
        .filter(order => order.status !== 'cancelled')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);
      setRecentOrders(activeOrders);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      if (!window.confirm('Are you sure you want to cancel this order?')) {
        return;
      }

      const response = await axios.post(`http://localhost:8000/api/orders/cancel/${orderId}`);
      
      // Update wallet balance
      setWalletBalance(response.data.updatedWalletBalance);
      localStorage.setItem('walletBalance', response.data.updatedWalletBalance);

      // Show success message
      alert(`Order cancelled successfully. $${response.data.refundAmount} has been refunded to your wallet.`);
      
      // Refresh orders
      fetchRecentOrders();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'processing':
        return 'text-blue-600';
      case 'cancelled':
        return 'text-red-600';
      case 'delivered':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FaShoppingBag className="text-primary text-2xl mr-2" />
          <h2 className="text-xl font-semibold">Recent Orders</h2>
        </div>
        <div className="flex items-center">
          <FaWallet className="text-primary text-xl mr-2" />
          <span className="font-semibold">${walletBalance.toFixed(2)}</span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : recentOrders.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No orders found
        </div>
      ) : (
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div 
              key={order._id}
              className="border-b last:border-b-0 pb-3 last:pb-0"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{order.product.name}</h3>
                  <p className="text-sm text-gray-600">
                    Quantity: {order.quantity}
                  </p>
                  <p className="text-sm text-gray-600">
                    ${order.product.price * order.quantity}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status || 'Processing'}
                  </span>
                  {(!order.status || order.status === 'Processing') && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="text-sm text-red-600 hover:text-red-800 mt-2"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          <button 
            onClick={() => navigate('/orders')}
            className="w-full mt-4 py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            View All Orders
          </button>
        </div>
      )}
    </div>
  );
};

export default OrdersSummary; 