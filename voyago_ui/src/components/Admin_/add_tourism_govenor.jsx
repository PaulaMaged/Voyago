import React from "react";
import axios from "axios";

function AddTourismGovernor() {
  const creatingTourismGovernor = async (data, e) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/user/create-user",
        {
          username: data.username,
          password: data.password,

          role: "TOUR_GOVERNOR",
        }
      );
      if (response.status === 201) {
        return response.data._id;
      } else {
        throw new Error("Bad Request");
      }
    } catch (error) {
      e.target.name.value = "";
      alert("OOPS! This userName is not Unique!");
      throw error;
    }
  };

  const createTourismGovernor = async (user_id) => {
    try {
      console.log("Again" + user_id);
      const response1 = await axios.post(
        `http://localhost:8000/api/tourism-governor/create-tourgovernor`,
        { user: user_id }
      );
      if (response1.status === 201) {
        alert("Tourism Governor Created Successfully!");
      } else {
        throw new Error("Bad Request");
      }
    } catch (error) {
      console.error("Error creating tourism governor:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      username: e.target.name.value,
      password: e.target.password.value,
    };
    try {
      const userId = await creatingTourismGovernor(data, e);
      await createTourismGovernor(userId);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h1 className="title">Adding a new Tourism Governor</h1>
        <div className="form-group">
          <label htmlFor="name" className="label">
            Name:
          </label>
          <input type="text" id="name" name="name" required className="input" />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="label">
            Password:
          </label>
          <input
            type="text"
            id="password"
            name="password"
            required
            className="input"
          />
        </div>
        <button type="submit" className="button">
          Submit
        </button>
      </form>
      <style>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f4f4f4;
        }
        .form {
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .title {
          text-align: center;
          color: #333;
        }
        .form-group {
          margin-bottom: 15px;
        }
        .label {
          display: block;
          margin-bottom: 5px;
          color: #555;
        }
        .input {
          width: 100%;
          padding: 8px;
          border-radius: 4px;
          border: 1px solid #ccc;
        }
        .button {
          width: 100%;
          padding: 10px;
          border-radius: 4px;
          border: none;
          background-color: #007bff;
          color: #fff;
          font-size: 16px;
        }
      `}</style>
    </div>
  );
}

export default AddTourismGovernor;
