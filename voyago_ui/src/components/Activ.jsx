import { useState } from "react";
import axios from "axios";

function ActivityComponent() {
  const [result, setResult] = useState("");

  const createActivity = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      advertiser: formData.get("advertiser"),
      activity_date: formData.get("activity_date"),
      activity_time: formData.get("activity_time"),
      activity_end: formData.get("activity_end"),
      price: parseFloat(formData.get("price")),
      category: formData.get("category"),
      discount: parseFloat(formData.get("discount") || 0),
      tags: formData.get("tags").split(",").map((id) => id.trim()),
      booking_open: formData.get("booking_open") === "on",
    };

    try {
      const response = await axios.post("/api/activities", data);
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.log(error);
      setResult(JSON.stringify(error.response?.data || error.message, null, 2));
    }
  };

  const getActivity = async (event) => {
    event.preventDefault();
    const id = event.target.id.value;

    try {
      const response = await axios.get(`/api/activities/${id}`);
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.log(error);
      setResult(JSON.stringify(error.response?.data || error.message, null, 2));
    }
  };

  const deleteActivity = async (event) => {
    event.preventDefault();
    const id = event.target.id.value;

    try {
      const response = await axios.delete(`/api/activities/${id}`);
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.log(error);
      setResult(JSON.stringify(error.response?.data || error.message, null, 2));
    }
  };

  return (
    <div>
      <h2>Create Activity (POST Request)</h2>
      <form onSubmit={createActivity}>
        <label>
          Title:
          <input type="text" name="title" required />
        </label>
        <br />
        <label>
          Description:
          <textarea name="description" required></textarea>
        </label>
        <br />
        <label>
          Advertiser ID:
          <input type="text" name="advertiser" required />
        </label>
        <br />
        <label>
          Activity Date:
          <input type="date" name="activity_date" required />
        </label>
        <br />
        <label>
          Activity Time:
          <input type="time" name="activity_time" required />
        </label>
        <br />
        <label>
          Activity End Time:
          <input type="time" name="activity_end" />
        </label>
        <br />
        <label>
          Price:
          <input type="number" step="0.01" name="price" required />
        </label>
        <br />
        <label>
          Category:
          <input type="text" name="category" />
        </label>
        <br />
        <label>
          Discount:
          <input type="number" step="0.01" name="discount" />
        </label>
        <br />
        <label>
          Tags (comma-separated Tag IDs):
          <input type="text" name="tags" />
        </label>
        <br />
        <label>
          Booking Open:
          <input type="checkbox" name="booking_open" defaultChecked />
        </label>
        <br />
        <button type="submit">Create Activity</button>
      </form>

      <h2>Get Activity (GET Request)</h2>
      <form onSubmit={getActivity}>
        <label>
          Activity ID:
          <input type="text" name="id" required />
        </label>
        <br />
        <button type="submit">Get Activity</button>
      </form>

      <h2>Delete Activity (DELETE Request)</h2>
      <form onSubmit={deleteActivity}>
        <label>
          Activity ID:
          <input type="text" name="id" required />
        </label>
        <br />
        <button type="submit">Delete Activity</button>
      </form>

      {/* Display the result */}
      <h3>Response:</h3>
      <pre>{result}</pre>
    </div>
  );
}

export default ActivityComponent;
