// import React, { useState } from "react";
// import axios from "axios";
// import ForgotPasswordForm from "./forgetpassword.jsx";

// const handleSubmit = (e, setShowTerms, setUserId) => {
//   e.preventDefault();
//   const username = e.target.username.value;
//   const password = e.target.password.value;
//   login(username, password, setShowTerms, setUserId);
// };

// const login = async (username, password, setShowTerms, setUserId) => {
//   try {
//     console.log("Attempting login for:", username);
//     const response = await axios.post("http://localhost:8000/api/user/login", {
//       username,
//       password,
//     });

//     if (response.status === 200) {
//       const {
//         token,
//         user,
//         tourist,
//         tour_guide,
//         tour_governor,
//         seller,
//         advertiser,
//         admin,
//       } = response.data;
//       console.log("Response data:", response.data);

//       // Get role from user object
//       const roleName = user.role;
//       let roleId = null;

//       // Determine roleId based on role
//       switch (roleName) {
//         case "TOURIST":
//           roleId = tourist?._id;
//           break;
//         case "TOUR_GUIDE":
//           roleId = tour_guide?._id;
//           break;
//         case "TOUR_GOVERNOR":
//           roleId = tour_governor?._id;
//           break;
//         case "SELLER":
//           roleId = seller?._id;
//           break;
//         case "ADVERTISER":
//           roleId = advertiser?._id;
//           break;
//         case "ADMIN":
//           roleId = admin?._id;
//           break;
//         default:
//           console.error("Unknown role:", roleName);
//       }

//       console.log("Role found:", roleName, "with ID:", roleId);

//       // Store data in localStorage
//       localStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify(user));

//       if (roleId) {
//         localStorage.setItem("roleId", roleId);
//         localStorage.setItem("roleName", roleName);
//       } else {
//         console.error("No roleId found for role:", roleName);
//         throw new Error(`No roleId found for ${roleName}`);
//       }

//       alert("Login successful");

//       // Handle redirects
//       switch (roleName) {
//         case "TOURIST":
//           window.location.href = "http://localhost:5173/Tourist_Dashboard";
//           break;
//         case "ADMIN":
//           window.location.href = "http://localhost:5173/Admin_Dashboard";
//           break;
//         case "TOUR_GOVERNOR":
//           window.location.href = "http://localhost:5173/GovernorLandmarks";
//           break;
//         case "TOUR_GUIDE":
//           window.location.href = "http://localhost:5173/Guide_Dashboard";
//           break;
//         case "SELLER":
//           window.location.href = "http://localhost:5173/Seller_Dashboard";
//           break;
//         case "ADVERTISER":
//           window.location.href = "http://localhost:5173/Advertiser_Dashboard";
//           break;
//         default:
//           console.log(`No redirect specified for role: ${roleName}`);
//       }
//     } else if (response.status === 201) {
//       setShowTerms(true);
//       const userId = response.data.userId;
//       setUserId(userId);
//     }
//   } catch (error) {
//     console.error("Login error:", error);
//     if (error.response) {
//       alert(`Login failed: ${error.response.data.message}`);
//     } else {
//       alert(`Login failed: ${error.message}`);
//     }
//   }
// };

// function Login() {
//   const [showTerms, setShowTerms] = useState(false);
//   const [userId, setUserId] = useState(null);
//   const [showForgotPassword, setShowForgotPassword] = useState(false); // New state for "Forgot Password" form

//   const handleAccept = async () => {
//     try {
//       await axios.put(`http://localhost:8000/api/user/update-user/${userId}`, {
//         terms_and_conditions: true,
//         is_new: false,
//       });
//       setShowTerms(false);
//       alert("Terms and conditions accepted. You can now use the system!");
//       window.location.reload();
//     } catch (error) {
//       console.error("Error accepting terms:", error);
//       alert("Error accepting terms and conditions. Please try again.");
//     }
//   };

//   const handleDecline = () => {
//     setShowTerms(false);
//     alert("You must accept the terms and conditions to use the system!");
//   };

//   const handleForgotPassword = () => {
//     setShowForgotPassword(true); // Show the forgot password form
//   };

//   return (
//     <div className="login">
//       {showForgotPassword ? (
//         <ForgotPasswordForm setShowForgotPassword={setShowForgotPassword} />
//       ) : showTerms ? (
//         <div className="terms">
//           <h2 className="terms-title">Terms and Conditions</h2>
//           <div className="terms-content">
//             <p>
//               By using this service, you agree to the following terms and
//               conditions...
//             </p>
//             <p>Please read these terms carefully before continuing.</p>
//             <div className="terms-actions">
//               <button onClick={handleAccept} className="btn-accept">
//                 Accept
//               </button>
//               <button onClick={handleDecline} className="btn-decline">
//                 Decline
//               </button>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <form
//           className="login-form"
//           onSubmit={(e) => handleSubmit(e, setShowTerms, setUserId)}
//         >
//           <div className="form-group">
//             <label htmlFor="username">Username:</label>
//             <input type="text" id="username" required />
//           </div>
//           <div className="form-group">
//             <label htmlFor="password">Password:</label>
//             <input type="password" id="password" required />
//           </div>
//           <button type="submit" className="btn btn-primary">
//             Login
//           </button>
//           <button
//             type="button"
//             onClick={handleForgotPassword}
//             className="btn btn-link"
//           >
//             Forgot Password?
//           </button>
//         </form>
//       )}
//       <style>
//         {`
//           .login {
//             font-family: Arial, sans-serif;
//             background-color: #f4f4f4;
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             height: 100vh;
//             margin: 0;
//           }

