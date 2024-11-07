import React, { useState } from "react";
import "./signUp.css";

function SignUp() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("Tourist");
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

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    const step1Data = {
      role,
      username,
      email,
      password,
    };

    const step2Data = {
      dob: role === "Tourist" || role === "Tour Guide" ? dob : undefined,
      mobile: role === "Tourist" || role === "Tour Guide" ? mobile : undefined,
      yearsOfExperience: role === "Tour Guide" ? yearsOfExperience : undefined,
      previousWork: role === "Tour Guide" ? previousWork : undefined,
      website: role === "Advertiser" ? website : undefined,
      hotline: role === "Advertiser" ? hotline : undefined,
      companyName:
        role === "Advertiser" || role === "Seller" ? companyName : undefined,
      companyInfo: role === "Advertiser" ? companyInfo : undefined,
      description: role === "Seller" ? description : undefined,
    };

    console.log({ step1Data, step2Data });
  };

  return (
    <div className="signup-form">
      {step === 1 && (
        <form onSubmit={handleNext}>
          <label htmlFor="role">Select Role:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="Tourist">Tourist</option>
            <option value="Advertiser">Advertiser</option>
            <option value="Tour Guide">Tour Guide</option>
            <option value="Seller">Seller</option>
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

      {step === 2 && role === "Tourist" && (
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
            required
          />

          <button type="submit">Submit</button>
        </form>
      )}

      {step === 2 && role === "Tour Guide" && (
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

          <button type="submit">Submit</button>
        </form>
      )}

      {step === 2 && role === "Advertiser" && (
        <form onSubmit={handleSubmit}>
          <label htmlFor="website">Link to my website:</label>
          <input
            type="url"
            id="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            required
          />

          <label htmlFor="hotline">Hotline:</label>
          <input
            type="tel"
            id="hotline"
            value={hotline}
            onChange={(e) => setHotline(e.target.value)}
            pattern="[0-9-]*"
            required
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

          <button type="submit">Submit</button>
        </form>
      )}

      {step === 2 && role === "Seller" && (
        <form onSubmit={handleSubmit}>
          <label htmlFor="companyName">Name:</label>
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

          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
}

export default SignUp;
