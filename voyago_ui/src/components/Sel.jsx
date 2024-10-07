import { useState } from "react";
import axios from "axios";

function SellerComponent() {
  const [result, setResult] = useState("");

  const createSeller = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      user: formData.get("user"),
      store_name: formData.get("store_name"),
      description: formData.get("description"),
    };

    try {
      const response = await axios.post("http://localhost:5000/api/sellers", data);
      setResult(JSON.stringify(response.data));
    } catch (error) {
      setResult(JSON.stringify(error.response?.data || error.message, null, 2));
    }
  };

  const getSeller = async (event) => {
    event.preventDefault();
    const id = event.target.id.value;

    try {
      const response = await axios.get(`http://localhost:5000/api/sellers/${id}`);
      setResult(JSON.stringify(response.data));
    } catch (error) {
      setResult(JSON.stringify(error.response?.data || error.message, null, 2));
    }
  };

  const deleteSeller = async (event) => {
    event.preventDefault();
    const id = event.target.id.value;

    try {
      const response = await axios.delete(`http://localhost:5000/api/sellers/${id}`);
      setResult(JSON.stringify(response.data));
    } catch (error) {
      setResult(JSON.stringify(error.response?.data || error.message, null, 2));
    }
  };

  return (
    <div>
      <h2>Create Seller (POST Request)</h2>
      <form onSubmit={createSeller}>
        <label>
          User ID:
          <input type="text" name="user" required />
        </label>
        <br />
        <label>
          Store Name:
          <input type="text" name="store_name" />
        </label>
        <br />
        <label>
          Description:
          <input type="text" name="description" />
        </label>
        <br />
        <button type="submit">Create Seller</button>
      </form>

      <h2>Get Seller (GET Request)</h2>
      <form onSubmit={getSeller}>
        <label>
          Seller ID:
          <input type="text" name="id" required />
        </label>
        <br />
        <button type="submit">Get Seller</button>
      </form>

      <h2>Delete Seller (DELETE Request)</h2>
      <form onSubmit={deleteSeller}>
        <label>
          Seller ID:
          <input type="text" name="id" required />
        </label>
        <br />
        <button type="submit">Delete Seller</button>
      </form>

      {/* Display the result */}
      <h3>Response:</h3>
      <pre>{result}</pre>
    </div>
  );
}

export default SellerComponent;
