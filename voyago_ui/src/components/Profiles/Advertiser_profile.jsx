import React, { useState, useEffect } from "react";
import "./Profile.css";
import axios from "axios";

function Advertiser_profile() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/advertiser/get-advertiser-by-userId/${"6707b7c7e05533e031df67c4"}`
        );
        const data = response.data;
        setProfileData(data);
        setError(false);
        setPending(false);
      } catch (error) {
        setPending(false);
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
        `http://localhost:8000/api/advertiser/update-advertiser/${profileData._id}`,
        {
          // email: profileData.user.email,

          company_name: profileData.company_name,
          contact_info: profileData.contact_info,
          ad_campaign: profileData.ad_campaign,
        }
      );

      if (response.status === 200) {
        console.log("testing");
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
  const [isPending, setPending] = useState(true);
  const [error, setError] = useState(null);

  return (
    <div className="profile-container">
      {error && <div>Error fetching data</div>}
      {isPending && <div>Loading...</div>}
      <div>
        {!error &&
          profileData &&
          (isEditing ? (
            <div className="updating-profile">
              <h1>Update Profile:</h1>
              <form className="profile-form" onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={profileData.user.email}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      user: { ...profileData.user, email: e.target.value },
                    })
                  }
                  className="profile-input"
                />

                <label htmlFor="username">Username:</label>
                <input
                  id="username"
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
                />

                <label htmlFor="company_name">Company Name:</label>
                <input
                  id="company_name"
                  type="text"
                  required
                  value={profileData.company_name}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      company_name: e.target.value,
                    })
                  }
                  className="profile-input"
                />

                <label htmlFor="contact_info">Contact Info:</label>
                <input
                  id="contact_info"
                  type="text"
                  required
                  value={profileData.contact_info}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      contact_info: e.target.value,
                    })
                  }
                  className="profile-input"
                />

                <label htmlFor="ad_campaign">Ad Campaign:</label>
                <textarea
                  id="ad_campaign"
                  required
                  value={profileData.ad_campaign}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      ad_campaign: e.target.value,
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
              <p>Email: {profileData.user.email}</p>
              <p>Username: {profileData.user.username}</p>
              <p>Company Name: {profileData.company_name}</p>
              <p>Contact Info: {profileData.contact_info}</p>
              <p>Ad Campaign: {profileData.ad_campaign}</p>
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

export default Advertiser_profile;
