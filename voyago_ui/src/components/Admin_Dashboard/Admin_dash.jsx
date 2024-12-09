// import { useState } from "react";
// import AddUser from "./AddUser";
// // import DeleteAccount from "./DeleteAccount";
// import ViewDocuments from "./ViewDoucments";
// import ViewUsers from "./ViewAllusers";
// import ManageComplaints from "./ManageComplaints";
// import ManageActCategories from "./manageActCategories";
// import ManageTags from "./manageTags";
// import ViewActivitiesAdmin from "./ViewActivitiesAdmin";
// import ViewItinerariesAdmin from "./ViewItinerariesAdmin";

// export default function AdminDashboard() {
//   const [activeTab, setActiveTab] = useState("addUser");

//   const renderContent = () => {
//     switch (activeTab) {
//       case "addUser":
//         return <AddUser />;

//       case "View Users":
//         return <ViewUsers />;
//       case "viewDocuments":
//         return <ViewDocuments />;
//       case "manageComplaints":
//         return <ManageComplaints />;
//       case "manageActCategories":
//         return <ManageActCategories />;
//       case "manageTags":
//         return <ManageTags />;
//       case "viewActivities":
//         return <ViewActivitiesAdmin />;
//       case "viewItineraries":
//         return <ViewItinerariesAdmin />;
//       default:
//         return <AddUser />;
//     }
//   };

//   return (
//     <div className="admin-dashboard">
//       <nav className="sidebar">
//         <h2>Admin Dashboard</h2>
//         <ul>
//           <li>
//             <button onClick={() => setActiveTab("addUser")}>Add User</button>
//           </li>
//           <li>
//             <button onClick={() => setActiveTab("View Users")}>
//               View Users
//             </button>
//           </li>
//           <li>
//             <button onClick={() => setActiveTab("viewDocuments")}>
//               View Documents
//             </button>
//           </li>
//           <li>
//             <button onClick={() => setActiveTab("manageComplaints")}>
//               Manage Complaints
//             </button>
//           </li>
//           <li>
//             <button onClick={() => setActiveTab("manageActCategories")}>
//               Manage Activity Categories
//             </button>
//           </li>
//           <li>
//             <button onClick={() => setActiveTab("manageTags")}>
//               Manage Tags
//             </button>
//           </li>
//           <li>
//             <button onClick={() => setActiveTab("viewActivities")}>
//               view Activities
//             </button>
//           </li>
//           <li>
//             <button onClick={() => setActiveTab("viewItineraries")}>
//               view Itineraries
//             </button>
//           </li>
//         </ul>
//       </nav>
//       <main className="main-content">{renderContent()}</main>
//       <style>{`
//         .admin-dashboard {
//           display: flex;
//           height: 100vh;
//           font-family: Arial, sans-serif;
//         }
//         .sidebar {
//           width: 250px;
//           background-color: #2c3e50;
//           color: white;
//           padding: 20px;
//         }
//         .sidebar h2 {
//           margin-bottom: 20px;
//         }
//         .sidebar ul {
//           list-style-type: none;
//           padding: 0;
//         }
//         .sidebar li {
//           margin-bottom: 10px;
//         }
//         .sidebar button {
//           width: 100%;
//           padding: 10px;
//           background-color: #34495e;
//           color: white;
//           border: none;
//           cursor: pointer;
//           text-align: left;
//           transition: background-color 0.3s;
//         }
//         .sidebar button:hover {
//           background-color: #4a6785;
//         }
//         .main-content {
//           flex-grow: 1;
//           padding: 20px;
//           background-color: #ecf0f1;
//           overflow-y: auto;
//         }
//       `}</style>
//     </div>
//   );
// }

//kole el above 48lah

import React, { useState } from "react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronDown, ChevronRight, Bell, Search, User } from "lucide-react";
import AddUser from "./AddUser";
import ViewUsers from "./ViewAllUsers";
import ViewDocuments from "./ViewDoucments";
import ManageComplaints from "./ManageComplaints";
import ManageActCategories from "./ManageActCategories";
import ManageTags from "./ManageTags";
import ViewActivitiesAdmin from "./ViewActivitiesAdmin";
import ViewItinerariesAdmin from "./ViewItinerariesAdmin";
import CreatePromoCode from "./CreatePromoCode";
import ShowcasePromoCodes from "./ShowcasePromoCodes";
import {
  UserPlus,
  Users,
  FileText,
  MessageSquare,
  Grid,
  Tag,
  Activity,
  Map,
  Gift,
  Eye,
} from "lucide-react";

