import "./Changepassword.css";
import axios from "axios";
import { useState } from "react";

function Changepassword() {
  const [isChanged, setIsChanged] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState(true);
  const [passwordLengthError, setPasswordLengthError] = useState(false);
  const userString = localStorage.getItem("user");
  let id = null;
  
  if (userString) {
    try {
      const user = JSON.parse(userString);
      id = user._id;
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }
  } else {
    console.warn("No user data found in localStorage.");
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if new password is at least 8 characters long
    if (newPassword.length < 8) {
      setPasswordLengthError(true);
      return;
    } else {
      setPasswordLengthError(false);
    }

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/api/user/change-password/${id}`,
        {
          currentPassword: currentPassword,
          newPassword: newPassword,
        }
      );

      if (response.status === 200) {
        alert("Password changed successfully");
        setIsChanged(true);
      } else {
        alert("There was an error connecting to the server");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      if (error.response && error.response.status === 401) {
        // Current password is incorrect
        setIsCurrentPasswordValid(false);
        setTimeout(() => {
          setIsCurrentPasswordValid(true);
        }, 2500);
      } else {
        alert("An error occurred while changing the password.");
      }
    }
  };

  return (
    <div className="changepassword-container">
      {!isChanged ? (
        <>
          <h2>Change Password</h2>
          <form className="changepassword-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="current-password">Current Password</label>
              <input
                type="password"
                id="current-password"
                name="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              {!isCurrentPasswordValid && (
                <div style={{ color: "red" }}>
                  This is not your current password!
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="new-password">New Password</label>
              <input
                type="password"
                id="new-password"
                name="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              {passwordLengthError && (
                <div style={{ color: "red" }}>
                  Password must be at least 8 characters long
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="confirm-password">Confirm New Password</label>
              <input
                type="password"
                id="confirm-password"
                name="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Submit</button>
          </form>
        </>
      ) : (
        <div>Your password has been changed!</div>
      )}
    </div>
  );
}

export default Changepassword;
