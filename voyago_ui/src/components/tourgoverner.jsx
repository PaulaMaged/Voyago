// src/components/TourGovernorComponent.jsx

import { useState } from "react";
import axios from "axios";

function TourGovernorComponent() {
  const [result, setResult] = useState("");

  // Create Tour Governor
  const createTourGovernor = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const data = {
      user: formData.get("user"), // User ID (Assuming you have User management)
      region: formData.get("region"),
      years_of_service: parseInt(formData.get("years_of_service"), 10),
      contact_info: formData.get("contact_info"),
    };

    console.log("Sending data:", data);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/tourismgovernor/tourgovernors",
        data
      );
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error("Error creating Tour Governor:", error);
      setResult(
        JSON.stringify(error.response?.data || error.message, null, 2)
      );
    }
  };

  // Get Tour Governor by ID
  const getTourGovernor = async (event) => {
    event.preventDefault();
    const id = event.target.id.value;

    try {
      const response = await axios.get(
        `http://localhost:5000/api/tourismgovernor/tourgovernors/${id}`
      );
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error("Error fetching Tour Governor:", error);
      setResult(
        JSON.stringify(error.response?.data || error.message, null, 2)
      );
    }
  };

  // Update Tour Governor by ID
  const updateTourGovernor = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const id = formData.get("id");
    const data = {
      user: formData.get("user"), // Optional: User ID
      region: formData.get("region"),
      years_of_service: formData.get("years_of_service")
        ? parseInt(formData.get("years_of_service"), 10)
        : undefined,
      contact_info: formData.get("contact_info"),
    };

    // Remove undefined fields
    Object.keys(data).forEach(
      (key) => data[key] === undefined && delete data[key]
    );

    console.log("Updating data:", data);

    try {
      const response = await axios.put(
        `http://localhost:5000/api/tourismgovernor/tourgovernors/${id}`,
        data
      );
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error("Error updating Tour Governor:", error);
      setResult(
        JSON.stringify(error.response?.data || error.message, null, 2)
      );
    }
  };

  // Delete Tour Governor by ID
  const deleteTourGovernor = async (event) => {
    event.preventDefault();
    const id = event.target.id.value;

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/tourismgovernor/tourgovernors/${id}`
      );
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error("Error deleting Tour Governor:", error);
      setResult(
        JSON.stringify(error.response?.data || error.message, null, 2)
      );
    }
  };

  return (
    <div>
      <h2>Create Tour Governor (POST Request)</h2>
      <form onSubmit={createTourGovernor}>
        <label>
          User ID:
          <input type="text" name="user" required />
        </label>
        <br />
        <label>
          Region:
          <input type="text" name="region" required />
        </label>
        <br />
        <label>
          Years of Service:
          <input type="number" name="years_of_service" min="0" />
        </label>
        <br />
        <label>
          Contact Info:
          <input type="text" name="contact_info" />
        </label>
        <br />
        <button type="submit">Create Tour Governor</button>
      </form>

      <h2>Get Tour Governor (GET Request)</h2>
      <form onSubmit={getTourGovernor}>
        <label>
          Tour Governor ID:
          <input type="text" name="id" required />
        </label>
        <br />
        <button type="submit">Get Tour Governor</button>
      </form>

      <h2>Update Tour Governor (PUT Request)</h2>
      <form onSubmit={updateTourGovernor}>
        <label>
          Tour Governor ID:
          <input type="text" name="id" required />
        </label>
        <br />
        <label>
          User ID:
          <input type="text" name="user" />
        </label>
        <br />
        <label>
          Region:
          <input type="text" name="region" />
        </label>
        <br />
        <label>
          Years of Service:
          <input type="number" name="years_of_service" min="0" />
        </label>
        <br />
        <label>
          Contact Info:
          <input type="text" name="contact_info" />
        </label>
        <br />
        <button type="submit">Update Tour Governor</button>
      </form>

      <h2>Delete Tour Governor (DELETE Request)</h2>
      <form onSubmit={deleteTourGovernor}>
        <label>
          Tour Governor ID:
          <input type="text" name="id" required />
        </label>
        <br />
        <button type="submit">Delete Tour Governor</button>
      </form>

      {/* Display the result */}
      <h3>Response:</h3>
      <pre>{result}</pre>
    </div>
  );
}

export default TourGovernorComponent;
