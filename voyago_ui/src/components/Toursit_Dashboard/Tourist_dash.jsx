import { useState } from "react";
import ComplaintForm from "./Tourist_complaint";
import ChangePassword from "../Profiles/Changepassword";
import Profile from "../Profiles/Tourist_profile";
import ViewComplaints from "./View_complaints";
import ViewActivityGuest from "../viewActivityGuest";
import ViewItineraryGuest from "../viewItineraryGuest";
import ViewLandmarks from "../viewLandmarks";
import ViewProductTourist from "../viewProductTourist";
import ViewPurchasedProducts from "../viewPurchasedProducts";



// Placeholder components for each section
// const Profile = () => <div>Profile Content</div>;
// const ChangePassword = () => <div>Change Password Form</div>;
// const Complaint = () => <div>Complaint Form</div>;


export default function TouristDashboard() {
  const [activeSection, setActiveSection] = useState("profile");

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return <Profile />;
      case "changePassword":
        return <ChangePassword />;
      case "complaint":
        return <ComplaintForm />;
      case "viewComplaints":
        return <ViewComplaints />;
      case "activities":
        return <ViewActivityGuest />;
      case "itineraries":
        return <ViewItineraryGuest />;
      case "landmarks":
        return <ViewLandmarks />;  
      case "products":
        return <ViewProductTourist />;  
      case "purchasedProducts":
        return <ViewPurchasedProducts />;  
      default:
        return <Profile />;
    }
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2 className="sidebar-title">Tourist Dashboard</h2>
        <nav className="sidebar-nav">
          <button onClick={() => setActiveSection("profile")}>Profile</button>
          <button onClick={() => setActiveSection("changePassword")}>
            Change Password
          </button>
          <button onClick={() => setActiveSection("complaint")}>
            Make a Complaint
          </button>
          <button onClick={() => setActiveSection("viewComplaints")}>
            View My_Complaints{" "}
          </button>
          <button onClick={() => setActiveSection("activities")}>
            View Activities
          </button>
          <button onClick={() => setActiveSection("itineraries")}>
            View Itineraries
          </button>
          <button onClick={() => setActiveSection("landmarks")}>
            View LandMarks
          </button>
          <button onClick={() => setActiveSection("products")}>
            View Products
          </button>
          <button onClick={() => setActiveSection("purchasedProducts")}>
            View Purchased Products
          </button>
        </nav>
      </aside>
      <main className="content">
        <h1 className="content-title">
          {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
        </h1>
        {renderContent()}
      </main>
      <style>{`
        .dashboard {
          display: flex;
          height: 100vh;
          font-family: Arial, sans-serif;
        }
        .sidebar {
          width: 250px;
          background-color: #f0f0f0;
          padding: 20px;
          box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
        }
        .sidebar-title {
          font-size: 1.5em;
          margin-bottom: 20px;
          color: #333;
        }
        .sidebar-nav {
          display: flex;
          flex-direction: column;
        }
        .sidebar-nav button {
          background: none;
          border: none;
          text-align: left;
          padding: 10px;
          font-size: 1em;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .sidebar-nav button:hover {
          background-color: #e0e0e0;
        }
        .content {
          flex-grow: 1;
          padding: 20px;
          background-color: #ffffff;
        }
        .content-title {
          font-size: 2em;
          margin-bottom: 20px;
          color: #333;
        }
      `}</style>
    </div>
  );
}
