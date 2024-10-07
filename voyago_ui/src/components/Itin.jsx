import { useState } from "react";
import axios from "axios";

function ItineraryComponent() {
  const [result, setResult] = useState("");

  const createItinerary = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      tour_guide: formData.get("tour_guide"),
      name: formData.get("name"),
      description: formData.get("description"),
      language: formData.get("language"),
      price: parseFloat(formData.get("price")),
      activities: formData.get("activities").split(",").map((id) => id.trim()),
      available_dates: formData
        .get("available_dates")
        .split(",")
        .map((date) => new Date(date.trim())),
      available_times: formData
        .get("available_times")
        .split(",")
        .map((time) => time.trim()),
      accessibility: formData.get("accessibility") === "on",
      pick_up: formData.get("pick_up"),
      drop_off: formData.get("drop_off"),
    };

    try {
      const response = await axios.post("/api/itineraries", data);
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.log(error);
      setResult(JSON.stringify(error.response?.data || error.message, null, 2));
    }
  };

  const getItinerary = async (event) => {
    event.preventDefault();
    const id = event.target.id.value;

    try {
      const response = await axios.get(`/api/itineraries/${id}`);
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.log(error);
      setResult(JSON.stringify(error.response?.data || error.message, null, 2));
    }
  };

  const deleteItinerary = async (event) => {
    event.preventDefault();
    const id = event.target.id.value;

    try {
      const response = await axios.delete(`/api/itineraries/${id}`);
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.log(error);
      setResult(JSON.stringify(error.response?.data || error.message, null, 2));
    }
  };

  return (
    <div>
      <h2>Create Itinerary (POST Request)</h2>
      <form onSubmit={createItinerary}>
        <label>
          Tour Guide ID:
          <input type="text" name="tour_guide" required />
        </label>
        <br />
        <label>
          Name:
          <input type="text" name="name" required />
        </label>
        <br />
        <label>
          Description:
          <input type="text" name="description" />
        </label>
        <br />
        <label>
          Language:
          <input type="text" name="language" />
        </label>
        <br />
        <label>
          Price:
          <input type="number" step="0.01" name="price" />
        </label>
        <br />
        <label>
          Activities (comma-separated IDs):
          <input type="text" name="activities" />
        </label>
        <br />
        <label>
          Available Dates (comma-separated, YYYY-MM-DD):
          <input type="text" name="available_dates" />
        </label>
        <br />
        <label>
          Available Times (comma-separated, HH:MM):
          <input type="text" name="available_times" />
        </label>
        <br />
        <label>
          Accessibility:
          <input type="checkbox" name="accessibility" />
        </label>
        <br />
        <label>
          Pick-up Location ID:
          <input type="text" name="pick_up" />
        </label>
        <br />
        <label>
          Drop-off Location ID:
          <input type="text" name="drop_off" />
        </label>
        <br />
        <button type="submit">Create Itinerary</button>
      </form>

      <h2>Get Itinerary (GET Request)</h2>
      <form onSubmit={getItinerary}>
        <label>
          Itinerary ID:
          <input type="text" name="id" required />
        </label>
        <br />
        <button type="submit">Get Itinerary</button>
      </form>

      <h2>Delete Itinerary (DELETE Request)</h2>
      <form onSubmit={deleteItinerary}>
        <label>
          Itinerary ID:
          <input type="text" name="id" required />
        </label>
        <br />
        <button type="submit">Delete Itinerary</button>
      </form>

      {/* Display the result */}
      <h3>Response:</h3>
      <pre>{result}</pre>
    </div>
  );
}

export default ItineraryComponent;
