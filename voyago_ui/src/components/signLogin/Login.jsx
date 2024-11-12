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
    const response = await axios.post("http://localhost:8000/api/user/login", {
      username,
      password,
    });

    if (response.status === 200) {
      // Destructure the response data
      const { token, user, ...roleData } = response.data;

      // List of possible roles
      const roleNames = [
        "ADMIN",
        "USER",
        "TOURIST",
        "TOUR_GUIDE",
        "TOUR_GOVERNOR",
        "SELLER",
        "ADVERTISER",
      ];

      let roleId = null;
      let roleName = null;

      // Find the role present in the response
      for (const role of roleNames) {
        const roleKey = role.toLowerCase();
        if (roleData[roleKey]) {
          roleId = roleData[roleKey]._id;
          roleName = role;
          console.log(`Role found: ${roleName}, ID: ${roleId}`);
          break;
        }
      }

      // Store token, user, and role ID in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      if (roleId) {
        localStorage.setItem("roleId", roleId);
        localStorage.setItem("roleName", roleName);
      } else {
        throw new Error("Login failed");
      }

      // Retrieve the user object and parse it from JSON
      const user2 = JSON.parse(localStorage.getItem("user"));
      console.log("User:", user2);
      console.log(user2._id);

      // Retrieve the roleId and roleName if they exist
      const roleId2 = localStorage.getItem("roleId");
      const roleName2 = localStorage.getItem("roleName");
      console.log("RoleId:", roleId2);
      console.log("RoleName:", roleName2);

      alert("Login successful");
      if (roleName2 === "TOURIST") {
        window.location.href = "http://localhost:5173/Tourist_Dashboard";
      }
      if (roleName2 === "ADMIN") {
        window.location.href = "http://localhost:5173/Admin_Dashboard";
      }
    } else if (response.status === 201) {
      // New user accepted, show terms and conditions popup
      setShowTerms(true);
      const userId = response.data.userId;
      console.log("User ID:", userId);
      setUserId(userId);
      console.log(userId);
    }
  } catch (error) {
    console.error(error);
  }
};

function Login() {
  const [showTerms, setShowTerms] = useState(false);
  const [userId, setUserId] = useState(null);

  const handleAccept = () => {
    setShowTerms(false);

    axios.put(`http://localhost:8000/api/user/update-user/${userId}`, {
      terms_and_conditions: true,
    });
    alert("Terms and conditions accepted. You can now Use the system!");
  };

  const handleDecline = () => {
    setShowTerms(false);
    alert(
      "You must accept the terms and conditions in order to use the system!."
    );
    // Additional logic for declining terms can be added here
  };

  return (
    <div className="login">
      {showTerms ? (
        <div className="terms">
          <h2 className="terms-title">Terms and Conditions</h2>
          <div className="terms-content">
            {/* Example content for terms and conditions */}
            <p>
              By using this service, you agree to the following terms and
              conditions...
              {/* Add the rest of the terms here */}
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
