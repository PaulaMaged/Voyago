// import { useState, useEffect } from "react";
// import PropTypes from "prop-types";
// import "./Profile.css";
// import axios from "axios";

// function Tourist_profile({ userId, touristId }) {
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:8000/api/tourist/get-tourist/${touristId}`
//         );
//         if (response.status === 200) {
//           const data = response.data;
//           setProfileData(data);
//           console.log(response.data);
//           setError(false);
//           setPending(false);
//         } else {
//           console.log("Error fetching data");
//         }
//       } catch (error) {
//         setError(true);
//         setPending(false);
//         console.log(error.message);
//       }
//     };
//     fetchData();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsEditing(false);
//     try {
//       const response2 = await axios.put(
//         `http://localhost:8000/api/user/update-user/${userId}`,
//         {
//           email: profileData.user.email,
//         }
//       );

//       if (response2.status !== 200) {
//         return alert("Email already exists");
//       }
//       const response = await axios.put(
//         `http://localhost:8000/api/tourist/update-tourist/${profileData._id}`,
//         {
//           phone_number: profileData.phone_number,
//           nationality: profileData.nationality,
//           is_student: profileData.is_student,
//         }
//       );

//       if (response.status === 200) {
//         alert("Profile updated successfully");
//       } else {
//         console.log("Error fetching data");

