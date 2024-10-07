// components/LandmarkComponent.jsx
import { useState } from "react";
import axios from "axios";

function LandmarkComponent() {
  const [result, setResult] = useState("");

  // Create Landmark
  const createLandmark = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const data = {
      tour_governor: formData.get("tour_governor"),
      name: formData.get("name"),
      description: formData.get("description"),
      tags: formData.get("tags")
        ? formData.get("tags").split(",").map(id => id.trim()).filter(id => id)
        : [],
      location: formData.get("location"),
      image: formData.get("image"),
      opening_hours: parseInt(formData.get("opening_hours"), 10),
      types: formData.get("types"),
    };

    console.log("Sending data:", data);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/tourismgovernor/landmarks",
        data
      );
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error("Error creating landmark:", error);
      setResult(
        JSON.stringify(error.response?.data || error.message, null, 2)
      );
    }
  };

  // Get Landmark
  const getLandmark = async (event) => {
    event.preventDefault();
    const id = event.target.id.value;

    try {
      const response = await axios.get(
        `http://localhost:5000/api/tourismgovernor/landmarks/${id}`
      );
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error("Error fetching landmark:", error);
      setResult(
        JSON.stringify(error.response?.data || error.message, null, 2)
      );
    }
  };

  // Delete Landmark
  const deleteLandmark = async (event) => {
    event.preventDefault();
    const id = event.target.id.value;

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/tourismgovernor/landmarks/${id}`
      );
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error("Error deleting landmark:", error);
      setResult(
        JSON.stringify(error.response?.data || error.message, null, 2)
      );
    }
  };

  return (
    <div>
      <h2>Create Landmark (POST Request)</h2>
      <form onSubmit={createLandmark}>
        <label>
          Tour Governor ID:
          <input type="text" name="tour_governor" required />
        </label>
        <br />
        <label>
          Name:
          <input type="text" name="name" required />
        </label>
        <br />
        <label>
          Description:
          <input type="text" name="description"></input>
        </label>
        <br />
        <label>
          Tags (comma-separated Tag IDs):
          <input type="text" name="tags" />
        </label>
        <br />
        <label>
          Location ID:
          <input type="text" name="location" required />
        </label>
        <br />
        <label>
          Image URL:
          <input type="text" name="image" />
        </label>
        <br />
        <label>
          Opening Hours:
          <input type="number" name="opening_hours" />
        </label>
        <br />
        <label>
          Types:
          <input type="text" name="types" />
        </label>
        <br />
        <button type="submit">Create Landmark</button>
      </form>

      <h2>Get Landmark (GET Request)</h2>
      <form onSubmit={getLandmark}>
        <label>
          Landmark ID:
          <input type="text" name="id" required />
        </label>
        <br />
        <button type="submit">Get Landmark</button>
      </form>

      <h2>Delete Landmark (DELETE Request)</h2>
      <form onSubmit={deleteLandmark}>
        <label>
          Landmark ID:
          <input type="text" name="id" required />
        </label>
        <br />
        <button type="submit">Delete Landmark</button>
      </form>

      {/* Display the result */}
      <h3>Response:</h3>
      <pre>{result}</pre>
    </div>
  );
}

export default LandmarkComponent;
