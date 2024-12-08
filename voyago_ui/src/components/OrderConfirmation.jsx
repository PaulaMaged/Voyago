import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { receipt } = location.state || {};

  useEffect(() => {
    if (!receipt) {
      navigate('/Tourist_Dashboard');
      return;
    }

    // Create and load confetti script safely
    const loadConfetti = () => {
      if (typeof window !== 'undefined' && document.body) {
        const confetti = document.createElement('script');
        confetti.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js';
        
        confetti.onload = () => {
          if (window.confetti) {
            window.confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
          }
        };

        document.body.appendChild(confetti);
        return confetti;
      }
      return null;
    };

    const confettiScript = loadConfetti();

    // Cleanup
    return () => {
      if (confettiScript && document.body) {
        document.body.removeChild(confettiScript);
      }
    };
  }, [receipt, navigate]);

  if (!receipt) {
    return null;
  }

  // Calculate total amount from orders
  const totalAmount = receipt.orders.reduce((sum, order) => 
    sum + (order.quantity * order.product.price), 0
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="order-confirmation"
    >
      <motion.div 
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="success-icon"
      >
        <i className="fas fa-check-circle"></i>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Order Confirmed!
      </motion.h2>

      <motion.div 
        className="receipt-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="receipt-header">
          <h3>Order Summary</h3>
          <span className="order-date">
            {new Date().toLocaleDateString()}
          </span>
        </div>

        <div className="order-items">
          {receipt.orders.map((order, index) => (
            <motion.div 
              key={order._id} 
              className="order-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <div className="order-item-details">
                <h4>{order.description}</h4>
                <p className="quantity">Quantity: {order.quantity}</p>
              </div>
              <p className="price">${(order.quantity * order.product.price).toFixed(2)}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="total-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="total-row">
            <h4>Total Amount</h4>
            <h4>${totalAmount.toFixed(2)}</h4>
          </div>
          <div className="payment-info">
            <p>Payment Method: {receipt.paymentMethod}</p>
            {receipt.paymentMethod === 'wallet' && (
              <p className="wallet-balance">
                Updated Wallet Balance: ${receipt.updatedWalletBalance.toFixed(2)}
              </p>
            )}
          </div>
        </motion.div>

        <motion.div 
          className="delivery-info"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h4>Delivery Information</h4>
          <div className="address">
            <i className="fas fa-map-marker-alt"></i>
            <p>{receipt.deliveryAddress.street}</p>
          </div>
          <div className="delivery-date">
            <i className="fas fa-truck"></i>
            <p>Estimated Delivery: {new Date(receipt.estimatedDelivery).toLocaleDateString()}</p>
          </div>
        </motion.div>

        <motion.button
          className="view-orders-btn"
          onClick={() => navigate('/Tourist_Dashboard', { state: { activeTab: 'purchased-products' } })}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          View Purchased Items
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default OrderConfirmation; 