import React, { useState, useEffect } from "react";
import axios from "axios";
import currencyConversions from "../helpers/currencyConversions";
import "./viewItineraryGuide.css";
import { FaWheelchair, FaInfoCircle, FaLanguage, FaMoneyBillWave, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaEdit, FaTrash, FaSpinner, FaExclamationCircle, FaPlus } from "react-icons/fa";
import CreateItineraryForm from "./CreateItineraryForm";

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
  const [showCreateForm, setShowCreateForm] = useState(false);

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
      const tourGuideId = localStorage.getItem("roleId");
      console.log("Fetching itineraries for tour guide:", tourGuideId);

      const response = await axios.get(
        `http://localhost:8000/api/tour-guide/get-tourguide-itineraries/${tourGuideId}`
      );
      console.log("Received itineraries:", response.data);

      setItineraries(response.data);
      setFilteredItineraries(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching itineraries:", error.response || error);
      setError(`Failed to fetch itineraries: ${error.response?.data?.message || error.message}`);
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
        const convertedPrice = currencyConversions.convertFromDB(itinerary.price);
        const matchesPrice =
          (!minPrice || convertedPrice >= parseFloat(minPrice)) &&
          (!maxPrice || convertedPrice <= parseFloat(maxPrice));
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
      const tourGuideId = localStorage.getItem("roleId"); // Replace with actual tour guide ID
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

  const handleEditClick = (itinerary) => {
    setEditingItinerary(itinerary);
    setShowCreateForm(true);
  };

  const handleEditSubmit = async (updatedData) => {
    try {
      // Format the data properly before sending
      const formattedData = {
        ...updatedData,
        tour_guide: localStorage.getItem("roleId"),
        price: currencyConversions.convertToDB(parseFloat(updatedData.price)),
        start_date: new Date(updatedData.start_date).toISOString(),
        activities: Array.isArray(updatedData.activities) ? updatedData.activities : []
      };

      console.log('Sending update data:', formattedData); // Debug log

      const response = await axios.put(
        `http://localhost:8000/api/tour-guide/update-itinerary/${editingItinerary._id}`,
        formattedData
      );

      setItineraries(prevItineraries =>
        prevItineraries.map(item =>
          item._id === editingItinerary._id ? response.data : item
        )
      );

      setFilteredItineraries(prevFiltered =>
        prevFiltered.map(item =>
          item._id === editingItinerary._id ? response.data : item
        )
      );

      setEditingItinerary(null);
      setShowCreateForm(false);
      alert("Itinerary updated successfully!");
    } catch (error) {
      console.error("Error updating itinerary:", error.response?.data || error);
      alert(`Failed to update itinerary: ${error.response?.data?.message || error.message}`);
    }
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
    // Add confirmation dialog
    if (!window.confirm("Are you sure you want to delete this itinerary?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:8000/api/tour-guide/delete-itinerary/${itineraryId}`
      );

      if (response.status === 200) {
        // Remove the deleted itinerary from both states
        setItineraries(prevItineraries =>
          prevItineraries.filter(itinerary => itinerary._id !== itineraryId)
        );
        
        setFilteredItineraries(prevFiltered =>
          prevFiltered.filter(itinerary => itinerary._id !== itineraryId)
        );

        alert("Itinerary deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting itinerary:", error);
      
      // Check if there's a specific error message from the backend
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else if (error.response?.status === 400) {
        alert("Cannot delete itinerary with existing bookings");
      } else {
        alert("Failed to delete itinerary. Please try again later.");
      }
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
    const selectedActivityIds = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setNewItinerary((prev) => ({
      ...prev,
      activities: selectedActivityIds,
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Itineraries</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg hover:bg-[var(--primaryDark)] transition-colors flex items-center gap-2"
        >
          <FaPlus /> Add New Itinerary
        </button>
      </div>

      {showCreateForm ? (
        <CreateItineraryForm 
          initialData={editingItinerary}
          onSuccess={async (data) => {
            try {
              if (editingItinerary) {
                await handleEditSubmit(data);
              } else {
                // Create new itinerary
                const response = await axios.post(
                  "http://localhost:8000/api/tour-guide/create-itinerary",
                  data
                );
                setItineraries(prevItineraries => [...prevItineraries, response.data]);
                setFilteredItineraries(prevFiltered => [...prevFiltered, response.data]);
                setShowCreateForm(false);
                alert("Itinerary created successfully!");
              }
            } catch (error) {
              console.error("Error handling itinerary:", error);
              alert(`Failed to ${editingItinerary ? 'update' : 'create'} itinerary: ${error.response?.data?.message || error.message}`);
            }
          }}
          onCancel={() => {
            setEditingItinerary(null);
            setShowCreateForm(false);
          }}
        />
      ) : (
        <>
          <div className="itinerary-guide-filters">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="itinerary-guide-filter-input"
            />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="itinerary-guide-filter-select"
            >
              <option value="">All Languages</option>
              {getAllLanguages().map((language) => (
                <option key={`lang-${language}`} value={language}>
                  {language}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Min price..."
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="itinerary-guide-filter-input"
            />
            <input
              type="number"
              placeholder="Max price..."
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="itinerary-guide-filter-input"
            />
          </div>

          <div className="itinerary-guide-list">
            {filteredItineraries.length === 0 ? (
              <div className="no-itineraries">
                <p>No itineraries found</p>
              </div>
            ) : (
              filteredItineraries.map((itinerary) => (
                <div key={`itinerary-${itinerary._id}`} className="itinerary-guide-card">
                  <div className="itinerary-guide-card-header">
                    <h2>{itinerary.name}</h2>
                    <div className="itinerary-guide-card-badges">
                      <span className={`status-badge ${itinerary.active ? 'active' : 'inactive'}`}>
                        {itinerary.active ? 'Active' : 'Inactive'}
                      </span>
                      {itinerary.accessibility && (
                        <span className="accessibility-badge">
                          <FaWheelchair className="icon" />
                          Accessible
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="itinerary-guide-card-content">
                    <div className="info-group">
                      <FaInfoCircle className="icon" />
                      <p>{itinerary.description}</p>
                    </div>

                    <div className="info-group">
                      <FaLanguage className="icon" />
                      <p>{itinerary.language}</p>
                    </div>

                    <div className="info-group">
                      <FaMoneyBillWave className="icon" />
                      <p className="price">
                        {currencyConversions.convertFromDB(itinerary.price).toFixed(2)}
                        {" "}{localStorage.getItem("currency") || "USD"}
                      </p>
                    </div>

                    <div className="info-group">
                      <FaCalendarAlt className="icon" />
                      <p>{new Date(itinerary.start_date).toLocaleDateString()}</p>
                    </div>

                    <div className="info-group">
                      <FaClock className="icon" />
                      <p>{itinerary.start_time}</p>
                    </div>

                    {itinerary.pick_up && (
                      <div className="info-group">
                        <FaMapMarkerAlt className="icon" />
                        <p>
                          Pick-up Location: {itinerary.pick_up.latitude}, {itinerary.pick_up.longitude}
                        </p>
                      </div>
                    )}

                    {itinerary.activities && itinerary.activities.length > 0 && (
                      <div className="activities-section">
                        <h3>Activities:</h3>
                        <ul>
                          {itinerary.activities.map((activity) => (
                            <li key={`activity-${itinerary._id}-${activity._id}`}>
                              {activity.title}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="itinerary-guide-card-actions">
                    <button 
                      onClick={() => handleEditClick(itinerary)}
                      className="edit-button"
                    >
                      <FaEdit className="icon" />
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteItinerary(itinerary._id)}
                      className="delete-button"
                    >
                      <FaTrash className="icon" />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {isLoading && (
        <div className="itinerary-guide-loading">
          <FaSpinner className="icon-spin" /> Loading itineraries...
        </div>
      )}

      {error && (
        <div className="itinerary-guide-error">
          <FaExclamationCircle className="icon" /> {error}
        </div>
      )}
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
