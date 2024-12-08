import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import currencyConversions from "../helpers/currencyConversions";
import "./Checkout.css";
import getCheckoutUrl from "../helpers/getCheckoutUrl";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchCartItems();
    fetchSavedAddresses();
  }, []);

  const fetchCartItems = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const roleId = localStorage.getItem("roleId");

      if (!user || !roleId) {
        setError("Please log in to continue");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `http://localhost:8000/api/cart/${roleId}`
      );
      if (response.data?.items) {
        setCartItems(response.data.items);
      } else {
        setCartItems([]);
      }
      setLoading(false);
    } catch (err) {
      console.error("Cart fetch error:", err);
      setError("Failed to fetch cart items");
      setLoading(false);
    }
  };

  const fetchSavedAddresses = async () => {
    try {
      const roleId = localStorage.getItem("roleId");
      if (!roleId) {
        setError("Please log in to continue");
        return;
      }

      const response = await axios.get(
        `http://localhost:8000/api/orders/tourist-addresses/${roleId}`
      );

      if (response.data && Array.isArray(response.data)) {
        setSavedAddresses(response.data);
        const defaultAddress = response.data.find((addr) => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress._id);
        }
      } else {
        setSavedAddresses([]);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching addresses:", err);
      setError(
        err.response?.data?.message || "Failed to fetch saved addresses"
      );
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!cartItems || cartItems.length === 0) return 0;

    return cartItems.reduce((total, item) => {
      if (
        !item.product ||
        typeof item.product.price !== "number" ||
        typeof item.quantity !== "number"
      ) {
        console.error("Invalid cart item:", item);
        return total;
      }
      return total + item.product.price * item.quantity;
    }, 0);
  };

  const handleStripePayment = async () => {
    const url = await getCheckoutUrl(
      "product",
      "http://localhost:5173/Tourist_Dashboard?accepted",
      "http://localhost:5173/Tourist_Dashboard?cancelled",
      cartItems,
      { addressId: selectedAddressId }
    );

    window.location = url;
  };

  const handleCheckout = async () => {
    try {
      const roleId = localStorage.getItem("roleId");

      if (!roleId) {
        setError("Please log in to continue");
        return;
      }

      if (!selectedAddressId) {
        setError("Please select a delivery address");
        return;
      }

      setIsProcessing(true);
      setError(null);

      let url = "";
      let data = {};

      if (paymentMethod == "card") {
        handleStripePayment();
        return;
      } else {
        url = "http://localhost:8000/api/orders/checkout";
        data = {
          touristId: roleId,
          addressId: selectedAddressId,
          paymentMethod,
        };
      }
      // Create order using checkout endpoint
      const response = await axios.post(url, data);

      // Update wallet balance in localStorage if payment method was wallet
      if (paymentMethod === "wallet") {
        const { updatedWalletBalance } = response.data;
        localStorage.setItem("walletBalance", updatedWalletBalance);
      }

      // Navigate to order confirmation page with receipt data
      navigate("/order-confirmation", {
        state: {
          receipt: response.data,
        },
      });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to process checkout");
      setIsProcessing(false);
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          <div className="order-summary">
            <h3>Order Summary</h3>
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item-summary">
                <span>
                  {item.product.name} x {item.quantity}
                </span>
                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="total">Total: ${calculateTotal().toFixed(2)}</div>
          </div>

          <div className="delivery-address-section">
            <h3>Select Delivery Address</h3>
            {savedAddresses.length === 0 ? (
              <div className="no-addresses">
                <p>No saved addresses found.</p>
                <Link to="/add-address" className="add-address-button">
                  Add New Address
                </Link>
              </div>
            ) : (
              <>
                <div className="saved-addresses">
                  {savedAddresses.map((address) => (
                    <div key={address._id} className="address-option">
                      <input
                        type="radio"
                        id={address._id}
                        name="deliveryAddress"
                        value={address._id}
                        checked={selectedAddressId === address._id}
                        onChange={(e) => setSelectedAddressId(e.target.value)}
                      />
                      <label htmlFor={address._id}>
                        <div className="address-details">
                          <p>{address.street}</p>
                          <p>
                            {address.city}, {address.state} {address.postalCode}
                          </p>
                          <p>{address.country}</p>
                          {address.isDefault && (
                            <span className="default-badge">Default</span>
                          )}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
                <Link to="/add-address" className="add-another-address">
                  Add Another Address
                </Link>
              </>
            )}
          </div>

          <div className="payment-method">
            <h3>Payment Method</h3>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="wallet">Wallet</option>
              <option value="cash">Cash on Delivery</option>
              <option value="card">Card</option>
            </select>
          </div>

          <button
            onClick={handleCheckout}
            className="checkout-button"
            disabled={isProcessing || !selectedAddressId}
          >
            {isProcessing ? "Processing..." : "Place Order"}
          </button>
        </>
      )}
    </div>
  );
};

export default Checkout;
