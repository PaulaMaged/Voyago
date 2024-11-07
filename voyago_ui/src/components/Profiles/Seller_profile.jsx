import React, { useState, useEffect } from "react";
import "./Profile.css";
import axios from "axios";

function Seller_profile() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/seller/get-seller-by-userId/${"6707befa14e8bbb34cff0875"}`
        );
        const data = response.data;
        setProfileData(data);
        setError(false);
        setPending(false);
      } catch (error) {
        setError(true);
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsEditing(false);
    try {
      const response = await axios.put(
        `http://localhost:8000/api/seller/update-seller/${"6707bf1414e8bbb34cff0877"}`,
        {
          username: profileData.user.username,
          email: profileData.user.email,
          store_name: profileData.store_name,
          description: profileData.description,
        }
      );

      if (response.status === 200) {
        alert("Profile updated successfully");
      } else {
        throw new Error("Profile update failed");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, setPending] = useState(true);
  const [error, setError] = useState(null);

  return (
    <div className="profile-container">
      {isPending && <div>Loading...</div>}
      <div>
        {!error &&
          profileData &&
          (isEditing ? (
            <div className="updating-profile">
              <h1>Update Profile:</h1>
              <form className="profile-form" onSubmit={handleSubmit}>
                <label htmlFor="store_name">Store Name:</label>
                <input
                  id="store_name"
                  type="text"
                  required
                  value={profileData.store_name}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      store_name: e.target.value,
                    })
                  }
                  className="profile-input"
                />

                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  required
                  value={profileData.description}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      description: e.target.value,
                    })
                  }
                  className="profile-input"
                />

                <button type="submit" className="profile-button">
                  Update
                </button>
              </form>
            </div>
          ) : (
            <div className="viewing-profile">
              <h1>Profile</h1>
              <p>Username: {profileData.user.username}</p>
              {/* <p>Email: {profileData.user.email}</p> hal y2dro yupdate seller? */}
              <p>Store Name: {profileData.store_name}</p>
              <p>Description: {profileData.description}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="profile-button"
              >
                Edit Profile
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Seller_profile;
