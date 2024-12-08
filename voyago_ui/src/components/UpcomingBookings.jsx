import React, { useState, useEffect } from 'react';
import axios from 'axios';
import check from '../helpers/checks';
import './UpcomingBookings.css';

export default function UpcomingBookings() {
  const [upcomingBookings, setUpcomingBookings] = useState({
    activities: [],
    itineraries: []
  });

  useEffect(() => {
    fetchUpcomingBookings();
  }, []);

  const fetchUpcomingBookings = async () => {
    try {
      const touristId = localStorage.getItem('roleId');
      const response = await axios.get(
        `http://localhost:8000/api/tourist/get-upcoming-bookings/${touristId}`
      );
      setUpcomingBookings(response.data);
    } catch (error) {
      console.error('Error fetching upcoming bookings:', error);
      alert('Error fetching upcoming bookings');
    }
  };

  const handleCancelActivity = async (booking) => {
    if (!window.confirm('Are you sure you want to cancel this activity?')) {
      return;
    }

    try {
      const isPast = await check.isCompleted(booking.activity, "activity");
      if (isPast) {
        alert("Cannot cancel past activities");
        return;
      }

      const response = await axios.delete(
        `http://localhost:8000/api/tourist/tourist-cancel-activity-booking/${booking._id}`
      );

      if (response.status === 200) {
        const touristId = localStorage.getItem('roleId');
        const touristResponse = await axios.get(
          `http://localhost:8000/api/tourist/get-tourist/${touristId}`
        );
        
        localStorage.setItem('walletBalance', touristResponse.data.wallet);
        
        alert(`Activity cancelled successfully. $${booking.activity.price} has been refunded to your wallet.`);
        fetchUpcomingBookings();
      }
    } catch (error) {
      console.error('Error cancelling activity:', error);
      alert(error.response?.data?.message || 'Error cancelling activity');
    }
  };

  return (
    <div className="upcoming-bookings-container">
      <h1>Upcoming Bookings</h1>
      
      <section className="activities-section">
        <h2>Activities</h2>
        {upcomingBookings.activities.length === 0 ? (
          <p>No upcoming activities</p>
        ) : (
          <div className="bookings-grid">
            {upcomingBookings.activities.map((booking) => (
              <div key={booking._id} className="booking-card">
                <h3>{booking.activity.title}</h3>
                <p className="description">{booking.activity.description}</p>
                <div className="booking-details">
                  <p>
                    <strong>Date:</strong>{' '}
                    {new Date(booking.activity.start_time).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Time:</strong>{' '}
                    {new Date(booking.activity.start_time).toLocaleTimeString()}
                  </p>
                  <p>
                    <strong>Duration:</strong> {booking.activity.duration} minutes
                  </p>
                  <p>
                    <strong>Price:</strong> ${booking.activity.price}
                  </p>
                </div>
                <button 
                  className="cancel-button"
                  onClick={() => handleCancelActivity(booking)}
                >
                  Cancel Activity
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="itineraries-section">
        <h2>Itineraries</h2>
        {upcomingBookings.itineraries.length === 0 ? (
          <p>No upcoming itineraries</p>
        ) : (
          <div className="bookings-grid">
            {upcomingBookings.itineraries.map((booking) => (
              <div key={booking._id} className="booking-card">
                <h3>{booking.itinerary.name}</h3>
                <p className="description">{booking.itinerary.description}</p>
                <div className="booking-details">
                  <p>
                    <strong>Start Date:</strong>{' '}
                    {new Date(booking.itinerary.start_date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>End Date:</strong>{' '}
                    {new Date(booking.itinerary.end_date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Price:</strong> ${booking.itinerary.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
} 