//         throw new Error("Profile update failed");
//       }
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   const request_to_delete = async () => {
//     try {
//       const response = await axios.put(
//         `http://localhost:8000/api/user/update-user/${userId}`,
//         {
//           requested_to_be_deleted: true,
//         }
//       );
//       if (response.status === 200) {
//         alert(
//           "Request to delete account sent successfully please check your inbox for updates!"
//         );
//         setTimeout(() => {
//           window.location.href = "http://localhost:5173/";
//         }, 1500);

//         //i want to logout the user after sending the request
//       }
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   let currentCurrency = localStorage.getItem("currency");
//   if (!currentCurrency) {
//     currentCurrency = "USD";
//     localStorage.setItem("currency", currentCurrency);
//   }

//   const [profileData, setProfileData] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isPending, setPending] = useState(true);
//   const [error, setError] = useState(null);
//   const [currency, setCurrency] = useState("");

//   const handleCurrency = (e) => {
//     const currency = e.target.value;
//     setCurrency(currency);
//     localStorage.setItem("currency", currency);
//     console.log(currency);
//   };

//   return (
//     <div className="profile-container">
//       {isPending && <div>Loading...</div>}
//       {error && <div>Something went wrong. Please try again later.</div>}
//       <div>
//         {!error &&
//           profileData &&
//           (isEditing ? (
//             <div className="updating-profile">
//               <h1>Update Profile:</h1>
//               <form className="profile-form" onSubmit={handleSubmit}>
//                 <label htmlFor="email">Email:</label>
//                 <input
//                   id="email"
//                   type="email"
//                   required
//                   value={profileData.user.email}
//                   onChange={(e) =>
//                     setProfileData({
//                       ...profileData,
//                       user: { ...profileData.user, email: e.target.value },
//                     })
//                   }
//                   className="profile-input"
//                 />

//                 <label htmlFor="mobile_number">Mobile Number:</label>
//                 <input
//                   id="mobile_number"
//                   type="text"
//                   required
//                   value={profileData.phone_number}
//                   onChange={(e) =>
//                     setProfileData({
//                       ...profileData,
//                       phone_number: e.target.value,
//                     })
//                   }
//                   className="profile-input"
//                 />

//                 <label htmlFor="nationality">Nationality:</label>
//                 <input
//                   id="nationality"
//                   type="text"
//                   required
//                   value={profileData.nationality}
//                   onChange={(e) =>
//                     setProfileData({
//                       ...profileData,
//                       nationality: e.target.value,
//                     })
//                   }
//                   className="profile-input"
//                 />

//                 <label htmlFor="is_student">Is Student:</label>
//                 <input
//                   id="is_student"
//                   type="checkbox"
//                   checked={profileData.is_student}
//                   onChange={(e) =>
//                     setProfileData({
//                       ...profileData,
//                       is_student: e.target.checked,
//                     })
//                   }
//                   className="profile-input"
//                 />
//                 <label>Currency of choice:</label>
//                 <select
//                   name="currency"
//                   value={currency}
//                   onChange={handleCurrency}
//                 >
//                   <option value="" disabled>
//                     Select currency
//                   </option>
//                   <option value="EGY">EGY</option>
//                   <option value="USD">USD</option>
//                 </select>
//                 <p></p>
//                 <button type="submit" className="profile-button">
//                   Update
//                 </button>
//               </form>
//             </div>
//           ) : (
//             <div className="viewing-profile">
//               <h1>Profile</h1>
//               <p>Username: {profileData.user.username}</p>
//               <p>Email: {profileData.user.email}</p>

//               <p>Mobile Number: {profileData.phone_number}</p>
//               <p>Nationality: {profileData.nationality}</p>
//               <p>Date of Birth: {profileData.DOB}</p>
//               <p>Is Student: {profileData.is_student ? "Yes" : "No"}</p>
//               <p>Wallet: {profileData.wallet}</p>
//               <p>Currency of choice: {localStorage.getItem("currency")}</p>
//               <button
//                 onClick={() => setIsEditing(true)}
//                 className="profile-button"
//               >
//                 Edit Profile
//               </button>
//             </div>
//           ))}
//       </div>
//       <br></br>
//       <br></br>
//       <button
//         style={{ backgroundColor: "red" }}
//         className="profile-button"
//         id="deletionReq"
//         onClick={request_to_delete}
//       >
//         Request to delete acount
//       </button>
//     </div>
//   );
// }
// Tourist_profile.propTypes = {
//   userId: PropTypes.string.isRequired,
//   touristId: PropTypes.string.isRequired,
// };

// export default Tourist_profile;

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {
  FaPencilAlt,
  FaTrashAlt,
  FaSpinner,
  FaUserCircle,
} from "react-icons/fa";
import currencyConversions from "../../helpers/currencyConversions";

function Tourist_profile({ userId, touristId }) {
  const [profileData, setProfileData] = useState({
    user: { email: '', username: '' },
    phone_number: '',
    nationality: '',
    is_student: false,
    wallet: 0,
    DOB: ''
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, setPending] = useState(true);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState(
    localStorage.getItem("currency") || "USD"
  );
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get profile data
        const profileResponse = await axios.get(
          `http://localhost:8000/api/tourist/get-tourist/${touristId}`
        );

        if (profileResponse.status === 200) {
          profileResponse.data.wallet = currencyConversions.convertFromDB(
            profileResponse.data.wallet
          );
          setProfileData(profileResponse.data);
        }

        // Try to get profile picture, but don't block on failure
        try {
          const pictureResponse = await axios.get(
            `http://localhost:8000/api/tourist/profile-picture/${touristId}`
          );
          if (pictureResponse.status === 200) {
            setProfilePicture(pictureResponse.data.image_url);
          }
        } catch (pictureError) {
          console.log("No profile picture found");
        }

        setPending(false);
      } catch (error) {
        setError(error.message);
        setPending(false);
      }
    };
    fetchData();
  }, [touristId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsEditing(false);
    try {
      let formData = new FormData();
      formData.append("email", profileData.user.email);
      formData.append("phone_number", profileData.phone_number);
      formData.append("nationality", profileData.nationality);
      formData.append("is_student", profileData.is_student);
      
      if (file) {
        formData.append("profile_picture", file);
        
        // Upload profile picture
        const uploadResponse = await axios.post(
          `http://localhost:8000/api/tourist/upload-profile-picture/${profileData._id}`,
          formData,
          { 
            headers: { 
              "Content-Type": "multipart/form-data" 
            } 
          }
        );

        if (uploadResponse.status === 200) {
          setProfilePicture(uploadResponse.data.image_url);
        }
      }

      // Update other tourist information
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
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.response?.data?.message || "Error updating profile");
    }
  };

  const handleCurrency = (e) => {
    const newCurrency = e.target.value;
    setCurrency(newCurrency);
    localStorage.setItem("currency", newCurrency);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
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
        alert("Request to delete account sent successfully!");
        setTimeout(() => (window.location.href = "/"), 1500);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  if (isPending)
    return (
      <div className="flex justify-center items-center">
        <FaSpinner className="animate-spin text-teal-600 text-3xl" />
      </div>
    );
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
      <div className="flex justify-center mb-4">
        {profilePicture ? (
          <img
            src={`http://localhost:8000/uploads/${profilePicture}`}
            alt="Profile"
            className="rounded-full w-24 h-24 object-cover"
          />
        ) : (
          <FaUserCircle className="text-teal-600 text-6xl" />
        )}
      </div>

      {/* Displaying Profile */}
      {!isEditing ? (
        <div className="space-y-4">
          <div>
            <strong>Username:</strong> {profileData.user.username}
          </div>
          <div>
            <strong>Email:</strong> {profileData.user.email}
          </div>
          <div>
            <strong>Mobile Number:</strong> {profileData.phone_number}
          </div>
          <div>
            <strong>Nationality:</strong> {profileData.nationality}
          </div>
          <div>
            <strong>Date of Birth:</strong> {profileData.DOB}
          </div>
          <div>
            <strong>Is Student:</strong> {profileData.is_student ? "Yes" : "No"}
          </div>
          <div>
            <strong>Wallet:</strong> {profileData.wallet}
          </div>
          <div>
            <strong>Currency of Choice:</strong> {currency}
          </div>

          <div className="flex space-x-4 mt-4">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              <FaPencilAlt className="mr-2" /> Edit Profile
            </button>
            <button
              onClick={request_to_delete}
              className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <FaTrashAlt className="mr-2" /> Request to Delete Account
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              name="phone_number"
              value={profileData.phone_number || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nationality
            </label>
            <input
              type="text"
              name="nationality"
              value={profileData.nationality || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="is_student"
                checked={profileData.is_student || false}
                onChange={handleInputChange}
                className="rounded text-teal-600"
              />
              <span className="text-sm text-gray-700">Student</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Profile Picture
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

Tourist_profile.propTypes = {
  userId: PropTypes.string.isRequired,
  touristId: PropTypes.string.isRequired,
};

export default Tourist_profile;
