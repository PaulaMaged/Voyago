import React, { useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import check from "../helpers/checks";
import axios from "axios";
import currencyConversions from "../helpers/currencyConversions";
import BookmarkButton from "./BookmarkButton";
import './viewActivityGuest.css';

export default function ViewActivityGuest() {
  const [searchTerm, setSearchTerm] = useState("");
  const [budget, setBudget] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const navigate = useNavigate();
  const [bookingStates, setBookingStates] = useState({});

  const handleBookActivity = async (activityId) => {
    try {
      // Get the activity from the activities list
      const activity = activities.find(act => act._id === activityId);
      if (!activity) {
        console.error('Activity not found');
        return;
      }

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

      setBookingStates(prev => ({ ...prev, [activityId]: 'loading' }));

      const touristId = localStorage.getItem("roleId");
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
        setBookingStates(prev => ({ ...prev, [activityId]: 'success' }));
        alert("Activity booked successfully!");
      }
    } catch (error) {
      console.error("Error booking activity:", error);
      setBookingStates(prev => ({ ...prev, [activityId]: 'error' }));
      
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

  const { error: activitiesError, data: activities } = useFetch(
    "http://localhost:8000/api/advertiser/get-all-activities"
  );

  const { error: categoriesError, data: categories } = useFetch(
    "http://localhost:8000/api/admin/get-all-activity-categories"
  );

  const filteredActivities = activities
    .filter((activity) => {
      const matchesSearch =
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (activity.category &&
          activity.category.category
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (activity.tags &&
          activity.tags.some((tag) =>
            tag.tag_name.toLowerCase().includes(searchTerm.toLowerCase())
          ));

      const withinBudget = budget
        ? currencyConversions.convertFromDB(activity.price) <=
          parseFloat(budget)
        : true;

      const matchesCategory = selectedCategory
        ? activity.category && activity.category._id === selectedCategory
        : true;

      const matchesDate = selectedDate
        ? new Date(activity.start_time).toLocaleDateString() ===
          new Date(selectedDate).toLocaleDateString()
        : true;

      return matchesSearch && withinBudget && matchesDate && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      return 0;
    });

  const handleFeedback = async (activity) => {
    const isBooked = await check.isBooked(activity, "activity");
    const isCompleted = await check.isCompleted(activity, "activity");

    if (isBooked && isCompleted) {
      navigate("/createReview", { state: { activity: activity } });
    } else if (!isBooked) {
      alert("You haven't booked this activity yet");
    } else if (!isCompleted) {
      alert("The activity isn't over yet, come back afterwards");
    }
  };

  return (
    <div className="activity-guest-container">
      <div className="activity-guest-header">
        <h1 className="activity-guest-title">Discover Activities</h1>
        <p className="activity-guest-subtitle">Find and book amazing experiences</p>
      </div>

      <div className="activity-guest-filters">
        <input
          type="text"
          placeholder="Search activities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="filter-input"
        />
        <input
          type="number"
          placeholder="Max price"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="filter-input"
        />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="filter-input"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="filter-input"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.category}
            </option>
          ))}
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="filter-input"
        >
          <option value="">Sort by Price</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>

      <div className="activity-guest-grid">
        {filteredActivities.map((activity) => (
          <div key={activity._id} className="activity-guest-card">
            <div className="card-content">
              <h2 className="card-title">{activity.title}</h2>
              <p className="card-description">{activity.description}</p>
              
              <div className="tag-container">
                {activity.tags?.map((tag) => (
                  <span key={tag._id} className="tag">
                    {tag.tag_name}
                  </span>
                ))}
              </div>

              <div className="card-details">
                <div className="detail-item">
                  <span className="detail-label">Price</span>
                  <span className="detail-value">${activity.price}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Duration</span>
                  <span className="detail-value">{activity.duration} mins</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Date</span>
                  <span className="detail-value">
                    {new Date(activity.start_time).toLocaleDateString()}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Time</span>
                  <span className="detail-value">
                    {new Date(activity.start_time).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              <div className="card-actions">
                <BookmarkButton activityId={activity._id} />
                <button
                  className={`btn btn-book ${bookingStates[activity._id] || ''}`}
                  onClick={() => handleBookActivity(activity._id)}
                  disabled={bookingStates[activity._id] === 'loading'}
                >
                  <span className="button-text">
                    {bookingStates[activity._id] === 'loading' ? 'Booking...' :
                     bookingStates[activity._id] === 'success' ? 'Booked!' :
                     bookingStates[activity._id] === 'error' ? 'Failed!' :
                     'Book Now'}
                  </span>
                  {bookingStates[activity._id] === 'success' && 
                    <span className="checkmark">✓</span>}
                </button>
                <button
                  className="btn btn-feedback"
                  onClick={() => handleFeedback(activity)}
                >
                  Feedback
                </button>
              </div>
            </div>
            
            <button
              className="btn btn-copy"
              onClick={() => navigator.clipboard.writeText(window.location.href)}
            >
              Copy Link
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// const styles = {
//   container: {
//     maxWidth: "1200px",
//     margin: "0 auto",
//     padding: "20px",
//     fontFamily: "Arial, sans-serif",
//   },
//   title: {
//     fontSize: "24px",
//     fontWeight: "bold",
//     marginBottom: "20px",
//   },
//   filterContainer: {
//     display: "flex",
//     flexWrap: "wrap",
//     gap: "10px",
//     marginBottom: "20px",
//   },
//   input: {
//     padding: "8px",
//     border: "1px solid #ccc",
//     borderRadius: "4px",
//     fontSize: "14px",
//   },
//   select: {
//     padding: "8px",
//     border: "1px solid #ccc",
//     borderRadius: "4px",
//     fontSize: "14px",
//     backgroundColor: "white",
//   },
//   activityGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
//     gap: "40px",
//   },
//   card: {
//     border: "1px solid #ccc",
//     borderRadius: "8px",
//     padding: "15px",
//     backgroundColor: "white",
//   },
//   cardTitle: {
//     fontSize: "18px",
//     fontWeight: "bold",
//     marginBottom: "10px",
//   },
//   cardDescription: {
//     fontSize: "14px",
//     color: "#666",
//     marginBottom: "10px",
//   },
//   tagContainer: {
//     display: "flex",
//     flexWrap: "wrap",
//     gap: "5px",
//     marginTop: "5px",
//   },
//   tag: {
//     backgroundColor: "#e0e0e0",
//     padding: "3px 8px",
//     borderRadius: "4px",
//     fontSize: "12px",
//   },
//   noActivities: {
//     gridColumn: "1 / -1",
//     textAlign: "center",
//     color: "#666",
//   },
// };

