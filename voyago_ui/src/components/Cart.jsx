import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      fetchCartItems();
      fetchDeliveryAddresses();
    }
  }, [userId]);

  const fetchCartItems = async () => {
    try {
      const cart = await axios.get(`http://localhost:8000/api/cart/${userId}`);
      const itemsWithDetails = await Promise.all(
        cart.data.items.map(async (item) => {
          const productResponse = await axios.get(
            `http://localhost:8000/api/product/retrieve-product-by-id/${item.product}`
          );
          return {
            ...item,
            productDetails: productResponse.data
          };
        })
      );
      setCartItems(itemsWithDetails);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch cart items');
      setLoading(false);
    }
  };

  const fetchDeliveryAddresses = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/orders/address/${userId}`);
      setAddresses(response.data);
      if (response.data.length > 0) {
        const defaultAddress = response.data.find(addr => addr.isDefault) || response.data[0];
        setSelectedAddress(defaultAddress._id);
      }
    } catch (err) {
      console.error('Failed to fetch delivery addresses:', err);
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      await axios.post('http://localhost:8000/api/cart/update', {
        userId,
        productId,
        quantity: newQuantity
      });
      fetchCartItems();
    } catch (err) {
      setError('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await axios.post('http://localhost:8000/api/cart/remove', {
        userId,
        productId
      });
      fetchCartItems();
    } catch (err) {
      setError('Failed to remove item');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.productDetails.price * item.quantity);
    }, 0);
  };

  const handleCheckout = async () => {
    if (!selectedAddress) {
      setError('Please select a delivery address');
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/orders/checkout', {
        userId,
        addressId: selectedAddress
      });
      setCartItems([]);
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to checkout');
    }
  };

  const handleAddAddress = () => {
    navigate('/add-address');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.product} className="cart-item">
                <img 
                  src={item.productDetails.picture || 'default-product-image.jpg'} 
                  alt={item.productDetails.name} 
                  className="item-image"
                />
                <div className="item-details">
                  <h3>{item.productDetails.name}</h3>
                  <p className="price">${item.productDetails.price}</p>
                </div>
                <div className="item-actions">
                  <div className="quantity-controls">
                    <button 
                      onClick={() => handleQuantityChange(item.product, Math.max(1, item.quantity - 1))}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(item.product, item.quantity + 1)}
                      disabled={item.quantity >= item.productDetails.available_quantity}
                    >
                      +
                    </button>
                  </div>
                  <button 
                    className="remove-button"
                    onClick={() => handleRemoveItem(item.product)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="delivery-section">
            <h3>Delivery Address</h3>
            {addresses.length > 0 ? (
              <select 
                value={selectedAddress} 
                onChange={(e) => setSelectedAddress(e.target.value)}
              >
                {addresses.map(address => (
                  <option key={address._id} value={address._id}>
                    {address.street}, {address.city}, {address.state}
                  </option>
                ))}
              </select>
            ) : (
              <p>No delivery addresses found</p>
            )}
            <button onClick={handleAddAddress} className="add-address-button">
              Add New Address
            </button>
          </div>

          <div className="cart-summary">
            <div className="total">
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <button 
              className="checkout-button"
              onClick={handleCheckout}
              disabled={!selectedAddress}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;