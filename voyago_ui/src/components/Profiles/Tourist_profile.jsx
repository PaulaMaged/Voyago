import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./Profile.css";
import axios from "axios";

function Tourist_profile({ userId, touristId }) {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/tourist/get-tourist/${touristId}`
        );
        if (response.status === 200) {
          const data = response.data;
          setProfileData(data);
          console.log(response.data);
          setError(false);
          setPending(false);
        } else {
          console.log("Error fetching data");
        }
      } catch (error) {
        setError(true);
        setPending(false);
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsEditing(false);
    try {
      const response2 = await axios.put(
        `http://localhost:8000/api/user/update-user/${userId}`,
        {
          email: profileData.user.email,
        }
      );

      if (response2.status !== 200) {
        return alert("Email already exists");
      }
      const response = await axios.put(
        `http://localhost:8000/api/tourist/update-tourist/${profileData._id}`,
        {
          phone_number: profileData.phone_number,
          nationality: profileData.nationality,
          is_student: profileData.is_student,
        }
      );

      if (response.status === 200) {
        alert("Profile updated successfully");
      } else {
        console.log("Error fetching data");

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
    } catch (e) {
      console.log(e.error.message);
    }
  };

  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, setPending] = useState(true);
  const [error, setError] = useState(null);

  return (
    <div className="profile-container">
      {isPending && <div>Loading...</div>}
      {error && <div>Something went wrong. Please try again later.</div>}
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

                <label htmlFor="mobile_number">Mobile Number:</label>
                <input
                  id="mobile_number"
                  type="text"
                  required
                  value={profileData.phone_number}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      phone_number: e.target.value,
                    })
                  }
                  className="profile-input"
                />

                <label htmlFor="nationality">Nationality:</label>
                <input
                  id="nationality"
                  type="text"
                  required
                  value={profileData.nationality}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      nationality: e.target.value,
                    })
                  }
                  className="profile-input"
                />

                <label htmlFor="is_student">Is Student:</label>
                <input
                  id="is_student"
                  type="checkbox"
                  checked={profileData.is_student}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      is_student: e.target.checked,
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
              <p>Email: {profileData.user.email}</p>

              <p>Mobile Number: {profileData.phone_number}</p>
              <p>Nationality: {profileData.nationality}</p>
              <p>Date of Birth: {profileData.DOB}</p>
              <p>Is Student: {profileData.is_student ? "Yes" : "No"}</p>
              <p>Wallet: {profileData.wallet}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="profile-button"
              >
                Edit Profile
              </button>
            </div>
          ))}
      </div>
      <button className="profile-button" id="deletionReq" onClick={deletionReq}>
        Delete Account
      </button>
    </div>
  );
}
Tourist_profile.propTypes = {
  userId: PropTypes.string.isRequired,
  touristId: PropTypes.string.isRequired,
};

export default Tourist_profile;
