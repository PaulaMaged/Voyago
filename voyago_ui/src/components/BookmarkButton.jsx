import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import '../styles/Bookmarks.css';

const BookmarkButton = ({ activityId }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [count, setCount] = useState(0);
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
        const bookmark = bookmarks.data.find(b => b.activity && b.activity._id === activityId);
        
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

  useEffect(() => {
    const checkBookmarkStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/tourist/get-bookmarks/${touristId}`);
        setIsBookmarked(response.data.some(bookmark => 
          bookmark.activity && bookmark.activity._id === activityId
        ));
        
        // Temporarily comment out bookmark count fetch until endpoint is ready
        // const activityResponse = await axios.get(`http://localhost:8000/api/tourist/activity-bookmark-count/${activityId}`);
        // setCount(activityResponse.data.count);
        setCount(0); // Default to 0 for now
      } catch (error) {
        console.error('Error checking bookmark status:', error);
        setCount(0); // Ensure count is set even on error
      }
    };

    if (touristId) {
      checkBookmarkStatus();
    }
  }, [activityId, touristId]);

  return (
    <button 
      className={`bookmark-button ${isBookmarked ? 'active' : ''}`}
      onClick={handleBookmark}
      aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      <span className="bookmark-icon">
        {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
      </span>
      {count > 0 && (
        <span className="bookmark-count">
          {count}
        </span>
      )}
    </button>
  );
};

export default BookmarkButton; 