//           .login-form {
//             background-color: #ffffff;
//             padding: 20px;
//             border-radius: 8px;
//             box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//             width: 300px;
//             display: flex;
//             flex-direction: column;
//           }

//           .form-group {
//             margin-bottom: 15px;
//           }

//           .form-group label {
//             font-weight: bold;
//             color: #333;
//           }

//           .form-group input {
//             padding: 10px;
//             border-radius: 4px;
//             border: 1px solid #cccccc;
//             font-size: 16px;
//             width: 90%;
//           }

//           .form-group input:focus {
//             border-color: #007bff;
//             outline: none;
//           }

//           .btn {
//             padding: 10px;
//             border: none;
//             border-radius: 4px;
//             color: white;
//             font-size: 16px;
//             cursor: pointer;
//           }

//           .btn-primary {
//             background-color: #007bff;
//             transition: background-color 0.3s ease;
//           }

//           .btn-primary:hover {
//             background-color: #0056b3;
//           }

//           .btn-link {
//             background-color: transparent;
//             color: #007bff;
//             text-decoration: none;
//             margin-top: 10px;
//           }

//           .btn-link:hover {
//             color: #0056b3;
//           }

//           .terms {
//             background-color: #ffffff;
//             padding: 20px;
//             border-radius: 8px;
//             box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//             width: 400px;
//             text-align: center;
//           }

//           .terms-title {
//             font-size: 24px;
//             margin-bottom: 20px;
//           }

//           .terms-content {
//             font-size: 16px;
//             margin-bottom: 20px;
//           }

//           .terms-actions {
//             display: flex;
//             justify-content: center;
//             gap: 10px;
//           }

//           .btn-accept {
//             background-color: #28a745;
//           }

//           .btn-decline {
//             background-color: #dc3545;
//           }

//           .btn-accept, .btn-decline {
//             padding: 10px 20px;
//             color: white;
//             font-size: 16px;
//             border: none;
//             border-radius: 4px;
//             cursor: pointer;
//           }

//           .btn-accept:hover {
//             background-color: #218838;
//           }

//           .btn-decline:hover {
//             background-color: #c82333;
//           }
//         `}
//       </style>
//     </div>
//   );
// }

// export default Login;

//above works just fine just in case
import image from "../../assets/205255760.png";
import background from "../../assets/Login.jpg";
import React, { useState } from "react";
import axios from "axios";
import { FaUser, FaLock } from "react-icons/fa";
import ForgotPasswordForm from "./forgetpassword.jsx";

const handleSubmit = (e, setShowTerms, setUserId) => {
  e.preventDefault();
  const username = e.target.username.value;
  const password = e.target.password.value;
  login(username, password, setShowTerms, setUserId);
};

const login = async (username, password, setShowTerms, setUserId) => {
  try {
    console.log("Attempting login for:", username);
    const response = await axios.post("http://localhost:8000/api/user/login", {
      username,
      password,
    });

    if (response.status === 200) {
      const {
        token,
        user,
        tourist,
        tour_guide,
        tour_governor,
        seller,
        advertiser,
        admin,
      } = response.data;
      console.log("Response data:", response.data);

      const roleName = user.role;
      let roleId = null;

      switch (roleName) {
        case "TOURIST":
          roleId = tourist?._id;
          break;
        case "TOUR_GUIDE":
          roleId = tour_guide?._id;
          break;
        case "TOUR_GOVERNOR":
          roleId = tour_governor?._id;
          break;
        case "SELLER":
          roleId = seller?._id;
          break;
        case "ADVERTISER":
          roleId = advertiser?._id;
          break;
        case "ADMIN":
          roleId = admin?._id;
          break;
        default:
          console.error("Unknown role:", roleName);
      }

      console.log("Role found:", roleName, "with ID:", roleId);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (roleId) {
        localStorage.setItem("roleId", roleId);
        localStorage.setItem("roleName", roleName);
      } else {
        console.error("No roleId found for role:", roleName);
        throw new Error(`No roleId found for ${roleName}`);
      }

      alert("Login successful");

      switch (roleName) {
        case "TOURIST":
          window.location.href = "http://localhost:5173/Tourist_Dashboard";
          break;
        case "ADMIN":
          window.location.href = "http://localhost:5173/Admin_Dashboard";
          break;
        case "TOUR_GOVERNOR":
          window.location.href = "http://localhost:5173/GovernorLandmarks";
          break;
        case "TOUR_GUIDE":
          window.location.href = "http://localhost:5173/Guide_Dashboard";
          break;
        case "SELLER":
          window.location.href = "http://localhost:5173/Seller_Dashboard";
          break;
        case "ADVERTISER":
          window.location.href = "http://localhost:5173/Advertiser_Dashboard";
          break;
        default:
          console.log(`No redirect specified for role: ${roleName}`);
      }
    } else if (response.status === 201) {
      setShowTerms(true);
      const userId = response.data.userId;
      setUserId(userId);
    } else if (response.status === 202) {
      alert("Your documents are still under review. Please check back later.");
    }
  } catch (error) {
    console.error("Login error:", error);
    if (error.response) {
      alert(`Login failed: ${error.response.data.message}`);
    } else {
      alert(`Login failed: ${error.message}`);
    }
  }
};

