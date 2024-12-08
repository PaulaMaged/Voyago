import React, { useState, useEffect } from "react";
import "./Profile.css";
import axios from "axios";

function Advertiser_profile() {
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, setPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get and parse user data from localStorage
        const userString = localStorage.getItem('user');
        if (!userString) {
          setError("No user data found. Please log in again.");
          setPending(false);
          return;
        }

        const user = JSON.parse(userString);
        const userId = user._id;
        
        if (!userId) {
          setError("User ID not found in profile. Please log in again.");
          setPending(false);
          return;
        }

        // Validate userId format (assuming it's a MongoDB ObjectId)
        if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
          setError("Invalid user ID format. Please log in again.");
          setPending(false);
          return;
        }

        console.log("Fetching advertiser profile with userId:", userId); // Debug log

        const response = await axios.get(
          `http://localhost:8000/api/advertiser/get-advertiser-by-userId/${userId}`,
          { validateStatus: false }
        );
        
        if (response.status === 200) {
          setProfileData(response.data);
          setError(null);
        } else if (response.status === 404) {
          setError("No advertiser profile found. Please complete your registration.");
          console.log("No advertiser profile found for userId:", userId);
        } else {
          setError(`Server error (${response.status}): ${response.data.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error("Profile fetch error:", {
          error,
          userString: localStorage.getItem('user')
        });
        setError("Failed to connect to the server. Please try again later.");
      } finally {
        setPending(false);
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

  const request_to_delete = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/user/update-user/${userId}`,
        {
          requested_to_be_deleted: true,
        }
      );
      if (response.status === 200) {
        alert(
          "Request to delete account sent successfully please check your inbox for updates!"
        );
        setTimeout(() => {
          window.location.href = "http://localhost:5173/";
        }, 1500);

        //i want to logout the user after sending the request
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-[var(--background)]">
      {error && (
        <div className="p-4 mb-6 text-red-500 bg-red-100 rounded-lg">
          <p>{error}</p>
        </div>
      )}
      
      {isPending && (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-16 h-16 border-4 border-t-[var(--primary)] border-[var(--secondary)] rounded-full animate-spin"></div>
        </div>
      )}

      {!error && profileData && (
        <div className="max-w-4xl mx-auto">
          {isEditing ? (
            <div className="bg-[var(--foreground)] rounded-lg shadow-lg p-6">
              <h1 className="mb-6 text-3xl font-bold text-[var(--textPrimary)]">Update Profile</h1>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-[var(--textPrimary)]">Email:</label>
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
                    className="w-full p-2 border rounded-md bg-[var(--background)] text-[var(--textPrimary)] border-[var(--border)]"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="username" className="block text-[var(--textPrimary)]">Username:</label>
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
                    className="w-full p-2 border rounded-md bg-[var(--background)] text-[var(--textPrimary)] border-[var(--border)]"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="company_name" className="block text-[var(--textPrimary)]">Company Name:</label>
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
                    className="w-full p-2 border rounded-md bg-[var(--background)] text-[var(--textPrimary)] border-[var(--border)]"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact_info" className="block text-[var(--textPrimary)]">Contact Info:</label>
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
                    className="w-full p-2 border rounded-md bg-[var(--background)] text-[var(--textPrimary)] border-[var(--border)]"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="ad_campaign" className="block text-[var(--textPrimary)]">Ad Campaign:</label>
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
                    className="w-full p-2 border rounded-md bg-[var(--background)] text-[var(--textPrimary)] border-[var(--border)] min-h-[100px]"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="px-6 py-2 text-white rounded-md bg-[var(--primary)] hover:bg-[var(--primaryHover)] transition-colors"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 text-[var(--textPrimary)] rounded-md bg-[var(--secondary)] hover:bg-[var(--secondaryHover)] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-[var(--foreground)] rounded-lg shadow-lg p-6">
              <h1 className="mb-6 text-3xl font-bold text-[var(--textPrimary)]">Profile</h1>
              <div className="space-y-4">
                <div className="p-4 rounded-md bg-[var(--background)]">
                  <p className="text-[var(--textPrimary)]"><span className="font-semibold">Email:</span> {profileData.user.email}</p>
                </div>
                <div className="p-4 rounded-md bg-[var(--background)]">
                  <p className="text-[var(--textPrimary)]"><span className="font-semibold">Username:</span> {profileData.user.username}</p>
                </div>
                <div className="p-4 rounded-md bg-[var(--background)]">
                  <p className="text-[var(--textPrimary)]"><span className="font-semibold">Company Name:</span> {profileData.company_name}</p>
                </div>
                <div className="p-4 rounded-md bg-[var(--background)]">
                  <p className="text-[var(--textPrimary)]"><span className="font-semibold">Contact Info:</span> {profileData.contact_info}</p>
                </div>
                <div className="p-4 rounded-md bg-[var(--background)]">
                  <p className="text-[var(--textPrimary)]"><span className="font-semibold">Ad Campaign:</span> {profileData.ad_campaign}</p>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 text-white rounded-md bg-[var(--primary)] hover:bg-[var(--primaryHover)] transition-colors"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={request_to_delete}
                    className="px-6 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
                  >
                    Request Account Deletion
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Advertiser_profile;
