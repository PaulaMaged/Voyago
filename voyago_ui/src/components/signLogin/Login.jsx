import React, { useState } from "react";
import axios from "axios";
import ForgotPasswordForm from "./forgetpassword.jsx";

const handleSubmit = (e, setShowTerms, setUserId) => {
  e.preventDefault();
  const username = e.target.username.value;
  const password = e.target.password.value;
  login(username, password, setShowTerms, setUserId);
};

const login = async (username, password, setShowTerms, setUserId) => {
  try {
    console.log("Attempting login for:", username);
    const response = await axios.post("http://localhost:8000/api/user/login", {
      username,
      password,
    });

    if (response.status === 200) {
      const {
        token,
        user,
        tourist,
        tour_guide,
        tour_governor,
        seller,
        advertiser,
        admin,
      } = response.data;
      console.log("Response data:", response.data);

      // Get role from user object
      const roleName = user.role;
      let roleId = null;

      // Determine roleId based on role
      switch (roleName) {
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
          console.error("Unknown role:", roleName);
      }

      console.log("Role found:", roleName, "with ID:", roleId);

      // Store data in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (roleId) {
        localStorage.setItem("roleId", roleId);
        localStorage.setItem("roleName", roleName);
      } else {
        console.error("No roleId found for role:", roleName);
        throw new Error(`No roleId found for ${roleName}`);
      }

      alert("Login successful");

      // Handle redirects
      switch (roleName) {
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
    console.error("Login error:", error);
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
  const [showForgotPassword, setShowForgotPassword] = useState(false); // New state for "Forgot Password" form

  const handleAccept = async () => {
    try {
      await axios.put(`http://localhost:8000/api/user/update-user/${userId}`, {
        terms_and_conditions: true,
        is_new: false,
      });
      setShowTerms(false);
      alert("Terms and conditions accepted. You can now use the system!");
      window.location.reload();
    } catch (error) {
      console.error("Error accepting terms:", error);
      alert("Error accepting terms and conditions. Please try again.");
    }
  };

  const handleDecline = () => {
    setShowTerms(false);
    alert("You must accept the terms and conditions to use the system!");
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true); // Show the forgot password form
  };

  return (
    <div className="login">
      {showForgotPassword ? (
        <ForgotPasswordForm setShowForgotPassword={setShowForgotPassword} />
      ) : showTerms ? (
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
            <input type="text" id="username" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" required />
          </div>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
          <button
            type="button"
            onClick={handleForgotPassword}
            className="btn btn-link"
          >
            Forgot Password?
          </button>
        </form>
      )}
      <style>
        {`
          .login {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }

          .login-form {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            width: 300px;
            display: flex;
            flex-direction: column;
          }

          .form-group {
            margin-bottom: 15px;
          }

          .form-group label {
            font-weight: bold;
            color: #333;
          }

          .form-group input {
            padding: 10px;
            border-radius: 4px;
            border: 1px solid #cccccc;
            font-size: 16px;
            width: 90%;
          }

          .form-group input:focus {
            border-color: #007bff;
            outline: none;
          }

          .btn {
            padding: 10px;
            border: none;
            border-radius: 4px;
            color: white;
            font-size: 16px;
            cursor: pointer;
          }

          .btn-primary {
            background-color: #007bff;
            transition: background-color 0.3s ease;
          }

          .btn-primary:hover {
            background-color: #0056b3;
          }

          .btn-link {
            background-color: transparent;
            color: #007bff;
            text-decoration: none;
            margin-top: 10px;
          }

          .btn-link:hover {
            color: #0056b3;
          }

          .terms {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            width: 400px;
            text-align: center;
          }

          .terms-title {
            font-size: 24px;
            margin-bottom: 20px;
          }

          .terms-content {
            font-size: 16px;
            margin-bottom: 20px;
          }

          .terms-actions {
            display: flex;
            justify-content: center;
            gap: 10px;
          }

          .btn-accept {
            background-color: #28a745;
          }

          .btn-decline {
            background-color: #dc3545;
          }

          .btn-accept, .btn-decline {
            padding: 10px 20px;
            color: white;
            font-size: 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }

          .btn-accept:hover {
            background-color: #218838;
          }

          .btn-decline:hover {
            background-color: #c82333;
          }
        `}
      </style>
    </div>
  );
}

export default Login;
