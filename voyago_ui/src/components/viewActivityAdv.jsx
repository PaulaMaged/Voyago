import React, { useState, useEffect } from "react";
import currencyConversions from "../helpers/currencyConversions";
import axios from "axios";
import { FaSearch, FaEdit, FaTrash, FaSave, FaTimes, FaPlus, FaChevronDown, 
         FaClock, FaTag, FaDollarSign, FaCalendarAlt, FaLayerGroup, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function ViewActivityAdv() {
  const [searchTerm, setSearchTerm] = useState("");
  const [budget, setBudget] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [editingActivity, setEditingActivity] = useState(null);
  const [formInputs, setFormInputs] = useState({
    title: "",
    description: "",
    start_time: new Date().toISOString().slice(0, 16),
    duration: 30,
    price: 0,
    category: "",
    discount: 0,
    tags: [],
    booking_open: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isFormExpanded, setIsFormExpanded] = useState(false);

  const formVariants = {
    hidden: { 
      opacity: 0,
      y: -20,
      scale: 0.95
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const sectionVariants = {
    hidden: { 
      opacity: 0,
      x: -10
    },
    visible: { 
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  const FloatingLabel = ({ children, htmlFor }) => (
    <label
      htmlFor={htmlFor}
      className="absolute -top-3 left-2 px-2 text-sm bg-[var(--background)] text-[var(--primary)] 
                 transition-all duration-200 pointer-events-none"
    >
      {children}
    </label>
  );

  const FormField = ({ label, icon: Icon, children }) => (
    <div className="relative space-y-1">
      <label className="flex items-center gap-2 text-sm font-medium text-[var(--textSecondary)]">
        {Icon && <Icon className="text-[var(--primary)]" />}
        {label}
      </label>
      {children}
    </div>
  );

  // Fetching activities, categories, and tags
  useEffect(() => {
    let advid = localStorage.getItem("roleId");

    async function fetchActivities() {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/advertiser/get-advertiser-activities/${advid}`
        );
        setActivities(response.data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    }

    async function fetchCategories() {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/admin/get-all-activity-categories"
        );
        setCategories(response.data);
        if (response.data.length > 0) {
          setFormInputs(prev => ({
            ...prev,
            category: response.data[0]._id
          }));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    async function fetchTags() {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/tourism-governor/get-all-tags"
        );
        setTags(response.data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    }

    if (advid) {
      fetchActivities();
      fetchCategories();
      fetchTags();
    } else {
      console.error("Advertiser ID not found in localStorage");
    }
  }, []);

  // Filter and Sort Logic
  const filteredActivities = activities
    .filter((activity) => {
      const matchesSearch =
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (activity.category &&
          activity.category.category
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (activity.tags &&
          activity.tags.some((tag) =>
            tag.tag_name.toLowerCase().includes(searchTerm.toLowerCase())
          ));

      const withinBudget = budget
        ? currencyConversions.convertFromDB(activity.price) <=
          parseFloat(budget)
        : true;
      const matchesCategory = selectedCategory
        ? activity.category && activity.category._id === selectedCategory
        : true;
      const matchesDate = selectedDate
        ? new Date(activity.start_time).toLocaleDateString() ===
          new Date(selectedDate).toLocaleDateString()
        : true;

      return matchesSearch && withinBudget && matchesDate && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      return 0;
    });

  // Handle Form Inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInputs(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle Tag Selection
  const handleTagChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormInputs(prev => ({
      ...prev,
      tags: selectedOptions,
    }));
  };

  // Handle Create Activity
  const handleCreateActivity = async (activityData) => {
    try {
      // Validate required fields before sending
      const requiredFields = ['title', 'description', 'start_time', 'duration', 'price', 'category'];
      const missingFields = requiredFields.filter(field => !activityData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Format the data
      const formattedData = {
        ...activityData,
        price: Number(activityData.price),
        duration: Number(activityData.duration),
        discount: Number(activityData.discount),
        start_time: new Date(activityData.start_time).toISOString()
      };

      console.log('Sending formatted activity data:', formattedData);

      const response = await axios.post(
        'http://localhost:8000/api/advertiser/create-activity',
        formattedData,
        {
          headers: {
            'Content-Type': 'application/json',
            // Add auth token if required
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          // Add timeout
          timeout: 5000
        }
      );

      if (response.data) {
        console.log('Activity created successfully:', response.data);
        setActivities(prev => [...prev, response.data]);
        setFormInputs({
          title: "",
          description: "",
          start_time: "",
          duration: 30,
          price: 0,
          category: "",
          discount: 0,
          tags: [],
          booking_open: true,
        });
        setIsFormExpanded(false);
      }
    } catch (error) {
      // Detailed error logging
      console.error('Create Activity Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config,
      });

      // User-friendly error message
      const errorMessage = error.response?.data?.message 
        || error.message 
        || 'Failed to create activity. Please try again.';
      
      alert(`Error creating activity: ${errorMessage}`);
      
      // Re-throw for any error boundary handling
      throw error;
    }
  };

  // Handle Edit Activity
  const handleEditActivity = (activity) => {
    setEditingActivity(activity);
    setFormInputs({
      ...activity,
      tags: activity.tags.map((tag) => tag._id),
    });
  };

  // Handle Update Activity
  const handleUpdateActivity = async () => {
    try {
      const activityData = { ...formInputs };

      const response = await axios.put(
        `http://localhost:8000/api/advertiser/update-activity/${editingActivity._id}`,
        activityData
      );
      setActivities(
        activities.map((activity) =>
          activity._id === response.data._id ? response.data : activity
        )
      );
      setEditingActivity(null);
      setFormInputs({
        title: "",
        description: "",
        start_time: "",
        duration: 30,
        price: 0,
        category: "",
        discount: 0,
        tags: [],
        booking_open: true,
      });
    } catch (error) {
      console.error("Error updating activity:", error);
    }
  };

  // Handle Delete Activity
  const handleDeleteActivity = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/advertiser/delete-activity/${id}`
      );
      setActivities(activities.filter((activity) => activity._id !== id));
    } catch (error) {
      console.error("Error deleting activity:", error);
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const errors = {};
    const requiredFields = ['title', 'description', 'start_time', 'price', 'category'];
    
    requiredFields.forEach(field => {
      if (!formInputs[field]) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    if (formInputs.price <= 0) {
      errors.price = 'Price must be greater than 0';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Update the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      await handleCreateActivity(formInputs);
      // Clear form after successful submission
      setFormInputs({
        title: "",
        description: "",
        start_time: new Date().toISOString().slice(0, 16),
        duration: 30,
        price: 0,
        category: "",
        discount: 0,
        tags: [],
        booking_open: true,
      });
      setFormErrors({});
      setIsFormExpanded(false);
    } catch (error) {
      console.error('Form submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-[var(--background)]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <motion.h1 
          className="text-3xl font-bold mb-8 text-[var(--textPrimary)]"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Manage Activities
        </motion.h1>

        {/* Search and Filter Section */}
        <motion.div 
          className="bg-[var(--foreground)] p-6 rounded-lg shadow-lg mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative group">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 
                                 text-[var(--textSecondary)] group-hover:text-[var(--primary)]
                                 transition-colors duration-200" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-[var(--border)]
                         bg-[var(--background)] text-[var(--textPrimary)]
                         focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent
                         transition-all duration-200"
              />
            </div>
            
            <input
              type="number"
              placeholder="Max Budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--textPrimary)]"
            />
            
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--textPrimary)]"
            />
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--textPrimary)]"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.category}
                </option>
              ))}
            </select>
            
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--textPrimary)]"
            >
              <option value="">Sort by Price</option>
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>
          </div>
        </motion.div>

        {/* Updated Form Section */}
        <motion.div 
          className="bg-[var(--foreground)] rounded-lg shadow-lg mb-8 overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setIsFormExpanded(!isFormExpanded)}
            className="w-full px-6 py-4 flex items-center justify-between 
                     text-[var(--textPrimary)] hover:bg-[var(--background)] 
                     transition-colors duration-200"
          >
            <div className="flex items-center gap-2">
              <FaPlus className={`transition-transform ${isFormExpanded ? 'rotate-45' : ''}`} />
              <span className="text-xl font-semibold">
                {editingActivity ? "Edit Activity" : "Add New Activity"}
              </span>
            </div>
            <FaChevronDown className={`transition-transform ${isFormExpanded ? 'rotate-180' : ''}`} />
          </motion.button>
          
          <AnimatePresence>
            {isFormExpanded && (
              <motion.div
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <div className="p-6 border-t border-[var(--border)]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Activity Title" icon={FaTag}>
                      <input
                        type="text"
                        name="title"
                        value={formInputs.title}
                        onChange={handleInputChange}
                        placeholder="Enter activity title"
                        className={`w-full px-4 py-2 rounded-md border 
                                  ${formErrors.title ? 'border-red-500' : 'border-[var(--border)]'}
                                  bg-[var(--background)] text-[var(--textPrimary)]
                                  focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent
                                  transition-all duration-200`}
                      />
                      {formErrors.title && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
                      )}
                    </FormField>

                    <FormField label="Start Date & Time" icon={FaCalendarAlt}>
                      <input
                        type="datetime-local"
                        name="start_time"
                        value={formInputs.start_time}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-md border 
                                  ${formErrors.start_time ? 'border-red-500' : 'border-[var(--border)]'}
                                  bg-[var(--background)] text-[var(--textPrimary)]
                                  focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent
                                  transition-all duration-200`}
                      />
                      {formErrors.start_time && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.start_time}</p>
                      )}
                    </FormField>

                    <FormField label="Duration (minutes)" icon={FaClock}>
                      <input
                        type="number"
                        name="duration"
                        value={formInputs.duration}
                        onChange={(e) => setFormInputs(prev => ({
                          ...prev,
                          duration: e.target.value
                        }))}
                        placeholder="Enter duration in minutes"
                        min="0"
                        className="w-full px-4 py-2 rounded-md border border-[var(--border)]
                                 bg-[var(--background)] text-[var(--textPrimary)]
                                 focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent
                                 transition-all duration-200"
                      />
                    </FormField>

                    <FormField label="Price" icon={FaDollarSign}>
                      <input
                        type="number"
                        name="price"
                        value={formInputs.price}
                        onChange={(e) => setFormInputs(prev => ({
                          ...prev,
                          price: e.target.value
                        }))}
                        placeholder="Enter price"
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-2 rounded-md border border-[var(--border)]
                                 bg-[var(--background)] text-[var(--textPrimary)]
                                 focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent
                                 transition-all duration-200"
                      />
                    </FormField>

                    <FormField label="Category" icon={FaTag}>
                      <select
                        name="category"
                        value={formInputs.category}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-md border 
                                  ${formErrors.category ? 'border-red-500' : 'border-[var(--border)]'}
                                  bg-[var(--background)] text-[var(--textPrimary)]
                                  focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent
                                  transition-all duration-200`}
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.category}
                          </option>
                        ))}
                      </select>
                      {formErrors.category && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>
                      )}
                    </FormField>

                    <FormField label="Discount (%)" icon={FaTag}>
                      <input
                        type="number"
                        name="discount"
                        value={formInputs.discount}
                        onChange={(e) => setFormInputs(prev => ({
                          ...prev,
                          discount: e.target.value
                        }))}
                        placeholder="Enter discount percentage"
                        min="0"
                        max="100"
                        className="w-full px-4 py-2 rounded-md border border-[var(--border)]
                                 bg-[var(--background)] text-[var(--textPrimary)]
                                 focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent
                                 transition-all duration-200"
                      />
                    </FormField>

                    <div className="md:col-span-2">
                      <FormField label="Description" icon={FaEdit}>
                        <textarea
                          name="description"
                          value={formInputs.description}
                          onChange={handleInputChange}
                          placeholder="Enter activity description"
                          rows="4"
                          className="w-full px-4 py-2 rounded-md border border-[var(--border)]
                                   bg-[var(--background)] text-[var(--textPrimary)]
                                   focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent
                                   transition-all duration-200 resize-vertical"
                        />
                      </FormField>
                    </div>

                    <div className="md:col-span-2">
                      <FormField label="Tags" icon={FaTag}>
                        <select
                          multiple
                          name="tags"
                          value={formInputs.tags}
                          onChange={handleTagChange}
                          className="w-full px-4 py-2 rounded-md border border-[var(--border)]
                                   bg-[var(--background)] text-[var(--textPrimary)]
                                   focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent
                                   transition-all duration-200 min-h-[100px]"
                        >
                          {tags.map((tag) => (
                            <option key={tag._id} value={tag._id}>
                              {tag.tag_name}
                            </option>
                          ))}
                        </select>
                        <p className="mt-1 text-sm text-[var(--textSecondary)]">
                          Hold Ctrl (Cmd on Mac) to select multiple tags
                        </p>
                      </FormField>
                    </div>

                    <div className="md:col-span-2">
                      <FormField label="Booking Status" icon={FaCalendarAlt}>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="booking_open"
                            checked={formInputs.booking_open}
                            onChange={(e) => 
                              setFormInputs(prev => ({
                                ...prev,
                                booking_open: e.target.checked
                              }))
                            }
                            className="w-4 h-4 text-[var(--primary)] border-[var(--border)]
                                     rounded focus:ring-[var(--primary)]"
                          />
                          <span className="text-[var(--textSecondary)]">
                            Open for booking
                          </span>
                        </div>
                      </FormField>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSubmit}
                      className="flex items-center gap-2 px-6 py-2 bg-[var(--primary)]
                               hover:bg-[var(--primaryHover)] text-white rounded-md
                               transition-colors duration-200"
                    >
                      {editingActivity ? <><FaSave /> Update</> : <><FaPlus /> Create</>}
                    </motion.button>
                    {editingActivity && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setEditingActivity(null);
                          setFormInputs({
                            title: "",
                            description: "",
                            start_time: "",
                            duration: 30,
                            price: 0,
                            category: "",
                            discount: 0,
                            tags: [],
                            booking_open: true,
                          });
                          setIsFormExpanded(false);
                        }}
                        className="flex items-center gap-2 px-6 py-2 bg-[var(--secondary)]
                                 hover:bg-[var(--secondaryHover)] text-[var(--textPrimary)]
                                 rounded-md transition-colors duration-200"
                      >
                        <FaTimes /> Cancel
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Activities Grid - New Styled Version */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8"
          layout
        >
          {filteredActivities.map((activity) => (
            <motion.div
              key={activity._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.2 }
              }}
              className="relative bg-gradient-to-br from-[var(--surface)] to-[var(--background)]
                         rounded-2xl overflow-hidden shadow-lg border border-[var(--border)]
                         transition-all duration-300 hover:shadow-2xl"
            >
              {/* Activity Status Badge */}
              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium
                            ${activity.booking_open 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'}`}
              >
                {activity.booking_open ? 'Booking Open' : 'Closed'}
              </div>

              {/* Main Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-[var(--textPrimary)] line-clamp-2">
                    {activity.title}
                  </h3>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-[var(--textSecondary)]">
                    <FaCalendarAlt className="text-[var(--primary)]" />
                    <span>{new Date(activity.start_time).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--textSecondary)]">
                    <FaClock className="text-[var(--primary)]" />
                    <span>{activity.duration} mins</span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--textSecondary)]">
                    <FaLayerGroup className="text-[var(--primary)]" />
                    <span>{activity.category?.category || 'Uncategorized'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--primary)] font-semibold">
                    <FaDollarSign />
                    <span>{currencyConversions.formatPrice(activity.price)}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[var(--textSecondary)] mb-6 line-clamp-3">
                  {activity.description}
                </p>

                {/* Tags */}
                {activity.tags && activity.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {activity.tags.map(tag => (
                      <span 
                        key={tag._id}
                        className="px-3 py-1 text-sm rounded-full bg-[var(--surface)]
                                 text-[var(--textSecondary)] border border-[var(--border)]"
                      >
                        {tag.tag_name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 mt-auto">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleEditActivity(activity)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5
                             bg-[var(--primary)] hover:bg-[var(--primaryHover)]
                             text-white rounded-lg transition-colors duration-200"
                  >
                    <FaEdit className="text-sm" />
                    <span>Edit</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDeleteActivity(activity._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5
                             bg-red-500 hover:bg-red-600 text-white rounded-lg
                             transition-colors duration-200"
                  >
                    <FaTrash className="text-sm" />
                    <span>Delete</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
