import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMapMarkerAlt, FaHistory, FaInfoCircle, FaSearch, FaFilter, FaClock } from 'react-icons/fa';
import './viewLandmarks.css';

const ViewLandmarks = () => {
  const [landmarks, setLandmarks] = useState([]);
  const [filteredLandmarks, setFilteredLandmarks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');

  // Fetch landmarks from the API
  const fetchLandmarks = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/tourism-governor/get-all-landmarks');
      setLandmarks(response.data);
      setFilteredLandmarks(response.data);

      // Extract all unique tags from the landmarks
      const tags = [...new Set(response.data.flatMap(landmark => landmark.tags.map(tag => tag.tag_name)))];
      setAllTags(tags);
    } catch (error) {
      console.error('Error fetching landmarks:', error);
    }
  };

  useEffect(() => {
    fetchLandmarks();
  }, []);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    applyFilters(value, selectedTag);
  };

  const handleTagChange = (event) => {
    const value = event.target.value;
    setSelectedTag(value);
    applyFilters(searchTerm, value);
  };

  const applyFilters = (term, tag) => {
    const filtered = landmarks.filter(landmark => {
      const matchesName = landmark.name.toLowerCase().includes(term.toLowerCase());
      const matchesSearchTag = landmark.tags.some(t => t.tag_name.toLowerCase().includes(term.toLowerCase()));
      const matchesDropdownTag = !tag || landmark.tags.some(t => t.tag_name === tag);
      return (matchesName || matchesSearchTag) && matchesDropdownTag;
    });
    setFilteredLandmarks(filtered);
  };

  return (
    <div className="landmarks-viewer">
      <h1 className="text-3xl font-bold text-center mb-8">
        Historical Places and Museums
      </h1>

      <div className="filters">
        <div className="flex items-center gap-2 flex-1">
          <FaSearch className="text-[var(--textSecondary)]" />
          <input
            type="text"
            placeholder="Search by name or tag..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="flex-1"
          />
        </div>

        <div className="flex items-center gap-2">
          <FaFilter className="text-[var(--textSecondary)]" />
          <select 
            value={selectedTag} 
            onChange={handleTagChange}
            className="min-w-[150px]"
          >
            <option value="">All Tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="landmarks-list">
        {filteredLandmarks.length > 0 ? (
          filteredLandmarks.map(landmark => (
            <div key={landmark._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:-translate-y-2 transition-all duration-300 hover:shadow-xl">


              <div className="p-6">
                <h2 className="text-xl font-bold mb-2 text-gray-800">{landmark.name}</h2>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {landmark.description}
                </p>

                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Type:</span> {landmark.types}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Location:</span> {landmark.location.latitude}, {landmark.location.longitude}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Opening Hours:</span> {landmark.opening_hours <= 12 ? 
                      `${landmark.opening_hours} AM` : 
                      `${landmark.opening_hours - 12} PM`}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-700">Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {landmark.tags.map(tag => (
                      <span key={tag.tag_name} 
                        className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                        {tag.tag_name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-[var(--textSecondary)]">
            No landmarks found with selected filters.
          </p>
        )}
      </div>
    </div>
  );
};

export default ViewLandmarks;
