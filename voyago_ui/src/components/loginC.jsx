import { useState } from "react";

function LoginComp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [job, setJob] = useState("");
  const [dob, setDob] = useState("");
  const [nationality, setNationality] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      username,
      password,
      mobile,
      job,
      dob,
      nationality,
    });
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          required/>
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          required/>
          <input
            type="tel"
            id="mobile"
            placeholder="Mobile No"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          required/>
          <input
            type="text"
            id="job"
            placeholder="Job"
            value={job}
            onChange={(e) => setJob(e.target.value)}
          required/>
          <input
            type="date"
            id="dob"
            placeholder="Date of Birth"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          required/>
          <input
            type="text"
            id="nationality"
            placeholder="Nationality"
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
          required/>
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}

export default LoginComp;
