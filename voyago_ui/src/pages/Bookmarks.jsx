import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaShoppingCart, FaStar } from 'react-icons/fa';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const touristId = localStorage.getItem("roleId");

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/tourist/get-bookmarks/${touristId}`);
        const validBookmarks = response.data.filter(bookmark => bookmark.activity !== null);
        setBookmarks(validBookmarks);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [touristId]);

  const handleRemoveBookmark = async (bookmarkId) => {
    try {
      await axios.delete(`http://localhost:8000/api/tourist/remove-bookmark/${touristId}/${bookmarkId}`);
      setBookmarks(bookmarks.filter(bookmark => bookmark._id !== bookmarkId));
      alert('Bookmark removed successfully!');
    } catch (error) {
      console.error('Error removing bookmark:', error);
      alert('Error removing bookmark. Please try again.');
    }
  };

  const handleBookActivity = async (activityId) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/tourist/tourist-pay/${touristId}`,
        {
          plans: [
            {
              type: "Activity",
              activityId: activityId,
            },
          ],
        }
      );
      if (response.status === 201) {
        alert("Activity booked successfully!");
      }
    } catch (error) {
      console.error("Error booking activity:", error);
      const errorMessage = error.response?.data?.message || 
                          "An error occurred while booking the activity.";
      
      if (error.response?.status === 409) {
        alert("You have already booked this activity.");
      } else {
        alert(errorMessage);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bookmarks-container">
      <h2>My Bookmarks</h2>
      {bookmarks.length === 0 ? (
        <p>No bookmarks found.</p>
      ) : (
        <div className="bookmarks-grid">
          {bookmarks.map((bookmark) => (
            <div key={bookmark._id} className="bookmark-card">
              <h3>{bookmark.activity.title}</h3>
              <p>{bookmark.activity.description}</p>
              <p>Price: ${bookmark.activity.price}</p>
              <p>Date: {new Date(bookmark.activity.start_time).toLocaleDateString()}</p>
              <div className="bookmark-actions">
                <button onClick={() => handleBookActivity(bookmark.activity._id)}>
                  Book Activity
                </button>
                <button onClick={() => handleRemoveBookmark(bookmark._id)}>
                  Remove Bookmark
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks; 