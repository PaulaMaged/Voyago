import { useState } from "react";
import axios from "axios";

function Adv () {
  const [result, setResult] = useState(""); // State to store response

  // Axios function for POST (example: creating an Advertiser)
  const createAdvertiser = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      user: formData.get("user"),  // Reference to User ID
      company_name: formData.get("company_name"),
      contact_info: formData.get("contact_info"),
      ad_campaign: formData.get("ad_campaign"),
    };

    try {
      const response = await axios.post("http://localhost:5000/api/advertiser/advertisers", data);
      setResult(JSON.stringify(response.data)); // Displaying response
    } catch (error) {
      setResult(JSON.stringify(error.response?.data || error.message, null, 2));
    }
  };

  // Axios function for GET (example: fetching an Advertiser by ID)
  const getAdvertiser = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const id = formData.get("id");

    try {
      const response = await axios.get(`http://localhost:5000/api/advertiser/advertisers/${id}`);
      setResult(JSON.stringify(response.data)); // Displaying response
    } catch (error) {
      setResult(JSON.stringify(error.response?.data || error.message, null, 2));
    }
  };

  // Axios function for DELETE (example: deleting an Advertiser by ID)
  const deleteAdvertiser = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const id = formData.get("id");

    try {
      const response = await axios.delete(`http://localhost:5000/api/advertiser/advertisers/${id}`);
      setResult(JSON.stringify(response.data)); // Displaying response
    } catch (error) {
      setResult(JSON.stringify(error.response?.data || error.message, null, 2));
    }
  };

  return (
    <div>
      <h2>Create Advertiser (POST Request)</h2>
      <form onSubmit={createAdvertiser}>
        <label>
          User ID:
          <input type="text" name="user" required />
        </label>
        <br />
        <label>
          Company Name:
          <input type="text" name="company_name" required />
        </label>
        <br />
        <label>
          Contact Info:
          <input type="text" name="contact_info" required />
        </label>
        <br />
        <label>
          Ad Campaign:
          <input type="text" name="ad_campaign" />
        </label>
        <br />
        <button type="submit">Create Advertiser</button>
      </form>

      <h2>Get Advertiser (GET Request)</h2>
      <form onSubmit={getAdvertiser}>
        <label>
          Advertiser ID:
          <input type="text" name="id" required />
        </label>
        <br />
        <button type="submit">Get Advertiser</button>
      </form>

      <h2>Delete Advertiser (DELETE Request)</h2>
      <form onSubmit={deleteAdvertiser}>
        <label>
          Advertiser ID:
          <input type="text" name="id" required />
        </label>
        <br />
        <button type="submit">Delete Advertiser</button>
      </form>

      {/* Displaying the result */}
      <h3>Response:</h3>
      <pre>{result}</pre>
    </div>
  );
}

export default Adv;
