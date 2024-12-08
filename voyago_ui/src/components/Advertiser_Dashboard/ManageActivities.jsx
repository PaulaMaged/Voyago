import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import './ManageActivities.css';

export default function ManageActivities() {
  const [activities, setActivities] = useState([]);
  const [editingActivity, setEditingActivity] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
    fetchCategories();
    fetchTags();
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

  const handleEdit = (activity) => {
    setEditingActivity({
      ...activity,
      start_time: new Date(activity.start_time).toISOString().slice(0, 16),
      tags: activity.tags.map(tag => tag._id)
    });
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/advertiser/update-activity/${editingActivity._id}`,
        editingActivity
      );
      setActivities(activities.map(activity => 
        activity._id === response.data._id ? response.data : activity
      ));
      setEditingActivity(null);
      alert('Activity updated successfully!');
    } catch (error) {
      console.error('Error updating activity:', error);
      alert(error.response?.data?.message || 'Error updating activity');
    }
  };

  const handleDelete = async (activityId) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8000/api/advertiser/delete-activity/${activityId}`
      );
      setActivities(activities.filter(activity => activity._id !== activityId));
      alert('Activity deleted successfully!');
    } catch (error) {
      console.error('Error deleting activity:', error);
      alert(error.response?.data?.message || 'Error deleting activity');
    }
  };

  if (loading) {
    return <div>Loading activities...</div>;
  }

  return (
    <div className="manage-activities">
      <div className="activities-grid">
        {activities.map(activity => (
          <div key={activity._id} className="activity-card">
            {editingActivity?._id === activity._id ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editingActivity.title}
                  onChange={e => setEditingActivity({
                    ...editingActivity,
                    title: e.target.value
                  })}
                  placeholder="Activity Title"
                />
                <textarea
                  value={editingActivity.description}
                  onChange={e => setEditingActivity({
                    ...editingActivity,
                    description: e.target.value
                  })}
                  placeholder="Description"
                />
                <input
                  type="datetime-local"
                  value={editingActivity.start_time}
                  onChange={e => setEditingActivity({
                    ...editingActivity,
                    start_time: e.target.value
                  })}
                />
                <input
                  type="number"
                  value={editingActivity.duration}
                  onChange={e => setEditingActivity({
                    ...editingActivity,
                    duration: parseInt(e.target.value)
                  })}
                  placeholder="Duration (minutes)"
                />
                <input
                  type="number"
                  value={editingActivity.price}
                  onChange={e => setEditingActivity({
                    ...editingActivity,
                    price: parseFloat(e.target.value)
                  })}
                  placeholder="Price"
                />
                <select
                  value={editingActivity.category}
                  onChange={e => setEditingActivity({
                    ...editingActivity,
                    category: e.target.value
                  })}
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.category}
                    </option>
                  ))}
                </select>
                <select
                  multiple
                  value={editingActivity.tags}
                  onChange={e => setEditingActivity({
                    ...editingActivity,
                    tags: Array.from(e.target.selectedOptions, option => option.value)
                  })}
                >
                  {tags.map(tag => (
                    <option key={tag._id} value={tag._id}>
                      {tag.tag_name}
                    </option>
                  ))}
                </select>
                <div className="edit-actions">
                  <button onClick={handleUpdate} className="btn-save">
                    <FaCheck /> Save
                  </button>
                  <button onClick={() => setEditingActivity(null)} className="btn-cancel">
                    <FaTimes /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3>{activity.title}</h3>
                <p>{activity.description}</p>
                <div className="activity-details">
                  <p>
                    <strong>Date:</strong>{' '}
                    {new Date(activity.start_time).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Time:</strong>{' '}
                    {new Date(activity.start_time).toLocaleTimeString()}
                  </p>
                  <p>
                    <strong>Duration:</strong> {activity.duration} minutes
                  </p>
                  <p>
                    <strong>Price:</strong> ${activity.price}
                  </p>
                </div>
                <div className="activity-actions">
                  <button onClick={() => handleEdit(activity)} className="btn-edit">
                    <FaEdit /> Edit
                  </button>
                  <button onClick={() => handleDelete(activity._id)} className="btn-delete">
                    <FaTrash /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 