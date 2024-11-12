// FlightSearch.jsx
import React, { useState } from 'react';
import axios from 'axios';
import FlightBooking from './FlightBooking';

const FlightSearch = () => {
  const [origin, setOrigin] = useState('');
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State to manage which flight's booking form is open
  const [selectedFlight, setSelectedFlight] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!origin) {
      setError('Please enter an origin city code.');
      return;
    }
    setLoading(true);
    setError(null);
    setFlights([]);
    setSelectedFlight(null);

    try {
      const response = await axios.get('http://localhost:8000/api/search-flights', {
        params: {
          origin: origin.toUpperCase(),
        },
      });
      setFlights(response.data.data || []);
    } catch (err) {
      console.error('Error fetching flights:', err);
      let errorMessage = 'Failed to fetch flights. Please try again.';
      if (err.response && err.response.data) {
        if (err.response.data.errors && err.response.data.errors.length > 0) {
          const apiError = err.response.data.errors[0];
          errorMessage = apiError.detail || apiError.title || errorMessage;
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (flight) => {
    // Toggle the booking form for the selected flight
    setSelectedFlight((prevFlight) => (prevFlight === flight ? null : flight));
  };

  return (
    <div style={styles.container}>
      <h2>Search Flights</h2>
      <form onSubmit={handleSearch} style={styles.form}>
        <input
          type="text"
          placeholder="Origin City Code (e.g., DUB)"
          value={origin}
          onChange={(e) => setOrigin(e.target.value.toUpperCase())}
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
        {flights.length > 0 ? (
          flights.map((flight, index) => (
            <div key={index} style={styles.flightCard}>
              {/* Display relevant flight details */}
              <h3>
                {origin.toUpperCase()} ➔ {flight.destination}
              </h3>
              <p>Price: {flight.price.total} {flight.price.currency}</p>
              <p>Departure Date: {flight.departureDate}</p>
              {flight.returnDate && <p>Return Date: {flight.returnDate}</p>}
              {/* Add the Book button */}
              <button
                style={styles.bookButton}
                onClick={() => handleBookClick(flight)}
              >
                {selectedFlight === flight ? 'Close Booking' : 'Book'}
              </button>
              {/* Conditionally render the FlightBooking component */}
              {selectedFlight === flight && (
                <FlightBooking flight={flight} />
              )}
            </div>
          ))
        ) : (
          !loading &&
          !error && <p>No flights found. Please try a different search.</p>
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
    borderRadius: '4px',
  },
  bookButton: {
    padding: '8px 12px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    marginTop: '10px',
    borderRadius: '4px',
  },
  error: {
    marginTop: '10px',
    color: 'red',
  },
  results: {
    marginTop: '20px',
  },
  flightCard: {
    border: '1px solid #ccc',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '15px',
  },
};

export default FlightSearch;
