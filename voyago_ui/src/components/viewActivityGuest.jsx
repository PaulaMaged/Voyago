import React, { useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import check from "../helpers/checks";
import axios from "axios";
import currencyConversions from "../helpers/currencyConversions";
import BookmarkButton from "./BookmarkButton";
import "./viewActivityGuest.css";
import getCheckoutUrl from "../helpers/getCheckoutUrl";

export default function ViewActivityGuest() {
  const [searchTerm, setSearchTerm] = useState("");
  const [budget, setBudget] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [isBooked, setIsBooked] = useState(false);
  const navigate = useNavigate();
  const [bookingStates, setBookingStates] = useState({});

  const touristId = localStorage.getItem("roleId");

  const handleStripePayment = async (activity) => {
    const url = await getCheckoutUrl(
      "activity",
      "http://localhost:5173/viewActivityGuest?accepted",
      "http://localhost:5173/viewActivityGuest?cancelled",
      [activity]
    );

    window.location = url;
  };

  const handleBookActivity = async (activityId) => {
    const data = {
      plans: [
        {
          type: "Activity",
          activityId: activityId,
        },
      ],
    };

    setBookingStates((prev) => ({
      ...prev,
      [activityId]: "loading",
    }));

    try {
      const response = await axios.post(
        `http://localhost:8000/api/tourist/tourist-pay/${touristId}`,
        data
      );

      const touristResponse = await axios.get(
        `http://localhost:8000/api/tourist/get-tourist/${touristId}`
      );

      localStorage.setItem("walletBalance", touristResponse.data.wallet);

      setBookingStates((prev) => ({
        ...prev,
        [activityId]: "success",
      }));

      alert(
        `Activity booked successfully! Your new wallet balance is $${touristResponse.data.wallet}`
      );

      setTimeout(() => {
        setBookingStates((prev) => ({
          ...prev,
          [activityId]: null,
        }));
      }, 2000);
    } catch (error) {
      console.error(error);

      setBookingStates((prev) => ({
        ...prev,
        [activityId]: "error",
      }));

      alert(error.response?.data?.message || "Failed to book activity");

      setTimeout(() => {
        setBookingStates((prev) => ({
          ...prev,
          [activityId]: null,
        }));
      }, 2000);
    }
  };

  const { error: activitiesError, data: activities } = useFetch(
    "http://localhost:8000/api/advertiser/get-all-activities"
  );

  const { error: categoriesError, data: categories } = useFetch(
    "http://localhost:8000/api/admin/get-all-activity-categories"
  );

  const { error: bookingsError, data: bookings } = useFetch(
    `http://localhost:8000/api/tourist/get-all-tourists-activity-bookings/${touristId}`
  );

  const filteredActivities = activities
    .filter((activity) => {
      const booked =
        !isBooked ||
        bookings.some(
          (bookedActivity) => bookedActivity.activity._id === activity._id
        );

      const isUpcoming = new Date(activity.start_time) > new Date();

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

      return (
        matchesSearch &&
        withinBudget &&
        matchesDate &&
        matchesCategory &&
        booked &&
        isUpcoming
      );
    })
    .sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      return 0;
    });

  const handleCancel = (activity) => {
    const booking = bookings.filter(
      (booking) => booking.activity._id === activity._id
    )[0];

    if (!booking) {
      alert("You haven't booked this itinerary");
      return;
    }

    try {
      axios.delete(
        `http://localhost:8000/api/tourist/tourist-cancel-activity-booking/${booking._id}`
      );
      alert(
        `Cancelled successfully, amount of ${booking.activity.price} is refunded to your wallet`
      );
    } catch (error) {
      alert("Error occured while handling refund.");
      console.log(error);
    }
  };

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
        <p className="activity-guest-subtitle">
          Find and book amazing experiences
        </p>
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

        <label for="booked"> My Bookings </label>
        <input
          type="checkbox"
          id="booked"
          onChange={(e) => setIsBooked(e.target.checked)}
        />
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
                  className="copy"
                  onClick={() =>
                    navigator.clipboard.writeText(window.location.href)
                  }
                >
                  Copy Link
                </button>
                <h2 style={styles.cardTitle}>{activity.title}</h2>
                <p style={styles.cardDescription}>{activity.description}</p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(activity.start_time).toLocaleDateString()}
                </p>
                <p>
                  <strong>Time:</strong>{" "}
                  {new Date(activity.start_time).toLocaleTimeString()}
                </p>
                <p>
                  <strong>Duration:</strong> {activity.duration} minutes
                </p>
                <p>
                  <strong>Price: </strong>
                  {currencyConversions
                    .convertFromDB(activity.price)
                    .toFixed(2) +
                    " " +
                    localStorage.getItem("currency")}
                </p>
                <p>
                  <strong>Category:</strong> {activity.category?.category}
                </p>
                {activity.discount > 0 && (
                  <p>
                    <strong>Discount:</strong> {activity.discount}%
                  </p>
                )}
                <p>
                  <strong>Booking Open:</strong>{" "}
                  {activity.booking_open ? "Yes" : "No"}
                </p>
                {activity.location && (
                  <div>
                    <strong>Location:</strong>
                    <p>Latitude: {activity.location.latitude.toFixed(6)}</p>
                    <p>Longitude: {activity.location.longitude.toFixed(6)}</p>
                  </div>
                )}
                {activity.advertiser && (
                  <div>
                    <p>
                      <strong>Company:</strong>{" "}
                      {activity.advertiser.company_name}
                    </p>
                    <p>
                      <strong>Hotline:</strong>{" "}
                      {activity.advertiser.contact_info}
                    </p>
                  </div>
                )}
                {activity.tags && activity.tags.length > 0 && (
                  <div>
                    <strong>Tags:</strong>
                    <div style={styles.tagContainer}>
                      {activity.tags.map((tag) => (
                        <span key={tag._id} style={styles.tag}>
                          {tag.tag_name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button onClick={() => handleCancel(activity)}>
                  Cancel Activity
                </button>
                <button
                  id="book-activity"
                  className={`btn btn-book ${
                    bookingStates[activity._id] || ""
                  }`}
                  onClick={() => handleBookActivity(activity._id)}
                  disabled={bookingStates[activity._id] === "loading"}
                >
                  <span className="button-text">
                    {bookingStates[activity._id] === "loading"
                      ? "Booking..."
                      : bookingStates[activity._id] === "success"
                      ? "Booked!"
                      : bookingStates[activity._id] === "error"
                      ? "Failed!"
                      : "Book Now"}
                  </span>
                  {bookingStates[activity._id] === "success" && (
                    <span className="checkmark">✓</span>
                  )}
                </button>
                <button
                  className="btn btn-book"
                  onClick={() => handleStripePayment(activity)}
                >
                  <span>Book - Card</span>
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
              onClick={() =>
                navigator.clipboard.writeText(window.location.href)
              }
            >
              Copy Link
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  filterContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
  },
  select: {
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
    backgroundColor: "white",
  },
  activityGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "40px",
  },
  card: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "15px",
    backgroundColor: "white",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  cardDescription: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "10px",
  },
  tagContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "5px",
    marginTop: "5px",
  },
  tag: {
    backgroundColor: "#e0e0e0",
    padding: "3px 8px",
    borderRadius: "4px",
    fontSize: "12px",
  },
  noActivities: {
    gridColumn: "1 / -1",
    textAlign: "center",
    color: "#666",
  },
};