export default function AdminDashboard() {
  const [searchParams] = useSearchParams();
  const adminId = searchParams.get("logtimes");

  useEffect(() => {
    if (!adminId) {
      // Handle the case where adminId is not present in the URL
      console.log("Admin ID is missing from the URL");
    } else {
      console.log("Admin ID is present in the URL " + adminId);
    }
  }, [adminId]);
  const [activeTab, setActiveTab] = useState("addUser");
  const [expandedSections, setExpandedSections] = useState(["User Management"]);

  const renderContent = () => {
    switch (activeTab) {
      case "addUser":
        return <AddUser />;
      case "viewUsers":
        return <ViewUsers adminidf={adminId} />;
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
      case "createPromoCode":
        return <CreatePromoCode />;
      case "showcasePromoCodes":
        return <ShowcasePromoCodes />;
      default:
        return <AddUser />;
    }
  };

  const sections = [
    {
      title: "User Management",
      items: [
        { id: "addUser", label: "Add User", icon: UserPlus },
        { id: "viewUsers", label: "View Users", icon: Users },
        { id: "viewDocuments", label: "View Documents", icon: FileText },
        {
          id: "manageComplaints",
          label: "Manage Complaints",
          icon: MessageSquare,
        },
      ],
    },
    {
      title: "Content Management",
      items: [
        {
          id: "manageActCategories",
          label: "Manage Activity Categories",
          icon: Grid,
        },
        { id: "manageTags", label: "Manage Tags", icon: Tag },
      ],
    },
    {
      title: "Activity Management",
      items: [
        { id: "viewActivities", label: "View Activities", icon: Activity },
        { id: "viewItineraries", label: "View Itineraries", icon: Map },
      ],
    },
    {
      title: "Promo Codes",
      items: [
        { id: "createPromoCode", label: "Create Promo Code", icon: Gift },
        { id: "showcasePromoCodes", label: "Showcase Promo Codes", icon: Eye },
      ],
    },
  ];

  const toggleSection = (title) => {
    setExpandedSections((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  return (
    <div className="admin-dashboard">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h2 style={{ color: "white" }}>Admin Dashboard</h2>
        </div>
        <ul className="sidebar-menu">
          {sections.map((section, index) => (
            <li key={index} className="sidebar-section">
              <button
                onClick={() => toggleSection(section.title)}
                className="section-toggle"
              >
                <span>{section.title}</span>
                {expandedSections.includes(section.title) ? (
                  <ChevronDown className="icon" />
                ) : (
                  <ChevronRight className="icon" />
                )}
              </button>
              {expandedSections.includes(section.title) && (
                <ul className="section-items">
                  {section.items.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveTab(item.id)}
                        className={`section-item ${
                          activeTab === item.id ? "active" : ""
                        }`}
                      >
                        <item.icon className="icon" />
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="main-content">
        <header className="header">
          <div className="header-content">
            <h1>
              {sections.find((section) =>
                section.items.some((item) => item.id === activeTab)
              )?.title || "Dashboard"}
            </h1>
            <div className="header-actions">
              <button className="icon-button1">
                <Bell className="icon" style={{ color: "rgb(52, 73, 94)" }} />
              </button>

              <button className="user-button1">
                <User className="icon" style={{ color: "rgb(52, 73, 94)" }} />
                <span>Admin</span>
              </button>
            </div>
          </div>
        </header>
        <main className="content">
          <div className="content-wrapper">{renderContent()}</div>
        </main>
        <footer className="footer">
          <p>© 2023 Admin Dashboard. All rights reserved.</p>
        </footer>
      </div>

      <style>{`
        .admin-dashboard {
          display: flex;
          height: 100vh;
          overflow: hidden;
          font-family: Arial, sans-serif;
        }

        .sidebar {
          width: 250px;
          background-color: #2c3e50;
          color: white;
          overflow-y: auto;
          position: fixed;
          height: 100%;
          box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
        }

        .sidebar-header {
          padding: 20px;
          z-index: 2;
        }

        .sidebar-header h2 {
          margin: 0;
          font-size: 1.5rem;
        }

        .sidebar-menu {
          list-style-type: none;
          padding: 0;
          margin: 0;
        }

        .sidebar-section {
          margin-bottom: 10px;
        }

        .section-toggle {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 20px;
          background: none;
          border: none;
          color: #bdc3c7;
          font-size: 0.9rem;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .section-toggle:hover {
          background-color: #34495e;
        }

        .section-items {
          list-style-type: none;
          padding: 0;
          margin: 0;
        }

        .section-item {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 10px 30px;
          background: none;
          border: none;
          color: white;
          font-size: 0.9rem;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .section-item:hover {
          background-color: #4a6785;
        }

        .section-item.active {
          background-color: #4a6785;
        }

        .icon {
          width: 20px;
          height: 20px;
          margin-right: 10px;
        }

        .main-content {
          flex: 1;
          margin-left: 250px; /* Keeps the sidebar width */
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .header {
          background-color: white;
          padding: 20px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          z-index: 10;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header h1 {
          margin: 0;
          font-size: 1.5rem;
          color: #2c3e50;
        }

        .header-actions {
          display: flex;
          align-items: center;
        }

        .search-bar {
          position: relative;
          margin-right: 20px;
        }

        .search-bar input {
          padding: 8px 30px 8px 10px;
          border-radius: 20px;
          border: 1px solid #ddd;
          outline: none;
        }

        .search-bar .icon {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #7f8c8d;
        }

        .icon-button1,
        .user-button1 {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 5px 10px;
          border-radius: 20px;
          transition: background-color 0.3s;
        }

        .icon-button1:hover,
        .user-button1:hover {
          background-color: #f1f3f5;
        }

        .user-button1 span {
          margin-left: 5px;
          font-size: 0.9rem;
          color: #2c3e50;
        }

        .content {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          background-color: #f1f3f5;
        }

        .content-wrapper {
          background-color: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .footer {
          background-color: white;
          padding: 10px 20px;
          text-align: center;
          font-size: 0.8rem;
          color: #7f8c8d;
          border-top: 1px solid #ecf0f1;
        }
      `}</style>
    </div>
  );
}
