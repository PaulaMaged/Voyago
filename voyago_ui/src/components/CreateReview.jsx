import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import "./CreateReview.css";
import { useTheme } from '../context/ThemeContext';

const CreateReview = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  let reviewee;
  let entityName;
  let displayName;

  if (location.state?.activity) {
    reviewee = location.state.activity;
    entityName = "activity";
    displayName = "Activity";
  } else if (location.state?.tourGuide) {
    reviewee = location.state.tourGuide;
    entityName = "tourGuide";
    displayName = "Tour Guide";
  } else if (location.state?.itinerary) {
    reviewee = location.state.itinerary;
    entityName = "itinerary";
    displayName = "Itinerary";
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        [entityName]: reviewee._id,
        rating: rating,
        comment: comment,
      };

      const touristId = localStorage.getItem("roleId");

      await axios.post(
        `http://localhost:8000/api/tourist/tourist-rate-${entityName}/${touristId}`,
        data
      );

      navigate(-1);
    } catch (e) {
      console.log(e);
      if (e.response?.data?.message) alert(e.response?.data.message);

      navigate(-1);
    }
  };

  return (
    <div className={`review-container ${theme}`}>
      <div className="review-card">
        <h2 className="review-title">{displayName} Feedback</h2>
        <form className="review-form" onSubmit={handleSubmit}>
          <div className="rating-container">
            <label>Rating:</label>
            <div className="star-rating">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <FaStar
                    key={index}
                    className="star"
                    color={ratingValue <= (hover || rating) ? "#ffc107" : theme === 'dark' ? '#666' : '#e4e5e9'}
                    size={32}
                    onClick={() => setRating(ratingValue)}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(rating)}
                  />
                );
              })}
            </div>
          </div>

          <div className="comment-container">
            <label>Comment:</label>
            <textarea
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              className={theme}
            />
          </div>

          <div className="button-container">
            <button 
              type="button" 
              className={`cancel-btn ${theme}`} 
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={`submit-btn ${theme}`}
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateReview;
