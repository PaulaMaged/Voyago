import axios from "axios";
import { useEffect, useState } from "react";

// Hardcoded user data for demonstration

const roles = [
  "ALL",
  "ADMIN",
  "USER",
  "TOURIST",
  "TOUR_GUIDE",
  "TOUR_GOVERNOR",
  "SELLER",
  "ADVERTISER",
];

const fetchUsers = async (setUsers) => {
  try {
    const response = await axios.get(
      "http://localhost:8000/api/user/get-all-users"
    );
    if (response.data) {
      setUsers(response.data);
    } else if (response.status === 200) {
      alert("No users found");
    } else {
      throw new Error("Error fetching users");
    }
  } catch (error) {
    console.error("Error fetching users: ", error);
  }
};

export default function ViewAllUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [deleteRequestFilter, setDeleteRequestFilter] = useState("ALL");
  useEffect(() => {
    fetchUsers(setUsers);
  }, []);

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user._id !== userId));
    }
    //hena we will call the delete user functions
  };

  const filteredUsers = users.filter((user) => {
    console.log(user);
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email
        ? user.email.toLowerCase().includes(searchTerm.toLowerCase())
        : "");

    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    const matchesDeleteRequest =
      deleteRequestFilter === "ALL" ||
      (deleteRequestFilter === "YES" && user.requested_to_be_deleted) ||
      (deleteRequestFilter === "NO" && !user.requested_to_be_deleted);
    return matchesSearch && matchesRole && matchesDeleteRequest;
  });

  return (
    <div className="view-all-users">
      <h2>View All Users</h2>
      <div className="filters">
        <input
          type="text"
          placeholder="Search by username or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="filter-select"
        >
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <select
          value={deleteRequestFilter}
          onChange={(e) => setDeleteRequestFilter(e.target.value)}
          className="filter-select"
        >
          <option value="ALL">All Delete Requests</option>
          <option value="YES">Requested Deletion</option>
          <option value="NO">Not Requested Deletion</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Delete Request</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr
              key={user._id}
              className={user.requested_to_be_deleted ? "delete-requested" : ""}
            >
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                {user.requested_to_be_deleted ? "Requested" : "Not Requested"}
              </td>
              <td>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="delete-btn"
                >
                  Delete User
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <style>{`
        .view-all-users {
          width: 100%;
          overflow-x: auto;
        }
        h2 {
          color: #2c3e50;
          margin-bottom: 20px;
        }
        .filters {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        .search-input, .filter-select {
          padding: 8px;
          border: 1px solid #bdc3c7;
          border-radius: 4px;
          font-size: 14px;
        }
        .search-input {
          flex-grow: 1;
        }
        .filter-select {
          min-width: 150px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid #bdc3c7;
          padding: 10px;
          text-align: left;
        }
        th {
          background-color: #34495e;
          color: white;
        }
        .delete-requested {
          background-color: #ffcccb;
        }
        .delete-btn {
          padding: 5px 10px;
          background-color: #e74c3c;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .delete-btn:hover {
          background-color: #c0392b;
        }
      `}</style>
    </div>
  );
}