function Login() {
  const [showTerms, setShowTerms] = useState(false);
  const [userId, setUserId] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleAccept = async () => {
    try {
      await axios.put(`http://localhost:8000/api/user/update-user/${userId}`, {
        terms_and_conditions: true,
        is_new: false,
      });
      setShowTerms(false);
      alert("Terms and conditions accepted. You can now use the system!");
      window.location.reload();
    } catch (error) {
      console.error("Error accepting terms:", error);
      alert("Error accepting terms and conditions. Please try again.");
    }
  };

  const handleDecline = () => {
    setShowTerms(false);
    alert("You must accept the terms and conditions to use the system!");
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  return (
    <div className="login">
      <div className="login-container">
        {showForgotPassword ? (
          <ForgotPasswordForm setShowForgotPassword={setShowForgotPassword} />
        ) : showTerms ? (
          <div className="terms">
            <h2 className="terms-title">Terms and Conditions</h2>
            <div className="terms-content">
              <p>
                By using this service, you agree to the following terms and
                conditions...
              </p>
              <p>Please read these terms carefully before continuing.</p>
            </div>
            <div className="terms-actions">
              <button onClick={handleAccept} className="btn-accept">
                Accept
              </button>
              <button onClick={handleDecline} className="btn-decline">
                Decline
              </button>
            </div>
          </div>
        ) : (
          <div className="login-content">
            <div className="logo-container">
              <img src={image} alt="Voyago Logo" className="logo" />
            </div>

            <h1 className="welcome-text">Welcome Back!</h1>
            <p className="subtitle">Sign in to continue your journey</p>
            <form
              className="login-form"
              onSubmit={(e) => handleSubmit(e, setShowTerms, setUserId)}
            >
              <div className="form-group">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  id="username"
                  placeholder="Username"
                  required
                />
              </div>
              <div className="form-group">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  required
                />
              </div>
              <button type="submit" className="submit-button">
                Sign In
              </button>
            </form>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="btn btn-link"
            >
              Forgot Password?
            </button>
          </div>
        )}
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

        .login {
          font-family: 'Poppins', sans-serif;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
         background-image: url(${background});
          background-size: cover; /* Ensure the image covers the entire container */
          background-position: center; /* Center the image */
          background-repeat: no-repeat; /* Prevent the image from repeating */
        }

        .login-container {
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          padding: 32px;
          width: 100%;
          max-width: 420px;
          margin: 20px;
        }

        .logo-container {
        display: flex;
        justify-content: center;
          text-align: center;
         
        }

        .logo {
          width: 140px;
          height: auto;
        }

        .welcome-text {
          font-size: 24px;
          font-weight: 600;
          color: #1a2a6c;
          text-align: center;
          margin-bottom: 8px;
        }

        .subtitle {
          font-size: 14px;
          color: #666666;
          text-align: center;
          margin-bottom: 24px;
        }

        .login-form {
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

        .form-group input {
          width: 100%;
          padding: 12px 12px 12px 40px;
          border: 1px solid #cccccc;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        .form-group input:focus {
          border-color: #1a2a6c;
          outline: none;
          box-shadow: 0 0 0 3px rgba(26, 42, 108, 0.1);
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

        button[type="submit"] {
          background-color: #1a2a6c;
          color: #ffffff;
        }
         
     
        .btn-link {
          background-color: transparent;
          color: #1a2a6c;
          text-decoration: none;
          margin-top: 16px;
        }

        .btn-link:hover {
          color: #15215a;
        }


        .terms {
          text-align: center;
        }

        .terms-title {
          font-size: 20px;
          font-weight: 600;
          color: #1a2a6c;
          margin-bottom: 16px;
        }

        .terms-content {
          color: #666666;
          margin-bottom: 24px;
        }

        .terms-actions {
          display: flex;
          justify-content: center;
          gap: 16px;
        }

        .btn-accept,
        .btn-decline {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-accept {
          background-color: #28a745;
          color: #ffffff;
        }

        .btn-decline {
          background-color: #dc3545;
          color: #ffffff;
        }

        .btn-accept:hover,
        .btn-decline:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        @media (max-width: 480px) {
          .login-container {
            margin: 10px;
            padding: 20px;
          }

          .welcome-text {
            font-size: 20px;
          }

          .subtitle {
            font-size: 12px;
          }

          .form-group input {
            padding: 10px 10px 10px 36px;
          }
        }
      `}</style>
    </div>
  );
}

export default Login;
