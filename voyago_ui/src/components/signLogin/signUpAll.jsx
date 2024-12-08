// // SignUp.js

// import { useState } from "react";
// import axios from "axios";
// import "./signUp.css";

// function SignUp() {
//   const [done, setDone] = useState(false);
//   const [step, setStep] = useState(1);
//   const [role, setRole] = useState("TOURIST");
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [dob, setDob] = useState("");
//   const [mobile, setMobile] = useState("");
//   const [yearsOfExperience, setYearsOfExperience] = useState("");
//   const [previousWork, setPreviousWork] = useState("");
//   const [website, setWebsite] = useState("");
//   const [hotline, setHotline] = useState("");
//   const [companyName, setCompanyName] = useState("");
//   const [companyInfo, setCompanyInfo] = useState("");
//   const [description, setDescription] = useState("");
//   const [nationality, setNationality] = useState("");
//   const [isStudent, setIsStudent] = useState(false);
//   const [user_Id, setUserId] = useState(null);
//   const [document, setDocument] = useState(null); // New state for the uploaded file

//   const handleUploading = (e) => {
//     setDocument(e.target.files[0]); // Store the selected file in state
//     console.log("Selected file:", e.target.files[0]);
//   };

//   const handleNext = (e) => {
//     e.preventDefault();
//     const step1Data = {
//       username: username,
//       password: password,
//       email: email,
//       role: role.toUpperCase(),
//     };
//     const register_user = async () => {
//       console.log("Step 1 Data:", step1Data);
//       try {
//         const response = await axios.post(
//           "http://localhost:8000/api/user/create-user",
//           step1Data
//         );
//         if (response.status === 201) {
//           setStep(2);
//           setUserId(response.data._id);
//         } else {
//           throw new Error("Registration failed");
//         }
//       } catch (error) {
//         if (error.response && error.response.status === 400) {
//           alert(error.response.data.message);
//           if (error.response.data.message.includes("Username")) setUsername("");
//           else setEmail("");
//         } else {
//           console.error(error);
//           alert("An error occurred during registration.");
//           setEmail("");
//           setUsername("");
//         }
//       }
//     };
//     register_user();
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Validate mobile number format

//     const mobilePattern = /^[0-9-]*$/;
//     if (
//       (role === "TOURIST" || role === "TOUR_GUIDE" || role === "ADVERTISER") &&
//       !mobilePattern.test(mobile)
//     ) {
//       alert("Please enter a valid mobile number.");
//       setMobile("");
//       return;
//     }
//     if (role === "ADVERTISER" && !mobilePattern.test(hotline)) {
//       alert("Please enter a valid hotline number.");
//       setHotline("");
//       return;
//     }

//     const data_for_tourist = {
//       user: user_Id,
//       DOB: dob,
//       phone_number: mobile,
//       nationality: nationality,
//       is_student: isStudent,
//     };
//     // Create FormData object
//     const formData = new FormData();
//     formData.append("user", user_Id);
//     if (role === "TOURIST" || role === "TOUR_GUIDE") {
//       formData.append("dob", dob);
//       formData.append("phone_number", mobile);
//     }
//     if (role === "TOURIST") {
//       formData.append("nationality", nationality);
//       formData.append("is_student", isStudent);
//     }
//     if (role === "TOUR_GUIDE") {
//       formData.append("years_of_experience", yearsOfExperience);
//       formData.append("previous_work", previousWork);
//     }
//     if (role === "ADVERTISER") {
//       formData.append("URL_Website", website);
//       formData.append("company_hotline", hotline);
//       formData.append("company_name", companyName);
//       formData.append("contact_info", companyInfo);
//     }
//     if (role === "SELLER") {
//       formData.append("store_name", companyName);
//       formData.append("description", description);
//     }

//     // Append the file
//     if (document) {
//       formData.append("upFile", document); // Field name should match the backend
//       console.log("File appended to FormData:", document);
//     } else if (
//       role === "TOUR_GUIDE" ||
//       role === "ADVERTISER" ||
//       role === "SELLER"
//     ) {
//       alert("Please upload a document.");
//       return;
//     }

