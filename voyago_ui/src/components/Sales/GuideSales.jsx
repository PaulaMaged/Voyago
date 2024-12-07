import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdvSales.css';

const GuideSales = () => {
  const [salesData, setSalesData] = useState({
    totalRevenue: 0,
    itineraries: [],
    allItineraries: [],
    filteredRevenue: 0,
    itineraryStats: {},
    totalBookings: 0,
    totalAttendees: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    date: '',
    month: '',
    selectedItinerary: ''
  });

  const tourGuideId = localStorage.getItem('roleId');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  useEffect(() => {
    if (!tourGuideId) {
      setError('Tour Guide ID not found');
      setLoading(false);
      return;
    }
    fetchSalesData();
  }, [tourGuideId]);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      let endpoint = `http://localhost:8000/api/tour-guide/sales-report/${tourGuideId}`;
      
       // Fetch all itineraries first
       const allItinerariesResponse = await axios.get(`http://localhost:8000/api/tour-guide/get-tourguide-itineraries/${tourGuideId}`);
       const allItineraries = allItinerariesResponse.data || [];
      
      if (filter.date) {
        endpoint = `${endpoint}/by-date?date=${filter.date}`;
      } else if (filter.month) {
        endpoint = `${endpoint}/by-month?month=${filter.month}`;
      } else if (filter.selectedItinerary) {
        endpoint = `${endpoint}/by-itinerary/${filter.selectedItinerary}`;
      }

      const response = await axios.get(endpoint);
      setSalesData({
        totalRevenue: response.data.totalRevenue || 0,
        itineraries: response.data.itineraries || [],
        allItineraries: allItineraries,
        itineraryStats: response.data.itineraryStats || {},
        totalBookings: Object.values(response.data.itineraryStats || {})
          .reduce((sum, stat) => sum + (stat.bookingCount || 0), 0),
        totalAttendees: Object.values(response.data.itineraryStats || {})
          .reduce((sum, stat) => sum + (stat.attendedCount || 0), 0)
      });
    } catch (err) {
      setError('Failed to fetch sales data');
      console.error('Error fetching sales:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (type, value) => {
    setFilter(prev => {
      const newFilter = { ...prev, [type]: value };
      if (type === 'date') {
        newFilter.month = '';
        newFilter.selectedItinerary = '';
      } else if (type === 'month') {
        newFilter.date = '';
        newFilter.selectedItinerary = '';
      } else if (type === 'selectedItinerary') {
        newFilter.date = '';
        newFilter.month = '';
      }
      return newFilter;
    });
  };

  const handleApplyFilter = () => {
    fetchSalesData();
  };

  if (loading) {
    return <div className="loading">Loading sales data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="sales-report">
      <h1 className="title">Sales Report</h1>

      <div className="filter-controls">
        <div className="filter-item">
          <label>Filter by Date:</label>
          <input
            type="date"
            value={filter.date}
            onChange={(e) => handleFilterChange('date', e.target.value)}
          />
        </div>
        <div className="filter-item">
          <label>Filter by Month:</label>
          <select
            value={filter.month}
            onChange={(e) => handleFilterChange('month', e.target.value)}
          >
            <option value="">Select Month</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-item">
          <label>Filter by Itinerary:</label>
          <select
            value={filter.selectedItinerary}
            onChange={(e) => handleFilterChange('selectedItinerary', e.target.value)}
          >
            <option value="">All Itineraries</option>
            {salesData.allItineraries.map(itinerary => (
              <option key={itinerary._id} value={itinerary._id}>
                {itinerary.name}
              </option>
            ))}
          </select>
        </div>
        <button onClick={handleApplyFilter} className="filter-button">
          Apply Filter
        </button>
      </div>

      <div className="revenue-summary">
        <div className="summary-card total">
          <h2>Total Revenue</h2>
          <p>{formatCurrency(salesData.totalRevenue)}</p>
        </div>
        <div className="summary-card filtered">
          <h2>Total Bookings</h2>
          <p>{salesData.totalBookings}</p>
        </div>

        <div className="summary-card activities">
          <h2>Total Attendees</h2>
          <p>{salesData.totalAttendees}</p>
        </div>
      </div>

      <div className="revenue-details">
        <h2>Itineraries Breakdown</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Itinerary Name</th>
                <th>Price</th>
                <th>Total Bookings</th>
                <th>Attended Count</th>
                <th>Total Sales</th>
              </tr>
            </thead>
            <tbody>
              {salesData.itineraries.map((itinerary) => {
                const stats = salesData.itineraryStats[itinerary._id] || {
                  totalSales: 0,
                  bookingCount: 0,
                  attendedCount: 0
                };
                return (
                  <tr key={itinerary._id}>
                    <td>{itinerary.name}</td>
                    <td>{formatCurrency(itinerary.price)}</td>
                    <td>{stats.bookingCount}</td>
                    <td>{stats.attendedCount}</td>
                    <td>{formatCurrency(stats.totalSales)}</td>
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

export default GuideSales;