import React, { useState, useEffect } from "react";
import axios from "axios";
import "./viewItineraryGuide.css";

const ViewItineraryGuide = () => {
  const [itineraries, setItineraries] = useState([]);
  const [filteredItineraries, setFilteredItineraries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activities, setActivities] = useState([]); // Restored activities state
  const [tags, setTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [sortCriteria, setSortCriteria] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItinerary, setEditingItinerary] = useState(null);
  const [newItinerary, setNewItinerary] = useState({
    name: "",
    description: "",
    language: "",
    price: "",
    start_date: "",
    start_time: "",
    accessibility: false,
    active: true,
    activities: [],
  });

  useEffect(() => {
    fetchItineraries();
    fetchCategories();
    fetchActivities(); // Restored fetchActivities call
    fetchTags();
  }, []);

  useEffect(() => {
    if (itineraries.length > 0) {
      applyFilters();
    }
  }, [
    searchTerm,
    selectedTag,
    selectedCategory,
    selectedLanguage,
    minPrice,
    maxPrice,
    selectedDate,
    sortCriteria,
    itineraries,
  ]);

  const fetchItineraries = async () => {
    try {
      setIsLoading(true);
      const tourGuideId = localStorage.getItem('roleId'); // Replace with actual tour guide ID
      const response = await axios.get(
        `http://localhost:8000/api/tour-guide/get-tourguide-itineraries/${tourGuideId}`
      );
      setItineraries(response.data);
      setFilteredItineraries(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching itineraries:", error);
      setError("Failed to fetch itineraries. Please try again later.");
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/get-all-activity-categories"
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/advertiser/get-all-activities"
      );
      setActivities(response.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/tourism-governor/get-all-tags"
      );
      setTags(response.data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const applyFilters = () => {
    let filtered = itineraries.filter((itinerary) => {
      const matchesSearch = itinerary.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesTag =
        !selectedTag ||
        itinerary.activities.some((activity) =>
          activity.tags.some((tag) => tag._id === selectedTag)
        );
      const matchesCategory =
        !selectedCategory ||
        itinerary.activities.some(
          (activity) =>
            activity.category && activity.category._id === selectedCategory
        );
      const matchesLanguage =
        !selectedLanguage || itinerary.language === selectedLanguage;
      const matchesPrice =
        (!minPrice || itinerary.price >= parseFloat(minPrice)) &&
        (!maxPrice || itinerary.price <= parseFloat(maxPrice));
      const matchesDate =
        !selectedDate ||
        new Date(itinerary.start_date).toISOString().split("T")[0] ===
          selectedDate;

      return (
        matchesSearch &&
        matchesTag &&
        matchesCategory &&
        matchesLanguage &&
        matchesPrice &&
        matchesDate
      );
    });

    if (sortCriteria === "price_asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortCriteria === "price_desc") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredItineraries(filtered);
  };

  const handleCreateItinerary = async () => {
    try {
      const tourGuideId = localStorage.getItem('roleId'); // Replace with actual tour guide ID
      const response = await axios.post(
        "http://localhost:8000/api/tour-guide/create-itinerary",
        { ...newItinerary, tour_guide: tourGuideId }
      );
      setItineraries([...itineraries, response.data]);
      setNewItinerary({
        name: "",
        description: "",
        language: "",
        price: "",
        start_date: "",
        start_time: "",
        accessibility: false,
        active: true,
        activities: [],
      });
    } catch (error) {
      console.error("Error creating itinerary:", error);
    }
  };

  const handleEditItinerary = (itinerary) => {
    setEditingItinerary(itinerary);
    setNewItinerary({
      name: itinerary.name,
      description: itinerary.description,
      language: itinerary.language,
      price: itinerary.price,
      start_date: new Date(itinerary.start_date).toISOString().split("T")[0],
      start_time: itinerary.start_time,
      accessibility: itinerary.accessibility,
      active: itinerary.active,
      activities: itinerary.activities.map(activity => activity._id),
    });
  };

  const handleUpdateItinerary = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/tour-guide/update-itinerary/${editingItinerary._id}`,
        newItinerary
      );
      setItineraries(
        itineraries.map((itinerary) =>
          itinerary._id === response.data._id ? response.data : itinerary
        )
      );
      setEditingItinerary(null);
      setNewItinerary({
        name: "",
        description: "",
        language: "",
        price: "",
        start_date: "",
        start_time: "",
        accessibility: false,
        active: true,
        activities: [],
      });
    } catch (error) {
      console.error("Error updating itinerary:", error);
    }
  };

  const handleDeleteItinerary = async (itineraryId) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/tour-guide/delete-itinerary/${itineraryId}`
      );
      setItineraries(
        itineraries.filter((itinerary) => itinerary._id !== itineraryId)
      );
    } catch (error) {
      console.error("Error deleting itinerary:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewItinerary((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleActivitySelection = (e) => {
    const selectedActivityIds = Array.from(e.target.selectedOptions, option => option.value);
    setNewItinerary(prev => ({
      ...prev,
      activities: selectedActivityIds
    }));
  };

  const getAllLanguages = () => {
    return Array.from(
      new Set(itineraries.map((itinerary) => itinerary.language))
    );
  };

  if (isLoading) {
    return <div className="itinerary-guide-loading">Loading...</div>;
  }

  if (error) {
    return <div className="itinerary-guide-error">{error}</div>;
  }

  return (
    <div className="itinerary-guide-viewer">
      <h1>Manage Itineraries</h1>

      <div className="itinerary-guide-filters">
        <input
          type="text"
          placeholder="Search itineraries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="itinerary-guide-filter-input"
        />

        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="itinerary-guide-filter-select"
        >
          <option value="">All Tags</option>
          {tags.map((tag) => (
            <option key={tag._id} value={tag._id}>
              {tag.tag_name}
            </option>
          ))}
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="itinerary-guide-filter-select"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.category}
            </option>
          ))}
        </select>

        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="itinerary-guide-filter-select"
        >
          <option value="">All Languages</option>
          {getAllLanguages().map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="itinerary-guide-filter-input"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="itinerary-guide-filter-input"
        />

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="itinerary-guide-filter-input"
        />

        <select
          value={sortCriteria}
          onChange={(e) => setSortCriteria(e.target.value)}
          className="itinerary-guide-filter-select"
        >
          <option value="">Sort By</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      <div className="itinerary-guide-create-form">
        <h2>{editingItinerary ? "Edit Itinerary" : "Create New Itinerary"}</h2>
        <input
          type="text"
          name="name"
          placeholder="Itinerary Name"
          value={newItinerary.name}
          onChange={handleInputChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={newItinerary.description}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="language"
          placeholder="Language"
          value={newItinerary.language}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newItinerary.price}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="start_date"
          value={newItinerary.start_date}
          onChange={handleInputChange}
        />
        <input
          type="time"
          name="start_time"
          value={newItinerary.start_time}
          onChange={handleInputChange}
        />
        <label>
          <input
            type="checkbox"
            name="accessibility"
            checked={newItinerary.accessibility}
            onChange={handleInputChange}
          />
          Accessibility
        </label>
        <label>
          <input
            type="checkbox"
            name="active"
            checked={newItinerary.active}
            onChange={handleInputChange}
          />
          Active
        </label>
        <select
          multiple
          name="activities"
          value={newItinerary.activities}
          onChange={handleActivitySelection}
          className="itinerary-guide-activity-select"
        >
          {activities.map((activity) => (
            <option key={activity._id} value={activity._id}>
              {activity.title}
            </option>
          ))}
        </select>
        <button onClick={editingItinerary ? handleUpdateItinerary : handleCreateItinerary}>
          {editingItinerary ? "Update Itinerary" : "Create Itinerary"}
        </button>
        {editingItinerary && (
          <button onClick={() => setEditingItinerary(null)}>Cancel Edit</button>
        )}
      </div>

      <div className="itinerary-guide-list">
        {filteredItineraries.map((itinerary) => (
          <div key={itinerary._id} className="itinerary-guide-card">
            <h2>{itinerary.name}</h2>
            <p><strong>Description:</strong> {itinerary.description}</p>
            <p><strong>Language:</strong> {itinerary.language}</p>
            <p><strong>Price:</strong> ${itinerary.price}</p>
            <p><strong>Start Date:</strong> {new Date(itinerary.start_date).toLocaleDateString()}</p>
            <p><strong>Start Time:</strong> {itinerary.start_time}</p>
            <p><strong>Accessibility:</strong> {itinerary.accessibility ? "Yes" : "No"}</p>
            <p><strong>Active:</strong> {itinerary.active ? "Yes" : "No"}</p>
            {itinerary.pick_up && (
              <p>
                <strong>Pick-up Location:</strong> Latitude: {itinerary.pick_up.latitude}, Longitude: {itinerary.pick_up.longitude}
              </p>
            )}
            {itinerary.drop_off && (
              <p>
                <strong>Drop-off Location:</strong> Latitude: {itinerary.drop_off.latitude}, Longitude: {itinerary.drop_off.longitude}
              </p>
            )}
            <ActivitiesSection activities={itinerary.activities} />
            <button onClick={() => handleEditItinerary(itinerary)}>Edit</button>
            <button onClick={() => handleDeleteItinerary(itinerary._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const ActivitiesSection = ({ activities }) => {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);

  const nextActivity = () => {
    setCurrentActivityIndex((prevIndex) =>
      prevIndex < activities.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const prevActivity = () => {
    setCurrentActivityIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  };

  if (!activities || activities.length === 0) {
    return <p>No activities for this itinerary.</p>;
  }

  const currentActivity = activities[currentActivityIndex];

  return (
    <div className="activities-section">
      <h3>Activities</h3>
      <div className="activity-navigation">
        <button
          onClick={prevActivity}
          disabled={currentActivityIndex === 0}
          className="nav-button"
        >
          &lt; Previous
        </button>
        <span>
          {currentActivityIndex + 1} / {activities.length}
        </span>
        <button
          onClick={nextActivity}
          disabled={currentActivityIndex === activities.length - 1}
          className="nav-button"
        >
          Next &gt;
        </button>
      </div>
      <div className="activity-item">
        <p>
          <strong>Title:</strong> {currentActivity.title}
        </p>
        <p>
          <strong>Description:</strong> {currentActivity.description}
        </p>
        <p>
          <strong>Start Time:</strong>{" "}
          {new Date(currentActivity.start_time).toLocaleString()}
        </p>
        <p>
          <strong>Duration:</strong> {currentActivity.duration} minutes
        </p>
        {currentActivity.category && (
          <p>
            <strong>Category:</strong> {currentActivity.category.category}
          </p>
        )}
        {currentActivity.tags && currentActivity.tags.length > 0 && (
          <div>
            <strong>Tags:</strong>
            <ul className="tags-list">
              {currentActivity.tags.map((tag) => (
                <li key={tag._id}>{tag.tag_name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewItineraryGuide;