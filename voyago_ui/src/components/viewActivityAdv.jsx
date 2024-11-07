import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ViewActivityAdv = () => {
  const { advertiserId } = useParams(); // Retrieve advertiser ID from the URL
  const [activities, setActivities] = useState([]);
  const [activityData, setActivityData] = useState({
    title: '',
    description: '',
    start_time: '',
    duration: 30,
    price: '',
    category: '',
    tags: [], // To manage tags, you might want to allow multiple tag selections
    discount: '',
    booking_open: true,
  });

  const fetchActivities = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/advertiser/get-advertiser-activities/${advertiserId}`);
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  useEffect(() => {
    if (advertiserId) fetchActivities();
  }, [advertiserId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setActivityData({
      ...activityData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleTagChange = (e) => {
    const { value } = e.target;
    setActivityData((prevData) => ({
      ...prevData,
      tags: value.split(',').map(tag => tag.trim()), // Split input into an array of tags
    }));
  };

  const createActivity = async () => {
    try {
      const response = await axios.post(`http://localhost:8000/api/advertiser/create-activity`, activityData);
      setActivities([...activities, response.data]);
      setActivityData({
        title: '',
        description: '',
        start_time: '',
        duration: 30,
        price: '',
        category: '',
        tags: [], // Reset tags
        discount: 0,
        booking_open: true,
      });
      await fetchActivities();
    } catch (error) {
      console.error('Error creating activity:', error);
    }
  };

  const updateActivity = async (id) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/advertiser/update-activity/${id}`, activityData);
      setActivities(activities.map((activity) => (activity._id === id ? response.data : activity)));
      await fetchActivities();
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  };

  const deleteActivity = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/advertiser/delete-activity/${id}`);
      setActivities(activities.filter((activity) => activity._id !== id));
      await fetchActivities();
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  return (
    <div>
      <h1>Activity Manager</h1>
      <form>
        <input
          type="text"
          name="title"
          value={activityData.title}
          onChange={handleChange}
          placeholder="Title"
          style={{ marginLeft: '10px' }}
        />
        <input
          type="text"
          name="description"
          value={activityData.description}
          onChange={handleChange}
          placeholder="Description"
          style={{ marginLeft: '10px' }}
        />
        <input
          type="datetime-local"
          name="start_time"
          value={activityData.start_time}
          onChange={handleChange}
          style={{ marginLeft: '10px' }}
        />
        <input
          type="number"
          name="duration"
          value={activityData.duration}
          onChange={handleChange}
          placeholder="Duration (minutes)"
          style={{ marginLeft: '10px' }}
        />
        <input
          type="number"
          name="price"
          value={activityData.price}
          onChange={handleChange}
          placeholder="Price"
          style={{ marginLeft: '10px' }}
        />
        <input
          type="text"
          name="category"
          value={activityData.category}
          onChange={handleChange}
          placeholder="Category"
          style={{ marginLeft: '10px' }}
        />
        <input
          type="text"
          name="tags"
          value={activityData.tags.join(', ')} // Allow user to input multiple tags
          onChange={handleTagChange}
          placeholder="Tags (comma separated)"
          style={{ marginLeft: '10px' }}
        />
        <input
          type="number"
          name="discount"
          value={activityData.discount}
          onChange={handleChange}
          placeholder="Discount (%)"
          style={{ marginLeft: '10px' }}
        />
        <label style={{ marginLeft: '10px' }}>
          Booking Open:
          <input
            type="checkbox"
            name="booking_open"
            checked={activityData.booking_open}
            onChange={handleChange}
          />
        </label>
        <button type="button" onClick={createActivity} style={{ marginLeft: '10px' }}>Create Activity</button>
      </form>

      <div>
        <h1>Activity List</h1>
        <hr />
        {activities.map((activity) => (
          <div key={activity._id} style={{ border: '1px solid lightgray', margin: '5px 0', padding: '7px' }}>
            <p>Title: {activity.title}</p>
            <p>Description: {activity.description}</p>
            <p>Start Time: {new Date(activity.start_time).toLocaleString()}</p>
            <p>Duration: {activity.duration} minutes</p>
            <p>Price: ${activity.price}</p>
            <p>Category: {activity.category}</p>
            <p>Discount: {activity.discount}%</p>
            <p>Booking Open: {activity.booking_open ? 'Yes' : 'No'}</p>
            {activity.advertiser && (
              <div>
                <p>Company: {activity.advertiser.company_name}</p>
                <p>Hotline: {activity.advertiser.contact_info}</p>
              </div>
            )}
            {activity.tags && activity.tags.length > 0 && (
              <div>
                <p>Tags:</p>
                <ul>
                  {activity.tags.map((tag) => (
                    <li key={tag._id}>{tag.tag_name}</li> // Ensure tag object structure matches your schema
                  ))}
                </ul>
              </div>
            )}
            <button onClick={() => updateActivity(activity._id)}>Update</button>
            <button onClick={() => deleteActivity(activity._id)} style={{ marginLeft: '10px' }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewActivityAdv;
