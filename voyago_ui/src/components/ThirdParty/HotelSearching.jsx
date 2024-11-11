import React, { useState } from 'react';
import axios from 'axios';

const HotelSearch = () => {
    const [cityCode, setCityCode] = useState('');
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const handleSearch = async (e) => {
      e.preventDefault();
      if (!cityCode) {
        setError('Please enter a city code.');
        return;
      }
      setLoading(true);
      setError(null);
      setHotels([]); // Clear previous results
  
      try {
        const response = await axios.get(
          `http://localhost:8000/api/search-hotels?cityCode=${cityCode}`
        );
        setHotels(response.data.data || []);
      } catch (err) {
        console.error('Error fetching hotels:', err);
        setError(
          err.response && err.response.data && err.response.data.error
            ? err.response.data.error
            : 'Failed to fetch hotels. Please try again.'
        );
      } finally {
        setLoading(false);
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
          <button type="submit" style={styles.button}>
            Search
          </button>
        </form>
  
        {loading && <div>Loading...</div>}
        {error && <div style={styles.error}>{error}</div>}
  
        <div style={styles.results}>
          {hotels.length > 0 ? (
            hotels.map((hotel) => (
              <div key={hotel.hotelId} style={styles.hotelCard}>
                <h3>{hotel.name}</h3>
                <p>
                  {hotel.address?.lines
                    ? hotel.address.lines.join(', ')
                    : hotel.address
                    ? `${hotel.address.cityName}, ${hotel.address.countryCode}`
                    : 'Address not available'}
                </p>
              </div>
            ))
          ) : (
            !loading && !error && (
              <p>No hotels found. Please try a different search.</p>
            )
          )}
        </div>
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
};

export default HotelSearch;
