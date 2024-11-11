import axios from "axios";
import { useState } from "react";
import PropTypes from "prop-types";

export default function ComplaintForm({ userId, touristId }) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    body: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:8000/api/tourist/create-user-complaint/${userId}`,
        {
          title: formData.title,
          category: formData.category,
          body: formData.body,
        }
      );
      if (response.status === 201) {
        alert("Complaint submitted successfully!");
        setFormData({ title: "", category: "", body: "" });
      } else {
        alert(
          "Complaint not submitted successfully! please try again Later..."
        );
      }
    } catch (error) {
      alert(
        "An error occurred while submitting the complaint. Please try again later."
      );
    }

    console.log("Complaint submitted:", formData);
    setFormData({ title: "", category: "", body: "" });
  };

  return (
    <div className="complaint-form">
      <h2>Submit a Complaint</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Title:</label>
          <input
            type="text"
            id="name"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>

            <option value="itinerary">Itinerary</option>
            <option value="product">Product</option>
            <option value="accommodation">Accommodation</option>
            <option value="transportation">Transportation</option>
            <option value="activity">Activity</option>
            <option value="customer-service">Customer Service</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="body"
            value={formData.body}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button type="submit" className="submit-btn">
          Submit Complaint
        </button>
      </form>
      <style>{`
        .complaint-form {
          max-width: 500px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        h2 {
          color: #333;
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        label {
          display: block;
          margin-bottom: 5px;
          color: #555;
        }

        input,
        select,
        textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }

        textarea {
          height: 100px;
          resize: vertical;
        }

        .submit-btn {
          background-color: #4caf50;
          color: white;
          padding: 12px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s;
        }

        .submit-btn:hover {
          background-color: #45a049;
        }
      `}</style>
    </div>
  );
}

ComplaintForm.propTypes = {
  userId: PropTypes.string.isRequired,
  touristId: PropTypes.string.isRequired,
};
