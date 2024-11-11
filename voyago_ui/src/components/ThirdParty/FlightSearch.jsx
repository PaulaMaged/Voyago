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
      documentType: 'PASSPORT',
      documentNumber: '',
      expiryDate: '',
      issuanceCountry: '',
      nationality: '',
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
        documentType: 'PASSPORT',
        documentNumber: '',
        expiryDate: '',
        issuanceCountry: '',
        nationality: '',
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
        !traveler.email ||
        !traveler.documentNumber ||
        !traveler.expiryDate ||
        !traveler.issuanceCountry ||
        !traveler.nationality
      ) {
        setError('Please fill in all traveler details.');
        return;
      }
    }

    setLoading(true);
    setError(null);
    setBookingStatus(null);

    try {
      // Prepare flight offer object
      const flightOffer = {
        type: 'flight-offer',
        id: '1', // Placeholder ID; in real scenarios, this should come from a flight offers search
        source: 'GDS',
        instantTicketingRequired: false,
        nonHomogeneous: false,
        oneWay: false,
        lastTicketingDate: flight.departureDate,
        numberOfBookableSeats: 1,
        itineraries: [
          {
            segments: [
              {
                departure: {
                  iataCode: flight.origin.toUpperCase(),
                  at: flight.departureDate + 'T00:00:00',
                },
                arrival: {
                  iataCode: flight.destination.toUpperCase(),
                  at: flight.departureDate + 'T00:00:00',
                },
                carrierCode: 'XX',
                number: '1234',
                aircraft: {
                  code: '320',
                },
                duration: 'PT2H',
                id: '1',
                numberOfStops: 0,
                blacklistedInEU: false,
              },
            ],
          },
        ],
        price: {
          currency: 'USD',
          total: '200.00',
          base: '150.00',
        },
        pricingOptions: {
          fareType: ['PUBLISHED'],
          includedCheckedBagsOnly: true,
        },
        validatingAirlineCodes: ['XX'],
        travelerPricings: [
          {
            travelerId: '1',
            fareOption: 'STANDARD',
            travelerType: 'ADULT',
            price: {
              currency: 'USD',
              total: '200.00',
              base: '150.00',
            },
            fareDetailsBySegment: [
              {
                segmentId: '1',
                cabin: 'ECONOMY',
                fareBasis: 'Y',
                class: 'Y',
                includedCheckedBags: {
                  quantity: 1,
                },
              },
            ],
          },
        ],
      };

      // Prepare traveler data
      const preparedTravelers = travelers.map((traveler, index) => ({
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
        documents: [
          {
            documentType: traveler.documentType,
            number: traveler.documentNumber,
            expiryDate: traveler.expiryDate,
            issuanceCountry: traveler.issuanceCountry,
            nationality: traveler.nationality,
            holder: true,
          },
        ],
      }));

      // Send booking request to backend
      const response = await axios.post('http://localhost:8000/api/book-flight', {
        flightDetails: flightOffer,
        travelers: preparedTravelers,
      });

      setBookingStatus('Booking successful! Your booking reference is ' + response.data.data.id);
      // Reset form
      setTravelers([
        {
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          email: '',
          gender: 'UNKNOWN',
          documentType: 'PASSPORT',
          documentNumber: '',
          expiryDate: '',
          issuanceCountry: '',
          nationality: '',
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
            <input
              type="text"
              placeholder="Document Number"
              value={traveler.documentNumber}
              onChange={(e) => handleTravelerChange(index, 'documentNumber', e.target.value)}
              required
              style={styles.input}
            />
            <input
              type="date"
              placeholder="Document Expiry Date"
              value={traveler.expiryDate}
              onChange={(e) => handleTravelerChange(index, 'expiryDate', e.target.value)}
              required
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Issuance Country (e.g., US)"
              value={traveler.issuanceCountry}
              onChange={(e) => handleTravelerChange(index, 'issuanceCountry', e.target.value.toUpperCase())}
              required
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Nationality (e.g., US)"
              value={traveler.nationality}
              onChange={(e) => handleTravelerChange(index, 'nationality', e.target.value.toUpperCase())}
              required
              style={styles.input}
            />
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
