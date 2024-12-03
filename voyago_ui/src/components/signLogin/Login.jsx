import React, { useState } from "react";
import "./Login.css";
import axios from "axios";

const handleSubmit = (e, setShowTerms, setUserId) => {
  e.preventDefault();
  const username = e.target.username.value;
  const password = e.target.password.value;
  login(username, password, setShowTerms, setUserId);
};

const login = async (username, password, setShowTerms, setUserId) => {
  try {
    console.log('Attempting login for:', username);
    const response = await axios.post("http://localhost:8000/api/user/login", {
      username,
      password,
    });

    if (response.status === 200) {
      const { token, user, tourist, tour_guide, tour_governor, seller, advertiser, admin } = response.data;
      console.log('Response data:', response.data);

      // Get role from user object
      const roleName = user.role;
      let roleId = null;

      // Determine roleId based on role
      switch(roleName) {
        case "TOURIST":
          roleId = tourist?._id;
          break;
        case "TOUR_GUIDE":
          roleId = tour_guide?._id;
          break;
        case "TOUR_GOVERNOR":
          roleId = tour_governor?._id;
          break;
        case "SELLER":
          roleId = seller?._id;
          break;
        case "ADVERTISER":
          roleId = advertiser?._id;
          break;
        case "ADMIN":
          roleId = admin?._id;
          break;
        default:
          console.error('Unknown role:', roleName);
      }

      console.log('Role found:', roleName, 'with ID:', roleId);

      // Store data in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      if (roleId) {
        localStorage.setItem("roleId", roleId);
        localStorage.setItem("roleName", roleName);
      } else {
        console.error('No roleId found for role:', roleName);
        throw new Error(`No roleId found for ${roleName}`);
      }

      alert("Login successful");
      
      // Handle redirects
      switch(roleName) {
        case "TOURIST":
          window.location.href = "http://localhost:5173/Tourist_Dashboard";
          break;
        case "ADMIN":
          window.location.href = "http://localhost:5173/Admin_Dashboard";
          break;
        case "TOUR_GOVERNOR":
          window.location.href = "http://localhost:5173/GovernorLandmarks";
          break;
        case "TOUR_GUIDE":
          window.location.href = "http://localhost:5173/guideSales";
          break;
        case "SELLER":
          window.location.href = "http://localhost:5173/sellerSales";
          break;
        case "ADVERTISER":
          window.location.href = "http://localhost:5173/advSales";
          break;
        default:
          console.log(`No redirect specified for role: ${roleName}`);
      }

    } else if (response.status === 201) {
      setShowTerms(true);
      const userId = response.data.userId;
      setUserId(userId);
    }
  } catch (error) {
    console.error('Login error:', error);
    if (error.response) {
      alert(`Login failed: ${error.response.data.message}`);
    } else {
      alert(`Login failed: ${error.message}`);
    }
  }
};

function Login() {
  const [showTerms, setShowTerms] = useState(false);
  const [userId, setUserId] = useState(null);

  const handleAccept = async () => {
    try {
      await axios.put(`http://localhost:8000/api/user/update-user/${userId}`, {
        terms_and_conditions: true,
        is_new: false
      });
      setShowTerms(false);
      alert("Terms and conditions accepted. You can now use the system!");
      window.location.reload();
    } catch (error) {
      console.error('Error accepting terms:', error);
      alert("Error accepting terms and conditions. Please try again.");
    }
  };

  const handleDecline = () => {
    setShowTerms(false);
    alert("You must accept the terms and conditions to use the system!");
  };

  return (
    <div className="login">
      {showTerms ? (
        <div className="terms">
          <h2 className="terms-title">Terms and Conditions</h2>
          <div className="terms-content">
            <p>
              By using this service, you agree to the following terms and
              conditions...
            </p>
            <p>Please read these terms carefully before continuing.</p>
            <div className="terms-actions">
              <button onClick={handleAccept} className="btn-accept">
                Accept
              </button>
              <button onClick={handleDecline} className="btn-decline">
                Decline
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form
          className="login-form"
          onSubmit={(e) => handleSubmit(e, setShowTerms, setUserId)}
        >
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
      )}
    </div>
  );
}

export default Login;