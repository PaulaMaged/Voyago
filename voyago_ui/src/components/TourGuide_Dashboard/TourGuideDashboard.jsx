import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaUsers, FaStar, FaMoneyBillWave, FaSpinner } from 'react-icons/fa';
import './tourGuideDashboard.css';

const TourGuideDashboard = () => {
  const [stats, setStats] = useState({
    totalItineraries: 0,
    activeItineraries: 0,
    totalBookings: 0,
    averageRating: 0,
    totalEarnings: 0,
    recentBookings: [],
    upcomingItineraries: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const tourGuideId = localStorage.getItem('roleId');
      
      // Fetch all required data in parallel
      const [
        itinerariesResponse,
        bookingsResponse,
        ratingsResponse,
        earningsResponse
      ] = await Promise.all([
        axios.get(`http://localhost:8000/api/tour-guide/get-tourguide-itineraries/${tourGuideId}`),
        axios.get(`http://localhost:8000/api/tour-guide/bookings/${tourGuideId}`),
        axios.get(`http://localhost:8000/api/tour-guide/ratings/${tourGuideId}`),
        axios.get(`http://localhost:8000/api/tour-guide/earnings/${tourGuideId}`)
      ]);

      // Process the data
      const allItineraries = itinerariesResponse.data;
      const activeItineraries = allItineraries.filter(it => it.active);
      const upcomingItineraries = activeItineraries
        .filter(it => new Date(it.start_date) > new Date())
        .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
        .slice(0, 5);

      const recentBookings = bookingsResponse.data
        .sort((a, b) => new Date(b.booking_date) - new Date(a.booking_date))
        .slice(0, 5);

      setStats({
        totalItineraries: allItineraries.length,
        activeItineraries: activeItineraries.length,
        totalBookings: bookingsResponse.data.length,
        averageRating: ratingsResponse.data.averageRating || 0,
        totalEarnings: earningsResponse.data.totalEarnings || 0,
        recentBookings,
        upcomingItineraries
      });

      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="tour-guide-dashboard-loading">
        <FaSpinner className="spinner" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tour-guide-dashboard-error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="tour-guide-dashboard">
      <h1>Tour Guide Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <FaCalendarAlt className="stat-icon" />
          <div className="stat-content">
            <h3>Total Itineraries</h3>
            <p>{stats.totalItineraries}</p>
            <small>{stats.activeItineraries} active</small>
          </div>
        </div>

        <div className="stat-card">
          <FaUsers className="stat-icon" />
          <div className="stat-content">
            <h3>Total Bookings</h3>
            <p>{stats.totalBookings}</p>
          </div>
        </div>

        <div className="stat-card">
          <FaStar className="stat-icon" />
          <div className="stat-content">
            <h3>Average Rating</h3>
            <p>{stats.averageRating.toFixed(1)} / 5.0</p>
          </div>
        </div>

        <div className="stat-card">
          <FaMoneyBillWave className="stat-icon" />
          <div className="stat-content">
            <h3>Total Earnings</h3>
            <p>${stats.totalEarnings.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="dashboard-sections">
        <div className="dashboard-section">
          <h2>Recent Bookings</h2>
          <div className="activity-list">
            {stats.recentBookings.map((booking) => (
              <div key={booking._id} className="activity-item">
                <div className="activity-info">
                  <h3>{booking.itinerary.name}</h3>
                  <p>Booked by: {booking.tourist.user.username}</p>
                  <p>Date: {new Date(booking.booking_date).toLocaleDateString()}</p>
                </div>
                <div className="activity-price">
                  ${booking.itinerary.price}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Upcoming Itineraries</h2>
          <div className="activity-list">
            {stats.upcomingItineraries.map((itinerary) => (
              <div key={itinerary._id} className="activity-item">
                <div className="activity-info">
                  <h3>{itinerary.name}</h3>
                  <p>Date: {new Date(itinerary.start_date).toLocaleDateString()}</p>
                  <p>Time: {itinerary.start_time}</p>
                </div>
                <div className="activity-meta">
                  <span className="activity-bookings">
                    {itinerary.bookings?.length || 0} bookings
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourGuideDashboard; 