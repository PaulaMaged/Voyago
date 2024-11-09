import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './manageTags.css';

export default function ManageTags() {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editingTag, setEditingTag] = useState(null);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/tourism-governor/get-all-tags');
      setTags(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleCreateTag = async () => {
    if (!newTag) return;
    try {
      await axios.post('http://localhost:8000/api/tourism-governor/create-tag', { 
        tag_name: newTag,
        description: newDescription
      });
      setNewTag('');
      setNewDescription('');
      fetchTags();
    } catch (error) {
      console.error('Error creating tag:', error);
    }
  };

  const handleUpdateTag = async () => {
    if (!editingTag || !editingTag.tag_name) return;
    try {
      await axios.put(`http://localhost:8000/api/tourism-governor/update-tag/${editingTag._id}`, {
        tag_name: editingTag.tag_name,
        description: editingTag.description,
      });
      setEditingTag(null);
      fetchTags();
    } catch (error) {
      console.error('Error updating tag:', error);
    }
  };

  const handleDeleteTag = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/tourism-governor/delete-tag/${id}`);
      fetchTags();
    } catch (error) {
      console.error('Error deleting tag:', error);
    }
  };

  const handleEditChange = (field, value) => {
    setEditingTag(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="manage-tags-container">
      <h1 className="manage-tags-title">Manage Tags</h1>

      <div className="form-container">
        <input
          type="text"
          placeholder="New tag"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className="input-field"
        />
        <button onClick={handleCreateTag} className="create-button">
          Add Tag
        </button>
      </div>

      <div className="tags-list">
        {tags.map((tag) => (
          <div key={tag._id} className="tag-item">
            {editingTag && editingTag._id === tag._id ? (
              <>
                <input
                  type="text"
                  value={editingTag.tag_name}
                  onChange={(e) => handleEditChange('tag_name', e.target.value)}
                  className="input-field"
                  placeholder="Tag name"
                />
                <input
                  type="text"
                  value={editingTag.description}
                  onChange={(e) => handleEditChange('description', e.target.value)}
                  className="input-field"
                  placeholder="Description"
                />
                <button onClick={handleUpdateTag} className="update-button">
                  Save
                </button>
                <button onClick={() => setEditingTag(null)} className="cancel-button">
                  Cancel
                </button>
              </>
            ) : (
              <>
                <div className="tag-info">
                  <span className="tag-text">{tag.tag_name}</span>
                  <span className="tag-description">{tag.description}</span>
                </div>
                <div className="tag-actions">
                  <button
                    onClick={() => setEditingTag({ ...tag })}
                    className="edit-button"
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDeleteTag(tag._id)} className="delete-button">
                    Delete
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