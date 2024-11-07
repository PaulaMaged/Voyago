import React from "react";
import axios from "axios";

function AddTourismGovernor() {
  const creatingAdmin = async (data, e) => {
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
        alert("Admin Created Successfully!");
      } else {
        throw new Error("Bad Request");
      }
    } catch (error) {
      e.target.name.value = "";
      alert("OOPS! This userName is not Unique!");
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      username: e.target.name.value,
      password: e.target.password.value,
    };
    creatingAdmin(data, e);
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h1 className="title">Adding a new Admin</h1>
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
          width: 400px;
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
