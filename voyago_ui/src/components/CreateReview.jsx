import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const CreateReview = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

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
    <div className="createReview">
      <h2 className="review-header">{displayName} Feedback</h2>
      <form className="review-form" onSubmit={handleSubmit}>
        <label>
          Rating:
          <input
            type="number"
            min="1"
            max="5"
            required
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
        </label>

        <label>
          {" "}
          comment:
          <textarea
            rows="4"
            cols="50"
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </label>
        <button>Submit</button>
      </form>
    </div>
  );
};

export default CreateReview;