//     let url = "";
//     switch (role) {
//       case "TOURIST":
//         url = "http://localhost:8000/api/tourist/create-tourist";
//         break;
//       case "TOUR_GUIDE":
//         url = "http://localhost:8000/api/tour-guide/create-tourguide";
//         break;
//       case "ADVERTISER":
//         url = "http://localhost:8000/api/advertiser/create-advertiser";
//         break;
//       case "SELLER":
//         url = "http://localhost:8000/api/seller/create-seller";
//         break;
//       default:
//         url = "http://localhost:8000/api/user/register";
//     }

//     const registerUser = async () => {
//       try {
//         console.log("Submitting to URL:", url);
//         console.log("Role:", role);
//         let response = "";
//         if (role === "TOURIST") {
//           const response2 = await axios.post(url, data_for_tourist);
//           response = response2;
//         } else {
//           const response2 = await axios.post(url, formData);
//           response = response2;
//         }
//         console.log(response.status);

//         if (response.status === 201 || response.status === 200) {
//           alert("Registration successful");
//           setDone(true);
//           setTimeout(() => {
//             window.location.href = "http://localhost:5173/";
//           }, 3000);
//         } else {
//           throw new Error("Registration failed");
//         }
//       } catch (err) {
//         console.error("Error during registration:", err);
//         alert("An error occurred during registration.");
//       }
//     };

//     registerUser();
//   };

//   return (
//     <div className="signup-form">
//       {done && (
//         <div>
//           <h1>
//             Registration has been successful! Please wait until we review your
//             application.
//           </h1>
//         </div>
//       )}
//       {step === 1 && (
//         <form onSubmit={handleNext}>
//           <label htmlFor="role">Select Role:</label>
//           <select
//             id="role"
//             value={role}
//             onChange={(e) => setRole(e.target.value)}
//           >
//             <option value="TOURIST">Tourist</option>
//             <option value="ADVERTISER">Advertiser</option>
//             <option value="TOUR_GUIDE">Tour Guide</option>
//             <option value="SELLER">Seller</option>
//           </select>

//           <label htmlFor="username">Username:</label>
//           <input
//             type="text"
//             id="username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//           />

//           <label htmlFor="email">Email:</label>
//           <input
//             type="email"
//             id="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />

//           <label htmlFor="password">Password:</label>
//           <input
//             type="password"
//             id="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />

//           <button type="submit">Next</button>
//         </form>
//       )}

//       {step === 2 && !done && role === "TOURIST" && (
//         <form onSubmit={handleSubmit} encType="multipart/form-data">
//           <label htmlFor="dob">Date of Birth:</label>
//           <input
//             type="date"
//             id="dob"
//             value={dob}
//             onChange={(e) => setDob(e.target.value)}
//             required
//           />

//           <label htmlFor="mobile">Mobile No:</label>
//           <input
//             type="tel"
//             id="mobile"
//             value={mobile}
//             onChange={(e) => setMobile(e.target.value)}
//             pattern="[0-9-]*"
//             placeholder="123-456-789"
//             required
//           />
//           <label htmlFor="nationality">Nationality:</label>
//           <input
//             type="text"
//             id="nationality"
//             value={nationality}
//             onChange={(e) => setNationality(e.target.value)}
//             required
//           />

//           <label htmlFor="isStudent">Are you a student?</label>
//           <input
//             type="checkbox"
//             id="isStudent"
//             checked={isStudent}
//             onChange={(e) => setIsStudent(e.target.checked)}
//           />

//           <button type="submit">Submit</button>
//         </form>
//       )}

//       {step === 2 && !done && role === "TOUR_GUIDE" && (
//         <form onSubmit={handleSubmit} encType="multipart/form-data">
//           <label htmlFor="dob">Date of Birth:</label>
//           <input
//             type="date"
//             id="dob"
//             value={dob}
//             onChange={(e) => setDob(e.target.value)}
//             required
//           />

//           <label htmlFor="mobile">Mobile No:</label>
//           <input
//             type="tel"
//             id="mobile"
//             value={mobile}
//             onChange={(e) => setMobile(e.target.value)}
//             pattern="[0-9-]*"
//             placeholder="123-456-789"
//             required
//           />

//           <label htmlFor="yearsOfExperience">Years of Experience:</label>
//           <input
//             type="number"
//             id="yearsOfExperience"
//             value={yearsOfExperience}
//             onChange={(e) => setYearsOfExperience(e.target.value)}
//             min="0"
//             max="100"
//             required
//           />

