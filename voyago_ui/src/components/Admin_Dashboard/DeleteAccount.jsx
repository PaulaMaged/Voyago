import { useState } from "react";

export default function DeleteAccount() {
  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to delete account
    console.log("Deleting account:", username);
    alert("Account deleted successfully!");
    // Reset form
    setUsername("");
  };

  return (
    <div className="delete-account">
      <h2>Delete Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button type="submit">Delete Account</button>
      </form>
      <style>{`
        .delete-account {
          max-width: 300px;
          margin: 0 auto;
        }
        h2 {
          color: #2c3e50;
          margin-bottom: 20px;
        }
        form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        input,
        button {
          padding: 10px;
          border: 1px solid #bdc3c7;
          border-radius: 4px;
          font-size: 16px;
        }
        button {
          background-color: #e74c3c;
          color: white;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        button:hover {
          background-color: #c0392b;
        }
      `}</style>
    </div>
  );
}
