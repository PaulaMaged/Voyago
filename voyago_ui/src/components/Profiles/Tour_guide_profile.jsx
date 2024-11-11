import React, { useState } from "react";
import "./Profile.css";
import axios from "axios";

function Tour_guide_profile() {
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/tour-guide/get-tourguide-by-userId/${"6707bd7514e8bbb34cff086c"}`
        );
        const data = response.data;
        setProfileData(data);
        setError(false);
        SetPending(false);
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
    console.log(profileData);
    try {
      console.log("test");
      const response = await axios.put(
        `http://localhost:8000/api/tour-guide/update-tourguide/${"6707be2014e8bbb34cff0871"}`,

        {
          license_number: profileData.license_number,
          years_of_experience: profileData.years_of_experience,
          available: profileData.available,
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

  const deletionReq = async () => {
    try {
      const id = localStorage.getItem("roleId");
      const response = await axios.get(
        `http://localhost:8000/api/user/create-delete-request/${id}`
      );
      if (response.status === 200) {
        alert("Deletion Request has been Sent!");
      } else {
        throw new Error("Failed to send Request");
      }
    }catch(e){

    }
  }  

  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [ispending, SetPending] = useState(true);
  const [error, setError] = useState(null);

  return (
    <div className="profile-container">
      {ispending && <div>Loading...</div>}
      <div>
        {!error &&
          profileData &&
          (isEditing ? (
            <div className="updating-profile">
              <h1>Update Profile:</h1>
              <form className="profile-form" onSubmit={handleSubmit}>
                {/* <label htmlFor="email">Email:</label>
                <input
                  id="email"
                  type="text"
                  required
                  value={profileData.user.username}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      user: { ...profileData.user, username: e.target.value },
                    })
                  }
                  className="profile-input"
                />  fel a8lb m4 lazem n3mel updating lel profile hena*/}

                <label htmlFor="license">License Number:</label>
                <input
                  id="license"
                  type="text"
                  required
                  value={profileData.license_number}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      license_number: e.target.value,
                    })
                  }
                  className="profile-input"
                />

                <label htmlFor="experience">Years of Experience:</label>
                <input
                  id="experience"
                  type="text"
                  required
                  value={profileData.years_of_experience}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      years_of_experience: e.target.value,
                    })
                  }
                  className="profile-input"
                />

                <label htmlFor="available">Available:</label>
                <input
                  id="available"
                  type="checkbox"
                  checked={profileData.available}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      available: e.target.checked,
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
              <p>Email: {profileData.user.username}</p>
              <p>Username: {profileData.user.username}</p>
              <p>License Number: {profileData.license_number}</p>
              <p>Years of Experience: {profileData.years_of_experience}</p>
              <p>Available: {profileData.available ? "Yes" : "No"}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="profile-button"
              >
                Edit Profile
              </button>
            </div>
          ))}
      </div>
      <button className="profile-button" id="deletionReq" onClick={deletionReq}>Delete Account</button>
    </div>
  );
}

export default Tour_guide_profile;
