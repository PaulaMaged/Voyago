import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddAddress.css';

const AddAddress = () => {
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    isDefault: false,
    coordinates: {
      latitude: '',
      longitude: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const touristId = localStorage.getItem('roleId');
      if (!touristId) {
        throw new Error('Please log in to continue');
      }

      // First create/get location reference
      const locationResponse = await axios.post('http://localhost:8000/api/locations/reference', {
        latitude: parseFloat(address.coordinates.latitude),
        longitude: parseFloat(address.coordinates.longitude)
      });

      // Then create address with location reference
      await axios.post(`http://localhost:8000/api/orders/tourist-addresses/${touristId}`, {
        ...address,
        location: locationResponse.data.locationId
      });

      navigate('/checkout');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to add address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-address-container">
      <h2>Add New Delivery Address</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="address-form">
        <div className="form-group">
          <label>Street Address*</label>
          <input
            type="text"
            value={address.street}
            onChange={(e) => setAddress({...address, street: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="city">City*</label>
          <input
            type="text"
            id="city"
            name="city"
            value={address.city}
            onChange={(e) => setAddress({...address, city: e.target.value})}
            required
            placeholder="Enter city"
          />
        </div>

        <div className="form-group">
          <label htmlFor="state">State/Province*</label>
          <input
            type="text"
            id="state"
            name="state"
            value={address.state}
            onChange={(e) => setAddress({...address, state: e.target.value})}
            required
            placeholder="Enter state or province"
          />
        </div>

        <div className="form-group">
          <label htmlFor="postalCode">Postal Code*</label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={address.postalCode}
            onChange={(e) => setAddress({...address, postalCode: e.target.value})}
            required
            placeholder="Enter postal code"
          />
        </div>

        <div className="form-group">
          <label htmlFor="country">Country*</label>
          <input
            type="text"
            id="country"
            name="country"
            value={address.country}
            onChange={(e) => setAddress({...address, country: e.target.value})}
            required
            placeholder="Enter country"
          />
        </div>

        <div className="coordinates-group">
          <h3>Location Coordinates</h3>
          <div className="form-group">
            <label>Latitude*</label>
            <input
              type="number"
              step="any"
              value={address.coordinates.latitude}
              onChange={(e) => setAddress({
                ...address,
                coordinates: {...address.coordinates, latitude: e.target.value}
              })}
              required
            />
          </div>
          <div className="form-group">
            <label>Longitude*</label>
            <input
              type="number"
              step="any"
              value={address.coordinates.longitude}
              onChange={(e) => setAddress({
                ...address,
                coordinates: {...address.coordinates, longitude: e.target.value}
              })}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={address.isDefault}
              onChange={(e) => setAddress({...address, isDefault: e.target.checked})}
            />
            Set as default address
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Address'}
        </button>
      </form>
    </div>
  );
};

export default AddAddress; 