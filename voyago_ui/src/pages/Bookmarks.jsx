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
        setBookmarks(response.data);
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
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-[var(--textPrimary)]">
        Loading bookmarks...
      </div>
    );
  }

  return (
    <div className="p-6 bg-[var(--background)] min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-[var(--textPrimary)]">
        My Bookmarks
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookmarks.map((bookmark) => (
          <div 
            key={bookmark._id} 
            className="bg-[var(--surface)] rounded-lg shadow-md p-6 
                     transition-all duration-300 hover:shadow-lg
                     border border-[var(--border)]"
          >
            <h2 className="text-xl font-semibold mb-3 text-[var(--textPrimary)]">
              {bookmark.activity.title}
            </h2>
            <p className="text-[var(--textSecondary)] mb-4">
              {bookmark.activity.description}
            </p>
            
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => handleRemoveBookmark(bookmark._id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg
                         bg-[var(--error)] text-[var(--surface)]
                         hover:bg-[var(--errorLight)] transition-colors"
              >
                <FaTrash /> Remove
              </button>
              
              <button
                onClick={() => handleBookActivity(bookmark.activity._id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg
                         bg-[var(--primary)] text-[var(--surface)]
                         hover:bg-[var(--primaryLight)] transition-colors"
              >
                <FaShoppingCart /> Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {bookmarks.length === 0 && (
        <div className="text-center text-[var(--textSecondary)] mt-8">
          No bookmarks yet. Start exploring activities to bookmark them!
        </div>
      )}
    </div>
  );
};

export default Bookmarks; 