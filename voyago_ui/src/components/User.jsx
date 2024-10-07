import { useState } from "react";
import axios from "axios";

function UserComponent() {
  const [result, setResult] = useState(""); // State to store response

  // Function to create a User
  const createUser = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      username: formData.get("username"),
      password: formData.get("password"),
      description: formData.get("description"),
      DOB: formData.get("DOB"),
    };

    try {
      const response = await axios.post("/api/users", data);
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      setResult(JSON.stringify(error.response?.data || error.message, null, 2));
    }
  };

  // Function to get a User by ID
  const getUser = async (event) => {
    event.preventDefault();
    const id = event.target.id.value;

    try {
      const response = await axios.get(`/api/users/${id}`);
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      setResult(JSON.stringify(error.response?.data || error.message, null, 2));
    }
  };

  // Function to delete a User by ID
  const deleteUser = async (event) => {
    event.preventDefault();
    const id = event.target.id.value;

    try {
      const response = await axios.delete(`/api/users/${id}`);
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      setResult(JSON.stringify(error.response?.data || error.message, null, 2));
    }
  };

  return (
    <div>
      <h2>Create User (POST Request)</h2>
      <form onSubmit={createUser}>
        <label>
          Username:
          <input type="text" name="username" required />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" required />
        </label>
        <br />
        <label>
          Description:
          <input type="text" name="description" />
        </label>
        <br />
        <label>
          Date of Birth:
          <input type="date" name="DOB" />
        </label>
        <br />
        <button type="submit">Create User</button>
      </form>

      <h2>Get User (GET Request)</h2>
      <form onSubmit={getUser}>
        <label>
          User ID:
          <input type="text" name="id" required />
        </label>
        <br />
        <button type="submit">Get User</button>
      </form>

      <h2>Delete User (DELETE Request)</h2>
      <form onSubmit={deleteUser}>
        <label>
          User ID:
          <input type="text" name="id" required />
        </label>
        <br />
        <button type="submit">Delete User</button>
      </form>

      {/* Display the result */}
      <h3>Response:</h3>
      <pre>{result}</pre>
    </div>
  );
}

export default UserComponent;
