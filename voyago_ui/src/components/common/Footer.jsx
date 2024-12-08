import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section">
            <h4 className="footer-heading">About Voyago</h4>
            <p className="footer-text">Your trusted partner for exploring Egypt's wonders. Book activities, tours, and create unforgettable memories.</p>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-list">
              <li><Link to="/viewActivityGuest" className="footer-link">Activities</Link></li>
              <li><Link to="/viewItineraryGuest" className="footer-link">Itineraries</Link></li>
              <li><Link to="/viewLandmarks" className="footer-link">Landmarks</Link></li>
              <li><Link to="/hotelBooking" className="footer-link">Hotels</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-heading">Contact</h4>
            <ul className="footer-list">
              <li>Email: info@voyago.com</li>
              <li>Phone: +20 123 456 789</li>
              <li>Address: Cairo, Egypt</li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-heading">Follow Us</h4>
            <div className="footer-social">
              <a href="#" className="footer-social-link"><FaFacebook size={24} /></a>
              <a href="#" className="footer-social-link"><FaTwitter size={24} /></a>
              <a href="#" className="footer-social-link"><FaInstagram size={24} /></a>
              <a href="#" className="footer-social-link"><FaLinkedin size={24} /></a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="footer-copyright">&copy; {new Date().getFullYear()} Voyago. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

