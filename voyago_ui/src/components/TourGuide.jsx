import { useState } from "react";
import axios from "axios";

function TestComp() {
  const [result, setResult] = useState(""); // State to store response

  // Axios function for POST (example: creating a Tour Guide)
  const createTourGuide = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      user: formData.get("user"),  // Reference to User ID
      license_number: formData.get("license_number"),
      specialization: formData.get("specialization"),
      years_of_experience: parseInt(formData.get("years_of_experience"), 10), // Convert to number
      available: formData.get("available") === "on",  // Checkbox handling
    };

    try {
      const response = await axios.post("/api/tourguide/tourguides", data);
      setResult(JSON.stringify(response.data, null, 2)); // Displaying response
    } catch (error) {
      setResult(JSON.stringify(error.response?.data || error.message, null, 2));
    }
  };

  // Axios function for GET (example: fetching a Tour Guide by ID)
  const getTourGuide = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const id = formData.get("id");

    try {
      const response = await axios.get(`/api/tourguide/tourguides/${id}`);
      setResult(JSON.stringify(response.data, null, 2)); // Displaying response
    } catch (error) {
      setResult(JSON.stringify(error.response?.data || error.message, null, 2));
    }
  };

  // Axios function for DELETE (example: deleting a Tour Guide by ID)
  const deleteTourGuide = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const id = formData.get("id");

    try {
      const response = await axios.delete(`/api/tourguide/tourguides/${id}`);
      setResult(JSON.stringify(response.data, null, 2)); // Displaying response
    } catch (error) {
      setResult(JSON.stringify(error.response?.data || error.message, null, 2));
    }
  };

  return (
    <div>
      <h2>Create Tour Guide (POST Request)</h2>
      <form onSubmit={createTourGuide}>
        <label>
          User ID:
          <input type="text" name="user" required />
        </label>
        <br />
        <label>
          License Number:
          <input type="text" name="license_number" required />
        </label>
        <br />
        <label>
          Specialization:
          <input type="text" name="specialization" required />
        </label>
        <br />
        <label>
          Years of Experience:
          <input type="number" name="years_of_experience" required />
        </label>
        <br />
        <label>
          Available:
          <input type="checkbox" name="available" />
        </label>
        <br />
        <button type="submit">Create Tour Guide</button>
      </form>

      <h2>Get Tour Guide (GET Request)</h2>
      <form onSubmit={getTourGuide}>
        <label>
          Tour Guide ID:
          <input type="text" name="id" required />
        </label>
        <br />
        <button type="submit">Get Tour Guide</button>
      </form>

      <h2>Delete Tour Guide (DELETE Request)</h2>
      <form onSubmit={deleteTourGuide}>
        <label>
          Tour Guide ID:
          <input type="text" name="id" required />
        </label>
        <br />
        <button type="submit">Delete Tour Guide</button>
      </form>

      {/* Displaying the result */}
      <h3>Response:</h3>
      <pre>{result}</pre>
    </div>
  );
}

export default TestComp;
