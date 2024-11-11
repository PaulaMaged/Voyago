import { useState, useEffect } from "react";
import ComplaintForm from "./Tourist_complaint";
import ChangePassword from "../Profiles/Changepassword";
import Profile from "../Profiles/Tourist_profile";
import ViewComplaints from "./View_complaints";
import ViewActivityGuest from "../viewActivityGuest";
import ViewItineraryGuest from "../viewItineraryGuest";
import ViewLandmarks from "../viewLandmarks";
import ViewProductTourist from "../viewProductTourist";
import ViewPurchasedProducts from "../viewPurchasedProducts";

export default function TouristDashboard() {
  const [activeSection, setActiveSection] = useState("profile");
  const [userId, setUserId] = useState(null);
  const [touristId, setTouristId] = useState(null);

  useEffect(() => {
    // Retrieve the user data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user._id) {
      setUserId(user._id); //dah el user id not tourist btw
    }

    const tourist_id = localStorage.getItem("roleId");
    setTouristId(tourist_id);
  }, []);

  const renderContent = () => {
    if (userId === null) {
      return <div>Loading...</div>;
    }
    switch (activeSection) {
      case "profile":
        return <Profile userId={userId} touristId={touristId} />;
      case "changePassword":
        return <ChangePassword userId={userId} touristId={touristId} />;
      case "complaint":
        return <ComplaintForm userId={userId} touristId={touristId} />;
      case "viewComplaints":
        return <ViewComplaints userId={userId} touristId={touristId} />;
      case "activities":
        return <ViewActivityGuest userId={userId} touristId={touristId} />;
      case "itineraries":
        return <ViewItineraryGuest userId={userId} touristId={touristId} />;
      case "landmarks":
        return <ViewLandmarks userId={userId} touristId={touristId} />;
      case "products":
        return <ViewProductTourist userId={userId} touristId={touristId} />;
      case "purchasedProducts":
        return <ViewPurchasedProducts userId={userId} touristId={touristId} />;
      default:
        return <Profile userId={userId} touristId={touristId} />;
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
            View My Complaints
          </button>
          <button onClick={() => setActiveSection("activities")}>
            View Activities
          </button>
          <button onClick={() => setActiveSection("itineraries")}>
            View Itineraries
          </button>
          <button onClick={() => setActiveSection("landmarks")}>
            View Landmarks
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
