import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/user/logout');
      if (response.status === 200) {
        localStorage.clear();
        setIsLoggedIn(false);
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <Link to="/" className="navbar-logo">
            <img 
              src="/src/assets/Voyago.jpeg" 
              alt="Voyago" 
              className="navbar-logo-image"
            />
          </Link>

          <div className="navbar-links">
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="navbar-button navbar-login">
                  Login
                </Link>
                <Link to="/signUp" className="navbar-button navbar-signup">
                  Sign Up
                </Link>
              </>
            ) : (
              <button 
                onClick={handleLogout}
                className="navbar-button navbar-logout"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

