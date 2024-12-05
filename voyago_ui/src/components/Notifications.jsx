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
        const response = await axios.get(
          `http://localhost:8000/api/tourist/get-tourist-notifications/${touristId}`
        );
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
    return (
      <div className="notifications-container">
        <h2>Notifications</h2>
        <div className="notifications-loading">
          Loading notifications
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <div className="no-notifications">
          Your notification inbox is empty
        </div>
      ) : (
        <ul>
          {notifications.map((notification, index) => (
            <li 
              key={notification._id}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {notification.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 