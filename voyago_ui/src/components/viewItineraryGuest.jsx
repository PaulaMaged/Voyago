import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import check from "../helpers/checks";
import axios from "axios";
import currencyConversions from "../helpers/currencyConversions";
import "./viewItinerary.css";
import './viewItineraryGuest.css';
const ViewItineraryGuest = () => {
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
  const navigate = useNavigate();

  useEffect(() => {
    fetchItineraries();
    fetchCategories();
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

  const handleBookItinerary = async (itineraryId) => {
    const touristId = localStorage.getItem("roleId");

    const data = {
      plans: [
        {
          type: "Itinerary",
          itineraryId: itineraryId,
        },
      ],
    };

    console.log(data);
    try {
      const response = await axios.post(
        `http://localhost:8000/api/tourist/tourist-pay/${touristId}`,
        data
      );
      console.log(response.data);
      if (response.status === 201) {
        alert("Itinerary booked successfully!");
      } else {
        alert("Failed to book the Itinerary. Please try again.");
      }
      // Handle successful booking
    } catch (error) {
      console.error("Error booking itinerary:", error);
      // Handle booking error
      alert(
        "An error occurred while booking the Itinerary. Please try again later."
      );
    }
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleFeedbackItinerary = async (itinerary) => {
    const isBooked = await check.isBooked(itinerary, "itinerary");
    const isCompleted = await check.isCompleted(itinerary, "itinerary");

    if (isBooked && isCompleted) {
      navigate("/createReview", { state: { itinerary: itinerary } });
    } else if (!isBooked) {
      alert("You haven't booked this itinerary yet");
    } else if (!isCompleted) {
      alert("The itinerary isn't over yet, come back afterwards");
    }
  };

  const handleFeedbackTourGuide = async (itinerary) => {
    const isBooked = await check.isBooked(itinerary, "itinerary");
    const isCompleted = await check.isCompleted(itinerary, "itinerary");

    if (isBooked && isCompleted) {
      navigate("/createReview", { state: { tourGuide: itinerary.tour_guide } });
    } else if (!isBooked) {
      alert("You haven't booked this itinerary yet");
    } else if (!isCompleted) {
      alert("The itinerary isn't over yet, come back afterwards");
    }
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
          <option key="tag-default" value="">All Tags</option>
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
          <option key="category-default" value="">All Categories</option>
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
          <option key="language-default" value="">All Languages</option>
          {getAllLanguages().map((language) => (
            <option key={`lang-${language}`} value={language}>
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
          <option key="sort-default" value="">Sort By</option>
          <option key="sort-price-asc" value="price_asc">Price: Low to High</option>
          <option key="sort-price-desc" value="price_desc">Price: High to Low</option>
          <option key="sort-date-asc" value="date_asc">Date: Earliest First</option>
          <option key="sort-date-desc" value="date_desc">Date: Latest First</option>
        </select>
      </div>

      <div className="itinerary-list">
        {filteredItineraries.map((itinerary) => {
          if (
            itinerary.flag_inapproperiate == true ||
            itinerary.active == false
          )
            return null;
          return (
            <div key={itinerary._id} className="itinerary-card">
              <button
                className="btn-copy-link"
                onClick={() => navigator.clipboard.writeText(window.location.href)}
              >
                Copy Link
              </button>
              <h2>{itinerary.name}</h2>
              <p>
                <strong>Description:</strong> {itinerary.description}
              </p>
              <p>
                <strong>Tour Guide:</strong>{" "}
                {itinerary.tour_guide?.user
                  ? itinerary.tour_guide.user.username
                  : "N/A"}
              </p>
              <p>
                <strong>Language:</strong> {itinerary.language}
              </p>
              <p>
                <strong>Price:</strong>{" "}
                {currencyConversions.formatPrice(itinerary.price)}
              </p>
              <p>
                <strong>Start Date:</strong>{" "}
                {new Date(itinerary.start_date).toLocaleDateString()}
              </p>
              <p>
                <strong>Start Time:</strong> {itinerary.start_time}
              </p>
              <p>
                <strong>Accessibility:</strong>{" "}
                {itinerary.accessibility ? "Yes" : "No"}
              </p>
              <p>
                <strong>Active:</strong> {itinerary.active ? "Yes" : "No"}
              </p>
              {itinerary.pick_up && (
                <p>
                  <strong>Pick-up Location:</strong> Latitude:{" "}
                  {itinerary.pick_up.latitude}, Longitude:{" "}
                  {itinerary.pick_up.longitude}
                </p>
              )}
              {itinerary.drop_off && (
                <p>
                  <strong>Drop-off Location:</strong> Latitude:{" "}
                  {itinerary.drop_off.latitude}, Longitude:{" "}
                  {itinerary.drop_off.longitude}
                </p>
              )}
              <ActivitiesSection activities={itinerary.activities} />
              <div className="itinerary-actions">
                <button
                  id="bookItin"
                  className="itinerary-btn btn-book-itinerary"
                  onClick={() => handleBookItinerary(itinerary._id)}
                >
                  Book Itinerary
                </button>
                <button
                  className="itinerary-btn btn-feedback-itinerary"
                  onClick={() => handleFeedbackItinerary(itinerary)}
                >
                  Itinerary Feedback
                </button>
                <button
                  className="itinerary-btn btn-feedback-guide"
                  onClick={() => handleFeedbackTourGuide(itinerary)}
                >
                  Guide Feedback
                </button>
              </div>
            </div>
          );
        })}
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

export default ViewItineraryGuest;
