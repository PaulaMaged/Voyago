import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Bookmarks.css';

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
      alert("An error occurred while booking the activity.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bookmarks-container">
      <h1>My Bookmarked Activities</h1>
      {bookmarks.length === 0 ? (
        <p>No bookmarked activities yet.</p>
      ) : (
        <div className="bookmarks-grid">
          {bookmarks.map((bookmark) => (
            <div key={bookmark._id} className="bookmark-card">
              <h2>{bookmark.activity.title}</h2>
              <p>{bookmark.activity.description}</p>
              <div className="activity-details">
                <p>Price: ${bookmark.activity.price}</p>
                <p>Duration: {bookmark.activity.duration} minutes</p>
                <p>Date: {new Date(bookmark.activity.start_time).toLocaleDateString()}</p>
              </div>
              <div className="bookmark-actions">
                <button onClick={() => handleBookActivity(bookmark.activity._id)}>
                  Book Activity
                </button>
                <button 
                  onClick={() => handleRemoveBookmark(bookmark._id)}
                  className="remove-bookmark"
                >
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