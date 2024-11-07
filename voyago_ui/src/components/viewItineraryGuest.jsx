import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './viewItinerary.css';

const ViewItineraryGuest = () => {
  const [itineraries, setItineraries] = useState([]);
  const [filteredItineraries, setFilteredItineraries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [sortCriteria, setSortCriteria] = useState('');

  useEffect(() => {
    fetchItineraries();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedTag, selectedCategory, selectedLanguage, minPrice, maxPrice, selectedDate, sortCriteria, itineraries]);

  const fetchItineraries = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/tour-guide/get-all-itineraries');
      setItineraries(response.data);
      setFilteredItineraries(response.data);
    } catch (error) {
      console.error('Error fetching itineraries:', error);
    }
  };

  const applyFilters = () => {
    let filtered = itineraries.filter(itinerary => {
      const matchesSearch = itinerary.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = !selectedTag || itinerary.activities.some(activity => 
        activity.tags.some(tag => tag._id === selectedTag)
      );
      const matchesCategory = !selectedCategory || itinerary.activities.some(activity => 
        activity.category === selectedCategory
      );
      const matchesLanguage = !selectedLanguage || itinerary.language === selectedLanguage;
      const matchesPrice = (!minPrice || itinerary.price >= parseFloat(minPrice)) &&
                           (!maxPrice || itinerary.price <= parseFloat(maxPrice));
      const matchesDate = !selectedDate || new Date(itinerary.start_date).toISOString().split('T')[0] === selectedDate;

      return matchesSearch && matchesTag && matchesCategory && matchesLanguage && matchesPrice && matchesDate;
    });

    if (sortCriteria === 'price_asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortCriteria === 'price_desc') {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredItineraries(filtered);
  };

  const getAllTags = () => {
    const tagSet = new Set();
    itineraries.forEach(itinerary => {
      itinerary.activities.forEach(activity => {
        activity.tags.forEach(tag => tagSet.add(JSON.stringify(tag)));
      });
    });
    return Array.from(tagSet).map(tag => JSON.parse(tag));
  };

  const getAllCategories = () => {
    const categorySet = new Set();
    itineraries.forEach(itinerary => {
      itinerary.activities.forEach(activity => {
        categorySet.add(activity.category);
      });
    });
    return Array.from(categorySet);
  };

  const getAllLanguages = () => {
    return Array.from(new Set(itineraries.map(itinerary => itinerary.language)));
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

        <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)} className="filter-select">
          <option value="">All Tags</option>
          {getAllTags().map((tag) => (
            <option key={tag._id} value={tag._id}>{tag.tag_name}</option>
          ))}
        </select>

        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="filter-select">
          <option value="">All Categories</option>
          {getAllCategories().map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} className="filter-select">
          <option value="">All Languages</option>
          {getAllLanguages().map((language) => (
            <option key={language} value={language}>{language}</option>
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

        <select value={sortCriteria} onChange={(e) => setSortCriteria(e.target.value)} className="filter-select">
          <option value="">Sort By</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      <div className="itinerary-list">
        {filteredItineraries.map((itinerary) => {
          return (
            <div key={itinerary._id} className="itinerary-card">
              <h2>{itinerary.name}</h2>
              <p><strong>Description:</strong> {itinerary.description}</p>
              <p><strong>Tour Guide:</strong> {itinerary.tour_guide.user.username}</p>
              <p><strong>Language:</strong> {itinerary.language}</p>
              <p><strong>Price:</strong> ${itinerary.price}</p>
              <p><strong>Start Date:</strong> {new Date(itinerary.start_date).toLocaleDateString()}</p>
              <p><strong>Start Time:</strong> {itinerary.start_time}</p>
              <p><strong>Accessibility:</strong> {itinerary.accessibility ? 'Yes' : 'No'}</p>
              <p><strong>Active:</strong> {itinerary.active ? 'Yes' : 'No'}</p>
              <p><strong>Pick-up Location:</strong> {itinerary.pick_up ? itinerary.pick_up.name : 'Not specified'}</p>
              <p><strong>Drop-off Location:</strong> {itinerary.drop_off ? itinerary.drop_off.name : 'Not specified'}</p>
              <ActivitiesSection activities={itinerary.activities} />
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

  if (activities.length === 0) {
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
        <span>{currentActivityIndex + 1} / {activities.length}</span>
        <button
          onClick={nextActivity}
          disabled={currentActivityIndex === activities.length - 1}
          className="nav-button"
        >
          Next &gt;
        </button>
      </div>
      <div className="activity-item">
        <p><strong>Title:</strong> {currentActivity.title}</p>
        <p><strong>Category:</strong> {currentActivity.category}</p>
        <p><strong>Duration:</strong> {currentActivity.duration} minutes</p>
        {currentActivity.tags.length > 0 && (
          <div>
            <strong>Tags:</strong>
            <ul className="tags-list">
              {currentActivity.tags.map(tag => (
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