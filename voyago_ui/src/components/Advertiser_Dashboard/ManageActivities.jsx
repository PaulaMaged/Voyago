import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaCheck, FaTimes, FaPlus, 
         FaClock, FaTag, FaDollarSign, FaCalendarAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import './ManageActivities.css';

const ManageActivities = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [editingActivity, setEditingActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [locations, setLocations] = useState([]);

  const [formInputs, setFormInputs] = useState({
    title: '',
    description: '',
    start_time: new Date().toISOString().slice(0, 16),
    end_time: new Date().toISOString().slice(0, 16),
    price: '0',
    location: '',
  });

  useEffect(() => {
    fetchActivities();
    fetchCategories();
    fetchTags();
    fetchLocations();
  }, []);

  const fetchActivities = async () => {
    try {
      const advertiserId = localStorage.getItem('roleId');
      const response = await axios.get(
        `http://localhost:8000/api/advertiser/get-advertiser-activities/${advertiserId}`
      );
      setActivities(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8000/api/admin/get-all-activity-categories'
      );
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8000/api/tourism-governor/get-all-tags'
      );
      setTags(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/locations');
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const resetForm = () => {
    setFormInputs({
      title: '',
      description: '',
      start_time: new Date().toISOString().slice(0, 16),
      end_time: new Date().toISOString().slice(0, 16),
      price: '0',
      location: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const advertiserId = localStorage.getItem('roleId');

    try {
      const formattedData = {
        ...formInputs,
        price: Number(formInputs.price),
        advertiser: advertiserId
      };

      if (editingActivity) {
        await axios.put(
          `http://localhost:8000/api/advertiser/update-activity/${editingActivity._id}`,
          formattedData
        );
      } else {
        await axios.post(
          'http://localhost:8000/api/advertiser/create-activity',
          formattedData
        );
      }
      
      fetchActivities();
      setEditingActivity(null);
      setIsFormVisible(false);
      resetForm();
      
    } catch (error) {
      console.error('Error saving activity:', error);
      alert(error.response?.data?.message || 'Error saving activity');
    }
  };

  const handleEdit = (activity) => {
    setEditingActivity(activity);
    setFormInputs({
      ...activity,
      start_time: new Date(activity.start_time).toISOString().slice(0, 16),
      end_time: new Date(activity.end_time).toISOString().slice(0, 16),
      location: activity.location?._id || '',
    });
    setIsFormVisible(true);
  };

  const handleDelete = async (activityId) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;

    try {
      await axios.delete(
        `http://localhost:8000/api/advertiser/delete-activity/${activityId}`
      );
      setActivities(activities.filter(activity => activity._id !== activityId));
    } catch (error) {
      console.error('Error deleting activity:', error);
      alert(error.response?.data?.message || 'Error deleting activity');
    }
  };

  const filteredActivities = activities.filter(activity =>
    activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading activities...</div>;
  }

  return (
    <div className="manage-activities-container">
      <div className="header">
        <div className="header-left">
          <h1>Manage Activities</h1>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-add"
            onClick={() => {
              setIsFormVisible(true);
              resetForm();
            }}
          >
            <FaPlus /> Add Activity
          </motion.button>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Activity Form Modal */}
      {isFormVisible && (
        <motion.div 
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="modal-content"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div className="modal-header">
              <h2>{editingActivity ? 'Edit Activity' : 'Add New Activity'}</h2>
              <button 
                className="btn-close"
                onClick={() => {
                  setIsFormVisible(false);
                  setEditingActivity(null);
                  resetForm();
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="activity-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={formInputs.title}
                    onChange={(e) => setFormInputs({...formInputs, title: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formInputs.description}
                    onChange={(e) => setFormInputs({...formInputs, description: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaCalendarAlt /> Start Time
                  </label>
                  <input
                    type="datetime-local"
                    value={formInputs.start_time}
                    onChange={(e) => setFormInputs({...formInputs, start_time: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaCalendarAlt /> End Time
                  </label>
                  <input
                    type="datetime-local"
                    value={formInputs.end_time}
                    onChange={(e) => setFormInputs({...formInputs, end_time: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaDollarSign /> Price
                  </label>
                  <input
                    type="number"
                    value={formInputs.price || '0'}
                    onChange={(e) => setFormInputs({
                      ...formInputs,
                      price: e.target.value === '' ? '0' : e.target.value
                    })}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <select
                    value={formInputs.location}
                    onChange={(e) => setFormInputs({...formInputs, location: e.target.value})}
                    required
                  >
                    <option value="">Select Location</option>
                    {locations.map(location => (
                      <option key={location._id} value={location._id}>
                        {`${location.latitude}, ${location.longitude}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="btn-submit"
                >
                  {editingActivity ? <><FaCheck /> Update Activity</> : <><FaPlus /> Create Activity</>}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setIsFormVisible(false);
                    setEditingActivity(null);
                    resetForm();
                  }}
                >
                  <FaTimes /> Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      <div className="activities-grid">
        <AnimatePresence>
          {filteredActivities.map((activity) => (
            <motion.div
              key={activity._id}
              className="activity-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              layout
            >
              <h3>{activity.title}</h3>
              <p className="description">{activity.description}</p>
              
              <div className="activity-details">
                <div className="detail">
                  <FaCalendarAlt />
                  <span>{new Date(activity.start_time).toLocaleDateString()}</span>
                </div>
                <div className="detail">
                  <FaClock />
                  <span>{activity.duration} minutes</span>
                </div>
                <div className="detail">
                  <FaDollarSign />
                  <span>${activity.price}</span>
                </div>
              </div>

              <div className="tags">
                {activity.tags.map(tag => (
                  <span key={tag._id} className="tag">
                    {tag.tag_name}
                  </span>
                ))}
              </div>

              <div className="card-actions">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-edit"
                  onClick={() => handleEdit(activity)}
                >
                  <FaEdit /> Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-delete"
                  onClick={() => handleDelete(activity._id)}
                >
                  <FaTrash /> Delete
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ManageActivities; 