import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Statistics.css';

const GuideTouristStats = () => {
  const [touristData, setTouristData] = useState({
    totalTourists: 0,
    itineraryStats: {},
  });

  const [overallTotal, setOverallTotal] = useState(0);
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    month: ''
  });

  const tourGuideId = localStorage.getItem('roleId');

  useEffect(() => {
    if (!tourGuideId) {
      setError('Tour Guide ID not found');
      setLoading(false);
      return;
    }
    fetchTouristData();
  }, [tourGuideId]);

  const fetchTouristData = async () => {
    try {
      setLoading(true);
      let endpoint = `http://localhost:8000/api/tour-guide/tourist-count/${tourGuideId}`;
      
      if (!overallTotal) {
        const overallResponse = await axios.get(endpoint);
        setOverallTotal(overallResponse.data.totalTourists);
      }
      
      if (filter.month) {
        endpoint = `${endpoint}/by-month?month=${filter.month}`;
      }

      const [touristResponse, itinerariesResponse] = await Promise.all([
        axios.get(endpoint),
        axios.get(`http://localhost:8000/api/tour-guide/get-tourguide-itineraries/${tourGuideId}`)
      ]);

      setTouristData(touristResponse.data);
      setItineraries(itinerariesResponse.data);
    } catch (err) {
      setError('Failed to fetch tourist data');
      console.error('Error fetching tourist data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (value) => {
    setFilter({ month: value });
  };

  const handleApplyFilter = () => {
    fetchTouristData();
  };

  if (loading) return <div className="loading">Loading tourist data...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="statistics-report">
      <h1 className="title">Tourist Statistics</h1>

      <div className="filter-controls">
        <div className="filter-item">
          <label>Filter by Month:</label>
          <select
            value={filter.month}
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            <option value="">All Time</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>
        <button onClick={handleApplyFilter} className="filter-button">
          Apply Filter
        </button>
      </div>

      <div className="statistics-summary">
        <div className="summary-card total">
          <h2>Total Tourists</h2>
          <p>{overallTotal}</p>
        </div>
        <div className="summary-card monthly">
          <h2>Tourists this Month</h2>
          <p>{filter.month ? touristData.totalTourists : '-'}</p>
        </div>
        <div className="summary-card activities">
          <h2>Total Itineraries</h2>
          <p>{itineraries.length}</p>
        </div>
      </div>

      <div className="statistics-details">
        <h2>Itineraries Breakdown</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Itinerary Name</th>
                <th>Total Bookings</th>
                <th>Attended Count</th>
              </tr>
            </thead>
            <tbody>
              {itineraries.map((itinerary) => {
                const stats = touristData.itineraryStats[itinerary._id] || {
                  totalBookings: 0,
                  attendedCount: 0
                };
                return (
                  <tr key={itinerary._id}>
                    <td>{itinerary.name}</td>
                    <td>{stats.totalBookings}</td>
                    <td>{stats.attendedCount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GuideTouristStats; 