import React, { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const ForgotPasswordForm = ({ setShowForgotPassword }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    try {
      const response = await axios.post("http://localhost:8000/api/user/otp", {
        email,
      });
      if (response.status === 200) {
        alert("OTP sent to your email.");
        setIsOtpSent(true);
      }
    } catch (error) {
      alert("Error sending OTP: " + error.response.data.message);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    console.log("OTP submitted:", otp);
    console.log("New password:", newPassword);
    console.log("Email:", email);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/user/verify-otp",
        {
          email,
          otp,
          newPassword,
        }
      );
      if (response.status === 200) {
        alert("Password reset successful.");
        setShowForgotPassword(false);
      }
    } catch (error) {
      alert("Error resetting password: " + error.response.data.message);
    }
  };

  return (
    <div className="forgot-password-form">
      <style>
        {`
          .forgot-password-form {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            padding: 20px;
            max-width: 400px;
            margin: 0 auto;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            text-align: center;
          }

          .forgot-password-form h3 {
            font-size: 20px;
            color: #333;
            margin-bottom: 20px;
          }

          .forgot-password-form form {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }

          .forgot-password-form input {
            padding: 10px;
            border-radius: 4px;
            border: 1px solid #ccc;
            font-size: 16px;
            margin-bottom: 10px;
            outline: none;
          }

          .forgot-password-form input:focus {
            border-color: #007bff;
          }

          .forgot-password-form button {
            padding: 12px;
            background-color: #007bff;
            color: white;
            font-size: 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }

          .forgot-password-form button:hover {
            background-color: #0056b3;
          }

          .forgot-password-form .back-button {
            padding: 10px;
            background-color: #ddd;
            color: #333;
            font-size: 14px;
            border: none;
            border-radius: 4px;
            margin-top: 20px;
            cursor: pointer;
            text-decoration: none;
          }

          .forgot-password-form .back-button:hover {
            background-color: #bbb;
          }
        `}
      </style>

      {!isOtpSent ? (
        <form onSubmit={handleEmailSubmit}>
          <h3>Enter your email to receive OTP</h3>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send OTP</button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit}>
          <h3>Verify OTP and Reset Password</h3>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit">Reset Password</button>
        </form>
      )}
      <button
        className="back-button"
        onClick={() => setShowForgotPassword(false)}
      >
        Back to Login
      </button>
    </div>
  );
};
ForgotPasswordForm.propTypes = {
  setShowForgotPassword: PropTypes.func.isRequired,
};

export default ForgotPasswordForm;
