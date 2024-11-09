import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './manageActCategories.css'; // Import the CSS file

export default function ManageActCategories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/get-all-activity-categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Create a new category
  const handleCreateCategory = async () => {
    if (!newCategory) return;
    try {
      await axios.post('http://localhost:8000/api/admin/create-activity-category', { category: newCategory });
      setNewCategory('');
      fetchCategories(); // Refresh the list
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  // Update a category
  const handleUpdateCategory = async () => {
    if (!editCategoryName) return;
    try {
      await axios.put(`http://localhost:8000/api/admin/update-activity-category/${editCategoryId}`, {
        category: editCategoryName,
      });
      setEditCategoryId(null);
      setEditCategoryName('');
      fetchCategories(); // Refresh the list
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  // Delete a category
  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/admin/delete-activity-category/${id}`);
      fetchCategories(); // Refresh the list
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div className="activity-categories-container">
      <h1 className="activity-categories-title">Manage Activity Categories</h1>

      <div className="activity-categories-form">
        <input
          type="text"
          placeholder="New category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="activity-categories-input"
        />
        <button onClick={handleCreateCategory} className="activity-categories-button">
          Add Category
        </button>
      </div>

      <div className="activity-categories-list">
        {categories.map((category) => (
          <div key={category._id} className="activity-categories-item">
            {editCategoryId === category._id ? (
              <>
                <input
                  type="text"
                  value={editCategoryName}
                  onChange={(e) => setEditCategoryName(e.target.value)}
                  className="activity-categories-input"
                />
                <button onClick={handleUpdateCategory} className="activity-categories-button" style={{marginRight: '10px' }}>
                  Save
                </button>
                <button onClick={() => setEditCategoryId(null)} className="activity-categories-button">
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="activity-categories-text">{category.category}</span>
                <button
                  onClick={() => {
                    setEditCategoryId(category._id);
                    setEditCategoryName(category.category);
                  }}
                  className="activity-categories-button edit-button"
                >
                  Edit
                </button>
                <button onClick={() => handleDeleteCategory(category._id)} className="activity-categories-button delete-button">
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
