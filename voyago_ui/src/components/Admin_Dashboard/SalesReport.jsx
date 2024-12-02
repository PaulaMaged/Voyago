import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SalesReport.css';

const SalesReport = () => {
  const [revenueData, setRevenueData] = useState({
    itineraryRevenue: 0,
    activityRevenue: 0,
    productRevenue: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRevenue();
  }, []);

  const fetchRevenue = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/admin/total-revenue');
      
      // Calculate 10% app rate for itineraries and activities
      const itineraryAppRate = response.data.itineraryRevenue * 0.1;
      const activityAppRate = response.data.activityRevenue * 0.1;
      const productTotal = response.data.productRevenue * 0.1;

      setRevenueData({
        itineraryRevenue: itineraryAppRate,
        activityRevenue: activityAppRate,
        productRevenue: productTotal,
        totalRevenue: itineraryAppRate + activityAppRate + productTotal
      });
    } catch (err) {
      setError('Failed to fetch revenue data');
      console.error('Error fetching revenue:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return <div className="loading">Loading sales report...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="sales-report">
      <h1 className="title">Sales Report</h1>

      <div className="revenue-summary">
        <div className="summary-card total">
          <h2>Total Revenue</h2>
          <p>{formatCurrency(revenueData.totalRevenue)}</p>
        </div>

        <div className="summary-card itinerary">
          <h2>Itinerary Revenue (10%)</h2>
          <p>{formatCurrency(revenueData.itineraryRevenue)}</p>
        </div>

        <div className="summary-card activity">
          <h2>Activity Revenue (10%)</h2>
          <p>{formatCurrency(revenueData.activityRevenue)}</p>
        </div>

        <div className="summary-card shop">
          <h2>Shop Revenue (10%)</h2>
          <p>{formatCurrency(revenueData.productRevenue)}</p>
        </div>
      </div>

      <div className="revenue-details">
        <h2>Revenue Breakdown</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Revenue Source</th>
                <th>Amount</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Itinerary Revenue (10% app rate)</td>
                <td>{formatCurrency(revenueData.itineraryRevenue)}</td>
                <td>{((revenueData.itineraryRevenue / revenueData.totalRevenue) * 100).toFixed(1)}%</td>
              </tr>
              <tr>
                <td>Activity Revenue (10% app rate)</td>
                <td>{formatCurrency(revenueData.activityRevenue)}</td>
                <td>{((revenueData.activityRevenue / revenueData.totalRevenue) * 100).toFixed(1)}%</td>
              </tr>
              <tr>
                <td>Shop Revenue (10% app rate)</td>
                <td>{formatCurrency(revenueData.productRevenue)}</td>
                <td>{((revenueData.productRevenue / revenueData.totalRevenue) * 100).toFixed(1)}%</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td>Total</td>
                <td>{formatCurrency(revenueData.totalRevenue)}</td>
                <td>100%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesReport;

