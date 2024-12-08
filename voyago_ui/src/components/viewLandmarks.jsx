import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    <div>
      <h1>Historical Places and Museums</h1>
      <hr />

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by name or tag..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginRight: '10px', padding: '5px' }}
      />

      {/* Tag Filter Dropdown */}
      <select value={selectedTag} onChange={handleTagChange} style={{ padding: '5px' }}>
        <option value="">All Tags</option>
        {allTags.map(tag => (
          <option key={tag} value={tag}>{tag}</option>
        ))}
      </select>

      {/* Landmarks Display */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px' }}>
        {filteredLandmarks.length > 0 ? (
          filteredLandmarks.map(landmark => (
            <div key={landmark._id} style={{ border: '1px solid lightgray', padding: '20px' }}>
              <h2>{landmark.name}</h2>
              <p><strong>Description:</strong> {landmark.description}</p>
              <p><strong>Type:</strong> {landmark.types}</p>
              <p><strong>Location Latitude:</strong> {landmark.location.latitude}</p>
              <p><strong>Location Longitude:</strong> {landmark.location.longitude}</p>
              <p><strong>Opening Hours:</strong> {landmark.opening_hours} hours</p>
              <p><strong>Tags:</strong> {landmark.tags.map(tag => tag.tag_name).join(', ')}</p>
              
              {/* Single image display */}
              <div style={{ display: 'flex', gap: '10px' }}>
                {landmark.image && (
                  <img 
                    src={landmark.image} 
                    alt={`${landmark.name} image`} 
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
                  />
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No landmarks found with selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default ViewLandmarks;
