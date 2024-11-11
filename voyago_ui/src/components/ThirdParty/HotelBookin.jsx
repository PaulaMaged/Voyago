// src/HotelBooking.js
import React, { useState } from 'react';
import axios from 'axios';

const HotelBooking = ({ hotel }) => {
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [bookingStatus, setBookingStatus] = useState(null);
  const [error, setError] = useState(null);

  const handleBooking = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!userDetails.name || !userDetails.email || !userDetails.phone) {
      setError('Please fill in all user details.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/book-hotel', {
        hotelId: hotel.hotel.hotelId,
        userDetails,
      });

      setBookingStatus(response.data.message);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to book hotel. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h3>Book: {hotel.hotel.name}</h3>
      <form onSubmit={handleBooking} style={styles.form}>
        <h4>User Details</h4>
        <input
          type="text"
          placeholder="Name"
          value={userDetails.name}
          onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
          required
          style={styles.input}
        />
        <input
          type="email"
          placeholder="Email"
          value={userDetails.email}
          onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
          required
          style={styles.input}
        />
        <input
          type="tel"
          placeholder="Phone"
          value={userDetails.phone}
          onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Confirm Booking
        </button>
      </form>

      {bookingStatus && <div style={styles.success}>{bookingStatus}</div>}
      {error && <div style={styles.error}>{error}</div>}
    </div>
  );
};

const styles = {
  container: {
    border: '1px solid #28a745',
    padding: '15px',
    borderRadius: '8px',
    marginTop: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  input: {
    padding: '8px',
    fontSize: '14px',
  },
  button: {
    padding: '10px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
  },
  success: {
    marginTop: '10px',
    color: 'green',
  },
  error: {
    marginTop: '10px',
    color: 'red',
  },
};

export default HotelBooking;
