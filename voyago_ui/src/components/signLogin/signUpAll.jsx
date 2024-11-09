import { useState } from "react";
import axios from "axios";
import "./signUp.css";

function SignUp() {
  const [done, Setdone] = useState(false);
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
  const [user_Id, SetUserId] = useState(null);

  const handleUploading = (e) => {};

  const handleNext = (e) => {
    e.preventDefault();
    const step1Data = {
      username: username,
      password: password,
      email: email,
      role: role.toUpperCase(),
    };
    const register_user = async () => {
      console.log(step1Data);
      try {
        const response = await axios.post(
          "http://localhost:8000/api/user/create-user",
          step1Data
        );
        if (response.status === 201) {
          setStep(2);
          SetUserId(response.data._id);
        } else {
          throw new Error("Registration failed");
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
    register_user();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate mobile number format

    const mobilePattern = /^[0-9-]*$/;
    if (
      (role === "TOURIST" || role === "TOUR_GUIDE" || role === "ADVERTISER") &&
      !mobilePattern.test(mobile)
    ) {
      alert("Please enter a valid mobile number.");
      setMobile("");
      return;
    }
    if ((role == "ADVERTISER") & !mobilePattern.test(hotline)) {
      alert("Please enter a valid hotline number.");
      setHotline("");
      return;
    }

    // Handle form submission logic here

    const step2Data = {
      user: user_Id,
      dob: role === "TOURIST" || role === "TOUR_GUIDE" ? dob : undefined,
      phone_number:
        role === "TOURIST" || role === "TOUR_GUIDE" || role === "ADVERTISER"
          ? mobile
          : undefined,

      nationality: role === "TOURIST" ? nationality : undefined,
      is_student: role === "TOURIST" ? isStudent : undefined,
      years_of_experience:
        role === "TOUR_GUIDE" ? yearsOfExperience : undefined,
      previous_work: role === "TOUR_GUIDE" ? previousWork : undefined,
      URL_Website: role === "ADVERTISER" ? website : undefined,
      company_hotline: role === "ADVERTISER" ? hotline : undefined,
      company_name:
        role === "ADVERTISER" || role === "SELLER" ? companyName : undefined,
      store_name: role === "SELLER" ? companyName : undefined,
      contact_info: role === "ADVERTISER" ? companyInfo : undefined,
      description: role === "SELLER" ? description : undefined,
    };
    console.log({ step2Data });
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
    const registerUser = async () => {
      try {
        console.log(url);
        console.log(role);
        const response = await axios.post(url, step2Data);
        if (response.status === 201 || response.status === 200) {
          alert("Registration successful");
          Setdone(true);
          setTimeout(() => {
            window.location.href = "http://localhost:5173/";
          }, 3000);
        } else {
          throw new Error("Registration failed");
        }
      } catch (err) {
        console.error(err);
      }
    };

    registerUser(url);
  };

  return (
    <div className="signup-form">
      {done && (
        <div>
          <h1>
            Registration has been Successful!, Please wait until we Review your
            Application
            {/* {setTimeout(() => {
              window.location.href = "http://localhost:5173/";
            }, 3000)} */}
          </h1>
        </div>
      )}
      {step === 1 && (
        <form onSubmit={handleNext}>
          <label htmlFor="role">Select Role:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="TOURIST">Tourist</option>
            <option value="ADVERTISER">Advertiser</option>
            <option value="TOUR_GUIDE">TourGuide</option>
            <option value="SELLER">Seller</option>
          </select>

          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Next</button>
        </form>
      )}

      {step === 2 && !done && role === "TOURIST" && (
        <form onSubmit={handleSubmit}>
          <label htmlFor="dob">Date of Birth:</label>
          <input
            type="date"
            id="dob"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />

          <label htmlFor="mobile">Mobile No:</label>
          <input
            type="tel"
            id="mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            pattern="[0-9-]*"
            placeholder="123-456-789"
            required
          />
          <label htmlFor="nationality">Nationality:</label>
          <input
            type="text"
            id="nationality"
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            required
          />

          <label htmlFor="isStudent">Are you a student?</label>
          <input
            type="checkbox"
            id="isStudent"
            checked={isStudent}
            onChange={(e) => setIsStudent(e.target.checked)}
          />

          <button type="submit">Submit</button>
        </form>
      )}

      {step === 2 && !done && role === "TOUR_GUIDE" && (
        <form onSubmit={handleSubmit}>
          <label htmlFor="dob">Date of Birth:</label>
          <input
            type="date"
            id="dob"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />

          <label htmlFor="mobile">Mobile No:</label>
          <input
            type="tel"
            id="mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            pattern="[0-9-]*"
            placeholder="123-456-789"
            required
          />

          <label htmlFor="yearsOfExperience">Years of Experience:</label>
          <input
            type="number"
            id="yearsOfExperience"
            value={yearsOfExperience}
            onChange={(e) => setYearsOfExperience(e.target.value)}
            min="0"
            max="100"
            required
          />

          <label htmlFor="previousWork">Previous Work (if exists):</label>
          <input
            type="text"
            id="previousWork"
            value={previousWork}
            onChange={(e) => setPreviousWork(e.target.value)}
          />

          <p>
            Please upload a doucment which includes Your ID and certificates
            registery card
          </p>

          <label>Upload Document:</label>
          <input
            type="file"
            id="document"
            required
            onChange={(e) => handleUploading(e)}
          />

          <button type="submit">Submit</button>
        </form>
      )}

      {step === 2 && !done && role === "ADVERTISER" && (
        <form onSubmit={handleSubmit}>
          <label htmlFor="website">Link to my website:</label>
          <input
            type="url"
            id="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            required
          />

          <label htmlFor="hotline">Company_Hotline:</label>
          <input
            type="tel"
            id="hotline"
            value={hotline}
            onChange={(e) => setHotline(e.target.value)}
            pattern="[0-9-]*"
            required
            placeholder="123-456-789"
          />

          <label htmlFor="companyName">Company Name:</label>
          <input
            type="text"
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />

          <label htmlFor="companyInfo">Company Info:</label>
          <textarea
            id="companyInfo"
            value={companyInfo}
            onChange={(e) => setCompanyInfo(e.target.value)}
            required
          />
          <p>
            Please upload a doucment which includes the ID and taxation
            registery card
          </p>

          <label>Upload Document:</label>
          <input
            type="file"
            id="document"
            required
            onChange={(e) => handleUploading(e)}
          />

          <button type="submit">Submit</button>
        </form>
      )}

      {step === 2 && !done && role === "SELLER" && (
        <form onSubmit={handleSubmit}>
          <label htmlFor="companyName">store Name:</label>
          <input
            type="text"
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <p>
            Please upload a doucment which includes Your ID and taxation
            registery card registery card
          </p>

          <label>Upload Document:</label>
          <input
            type="file"
            id="document"
            required
            onChange={(e) => handleUploading(e)}
          />
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
}

export default SignUp;
