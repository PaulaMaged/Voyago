import { useState } from "react";
import AddUser from "./AddUser";
// import DeleteAccount from "./DeleteAccount";
import ViewDocuments from "./ViewDoucments";
import ViewUsers from "./ViewAllusers";
import ManageComplaints from "./ManageComplaints";
import ManageActCategories from "./manageActCategories";
import ManageTags from "./manageTags";
import ViewActivitiesAdmin from "./ViewActivitiesAdmin";
import ViewItinerariesAdmin from "./viewItinerariesAdmin";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("addUser");

  const renderContent = () => {
    switch (activeTab) {
      case "addUser":
        return <AddUser />;

      case "View Users":
        return <ViewUsers />;
      case "viewDocuments":
        return <ViewDocuments />;
      case "manageComplaints":
        return <ManageComplaints />;
      case "manageActCategories":
        return <ManageActCategories />;
      case "manageTags":
        return <ManageTags />;
      case "viewActivities":
        return <ViewActivitiesAdmin />;
      case "viewItineraries":
        return <ViewItinerariesAdmin />;
      default:
        return <AddUser />;
    }
  };

  return (
    <div className="admin-dashboard">
      <nav className="sidebar">
        <h2>Admin Dashboard</h2>
        <ul>
          <li>
            <button onClick={() => setActiveTab("addUser")}>Add User</button>
          </li>
          <li>
            <button onClick={() => setActiveTab("View Users")}>
              View Users
            </button>
          </li>
          <li>
            <button onClick={() => setActiveTab("viewDocuments")}>
              View Documents
            </button>
          </li>
          <li>
            <button onClick={() => setActiveTab("manageComplaints")}>
              Manage Complaints
            </button>
          </li>
          <li>
            <button onClick={() => setActiveTab("manageActCategories")}>
              Manage Activity Categories
            </button>
          </li>
          <li>
            <button onClick={() => setActiveTab("manageTags")}>
              Manage Tags
            </button>
          </li>
          <li>
            <button onClick={() => setActiveTab("viewActivities")}>
              view Activities
            </button>
          </li>
          <li>
            <button onClick={() => setActiveTab("viewItineraries")}>
              view Itineraries
            </button>
          </li>
        </ul>
      </nav>
      <main className="main-content">{renderContent()}</main>
      <style>{`
        .admin-dashboard {
          display: flex;
          height: 100vh;
          font-family: Arial, sans-serif;
        }
        .sidebar {
          width: 250px;
          background-color: #2c3e50;
          color: white;
          padding: 20px;
        }
        .sidebar h2 {
          margin-bottom: 20px;
        }
        .sidebar ul {
          list-style-type: none;
          padding: 0;
        }
        .sidebar li {
          margin-bottom: 10px;
        }
        .sidebar button {
          width: 100%;
          padding: 10px;
          background-color: #34495e;
          color: white;
          border: none;
          cursor: pointer;
          text-align: left;
          transition: background-color 0.3s;
        }
        .sidebar button:hover {
          background-color: #4a6785;
        }
        .main-content {
          flex-grow: 1;
          padding: 20px;
          background-color: #ecf0f1;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
}
