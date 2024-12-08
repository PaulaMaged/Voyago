import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {loading ? (
        <div className="text-center py-10 text-gray-600">
          <div className="animate-spin w-12 h-12 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full"></div>
          Loading your cart...
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      ) : cartItems.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Your cart is empty</h2>
          <Link 
            to="/tourist/products" 
            className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-white font-semibold
                     transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
                     relative overflow-hidden group"
          >
            <span className="relative z-10">Continue Shopping</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primaryLight 
                          transform scale-x-0 group-hover:scale-x-100 
                          transition-transform duration-300 origin-left">
            </div>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid gap-6">
            {cartItems.map((item) => (
              <div 
                key={item.product._id} 
                className="bg-surface rounded-xl shadow-sm overflow-hidden p-6
                         transform transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex justify-between items-center">
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-textPrimary mb-2">{item.product.name}</h3>
                    <p className="text-2xl font-bold text-accent">
                      {currencyConversions.formatPrice(item.product.price)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                      <button 
                        onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 rounded-md flex items-center justify-center
                                 bg-white border border-gray-200 text-gray-600
                                 transition-all duration-200 hover:bg-gray-50
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.available_quantity}
                        className="w-8 h-8 rounded-md flex items-center justify-center
                                 bg-white border border-gray-200 text-gray-600
                                 transition-all duration-200 hover:bg-gray-50
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => handleRemoveItem(item.product._id)}
                      className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium
                               transform transition-all duration-300 hover:-translate-y-1
                               hover:shadow-md active:translate-y-0"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-surface rounded-xl shadow-sm">
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold text-gray-700">Total Items:</span>
                <span className="text-xl font-semibold text-gray-700">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-gray-900">Total Amount:</span>
                <span className="text-2xl font-bold text-accent">
                  {currencyConversions.formatPrice(calculateTotal())}
                </span>
              </div>
              
              <div className="h-px bg-gray-200"></div>
              
              <button
                onClick={handleCheckout}
                className="cart-button w-full py-4 px-6 rounded-lg bg-primary text-white font-semibold
                         transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
                         relative overflow-hidden group/btn"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <i className="fas fa-credit-card text-xl"></i>
                  Proceed to Checkout
                </span>
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-primary to-primaryLight 
                            transform scale-x-0 group-hover/btn:scale-x-100 
                            transition-transform duration-300 origin-left"
                ></div>
              </button>
              
            
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;