//           <label htmlFor="previousWork">Previous Work (if any):</label>
//           <input
//             type="text"
//             id="previousWork"
//             value={previousWork}
//             onChange={(e) => setPreviousWork(e.target.value)}
//           />

//           <p>
//             Please upload a document that includes your ID and certificates or
//             registry card.
//           </p>

//           <label>Upload Document:</label>
//           <input
//             type="file"
//             id="document"
//             name="upFile" // Name should match the backend field
//             required
//             onChange={handleUploading}
//           />

//           <button type="submit">Submit</button>
//         </form>
//       )}

//       {step === 2 && !done && role === "ADVERTISER" && (
//         <form onSubmit={handleSubmit} encType="multipart/form-data">
//           <label htmlFor="website">Link to my website:</label>
//           <input
//             type="url"
//             id="website"
//             value={website}
//             onChange={(e) => setWebsite(e.target.value)}
//             required
//           />

//           <label htmlFor="hotline">Company Hotline:</label>
//           <input
//             type="tel"
//             id="hotline"
//             value={hotline}
//             onChange={(e) => setHotline(e.target.value)}
//             pattern="[0-9-]*"
//             required
//             placeholder="123-456-789"
//           />

//           <label htmlFor="companyName">Company Name:</label>
//           <input
//             type="text"
//             id="companyName"
//             value={companyName}
//             onChange={(e) => setCompanyName(e.target.value)}
//             required
//           />

//           <label htmlFor="companyInfo">Company Info:</label>
//           <textarea
//             id="companyInfo"
//             value={companyInfo}
//             onChange={(e) => setCompanyInfo(e.target.value)}
//             required
//           />
//           <p>
//             Please upload a document that includes the ID and taxation registry
//             card.
//           </p>

//           <label>Upload Document:</label>
//           <input
//             type="file"
//             id="document"
//             name="upFile" // Name should match the backend field
//             required
//             onChange={handleUploading}
//           />

//           <button type="submit">Submit</button>
//         </form>
//       )}

//       {step === 2 && !done && role === "SELLER" && (
//         <form onSubmit={handleSubmit} encType="multipart/form-data">
//           <label htmlFor="companyName">Store Name:</label>
//           <input
//             type="text"
//             id="companyName"
//             value={companyName}
//             onChange={(e) => setCompanyName(e.target.value)}
//             required
//           />
//           <label htmlFor="description">Description:</label>
//           <textarea
//             id="description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             required
//           />
//           <p>
//             Please upload a document that includes your ID and taxation registry
//             card.
//           </p>

//           <label>Upload Document:</label>
//           <input
//             type="file"
//             id="document"
//             name="upFile" // Name should match the backend field
//             required
//             onChange={handleUploading}
//           />
//           <button type="submit">Submit</button>
//         </form>
//       )}
//     </div>
//   );
// }

// export default SignUp;

//above works well

import { useState } from "react";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaCalendar,
  FaMobile,
  FaGlobe,
  FaBuilding,
  FaFileAlt,
} from "react-icons/fa";
import backgroundImage from "../../assets/signUp.png"; // You'll need to add this image
import logo from "../../assets/205255760.png";

