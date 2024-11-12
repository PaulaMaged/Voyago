import React, { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";

export default function ViewActivitiesAdmin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [budget, setBudget] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [toggle, setToggle] = useState(false);

  const { error: activitiesError, data: activities } = useFetch(
    "http://localhost:8000/api/advertiser/get-all-activities",
    [toggle]
  );

  const { error: categoriesError, data: categories } = useFetch(
    "http://localhost:8000/api/admin/get-all-activity-categories",
    [toggle]
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

      const withinBudget = budget ? activity.price <= parseFloat(budget) : true;

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

  const handleFlag = async (activity) => {
    const data = {
      flag_inapproperiate: !activity.flag_inapproperiate,
    };
    try {
      const response = await axios.put(
        `http://localhost:8000/api/admin/flag-inapproperiate-activity/${activity._id}`,
        data
      );
      console.log(response);
      alert("Successfully changed flag status");
      setToggle((prev) => !prev);
    } catch (error) {
      console.log(error);
      alert("Failed to change flag status");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Upcoming Activities</h1>

      <div style={styles.filterContainer}>
        <input
          type="text"
          placeholder="Search name, category, tag"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.input}
        />
        <input
          type="number"
          placeholder="Max Budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          style={styles.input}
        />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={styles.input}
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={styles.select}
        >
          <option value="">All Categories</option>
          {!categoriesError
            ? categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.category}
                </option>
              ))
            : "Can't fetch categories right now"}
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={styles.select}
        >
          <option value="">Sort by Price</option>
          <option value="asc">Low to High</option>
          <option value="desc">High to Low</option>
        </select>
      </div>

      <div style={styles.activityGrid}>
        {!activitiesError && filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <div key={activity._id} style={styles.card}>
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
                <strong>Price:</strong> ${activity.price.toFixed(2)}
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
                    <strong>Company:</strong> {activity.advertiser.company_name}
                  </p>
                  <p>
                    <strong>Hotline:</strong> {activity.advertiser.contact_info}
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
              <div className="flag">
                flag status: {activity.flag_inapproperiate.toString()}
              </div>
              <button
                onClick={() => {
                  handleFlag(activity);
                }}
              >
                Flag/Unflag Activity
              </button>
            </div>
          ))
        ) : (
          <p style={styles.noActivities}>No upcoming activities available.</p>
        )}
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
