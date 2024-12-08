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
        if (!touristId || !activityId) {
          setIsBookmarked(false);
          setCount(0);
          return;
        }

        const response = await axios.get(`http://localhost:8000/api/tourist/get-bookmarks/${touristId}`);
        
        // Filter out bookmarks with null activities before checking
        const validBookmarks = response.data.filter(bookmark => bookmark.activity != null);
        setIsBookmarked(validBookmarks.some(bookmark => bookmark.activity._id === activityId));
        
        // Temporarily set count to 0 until endpoint is ready
        setCount(0);
      } catch (error) {
        console.error('Error checking bookmark status:', error);
        setIsBookmarked(false);
        setCount(0);
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
      aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      <i className={`fas fa-bookmark ${isBookmarked ? 'active' : ''}`}></i>
      {count > 0 && <span className="bookmark-count">{count}</span>}
    </button>
  );
};

export default BookmarkButton; 