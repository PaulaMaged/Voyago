import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/Notifications.css';
export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const touristId = localStorage.getItem("roleId");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/tourist/get-tourist-notifications/${touristId}`);
        setNotifications(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [touristId]);

  if (loading) {
    return <div>Loading notifications...</div>;
  }

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li key={notification._id}>
              {notification.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 