import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaShoppingCart, FaStar } from 'react-icons/fa';
import check from '../helpers/checks';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const touristId = localStorage.getItem("roleId");

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/tourist/get-bookmarks/${touristId}`);
        const validBookmarks = response.data.filter(bookmark => bookmark.activity != null);
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

  const handleBookActivity = async (activity) => {
    if (!activity?._id) {
      console.error('Invalid activity');
      return;
    }

    try {
      // Check if activity is already booked
      const isAlreadyBooked = await check.isBooked(activity, "activity");
      if (isAlreadyBooked) {
        alert("You have already booked this activity.");
        return;
      }

      // Check if activity is in the past
      const isPast = check.isCompleted(activity);
      if (isPast) {
        alert("Cannot book past activities");
        return;
      }

      const touristId = localStorage.getItem("roleId");
      const response = await axios.post(
        `http://localhost:8000/api/tourist/tourist-pay/${touristId}`,
        {
          plans: [
            {
              type: "Activity",
              activityId: activity._id,
            },
          ],
        }
      );

      if (response.status === 201) {
        alert("Activity booked successfully!");
      }
    } catch (error) {
      console.error("Error booking activity:", error);
      
      if (error.response) {
        switch (error.response.status) {
          case 409:
            alert("You have already booked this activity.");
            break;
          case 400:
            alert(error.response.data.message || "Invalid booking request.");
            break;
          case 403:
            alert("Insufficient wallet balance. Please top up your wallet.");
            break;
          default:
            alert("An error occurred while booking the activity. Please try again.");
        }
      } else {
        alert("Network error. Please check your connection and try again.");
      }
    }
  };

  if (loading) {
    return <div>Loading bookmarks...</div>;
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">No Bookmarks</h2>
        <p className="text-gray-600">You haven't bookmarked any activities yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {bookmarks.map((bookmark) => (
        <div key={bookmark._id} className="border rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-2">{bookmark.activity.title}</h3>
          <p className="text-gray-600 mb-2">{bookmark.activity.description}</p>
          <p className="text-sm mb-2">
            <strong>Price:</strong> ${bookmark.activity.price}
          </p>
          <p className="text-sm mb-2">
            <strong>Start Time:</strong>{" "}
            {new Date(bookmark.activity.start_time).toLocaleString()}
          </p>
          <div className="flex justify-between mt-4">
            <button
              onClick={() => handleBookActivity(bookmark.activity)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Book Activity
            </button>
            <button
              onClick={() => handleRemoveBookmark(bookmark._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Remove Bookmark
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Bookmarks; 