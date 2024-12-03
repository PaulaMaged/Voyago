import axios from 'axios';
import { useState, useEffect } from 'react';

const BookmarkButton = ({ activityId }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const touristId = localStorage.getItem("roleId");

  const handleBookmark = async () => {
    try {
      if (!isBookmarked) {
        await axios.post('http://localhost:8000/api/tourist/create-bookmark', {
          touristId,
          activityId
        });
        setIsBookmarked(true);
        alert('Activity bookmarked successfully!');
      } else {
        // Find the bookmark ID first
        const bookmarks = await axios.get(`http://localhost:8000/api/tourist/get-bookmarks/${touristId}`);
        const bookmark = bookmarks.data.find(b => b.activity._id === activityId);
        
        if (bookmark) {
          await axios.delete(`http://localhost:8000/api/tourist/remove-bookmark/${touristId}/${bookmark._id}`);
          setIsBookmarked(false);
          alert('Bookmark removed successfully!');
        }
      }
    } catch (error) {
      console.error('Error handling bookmark:', error);
      alert('Error handling bookmark. Please try again.');
    }
  };

  // Check if activity is bookmarked on component mount
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/tourist/get-bookmarks/${touristId}`);
        setIsBookmarked(response.data.some(bookmark => bookmark.activity._id === activityId));
      } catch (error) {
        console.error('Error checking bookmark status:', error);
      }
    };

    if (touristId) {
      checkBookmarkStatus();
    }
  }, [activityId, touristId]);

  return (
    <button 
      onClick={handleBookmark}
      className={`bookmark-button ${isBookmarked ? 'bookmarked' : ''}`}
    >
      {isBookmarked ? '★ Bookmarked' : '☆ Bookmark'}
    </button>
  );
};

export default BookmarkButton; 