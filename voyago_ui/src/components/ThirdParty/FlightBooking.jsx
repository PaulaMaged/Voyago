// FlightBooking.jsx
import React, { useState } from 'react';
import axios from 'axios';

const FlightBooking = ({ flight }) => {
  const [travelers, setTravelers] = useState([
    {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      email: '',
      gender: 'UNKNOWN', // Can be 'MALE' or 'FEMALE'
    },
  ]);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTravelerChange = (index, field, value) => {
    const updatedTravelers = [...travelers];
    updatedTravelers[index][field] = value;
    setTravelers(updatedTravelers);
  };

  const addTraveler = () => {
    setTravelers([
      ...travelers,
      {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        email: '',
        gender: 'UNKNOWN',
      },
    ]);
  };

  const removeTraveler = (index) => {
    const updatedTravelers = travelers.filter((_, i) => i !== index);
    setTravelers(updatedTravelers);
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    // Validate inputs
    for (let traveler of travelers) {
      if (
        !traveler.firstName ||
        !traveler.lastName ||
        !traveler.dateOfBirth ||
        !traveler.email
      ) {
        setError('Please fill in all traveler details.');
        return;
      }
    }

    setLoading(true);
    setError(null);
    setBookingStatus(null);

    try {
      // Prepare booking data without flightOffer and passport details
      const bookingData = {
        flightDetails: flight, // Assuming flight data is sufficient
        travelers: travelers.map((traveler, index) => ({
          id: (index + 1).toString(),
          dateOfBirth: traveler.dateOfBirth,
          name: {
            firstName: traveler.firstName,
            lastName: traveler.lastName,
          },
          gender: traveler.gender,
          contact: {
            emailAddress: traveler.email,
          },
        })),
      };

      // Send booking request to backend
      const response = await axios.post('http://localhost:8000/api/book-flight', bookingData);

      setBookingStatus('Booking successful! Your booking reference is ' + response.data.data.id);
      // Reset form
      setTravelers([
        {
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          email: '',
          gender: 'UNKNOWN',
        },
      ]);
    } catch (err) {
      console.error('Error booking flight:', err);
      let errorMessage = 'Failed to book flight. Please try again.';
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

  return (
    <div style={styles.container}>
      <h3>Book Flight</h3>
      <form onSubmit={handleBooking} style={styles.form}>
        <h4>Traveler Details</h4>
        {travelers.map((traveler, index) => (
          <div key={index} style={styles.travelerSection}>
            <h5>Traveler {index + 1}</h5>
            <input
              type="text"
              placeholder="First Name"
              value={traveler.firstName}
              onChange={(e) => handleTravelerChange(index, 'firstName', e.target.value)}
              required
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={traveler.lastName}
              onChange={(e) => handleTravelerChange(index, 'lastName', e.target.value)}
              required
              style={styles.input}
            />
            <input
              type="date"
              placeholder="Date of Birth"
              value={traveler.dateOfBirth}
              onChange={(e) => handleTravelerChange(index, 'dateOfBirth', e.target.value)}
              required
              style={styles.input}
            />
            <input
              type="email"
              placeholder="Email Address"
              value={traveler.email}
              onChange={(e) => handleTravelerChange(index, 'email', e.target.value)}
              required
              style={styles.input}
            />
            <label style={styles.checkboxLabel}>
              Gender:
              <select
                value={traveler.gender}
                onChange={(e) => handleTravelerChange(index, 'gender', e.target.value)}
                style={styles.select}
              >
                <option value="UNKNOWN">Unknown</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </label>
            {travelers.length > 1 && (
              <button
                type="button"
                onClick={() => removeTraveler(index)}
                style={styles.removeButton}
              >
                Remove Traveler
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addTraveler} style={styles.addButton}>
          Add Traveler
        </button>

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Processing...' : 'Confirm Booking'}
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
    gap: '15px',
  },
  travelerSection: {
    border: '1px solid #ccc',
    padding: '10px',
    borderRadius: '6px',
  },
  input: {
    padding: '8px',
    fontSize: '14px',
  },
  checkboxLabel: {
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  select: {
    marginLeft: '10px',
    padding: '5px',
    fontSize: '14px',
  },
  addButton: {
    padding: '8px 12px',
    backgroundColor: '#17a2b8',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    borderRadius: '4px',
    alignSelf: 'flex-start',
  },
  removeButton: {
    padding: '6px 10px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '12px',
    borderRadius: '4px',
    marginTop: '10px',
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
  error: {
    marginTop: '10px',
    color: 'red',
  },
  success: {
    marginTop: '10px',
    color: 'green',
  },
};

export default FlightBooking;
