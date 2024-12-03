import { useState, useEffect } from "react";
import axios from "axios";

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

export default function ViewUsers() {
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    newUsersThisMonth: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [deleteRequestFilter, setDeleteRequestFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsersAndStats();
  }, []);

  const fetchUsersAndStats = async () => {
    try {
      setLoading(true);
      const [usersResponse, totalUsersResponse, newUsersResponse] =
        await Promise.all([
          axios.get("http://localhost:8000/api/user/get-all-users"),
          axios.get("http://localhost:8000/api/admin/get-total-users"),
          axios.get("http://localhost:8000/api/admin/get-total-new-users"),
        ]);

      if (usersResponse.data) {
        setUsers(usersResponse.data);
      } else if (usersResponse.status === 200) {
        alert("No users found");
      } else {
        throw new Error("Error fetching users");
      }

      setUserStats({
        totalUsers: totalUsersResponse.data.totalUsers,
        newUsersThisMonth: newUsersResponse.data.newUsersThisMonth,
      });
    } catch (error) {
      console.error("Error fetching users and stats: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(
          `http://localhost:8000/api/user/delete-user/${userId}`
        );
        setUsers(users.filter((user) => user._id !== userId));
        // Refresh user stats after deletion
        const [totalUsersResponse, newUsersResponse] = await Promise.all([
          axios.get("http://localhost:8000/api/admin/get-total-users"),
          axios.get("http://localhost:8000/api/admin/get-total-new-users"),
        ]);
        setUserStats({
          totalUsers: totalUsersResponse.data.totalUsers,
          newUsersThisMonth: newUsersResponse.data.newUsersThisMonth,
        });
      } catch (error) {
        console.error("Error deleting user: ", error);
      }
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email &&
        user.email.toLowerCase().includes(searchTerm.toLowerCase()));

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
      <div className="user-stats">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{loading ? "Loading..." : userStats.totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>New Users This Month</h3>
          <p>{loading ? "Loading..." : userStats.newUsersThisMonth}</p>
        </div>
      </div>
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
      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (
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
                className={
                  user.requested_to_be_deleted ? "delete-requested" : ""
                }
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
      )}
      <style>{`
        .view-all-users {
          width: 100%;
          overflow-x: auto;
        }
        h2 {
          color: #2c3e50;
          margin-bottom: 20px;
        }
        .user-stats {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .stat-card {
          background-color: #ecf0f1;
          border-radius: 8px;
          padding: 15px;
          width: 48%;
        }
        .stat-card h3 {
          margin: 0 0 10px 0;
          color: #34495e;
        }
        .stat-card p {
          font-size: 24px;
          font-weight: bold;
          color: #2980b9;
          margin: 0;
        }
        .filters {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        .search-input,
        .filter-select {
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
        th,
        td {
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
        .loading {
          text-align: center;
          padding: 20px;
          font-size: 18px;
          color: #7f8c8d;
        }
      `}</style>
    </div>
  );
}
