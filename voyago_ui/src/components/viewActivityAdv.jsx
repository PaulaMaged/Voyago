import React, { useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import currencyConversions from "../helpers/currencyConversions";
import axios from "axios";

export default function ViewActivityAdv() {
  const [searchTerm, setSearchTerm] = useState("");
  const [budget, setBudget] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingActivity, setEditingActivity] = useState(null);
  const [newActivity, setNewActivity] = useState({
    title: "",
    description: "",
    start_time: "",
    duration: 30,
    price: 0,
    category: "",
    discount: 0,
    location: "",
    tags: [],
    booking_open: true,
  });

  let advid = "";

  // Fetching activities and categories
  useEffect(() => {
    advid = localStorage.getItem("roleId");
    async function fetchActivities() {
      const response = await axios.get(
        "http://localhost:8000/api/get-advertiser-activities/${advid}"
      );
      setActivities(response.data);
    }

    async function fetchCategories() {
      const response = await axios.get(
        "http://localhost:8000/api/admin/get-all-activity-categories"
      );
      setCategories(response.data);
    }

    fetchActivities();
    fetchCategories();
  }, []);

  // Filter and Sort Logic
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

  // Handle Form Inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewActivity((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Create Activity
  const handleCreateActivity = async () => {
    try {
      // Retrieve advertiserId from localStorage
      const advertiserId = localStorage.getItem("roleId");

      // Ensure the newActivity includes the advertiserId
      const activityWithAdvertiserId = {
        ...newActivity,
        advertiser: advertiserId,
      };

      const response = await axios.post(
        "http://localhost:8000/api/advertiser/create-activity",
        activityWithAdvertiserId
      );

      setActivities([...activities, response.data]);
      setNewActivity({
        title: "",
        description: "",
        start_time: "",
        duration: 30,
        price: 0,
        category: "",
        discount: 0,
        location: "",
        tags: [],
        booking_open: true,
      });
    } catch (error) {
      console.error("Error creating activity:", error);
    }
  };

  // Handle Edit Activity
  const handleEditActivity = (activity) => {
    setEditingActivity(activity);
    setNewActivity({
      ...activity,
    });
  };

  // Handle Update Activity
  const handleUpdateActivity = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/advertiser/update-activity/${editingActivity._id}`,
        newActivity
      );
      setActivities(
        activities.map((activity) =>
          activity._id === response.data._id ? response.data : activity
        )
      );
      setEditingActivity(null);
      setNewActivity({
        title: "",
        description: "",
        start_time: "",
        duration: 30,
        price: 0,
        category: "",
        discount: 0,
        location: "",
        tags: [],
        booking_open: true,
      });
    } catch (error) {
      console.error("Error updating activity:", error);
      console.error("Error updating activity:", error);
    }
  };

  // Handle Delete Activity
  const handleDeleteActivity = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/advertiser/delete-activity/${id}`
      );
      setActivities(activities.filter((activity) => activity._id !== id));
    } catch (error) {
      console.error("Error deleting activity:", error);
      console.error("Error deleting activity:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Manage Activities</h1>

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
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.category}
            </option>
          ))}
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

      {/* Create / Edit Activity Form */}
      <div style={styles.activityForm}>
        <h2>{editingActivity ? "Edit Activity" : "Create New Activity"}</h2>
        <input
          type="text"
          name="title"
          placeholder="Activity Title"
          value={newActivity.title}
          onChange={handleInputChange}
          style={styles.input}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={newActivity.description}
          onChange={handleInputChange}
          style={styles.textarea}
        />
        <input
          type="datetime-local"
          name="start_time"
          value={newActivity.start_time}
          onChange={handleInputChange}
          style={styles.input}
        />
        <input
          type="number"
          name="duration"
          placeholder="Duration (minutes)"
          value={newActivity.duration}
          onChange={handleInputChange}
          style={styles.input}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newActivity.price}
          onChange={handleInputChange}
          style={styles.input}
        />
        <select
          name="category"
          value={newActivity.category}
          onChange={handleInputChange}
          style={styles.select}
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.category}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="discount"
          placeholder="Discount (%)"
          value={newActivity.discount}
          onChange={handleInputChange}
          style={styles.input}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={newActivity.location}
          onChange={handleInputChange}
          style={styles.input}
        />
        <button
          onClick={
            editingActivity ? handleUpdateActivity : handleCreateActivity
          }
          style={styles.button}
        >
          {editingActivity ? "Update Activity" : "Create Activity"}
        </button>
      </div>

      <div style={styles.activityGrid}>
        {filteredActivities.length > 0 ? (
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
                <strong>Price:</strong>
                {currencyConversions.convertFromDB(activity.price).toFixed(2) +
                  " " +
                  localStorage.getItem("currency")}
              </p>
              <p>
                <strong>Category:</strong> {activity.category?.category}
              </p>
              <button
                onClick={() => handleEditActivity(activity)}
                style={styles.button}
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteActivity(activity._id)}
                style={styles.button}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No activities found.</p>
        )}
      </div>
    </div>
  );
}

// Styles for the component (you can modify or use your preferred styling method)
const styles = {
  container: { padding: "20px", backgroundColor: "#f9f9f9" },
  title: { fontSize: "24px", textAlign: "center", marginBottom: "20px" },
  filterContainer: { marginBottom: "20px" },
  input: {
    padding: "8px",
    marginRight: "10px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  select: {
    padding: "8px",
    marginRight: "10px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  activityForm: { marginBottom: "20px" },
  textarea: {
    padding: "8px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    width: "100%",
    height: "100px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    margin: "5px",
  },
  activityGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  card: {
    padding: "15px",
    backgroundColor: "#fff",
    borderRadius: "5px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  cardTitle: { fontSize: "18px", fontWeight: "bold" },
  cardDescription: { fontSize: "14px", marginBottom: "10px" },
};
