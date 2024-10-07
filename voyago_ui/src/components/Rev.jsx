import { useState } from "react";
import axios from "axios";

function ReviewComponent() {
  const [result, setResult] = useState("");

  const createReview = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      reviewer: formData.get("reviewer"),
      product: formData.get("product"),
      rating: parseInt(formData.get("rating")),
      comment: formData.get("comment"),
    };

    try {
      const response = await axios.post("http://localhost:5000/api/reviews", data);
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      setResult(JSON.stringify(error.response?.data || error.message, null, 2));
    }
  };

  const getReview = async (event) => {
    event.preventDefault();
    const id = event.target.id.value;

    try {
      const response = await axios.get(`/http://localhost:5000/api/reviews/${id}`);
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      setResult(JSON.stringify(error.response?.data || error.message, null, 2));
    }
  };

  const deleteReview = async (event) => {
    event.preventDefault();
    const id = event.target.id.value;

    try {
      const response = await axios.delete(`http://localhost:5000/api/reviews/${id}`);
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      setResult(JSON.stringify(error.response?.data || error.message, null, 2));
    }
  };

  return (
    <div>
      <h2>Create Review (POST Request)</h2>
      <form onSubmit={createReview}>
        <label>
          Reviewer User ID:
          <input type="text" name="reviewer" required />
        </label>
        <br />
        <label>
          Product ID:
          <input type="text" name="product" required />
        </label>
        <br />
        <label>
          Rating:
          <input type="number" name="rating" min="1" max="5" required />
        </label>
        <br />
        <label>
          Comment:
          <input type="text" name="comment" />
        </label>
        <br />
        <button type="submit">Create Review</button>
      </form>

      <h2>Get Review (GET Request)</h2>
      <form onSubmit={getReview}>
        <label>
          Review ID:
          <input type="text" name="id" required />
        </label>
        <br />
        <button type="submit">Get Review</button>
      </form>

      <h2>Delete Review (DELETE Request)</h2>
      <form onSubmit={deleteReview}>
        <label>
          Review ID:
          <input type="text" name="id" required />
        </label>
        <br />
        <button type="submit">Delete Review</button>
      </form>

      {/* Display the result */}
      <h3>Response:</h3>
      <pre>{result}</pre>
    </div>
  );
}

export default ReviewComponent;
