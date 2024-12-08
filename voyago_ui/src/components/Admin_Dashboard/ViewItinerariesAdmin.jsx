import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../viewItinerary.css";

const ViewItineraryAdmin = () => {
  const [itineraries, setItineraries] = useState([]);
  const [filteredItineraries, setFilteredItineraries] = useState([]);
  const [categories, setCategories] = useState([]);
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
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    fetchItineraries();
    fetchCategories();
  }, [toggle]);

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
      const response = await axios.get(
        "http://localhost:8000/api/tour-guide/get-all-itineraries"
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

  const getAllTags = () => {
    const tagSet = new Set();
    itineraries.forEach((itinerary) => {
      itinerary.activities.forEach((activity) => {
        if (activity.tags) {
          activity.tags.forEach((tag) => tagSet.add(JSON.stringify(tag)));
        }
      });
    });
    return Array.from(tagSet).map((tag) => JSON.parse(tag));
  };

  const getAllLanguages = () => {
    return Array.from(
      new Set(itineraries.map((itinerary) => itinerary.language))
    );
  };

  const handleFlagChange = async (itinerary) => {
    const data = {
      flag_inapproperiate: !itinerary.flag_inapproperiate,
    };
    try {
      const response = await axios.put(
        `http://localhost:8000/api/admin/flag-inapproperiate-itinerary/${itinerary._id}`,
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

  const renderItineraries = () => {
    return filteredItineraries.map((itinerary) => (
      <div key={itinerary._id} className="itinerary-card">
        <div className="itinerary-header">
          <h2>{itinerary.name}</h2>
          <div className="itinerary-meta">
            <span>Price: ${itinerary.price}</span>
            <span>Language: {itinerary.language}</span>
          </div>
        </div>

        <div className="itinerary-details">
          <p><strong>Description:</strong> {itinerary.description}</p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(itinerary.start_date).toLocaleDateString()}
          </p>
          <p><strong>Duration:</strong> {itinerary.duration} hours</p>
          <p>
            <strong>Tour Guide:</strong>{" "}
            {itinerary.tour_guide?.user?.username || "Not assigned"}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span className={`status ${itinerary.active ? "active" : "inactive"}`}>
              {itinerary.active ? "Active" : "Inactive"}
            </span>
          </p>
          <p>
            <strong>Flagged:</strong>{" "}
            <button
              onClick={() => handleFlagChange(itinerary)}
              className={`flag-button ${
                itinerary.flag_inapproperiate ? "flagged" : ""
              }`}
            >
              {itinerary.flag_inapproperiate ? "Flagged" : "Not Flagged"}
            </button>
          </p>
        </div>

        <ActivitiesSection activities={itinerary.activities} />
      </div>
    ));
  };

  return (
    <div className="itinerary-viewer">
      <h1>Upcoming Itineraries</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Search itineraries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="filter-input"
        />

        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="filter-select"
        >
          <option value="">All Tags</option>
          {getAllTags().map((tag) => (
            <option key={tag._id} value={tag._id}>
              {tag.tag_name}
            </option>
          ))}
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="filter-select"
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
          className="filter-select"
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
          className="filter-input"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="filter-input"
        />

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="filter-input"
        />

        <select
          value={sortCriteria}
          onChange={(e) => setSortCriteria(e.target.value)}
          className="filter-select"
        >
          <option value="">Sort By</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      <div className="itineraries-grid">
        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : filteredItineraries.length === 0 ? (
          <div className="no-results">No itineraries found</div>
        ) : (
          renderItineraries()
        )}
      </div>
    </div>
  );
};

const ActivitiesSection = ({ activities }) => {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);

  const nextActivity = useCallback(() => {
    setCurrentActivityIndex((prevIndex) =>
      prevIndex < activities.length - 1 ? prevIndex + 1 : prevIndex
    );
  }, [activities.length]);

  const prevActivity = useCallback(() => {
    setCurrentActivityIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  }, []);

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

export default ViewItineraryAdmin;
