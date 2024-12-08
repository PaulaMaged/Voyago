import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GovernorLandmarks = () => {
  const [landmarks, setLandmarks] = useState([]);
  const [filteredLandmarks, setFilteredLandmarks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLandmark, setEditingLandmark] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    types: '',
    opening_hours: '',
    image: '',
    location: {
      latitude: '',
      longitude: ''
    },
    tags: []
  });

  // Fetch landmarks from the API
  const fetchLandmarks = async () => {
    try {
      const governorId = localStorage.getItem('roleId');
      console.log('Fetching landmarks for governor:', governorId);
      
      const response = await axios.get(`http://localhost:8000/api/tourism-governor/get-tourgovernor-landmarks/${governorId}`);
      console.log('Fetched landmarks:', response.data);
      
      setLandmarks(response.data);
      setFilteredLandmarks(response.data);
    } catch (error) {
      console.error('Error fetching landmarks:', error);
    }
  };

  // Fetch tags
  const fetchTags = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/tourism-governor/get-all-tags');
      console.log('Fetched tags:', response.data);
      setAllTags(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  useEffect(() => {
    fetchLandmarks();
    fetchTags();
  }, []);

  useEffect(() => {
    console.log('Current landmarks:', landmarks);
    console.log('Current filtered landmarks:', filteredLandmarks);
  }, [landmarks, filteredLandmarks]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    console.log('Search term:', value);
    setSearchTerm(value);
    applyFilters(value, selectedTag);
  };

  const handleTagChange = (event) => {
    const value = event.target.value;
    console.log('Selected tag:', value);
    setSelectedTag(value);
    applyFilters(searchTerm, value);
  };

  const applyFilters = (term, tag) => {
    const filtered = landmarks.filter(landmark => {
      const searchTerm = term.toLowerCase();
      
      const nameMatches = landmark.name.toLowerCase().includes(searchTerm);
      
      const tagMatchesSearch = landmark.tags && landmark.tags.some(t => 
        t.tag_name && t.tag_name.toLowerCase().includes(searchTerm)
      );

      const matchesSelectedTag = !tag || (landmark.tags && landmark.tags.some(t => 
        t.tag_name && t.tag_name === tag
      ));

      return (nameMatches || tagMatchesSearch) && matchesSelectedTag;
    });

    console.log('Filtered landmarks:', filtered);
    setFilteredLandmarks(filtered);
  };

  const handleCreateLandmark = async () => {
    try {
      const governorId = localStorage.getItem('roleId');
      
      // First create the location
      const locationResponse = await axios.post('http://localhost:8000/api/tourism-governor/create-location', {
        latitude: parseFloat(formData.location.latitude),
        longitude: parseFloat(formData.location.longitude)
      });

      // Then create the landmark with the new location ID
      const landmarkData = {
        name: formData.name,
        description: formData.description,
        types: formData.types,
        opening_hours: parseInt(formData.opening_hours),
        image: formData.image,
        tour_governor: governorId,
        location: locationResponse.data._id,
        tags: formData.tags
      };

      await axios.post('http://localhost:8000/api/tourism-governor/create-landmark', landmarkData);
      await fetchLandmarks();
      setIsModalOpen(false);
      resetFormData();
    } catch (error) {
      console.error('Error creating landmark:', error);
      alert('Error creating landmark: ' + error.message);
    }
  };

  const handleUpdateLandmark = async () => {
    try {
      if (editingLandmark.location.latitude !== parseFloat(formData.location.latitude) || 
          editingLandmark.location.longitude !== parseFloat(formData.location.longitude)) {
        
        await axios.put(
          `http://localhost:8000/api/tourism-governor/update-location/${editingLandmark.location._id}`, 
          {
            latitude: parseFloat(formData.location.latitude),
            longitude: parseFloat(formData.location.longitude)
          }
        );
      }

      const updatedData = {
        name: formData.name,
        description: formData.description,
        types: formData.types,
        opening_hours: parseInt(formData.opening_hours),
        image: formData.image,
        tags: formData.tags
      };

      await axios.put(
        `http://localhost:8000/api/tourism-governor/update-landmark/${editingLandmark._id}`, 
        updatedData
      );
      
      await fetchLandmarks();
      setIsModalOpen(false);
      setEditingLandmark(null);
      resetFormData();
    } catch (error) {
      console.error('Error updating landmark:', error);
      alert('Error updating landmark: ' + error.message);
    }
  };
  const handleDeleteLandmark = async (landmarkId) => {
    if (window.confirm('Are you sure you want to delete this landmark?')) {
      try {
        await axios.delete(`http://localhost:8000/api/tourism-governor/delete/${landmarkId}`);
        await fetchLandmarks();
      } catch (error) {
        console.error('Error deleting landmark:', error);
        alert('Error deleting landmark: ' + error.message);
      }
    }
  };

  const openEditModal = (landmark) => {
    setEditingLandmark(landmark);
    setFormData({
      name: landmark.name,
      description: landmark.description,
      types: landmark.types,
      opening_hours: landmark.opening_hours,
      image: landmark.image,
      location: {
        latitude: landmark.location ? landmark.location.latitude : '',
        longitude: landmark.location ? landmark.location.longitude : ''
      },
      tags: landmark.tags ? landmark.tags.map(tag => tag._id) : []
    });
    setIsModalOpen(true);
  };

  const resetFormData = () => {
    setFormData({
      name: '',
      description: '',
      types: '',
      opening_hours: '',
      image: '',
      location: {
        latitude: '',
        longitude: ''
      },
      tags: []
    });
  };

  return (
    <div className="landmarks-viewer">
      <h1 className="text-3xl font-bold text-center mb-8">
        Landmarks Management
      </h1>

      <div className="filters">
        <div className="flex items-center gap-2 flex-1">
          <input
            type="text"
            placeholder="Search landmarks by Name or Tag..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="flex-1 p-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
          
          <select 
            value={selectedTag} 
            onChange={handleTagChange}
            className="min-w-[150px] p-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          >
            <option value="">All Tags</option>
            {allTags.map(tag => (
              <option key={tag._id} value={tag.tag_name}>{tag.tag_name}</option>
            ))}
          </select>

          <button 
            onClick={() => {
              setIsModalOpen(true);
              setEditingLandmark(null);
              resetFormData();
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            Add New Landmark
          </button>
        </div>
      </div>

      {/* Landmarks Grid */}
      <div className="landmarks-list">
        {filteredLandmarks.map(landmark => (
          <div key={landmark._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:-translate-y-2 transition-all duration-300 hover:shadow-xl">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">{landmark.name}</h2>
              
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
                  {landmark.tags && landmark.tags.length > 0 ? (
                    landmark.tags.map(tag => (
                      <span key={tag.tag_name} 
                        className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                        {tag.tag_name}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">No tags</span>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button 
                onClick={() => openEditModal(landmark)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Edit
              </button>
              <button 
                onClick={() => handleDeleteLandmark(landmark._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '8px',
            width: '500px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2>{editingLandmark ? 'Edit Landmark' : 'Create New Landmark'}</h2>
            
            <div style={{ marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', minHeight: '100px' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="Type"
                value={formData.types}
                onChange={(e) => setFormData({...formData, types: e.target.value})}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <input
                type="number"
                placeholder="Opening Hours"
                value={formData.opening_hours}
                onChange={(e) => setFormData({...formData, opening_hours: e.target.value})}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="Image URL"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <input
                type="number"
                step="any"
                placeholder="Latitude"
                value={formData.location.latitude}
                onChange={(e) => setFormData({
                  ...formData, 
                  location: {...formData.location, latitude: e.target.value}
                })}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <input
                type="number"
                step="any"
                placeholder="Longitude"
                value={formData.location.longitude}
                onChange={(e) => setFormData({
                  ...formData, 
                  location: {...formData.location, longitude: e.target.value}
                })}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <select
                multiple
                value={formData.tags}
                onChange={(e) => setFormData({
                  ...formData,
                  tags: Array.from(e.target.selectedOptions, option => option.value)
                })}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', minHeight: '100px' }}
              >
                {allTags.map(tag => (
                  <option key={tag._id} value={tag._id}>
                    {tag.tag_name}
                  </option>
                ))}
              </select>
              <small style={{ color: '#666' }}>Hold Ctrl/Cmd to select multiple tags</small>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingLandmark(null);
                  resetFormData();
                }}
                style={{ 
                  padding: '8px 16px',
                  backgroundColor: '#ccc',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={editingLandmark ? handleUpdateLandmark : handleCreateLandmark}
                style={{ 
                  padding: '8px 16px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {editingLandmark ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GovernorLandmarks;