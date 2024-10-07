// src/components/LocationComponent.jsx

import { useState } from "react";
import axios from "axios";

function LocationComponent() {
  const [result, setResult] = useState("");

  // Base API URL
  const API_BASE_URL = "http://localhost:5000/api/tourismgovernor/locations";

  // Create Location
  const createLocation = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const data = {
      latitude: parseFloat(formData.get("latitude")),
      longitude: parseFloat(formData.get("longitude")),
    };

    console.log("Sending data:", data);

    try {
      const response = await axios.post(API_BASE_URL, data);
      setResult(JSON.stringify(response.data));
      // Removed fetchAllLocations call
    } catch (error) {
      console.error("Error creating Location:", error);
      setResult(JSON.stringify(error.response?.data || error.message, null, 2));
    }
  };

  // Get Location by ID
  const getLocation = async (event) => {
    event.preventDefault();
    const id = event.target.id.value;

    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      setResult(JSON.stringify(response.data));
    } catch (error) {
      console.error("Error fetching Location:", error);
      setResult(JSON.stringify(error.response?.data || error.message, null, 2));
    }
  };

  // Update Location by ID
  const updateLocation = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const id = formData.get("id");
    const data = {
      latitude: formData.get("latitude")
        ? parseFloat(formData.get("latitude"))
        : undefined,
      longitude: formData.get("longitude")
        ? parseFloat(formData.get("longitude"))
        : undefined,
    };

    // Remove undefined fields
    Object.keys(data).forEach(
      (key) => data[key] === undefined && delete data[key]
    );

    console.log("Updating data:", data);

    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, data);
      setResult(JSON.stringify(response.data));
      // Removed fetchAllLocations call
    } catch (error) {
      console.error("Error updating Location:", error);
      setResult(JSON.stringify(error.response?.data || error.message, null, 2));
    }
  };

  // Delete Location by ID
  const deleteLocation = async (event) => {
    event.preventDefault();
    const id = event.target.id.value;

    try {
      const response = await axios.delete(`${API_BASE_URL}/${id}`);
      setResult(JSON.stringify(response.data, null, 2));
      // Removed fetchAllLocations call
    } catch (error) {
      console.error("Error deleting Location:", error);
      setResult(JSON.stringify(error.response?.data || error.message, null, 2));
    }
  };

  return (
    <div>
      <h2>Create Location (POST Request)</h2>
      <form onSubmit={createLocation}>
        <label>
          Latitude:
          <input type="number" name="latitude" step="0.000001" required />
        </label>
        <br />
        <label>
          Longitude:
          <input type="number" name="longitude" step="0.000001" required />
        </label>
        <br />
        <button type="submit">Create Location</button>
      </form>

      <h2>Get Location (GET Request)</h2>
      <form onSubmit={getLocation}>
        <label>
          Location ID:
          <input type="text" name="id" required />
        </label>
        <br />
        <button type="submit">Get Location</button>
      </form>

      <h2>Update Location (PUT Request)</h2>
      <form onSubmit={updateLocation}>
        <label>
          Location ID:
          <input type="text" name="id" required />
        </label>
        <br />
        <label>
          Latitude:
          <input type="number" name="latitude" step="0.000001" />
        </label>
        <br />
        <label>
          Longitude:
          <input type="number" name="longitude" step="0.000001" />
        </label>
        <br />
        <button type="submit">Update Location</button>
      </form>

      <h2>Delete Location (DELETE Request)</h2>
      <form onSubmit={deleteLocation}>
        <label>
          Location ID:
          <input type="text" name="id" required />
        </label>
        <br />
        <button type="submit">Delete Location</button>
      </form>

      {/* Removed the Fetch All Locations section */}

      {/* Display the result */}
      <h3>Response:</h3>
      <pre>{result}</pre>
    </div>
  );
}

export default LocationComponent;
