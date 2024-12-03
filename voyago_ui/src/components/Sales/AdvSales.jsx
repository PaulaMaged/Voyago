import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdvSales.css';

const AdvSales = () => {
  const [salesData, setSalesData] = useState({
    totalRevenue: 0,
    activities: [],
    allActivities: [],
    filteredRevenue: 0,
    activitySales: {},
    totalBookings: 0,
    totalAttendees: 0
  });

  const [touristData, setTouristData] = useState({
    totalTourists: 0,
    activityStats: {},
    monthlyTourists: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    date: '',
    month: '',
    selectedActivity: ''
  });

  const advertiserId = localStorage.getItem('roleId');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  useEffect(() => {
    if (!advertiserId) {
      setError('Advertiser ID not found');
      setLoading(false);
      return;
    }
    fetchSalesData();
    fetchTouristData();
  }, [advertiserId]);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      let endpoint = `http://localhost:8000/api/advertiser/sales-report/${advertiserId}`;
      
      // First, get all activities for the dropdown if we don't have them
      let allActivities = salesData.allActivities;
      if (allActivities.length === 0) {
        const allActivitiesResponse = await axios.get(`http://localhost:8000/api/advertiser/sales-report/${advertiserId}`);
        allActivities = allActivitiesResponse.data.activities || [];
      }
      
      if (filter.date) {
        endpoint = `${endpoint}/by-date?date=${filter.date}`;
      } else if (filter.month) {
        endpoint = `${endpoint}/by-month?month=${filter.month}`;
      } else if (filter.selectedActivity) {
        endpoint = `${endpoint}/by-activity/${filter.selectedActivity}`;
      }

      const response = await axios.get(endpoint);
      
      if (filter.selectedActivity) {
        // Find the selected activity from our full list
        const selectedActivity = allActivities.find(act => act._id === filter.selectedActivity);
        
        setSalesData({
          totalRevenue: response.data.revenue || 0,
          activities: selectedActivity ? [selectedActivity] : [],
          allActivities: allActivities,
          activitySales: {
            [filter.selectedActivity]: {
              totalSales: response.data.revenue || 0,
              bookingCount: response.data.bookingCount || 0,
              attendedCount: response.data.attendedCount || 0
            }
          },
          totalBookings: response.data.bookingCount || 0,
          totalAttendees: response.data.attendedCount || 0
        });
      } else {
        setSalesData({
          totalRevenue: response.data.totalRevenue || 0,
          activities: response.data.activities || [],
          allActivities: allActivities,
          activitySales: response.data.activityStats || {},
          totalBookings: Object.values(response.data.activityStats || {})
            .reduce((sum, stat) => sum + (stat.bookingCount || 0), 0),
          totalAttendees: Object.values(response.data.activityStats || {})
            .reduce((sum, stat) => sum + (stat.attendedCount || 0), 0)
        });
      }
    } catch (err) {
      setError('Failed to fetch sales data');
      console.error('Error fetching sales:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTouristData = async () => {
    try {
      let endpoint = `http://localhost:8000/api/advertiser/tourist-count/${advertiserId}`;
      
      if (filter.month) {
        endpoint = `${endpoint}/by-month?month=${filter.month}`;
      }

      const response = await axios.get(endpoint);
      setTouristData(response.data);
    } catch (err) {
      console.error('Error fetching tourist data:', err);
    }
  };

  const handleFilterChange = (type, value) => {
    setFilter(prev => {
      const newFilter = { ...prev, [type]: value };
      
      if (type === 'date') {
        newFilter.month = '';
        newFilter.selectedActivity = '';
      } else if (type === 'month') {
        newFilter.date = '';
        newFilter.selectedActivity = '';
      } else if (type === 'selectedActivity') {
        newFilter.date = '';
        newFilter.month = '';
      }
      
      return newFilter;
    });
  };

  const handleApplyFilter = async () => {
    await Promise.all([
      fetchSalesData(),
      fetchTouristData()
    ]);
  };

  if (loading) {
    return <div className="loading">Loading sales data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="sales-report">
      <h1 className="title">My Sales Report</h1>

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
          <label>Filter by Activity:</label>
          <select
            value={filter.selectedActivity}
            onChange={(e) => handleFilterChange('selectedActivity', e.target.value)}
          >
            <option value="">All Activities</option>
            {salesData.allActivities?.map(activity => (
              <option key={activity._id} value={activity._id}>
                {activity.title}
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
        <h2>Activities Breakdown</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Activity Title</th>
                <th>Price</th>
                <th>Total Bookings</th>
                <th>Attended Count</th>
                <th>Total Sales</th>
              </tr>
            </thead>
            <tbody>
              {salesData.activities.map((activity) => {
                const stats = salesData.activitySales[activity._id] || {
                  totalSales: 0,
                  bookingCount: 0,
                  attendedCount: 0
                };
                return (
                  <tr key={activity._id}>
                    <td>{activity.title}</td>
                    <td>{formatCurrency(activity.price)}</td>
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

      <div className="tourist-statistics">
        <h2>Tourist Statistics</h2>
        <div className="stats-cards">
          <div className="stat-card">
            <h3>Total Tourists</h3>
            <p>{touristData.totalTourists}</p>
          </div>
          {filter.month && (
            <div className="stat-card">
              <h3>Tourists This Month</h3>
              <p>{touristData.totalTourists}</p>
            </div>
          )}
        </div>

        <div className="tourist-details">
          <h3>Breakdown by {filter.month ? 'Month' : 'All Time'}</h3>
          <table>
            <thead>
              <tr>
                <th>Activity Title</th>
                <th>Total Bookings</th>
                <th>Attended Tourists</th>
              </tr>
            </thead>
            <tbody>
              {salesData.activities.map((activity) => {
                const stats = touristData.activityStats[activity._id] || {
                  totalBookings: 0,
                  attendedCount: 0
                };
                return (
                  <tr key={activity._id}>
                    <td>{activity.title}</td>
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

export default AdvSales;