import React, { useState, useEffect } from 'react';
import axios from 'axios';
import currencyConversions from "../helpers/currencyConversions";
import { FaPlus, FaSpinner } from 'react-icons/fa';

const CreateItineraryForm = ({ initialData, onSuccess, onCancel }) => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    language: '',
    price: '',
    start_date: '',
    start_time: '',
    accessibility: false,
    active: true,
    activities: []
  });

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        language: initialData.language,
        price: currencyConversions.convertFromDB(initialData.price),
        start_date: new Date(initialData.start_date).toISOString().split('T')[0],
        start_time: initialData.start_time,
        accessibility: initialData.accessibility,
        active: initialData.active,
        activities: initialData.activities.map(activity => activity._id)
      });
    }
  }, [initialData]);

  const fetchActivities = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/advertiser/get-all-activities"
      );
      setActivities(response.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
      setError("Failed to fetch activities");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleActivitySelection = (e) => {
    const selectedActivityIds = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData(prev => ({
      ...prev,
      activities: selectedActivityIds
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const tourGuideId = localStorage.getItem("roleId");
      
      // Validate required fields
      if (!formData.name || !formData.description || !formData.language || 
          !formData.price || !formData.start_date || !formData.start_time) {
        throw new Error("Please fill in all required fields");
      }

      const submitData = {
        ...formData,
        tour_guide: tourGuideId,
        price: currencyConversions.convertToDB(parseFloat(formData.price)),
        start_date: new Date(formData.start_date).toISOString(),
        activities: Array.isArray(formData.activities) ? formData.activities : [],
        active: true, // Ensure the itinerary is active by default
        accessibility: formData.accessibility || false
      };

      if (onSuccess) {
        await onSuccess(submitData);
      }
    } catch (error) {
      console.error("Error submitting itinerary:", error);
      setError(error.message || "Failed to submit itinerary. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-itinerary-form bg-[var(--surface)] p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-[var(--textPrimary)]">
        {initialData ? 'Edit Itinerary' : 'Create New Itinerary'}
      </h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[var(--textPrimary)] mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-[var(--textPrimary)] mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-[var(--textPrimary)] mb-2">Language</label>
          <input
            type="text"
            name="language"
            value={formData.language}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-[var(--textPrimary)] mb-2">Price ({localStorage.getItem("currency") || "USD"})</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
            min="0"
            step="0.01"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-[var(--textPrimary)] mb-2">Start Date</label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-[var(--textPrimary)] mb-2">Start Time</label>
          <input
            type="time"
            name="start_time"
            value={formData.start_time}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-[var(--textPrimary)] mb-2">Activities</label>
          <select
            multiple
            name="activities"
            value={formData.activities}
            onChange={handleActivitySelection}
            className="w-full p-2 border rounded"
          >
            {activities.map((activity) => (
              <option key={activity._id} value={activity._id}>
                {activity.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="accessibility"
            checked={formData.accessibility}
            onChange={handleInputChange}
            className="rounded"
          />
          <label className="text-[var(--textPrimary)]">Wheelchair Accessible</label>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-[var(--primary)] text-white py-2 px-4 rounded hover:bg-[var(--primaryDark)] transition-colors"
          >
            {isLoading ? (
              <FaSpinner className="animate-spin mx-auto" />
            ) : (
              <span className="flex items-center justify-center gap-2">
                <FaPlus /> {initialData ? 'Update' : 'Create'} Itinerary
              </span>
            )}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateItineraryForm; 