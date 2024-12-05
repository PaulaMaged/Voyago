import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBell, FaTrash } from 'react-icons/fa';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const userId = localStorage.getItem('roleId');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/tourist/get-tourist-notifications/${userId}`);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await axios.delete(`http://localhost:8000/api/notifications/${notificationId}`);
      setNotifications(notifications.filter(notif => notif._id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <div className="p-6 bg-[var(--background)] min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <FaBell className="text-2xl text-[var(--primary)]" />
        <h1 className="text-2xl font-bold text-[var(--textPrimary)]">
          Notifications
        </h1>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification._id}
            className={`
              p-4 rounded-lg border transition-all duration-300
              ${notification.is_read 
                ? 'bg-[var(--surface)] border-[var(--border)]' 
                : 'bg-[var(--primaryLight)] border-[var(--primary)]'
              }
            `}
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <p className={`
                  text-lg mb-2
                  ${notification.is_read 
                    ? 'text-[var(--textPrimary)]' 
                    : 'text-[var(--textPrimary)] font-semibold'
                  }
                `}>
                  {notification.message}
                </p>
                <p className="text-sm text-[var(--textSecondary)]">
                  {new Date(notification.created_at).toLocaleString()}
                </p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(notification._id)}
                  className="p-2 rounded-full hover:bg-[var(--surface)] 
                           text-[var(--error)] transition-colors"
                  title="Delete notification"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="text-center py-8 text-[var(--textSecondary)]">
            <p className="text-lg">No notifications yet</p>
            <p className="text-sm mt-2">
              You'll see notifications here when there are updates to your activities or bookings
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications; 