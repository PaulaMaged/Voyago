import "./Changepassword.css";
import axios from "axios";
import { useState } from "react";

const handleSubmit = async (e, setIsChanged, setConfirmCurrentPassword) => {
  e.preventDefault();
  const currentPassword = e.target["current-password"].value;
  const newPassword = e.target["new-password"].value;
  const confirmPassword = e.target["confirm-password"].value;
  if (newPassword !== confirmPassword) {
    alert("Passwords do not match");
    return;
  } else {
    const current_actuall_password = await getcurrentpassword();
    if (currentPassword === current_actuall_password) {
      try {
        const response = await axios.put(
          `http://localhost:8000/api/user/change-password/${"672e356f3b83a1422019ef48"}`,
          {
            currentPassword: currentPassword,
            newPassword: newPassword,
          }
        );
        if (response.status === 200) {
          alert("Password changed successfully");

          setIsChanged(true);
        } else {
          alert("there was an error connection to the server");
        }
      } catch (error) {
        console.error("Error changing password:", error);
      }
    } else {
      setConfirmCurrentPassword(false);
      setTimeout(() => {
        setConfirmCurrentPassword(true);
      }, 2500);
    }
    console.log(
      current_actuall_password,
      currentPassword,
      newPassword,
      confirmPassword
    );
  }
};

const getcurrentpassword = async () => {
  try {
    const response = await axios.get(
      `http://localhost:8000/api/user/get-user-password/${"672e356f3b83a1422019ef48"}`
    );
    if (response.status === 200) {
      return response.data.password;
    } else {
      return response.data.password;
    }
  } catch (error) {
    console.error("Error changing password:", error);
  }
};

const setchange = setTimeout((setConfirmCurrentPassword) => {
  setConfirmCurrentPassword(true);
}, 2500);

function Changepassword() {
  const [ischanged, setIsChanged] = useState(false);
  const [current_password, setCurrentPassword] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [confirm_current_password, setConfirmCurrentPassword] = useState(true);
  return (
    <div className="changepassword-container">
      {!ischanged ? (
        <>
          <h2>Change Password</h2>
          <form
            className="changepassword-form"
            onSubmit={async (e) => {
              await handleSubmit(e, setIsChanged, setConfirmCurrentPassword);
            }}
          >
            <div className="form-group">
              <label htmlFor="current-password">Current Password</label>
              <input
                type="text"
                id="current-password"
                name="current-password"
                value={current_password}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              {!confirm_current_password && (
                <div style={{ color: "red" }}>
                  This is not your current password!
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="new-password">New Password</label>
              <input
                type="text"
                id="new-password"
                name="new-password"
                value={new_password}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              {!(new_password.length == 0) && new_password.length < 8 && (
                <div style={{ color: "red" }}>
                  Password must be at least 8 characters long
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="confirm-password">Confirm New Password</label>
              <input
                type="text"
                id="confirm-password"
                name="confirm-password"
                required
              />
            </div>
            <button type="submit">Submit</button>
          </form>
        </>
      ) : (
        <div>Your Password has been changed!</div>
      )}
    </div>
  );
}

export default Changepassword;
