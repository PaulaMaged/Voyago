import { useState } from "react";
import axios from "axios";

export default function AddUser() {
  const [userType, setUserType] = useState("tourismGovernor");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      username: username,
      password: password,
    };

    try {
      let userId;
      if (userType === "admin") {
        userId = await createAdmin(data);
      } else if (userType === "tourismGovernor") {
        userId = await createTourismGovernor(data);
      }
      setTimeout(() => {
        console.log(userId);
      }, 10000);
      if (userId) {
        alert(`${userType} created successfully!`);
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }

    // Reset form
    setUsername("");
    setPassword("");
  };

  const createAdmin = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/user/create-user",
        {
          username: data.username,
          email: data.username,
          password: data.password,
          role: "ADMIN",
        }
      );
      if (response.status === 201) {
        return response.data._id;
      } else {
        throw new Error("Bad Request");
      }
    } catch (error) {
      alert("OOPS! This userName is not Unique!");
      throw error;
    }
  };

  const createTourismGovernor = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/user/create-user",
        {
          username: data.username,
          password: data.password,
          email: data.username,
          role: "TOUR_GOVERNOR",
        }
      );

      if (response.status === 201) {
        const userId = response.data._id;
        const response2 = await axios.post(
          `http://localhost:8000/api/tourism-governor/create-tourgovernor`,
          { user: userId }
        );
        if (response2.status === 201 || response2.status === 200) {
          alert("Tourism Governor creation has been successful!");
        }
      } else {
        throw new Error("Bad Request");
      }
    } catch (error) {
      alert("OOPS! This userName is not Unique!");
      throw error;
    }
  };

  return (
    <div className="add-user">
      <h2>Add User</h2>
      <form onSubmit={handleSubmit}>
        <select value={userType} onChange={(e) => setUserType(e.target.value)}>
          <option value="tourismGovernor">Tourism Governor</option>
          <option value="admin">Admin</option>
        </select>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Add User</button>
      </form>
      <style>{`
        .add-user {
          max-width: 300px;
          margin: 0 auto;
        }
        h2 {
          color: #2c3e50;
          margin-bottom: 20px;
        }
        form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        select,
        input,
        button {
          padding: 10px;
          border: 1px solid #bdc3c7;
          border-radius: 4px;
          font-size: 16px;
        }
        button {
          background-color: #3498db;
          color: white;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        button:hover {
          background-color: #2980b9;
        }
      `}</style>
    </div>
  );
}