function SignUp() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("TOURIST");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [mobile, setMobile] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [previousWork, setPreviousWork] = useState("");
  const [website, setWebsite] = useState("");
  const [hotline, setHotline] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyInfo, setCompanyInfo] = useState("");
  const [description, setDescription] = useState("");
  const [nationality, setNationality] = useState("");
  const [isStudent, setIsStudent] = useState(false);
  const [userId, setUserId] = useState(null);
  const [document, setDocument] = useState(null);
  const [done, setDone] = useState(false);

  const handleUploading = (e) => {
    setDocument(e.target.files[0]);
  };

  const handleNext = async (e) => {
    e.preventDefault();
    const step1Data = { username, password, email, role: role.toUpperCase() };
    try {
      const response = await axios.post(
        "http://localhost:8000/api/user/create-user",
        step1Data
      );
      if (response.status === 201) {
        setStep(2);
        setUserId(response.data._id);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message);
        if (error.response.data.message.includes("Username")) setUsername("");
        else setEmail("");
      } else {
        console.error(error);
        alert("An error occurred during registration.");
        setEmail("");
        setUsername("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const mobilePattern = /^[0-9-]*$/;
    if (
      (role === "TOURIST" || role === "TOUR_GUIDE" || role === "ADVERTISER") &&
      !mobilePattern.test(mobile)
    ) {
      alert("Please enter a valid mobile number.");
      setMobile("");
      return;
    }
    if (role === "ADVERTISER" && !mobilePattern.test(hotline)) {
      alert("Please enter a valid hotline number.");
      setHotline("");
      return;
    }

    const formData = new FormData();
    formData.append("user", userId);
    if (role === "TOURIST" || role === "TOUR_GUIDE") {
      formData.append("dob", dob);
      formData.append("phone_number", mobile);
    }
    if (role === "TOURIST") {
      formData.append("nationality", nationality);
      formData.append("is_student", isStudent);
    }
    if (role === "TOUR_GUIDE") {
      formData.append("years_of_experience", yearsOfExperience);
      formData.append("previous_work", previousWork);
    }
    if (role === "ADVERTISER") {
      formData.append("URL_Website", website);
      formData.append("company_hotline", hotline);
      formData.append("company_name", companyName);
      formData.append("contact_info", companyInfo);
    }
    if (role === "SELLER") {
      formData.append("store_name", companyName);
      formData.append("description", description);
    }

    if (document) {
      formData.append("upFile", document);
    } else if (
      role === "TOUR_GUIDE" ||
      role === "ADVERTISER" ||
      role === "SELLER"
    ) {
      alert("Please upload a document.");
      return;
    }

    let url = "";
    switch (role) {
      case "TOURIST":
        url = "http://localhost:8000/api/tourist/create-tourist";
        break;
      case "TOUR_GUIDE":
        url = "http://localhost:8000/api/tour-guide/create-tourguide";
        break;
      case "ADVERTISER":
        url = "http://localhost:8000/api/advertiser/create-advertiser";
        break;
      case "SELLER":
        url = "http://localhost:8000/api/seller/create-seller";
        break;
      default:
        url = "http://localhost:8000/api/user/register";
    }

    try {
      const response = await axios.post(url, formData);
      if (response.status === 201 || response.status === 200) {
        alert("Registration successful");
        setDone(true);
        setTimeout(() => {
          window.location.href = "http://localhost:5173/";
        }, 3000);
      }
    } catch (err) {
      console.error("Error during registration:", err);
      alert("An error occurred during registration.");
    }
  };

  return (
    <div className="signup">
      <div className="signup-container">
        {done ? (
          <div className="success-message">
            <h1>
              Registration has been successful! Please wait until we review your
              application.
            </h1>
          </div>
        ) : (
          <>
            <div className="logo-container">
              <img src={logo} alt="Voyago Logo" className="logo" />
            </div>
            <h1 className="welcome-text">Join Our Adventure</h1>
            <p className="subtitle">Sign up to start your journey</p>
            {step === 1 ? (
              <form onSubmit={handleNext} className="signup-form">
                <div className="form-group">
                  <label htmlFor="role">Select Role:</label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="TOURIST">Tourist</option>
                    <option value="ADVERTISER">Advertiser</option>
                    <option value="TOUR_GUIDE">Tour Guide</option>
                    <option value="SELLER">Seller</option>
                  </select>
                </div>
                <div className="form-group">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                  />
                </div>
                <div className="form-group">
                  <FaEnvelope className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                  />
                </div>
                <div className="form-group">
                  <FaLock className="input-icon" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Next
                </button>
              </form>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="signup-form"
                encType="multipart/form-data"
              >
                {(role === "TOURIST" || role === "TOUR_GUIDE") && (
                  <>
                    <div className="form-group">
                      <FaCalendar className="input-icon" />
                      <input
                        type="date"
                        id="dob"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <FaMobile className="input-icon" />
                      <input
                        type="tel"
                        id="mobile"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        pattern="[0-9-]*"
                        placeholder="Mobile No: 123-456-789"
                        required
                      />
                    </div>
                  </>
                )}
                {role === "TOURIST" && (
                  <>
                    <div className="form-group">
                      <FaGlobe className="input-icon" />
                      <input
                        type="text"
                        id="nationality"
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        placeholder="Nationality"
                        required
                      />
                    </div>
                    <div className="form-group checkbox">
                      <input
                        type="checkbox"
                        id="isStudent"
                        checked={isStudent}
                        onChange={(e) => setIsStudent(e.target.checked)}
                      />
                      <label htmlFor="isStudent">Are you a student?</label>
                    </div>
                  </>
                )}
                {role === "TOUR_GUIDE" && (
                  <>
                    <div className="form-group">
                      <input
                        type="number"
                        id="yearsOfExperience"
                        value={yearsOfExperience}
                        onChange={(e) => setYearsOfExperience(e.target.value)}
                        placeholder="Years of Experience"
                        min="0"
                        max="100"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        id="previousWork"
                        value={previousWork}
                        onChange={(e) => setPreviousWork(e.target.value)}
                        placeholder="Previous Work (if any)"
                      />
                    </div>
                  </>
                )}
                {role === "ADVERTISER" && (
                  <>
                    <div className="form-group">
                      <FaGlobe className="input-icon" />
                      <input
                        type="url"
                        id="website"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="Website URL"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <FaMobile className="input-icon" />
                      <input
                        type="tel"
                        id="hotline"
                        value={hotline}
                        onChange={(e) => setHotline(e.target.value)}
                        pattern="[0-9-]*"
                        placeholder="Company Hotline: 123-456-789"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <FaBuilding className="input-icon" />
                      <input
                        type="text"
                        id="companyName"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Company Name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <textarea
                        id="companyInfo"
                        value={companyInfo}
                        onChange={(e) => setCompanyInfo(e.target.value)}
                        placeholder="Company Info"
                        required
                      />
                    </div>
                  </>
                )}
                {role === "SELLER" && (
                  <>
                    <div className="form-group">
                      <FaBuilding className="input-icon" />
                      <input
                        type="text"
                        id="companyName"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Store Name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description"
                        required
                      />
                    </div>
                  </>
                )}
                {(role === "TOUR_GUIDE" ||
                  role === "ADVERTISER" ||
                  role === "SELLER") && (
                  <div className="form-group file-upload">
                    <FaFileAlt className="input-icon" />
                    <input
                      type="file"
                      id="document"
                      name="upFile"
                      onChange={handleUploading}
                      required
                    />
                    <label htmlFor="document">Upload Document</label>
                  </div>
                )}
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </form>
            )}
          </>
        )}
      </div>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");

        .signup {
          font-family: "Poppins", sans-serif;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-image: url(${backgroundImage});
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        .signup-container {
          background-color: rgba(255, 255, 255, 0.9);
          border-radius: 8px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          padding: 32px;
          width: 100%;
          max-width: 480px;
          margin: 20px;
        }

        .logo-container {
          text-align: center;
          margin-bottom: 24px;
        }

        .logo {
          width: 120px;
          height: auto;
        }

        .welcome-text {
          font-size: 28px;
          font-weight: 600;
          color: #1a2a6c;
          text-align: center;
          margin-bottom: 8px;
        }

        .subtitle {
          font-size: 16px;
          color: #666666;
          text-align: center;
          margin-bottom: 24px;
        }

        .signup-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #666666;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 12px 12px 12px 40px;
          border: 1px solid #cccccc;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: #1a2a6c;
          outline: none;
          box-shadow: 0 0 0 3px rgba(26, 42, 108, 0.1);
        }

        .form-group.checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .form-group.checkbox input {
          width: auto;
        }

        .form-group.file-upload {
          display: flex;
          align-items: center;
        }

        .form-group.file-upload input[type="file"] {
          display: none;
        }

        .form-group.file-upload label {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px;
          background-color: #f0f0f0;
          border: 1px solid #cccccc;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .form-group.file-upload label:hover {
          background-color: #e0e0e0;
        }

        .btn {
          width: 100%;
          padding: 12px 16px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background-color: #1a2a6c;
          color: #ffffff;
        }

        .btn-primary:hover {
          background-color: #15215a;
        }

        .success-message {
          text-align: center;
          color: #28a745;
        }

        @media (max-width: 480px) {
          .signup-container {
            margin: 10px;
            padding: 20px;
          }

          .welcome-text {
            font-size: 24px;
          }

          .subtitle {
            font-size: 14px;
          }

          .form-group input,
          .form-group select,
          .form-group textarea {
            padding: 10px 10px 10px 36px;
          }
        }
      `}</style>
    </div>
  );
}

export default SignUp;
