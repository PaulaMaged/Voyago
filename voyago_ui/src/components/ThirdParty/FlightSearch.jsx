// FlightSearch.jsx
import React, { useState } from 'react';
import axios from 'axios';

const FlightSearch = () => {
  const [origin, setOrigin] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [oneWay, setOneWay] = useState(false);
  const [duration, setDuration] = useState('');
  const [nonStop, setNonStop] = useState(false);
  const [maxPrice, setMaxPrice] = useState('');
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!origin) {
      setError('Please enter an origin IATA code.');
      return;
    }
    setLoading(true);
    setError(null);
    setFlights([]); // Clear previous results

    try {
      const params = {
        origin: origin.toUpperCase(),
      };
      if (departureDate) params.departureDate = departureDate;
      if (oneWay) params.oneWay = true;
      if (duration) params.duration = duration;
      if (nonStop) params.nonStop = true;
      if (maxPrice) params.maxPrice = maxPrice;

      const response = await axios.get('http://localhost:8000/api/search-flights', {
        params,
      });
      setFlights(response.data.data || []);
    } catch (err) {
        console.error('Error fetching flights:', err);
        let errorMessage = 'Failed to fetch flights. Please try again.';
        if (err.response && err.response.data) {
          if (err.response.data.error) {
            errorMessage = err.response.data.error;
          } else if (err.response.data.errors && err.response.data.errors.length > 0) {
            // Extract the first error message from the errors array
            const apiError = err.response.data.errors[0];
            errorMessage = apiError.detail || apiError.title || errorMessage;
          }
        }
        setError(errorMessage);
      ;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Search Flights</h2>
      <form onSubmit={handleSearch} style={styles.form}>
        <input
          type="text"
          placeholder="Origin IATA Code (e.g., BOS)"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="date"
          placeholder="Departure Date"
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
          style={styles.input}
        />
        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={oneWay}
            onChange={(e) => setOneWay(e.target.checked)}
          />
          One Way
        </label>
        {oneWay && (
          <input
            type="number"
            placeholder="Duration (days)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            style={styles.input}
          />
        )}
        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={nonStop}
            onChange={(e) => setNonStop(e.target.checked)}
          />
          Non-Stop
        </label>
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
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
              <h3>
                {origin.toUpperCase()} ➔ {flight.destination}
              </h3>
              <p>Price: {flight.price.total} {flight.price.currency}</p>
              <p>Departure Date: {flight.departureDate}</p>
              {flight.returnDate && <p>Return Date: {flight.returnDate}</p>}
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
  checkboxLabel: {
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
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
  flightCard: {
    border: '1px solid #ccc',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '15px',
  },
};

export default FlightSearch;
