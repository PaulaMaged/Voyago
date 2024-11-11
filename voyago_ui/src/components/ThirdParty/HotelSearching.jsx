// src/HotelSearch.js
import React, { useState } from 'react';
import axios from 'axios';
import HotelBooking from './HotelBooking';

const HotelSearch = () => {
  const [cityCode, setCityCode] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!cityCode || !checkInDate || !checkOutDate) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/search-hotels', {
        cityCode,
        checkInDate,
        checkOutDate,
        adults,
      });

      setHotels(response.data.data); // Adjust based on actual API response structure
      setError(null);
      setSelectedHotel(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch hotels. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Search Hotels</h2>
      <form onSubmit={handleSearch} style={styles.form}>
        <input
          type="text"
          placeholder="City Code (e.g., PAR)"
          value={cityCode}
          onChange={(e) => setCityCode(e.target.value.toUpperCase())}
          required
          style={styles.input}
        />
        <input
          type="date"
          placeholder="Check-in Date"
          value={checkInDate}
          onChange={(e) => setCheckInDate(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="date"
          placeholder="Check-out Date"
          value={checkOutDate}
          onChange={(e) => setCheckOutDate(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="number"
          min="1"
          placeholder="Adults"
          value={adults}
          onChange={(e) => setAdults(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Search
        </button>
      </form>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.results}>
        {hotels.length > 0 ? (
          hotels.map((hotel) => (
            <div key={hotel.hotel.hotelId} style={styles.hotelCard}>
              <h3>{hotel.hotel.name}</h3>
              <p>{hotel.hotel.address.lines.join(', ')}</p>
              <p>Price: €{hotel.offers[0].price.total}</p>
              <button style={styles.bookButton} onClick={() => setSelectedHotel(hotel)}>
                Book Now
              </button>
            </div>
          ))
        ) : (
          <p>No hotels found. Please try a different search.</p>
        )}
      </div>

      {selectedHotel && <HotelBooking hotel={selectedHotel} />}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '20px auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
  },
  button: {
    padding: '10px',
    backgroundColor: '#0071c2',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
  },
  error: {
    marginTop: '10px',
    color: 'red',
  },
  results: {
    marginTop: '20px',
  },
  hotelCard: {
    border: '1px solid #ccc',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '15px',
  },
  bookButton: {
    padding: '8px 12px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
};

export default HotelSearch;
