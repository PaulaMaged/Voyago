import { useState } from "react";
import axios from "axios";

function TouristComponent() {
  const [result, setResult] = useState("");

  const createTourist = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      user: formData.get("user"),
      phone_number: formData.get("phone_number"),
      nationality: formData.get("nationality"),
      is_student: formData.get("is_student") === "on",
    };

    try {
      const response = await axios.post("/api/tourists", data);
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      setResult(JSON.stringify(error.response?.data || error.message, null, 2));
    }
  };

  const getTourist = async (event) => {
    event.preventDefault();
    const id = event.target.id.value;

    try {
      const response = await axios.get(`/api/tourists/${id}`);
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      setResult(JSON.stringify(error.response?.data || error.message, null, 2));
    }
  };

  const deleteTourist = async (event) => {
    event.preventDefault();
    const id = event.target.id.value;

    try {
      const response = await axios.delete(`/api/tourists/${id}`);
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      setResult(JSON.stringify(error.response?.data || error.message, null, 2));
    }
  };

  return (
    <div>
      <h2>Create Tourist (POST Request)</h2>
      <form onSubmit={createTourist}>
        <label>
          User ID:
          <input type="text" name="user" required />
        </label>
        <br />
        <label>
          Phone Number:
          <input type="text" name="phone_number" />
        </label>
        <br />
        <label>
          Nationality:
          <input type="text" name="nationality" />
        </label>
        <br />
        <label>
          Is Student:
          <input type="checkbox" name="is_student" />
        </label>
        <br />
        <button type="submit">Create Tourist</button>
      </form>

      <h2>Get Tourist (GET Request)</h2>
      <form onSubmit={getTourist}>
        <label>
          Tourist ID:
          <input type="text" name="id" required />
        </label>
        <br />
        <button type="submit">Get Tourist</button>
      </form>

      <h2>Delete Tourist (DELETE Request)</h2>
      <form onSubmit={deleteTourist}>
        <label>
          Tourist ID:
          <input type="text" name="id" required />
        </label>
        <br />
        <button type="submit">Delete Tourist</button>
      </form>

      {/* Display the result */}
      <h3>Response:</h3>
      <pre>{result}</pre>
    </div>
  );
}

export default TouristComponent;
