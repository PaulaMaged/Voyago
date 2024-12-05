import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Cart.css';
import currencyConversions from '../helpers/currencyConversions';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const touristId = localStorage.getItem('roleId');

  useEffect(() => {
    if (touristId) {
      fetchCartItems();
    }
  }, [touristId]);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/cart/${touristId}`);
      if (response.data && response.data.items) {
        setCartItems(response.data.items);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch cart items');
      setLoading(false);
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      // First, find the item in the cart
      const item = cartItems.find(item => item.product._id === productId);
      
      // Validate quantity against available stock
      if (newQuantity > item.product.available_quantity) {
        setError(`Only ${item.product.available_quantity} items available in stock`);
        return;
      }
      
      if (newQuantity < 1) {
        setError('Quantity cannot be less than 1');
        return;
      }

      // Calculate the quantity difference
      const quantityDifference = newQuantity - item.quantity;
      
      await axios.post(
        `http://localhost:8000/api/cart/${touristId}/${productId}`,
        { quantity: quantityDifference }  // Send the difference in quantity
      );
      
      // Update local state immediately for better UX
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.product._id === productId 
            ? { ...item, quantity: newQuantity }
            : item
        )
      );

      // Clear any previous errors
      setError(null);
      
      // Fetch updated cart data
      fetchCartItems();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update quantity');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const touristId = localStorage.getItem('roleId');
      await axios.delete(`http://localhost:8000/api/cart/${touristId}/${productId}`);
      fetchCartItems();
    } catch (err) {
      setError('Failed to remove item');
      console.error('Error removing item:', err);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) return <div className="cart-loading">Loading your cart...</div>;
  if (error) return <div className="cart-error">{error}</div>;

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button onClick={() => navigate('/products')} className="continue-shopping">
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.product._id} className="cart-item">
                <img 
                  src={item.product.picture || '/placeholder.svg'} 
                  alt={item.product.name} 
                  className="item-image"
                />
                <div className="item-details">
                  <h3>{item.product.name}</h3>
                  <p className="price">
                    {currencyConversions.formatPrice(item.product.price)}
                  </p>
                </div>
                <div className="item-actions">
                  <div className="quantity-controls">
                    <button 
                      onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="quantity-button"
                    >
                      -
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.available_quantity}
                      className="quantity-button"
                    >
                      +
                    </button>
                  </div>
                  <button 
                    className="remove-button"
                    onClick={() => handleRemoveItem(item.product._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="total">
              Total: {currencyConversions.convertFromDB(calculateTotal()).toFixed(2)} 
              {" "}{localStorage.getItem("currency")}
            </div>
            <button onClick={handleCheckout} className="checkout-button">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;