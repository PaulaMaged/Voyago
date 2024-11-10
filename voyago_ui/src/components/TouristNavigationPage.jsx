// src/components/NavigationPage.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

const NavigationPage = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Optional: Retrieve token from localStorage if your API requires authentication
      const token = localStorage.getItem('token');

      // Make a GET request to the logout API
      const response = await axios.get('http://localhost:8000/api/user/logout');

      if (response.status === 200) {
        // Clear localStorage
        localStorage.clear();

        // Redirect to the login page
        navigate('/login');
      } else {
        // Handle unexpected status codes
        alert('Logout failed. Please try again.');
        console.error('Unexpected response:', response);
      }
    } catch (error) {
      // Handle errors
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error('Logout failed:', error.response.data);
        alert(`Logout failed: ${error.response.data.message || 'Please try again.'}`);
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request);
        alert('No response from server. Please check your connection.');
      } else {
        // Something else happened
        console.error('Error during logout:', error.message);
        alert('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1>Navigation</h1>
      <nav style={styles.nav}>
        <ul style={styles.ul}>
          <li style={styles.li}>
            <NavLink to="/viewProductTourist" style={styles.link}>
              View Product Tourist
            </NavLink>
          </li>
          <li style={styles.li}>
            <NavLink to="/viewActivityGuest" style={styles.link}>
              View Activity Guest
            </NavLink>
          </li>
          <li style={styles.li}>
            <NavLink to="/viewItineraryGuest" style={styles.link}>
              View Itinerary Guest
            </NavLink>
          </li>
          <li style={styles.li}>
            <button onClick={handleLogout} style={styles.button}>
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

// Inline styles for basic styling
const styles = {
  container: {
    padding: '20px',
    textAlign: 'center',
  },
  nav: {
    marginTop: '20px',
  },
  ul: {
    listStyleType: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    alignItems: 'center',
    padding: 0,
  },
  li: {},
  link: {
    color: '#007bff',
    textDecoration: 'none',
    fontSize: '18px',
  },
  button: {
    padding: '10px 20px',
    background: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default NavigationPage;
