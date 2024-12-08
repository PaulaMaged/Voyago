import React, { useState, useEffect } from "react";
import currencyConversions from "../helpers/currencyConversions";
import axios from "axios";
import { FaSearch, FaEdit, FaTrash, FaSave, FaTimes, FaPlus, FaChevronDown, 
         FaClock, FaTag, FaDollarSign, FaCalendarAlt } from 'react-icons/fa';
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
  const [newActivity, setNewActivity] = useState({
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
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  const formVariants = {
    hidden: { 
      height: 0,
      opacity: 0
    },
    visible: { 
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
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
    setNewActivity((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Tag Selection
  const handleTagChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setNewActivity((prev) => ({
      ...prev,
      tags: selectedOptions,
    }));
  };

  // Handle Create Activity
  const handleCreateActivity = async () => {
    try {
      const advertiserId = localStorage.getItem("roleId");
      const activityData = {
        ...newActivity,
        advertiser: advertiserId,
      };

      activityData.price = currencyConversions.convertToDB(activityData.price);
      const response = await axios.post(
        "http://localhost:8000/api/advertiser/create-activity",
        activityData
      );

      setActivities([...activities, response.data]);
      setNewActivity({
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
      console.error("Error creating activity:", error);
    }
  };

  // Handle Edit Activity
  const handleEditActivity = (activity) => {
    setEditingActivity(activity);
    setNewActivity({
      ...activity,
      tags: activity.tags.map((tag) => tag._id),
    });
  };

  // Handle Update Activity
  const handleUpdateActivity = async () => {
    try {
      const activityData = { ...newActivity };

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
      setNewActivity({
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

        {/* Collapsible Create/Edit Form */}
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
                        value={newActivity.title}
                        onChange={handleInputChange}
                        placeholder="Enter activity title"
                        className="w-full px-4 py-2 rounded-md border border-[var(--border)]
                                 bg-[var(--background)] text-[var(--textPrimary)]
                                 focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent
                                 transition-all duration-200"
                      />
                    </FormField>

                    <FormField label="Start Date & Time" icon={FaCalendarAlt}>
                      <input
                        type="datetime-local"
                        name="start_time"
                        value={newActivity.start_time}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-md border border-[var(--border)]
                                 bg-[var(--background)] text-[var(--textPrimary)]
                                 focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent
                                 transition-all duration-200"
                      />
                    </FormField>

                    <FormField label="Duration (minutes)" icon={FaClock}>
                      <input
                        type="number"
                        name="duration"
                        value={newActivity.duration}
                        onChange={handleInputChange}
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
                        value={newActivity.price}
                        onChange={handleInputChange}
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
                        value={newActivity.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-md border border-[var(--border)]
                                 bg-[var(--background)] text-[var(--textPrimary)]
                                 focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent
                                 transition-all duration-200"
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.category}
                          </option>
                        ))}
                      </select>
                    </FormField>

                    <FormField label="Discount (%)" icon={FaTag}>
                      <input
                        type="number"
                        name="discount"
                        value={newActivity.discount}
                        onChange={handleInputChange}
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
                          value={newActivity.description}
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
                          value={newActivity.tags}
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
                            checked={newActivity.booking_open}
                            onChange={(e) => 
                              setNewActivity(prev => ({
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
                      onClick={() => {
                        editingActivity ? handleUpdateActivity() : handleCreateActivity();
                        setIsFormExpanded(false);
                      }}
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
                          setNewActivity({
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

        {/* Activities Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          layout
        >
          {filteredActivities.map((activity) => (
            <motion.div
              key={activity._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.02, y: -5 }}
              onHoverStart={() => setHoveredCard(activity._id)}
              onHoverEnd={() => setHoveredCard(null)}
              className="bg-[var(--foreground)] p-6 rounded-lg shadow-lg
                       transition-shadow duration-200 hover:shadow-xl"
            >
              <motion.h3 
                className="text-xl font-semibold mb-4 text-[var(--textPrimary)]"
                layout
              >
                {activity.title}
              </motion.h3>
              
              <motion.div 
                className="space-y-2 text-[var(--textSecondary)]"
                layout
              >
                <p className="flex items-center gap-2">
                  <FaCalendarAlt className="text-[var(--primary)]" />
                  {new Date(activity.start_time).toLocaleDateString()}
                </p>
                <p className="flex items-center gap-2">
                  <FaClock className="text-[var(--primary)]" />
                  {activity.duration} minutes
                </p>
                <p className="flex items-center gap-2 text-lg font-semibold text-[var(--primary)]">
                  <FaDollarSign />
                  {currencyConversions.formatPrice(activity.price)}
                </p>
                <p>
                  <span className="font-semibold">Category:</span>{" "}
                  {activity.category?.category}
                </p>
                <p>
                  <span className="font-semibold">Tags:</span>{" "}
                  {activity.tags.map((tag) => tag.tag_name).join(", ")}
                </p>
              </motion.div>
              
              <motion.div 
                className="flex gap-4 mt-6"
                layout
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEditActivity(activity)}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)]
                           hover:bg-[var(--primaryHover)] text-white rounded-md
                           transition-colors duration-200"
                >
                  <FaEdit /> Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDeleteActivity(activity._id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500
                           hover:bg-red-600 text-white rounded-md
                           transition-colors duration-200"
                >
                  <FaTrash /> Delete
                </motion.button>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
