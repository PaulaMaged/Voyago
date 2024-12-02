// import { useState, useEffect } from "react";
// import ComplaintForm from "./Tourist_complaint";
// import ChangePassword from "../Profiles/Changepassword";
// import Profile from "../Profiles/Tourist_profile";
// import ViewComplaints from "./View_complaints";
// import ViewActivityGuest from "../viewActivityGuest";
// import ViewItineraryGuest from "../viewItineraryGuest";
// import ViewLandmarks from "../viewLandmarks";
// import ViewProductTourist from "../viewProductTourist";
// import ViewPurchasedProducts from "../viewPurchasedProducts";
// import LoyaltySystem from "./Loyalty_points";

// export default function TouristDashboard() {
//   const [activeSection, setActiveSection] = useState("profile");
//   const [userId, setUserId] = useState(null);
//   const [touristId, setTouristId] = useState(null);

//   useEffect(() => {
//     // Retrieve the user data from localStorage
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (user && user._id) {
//       setUserId(user._id); //dah el user id not tourist btw
//     }

//     const tourist_id = localStorage.getItem("roleId");
//     setTouristId(tourist_id);
//   }, []);

//   const renderContent = () => {
//     if (userId === null) {
//       return <div>Loading...</div>;
//     }
//     switch (activeSection) {
//       case "profile":
//         return <Profile userId={userId} touristId={touristId} />;
//       case "changePassword":
//         return <ChangePassword userId={userId} touristId={touristId} />;
//       case "complaint":
//         return <ComplaintForm userId={userId} touristId={touristId} />;
//       case "viewComplaints":
//         return <ViewComplaints userId={userId} touristId={touristId} />;
//       case "activities":
//         return <ViewActivityGuest userId={userId} touristId={touristId} />;
//       case "itineraries":
//         return <ViewItineraryGuest userId={userId} touristId={touristId} />;
//       case "landmarks":
//         return <ViewLandmarks userId={userId} touristId={touristId} />;
//       case "products":
//         return <ViewProductTourist userId={userId} touristId={touristId} />;
//       case "purchased Products":
//         return <ViewPurchasedProducts userId={userId} touristId={touristId} />;
//       case "loyalty":
//         return <LoyaltySystem userId={userId} touristId={touristId} />;
//       default:
//         return <Profile userId={userId} touristId={touristId} />;
//     }
//   };

//   return (
//     <div className="dashboard">
//       <aside className="sidebar">
//         <h2 className="sidebar-title">Tourist Dashboard</h2>
//         <nav className="sidebar-nav">
//           <button onClick={() => setActiveSection("profile")}>Profile</button>
//           <button onClick={() => setActiveSection("changePassword")}>
//             Change Password
//           </button>
//           <button onClick={() => setActiveSection("complaint")}>
//             Make a Complaint
//           </button>
//           <button onClick={() => setActiveSection("viewComplaints")}>
//             View My Complaints
//           </button>
//           <button onClick={() => setActiveSection("activities")}>
//             View Activities
//           </button>
//           <button onClick={() => setActiveSection("itineraries")}>
//             View Itineraries
//           </button>
//           <button onClick={() => setActiveSection("landmarks")}>
//             View Landmarks
//           </button>
//           <button onClick={() => setActiveSection("products")}>
//             View Products
//           </button>
//           <button onClick={() => setActiveSection("purchased Products")}>
//             View Purchased Products
//           </button>
//           <button onClick={() => setActiveSection("loyalty")}>
//             Loyalty system
//           </button>
//         </nav>
//       </aside>
//       <main className="content">
//         <h1 className="content-title">
//           {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
//         </h1>
//         {renderContent()}
//       </main>
//       <style>{`
//         .dashboard {
//           display: flex;
//           height: 100vh;
//           font-family: Arial, sans-serif;
//         }
//         .sidebar {
//           width: 250px;
//           background-color: #f0f0f0;
//           padding: 20px;
//           box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
//         }
//         .sidebar-title {
//           font-size: 1.5em;
//           margin-bottom: 20px;
//           color: #333;
//         }
//         .sidebar-nav {
//           display: flex;
//           flex-direction: column;
//         }
//         .sidebar-nav button {
//           background: none;
//           border: none;
//           text-align: left;
//           padding: 10px;
//           font-size: 1em;
//           cursor: pointer;
//           transition: background-color 0.3s;
//         }
//         .sidebar-nav button:hover {
//           background-color: #e0e0e0;
//         }
//         .content {
//           flex-grow: 1;
//           padding: 20px;
//           background-color: #ffffff;
//         }
//         .content-title {
//           font-size: 2em;
//           margin-bottom: 20px;
//           color: #333;
//         }
//       `}</style>
//     </div>
//   );
// }

//the above is totally correct and works fine just in case

import {
  FaUser,
  FaLock,
  FaFileAlt,
  FaClipboardList,
  FaMapSigns,
  FaProductHunt,
  FaStar,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import React, { useState, useEffect } from "react";
import Profile from "../Profiles/Tourist_profile";
import ChangePassword from "../Profiles/Changepassword";
import ComplaintForm from "./Tourist_complaint";
import ViewComplaints from "./View_complaints";
import ViewActivityGuest from "../viewActivityGuest";
import ViewItineraryGuest from "../viewItineraryGuest";
import ViewLandmarks from "../viewLandmarks";
import ViewProductTourist from "../viewProductTourist";
import ViewPurchasedProducts from "../viewPurchasedProducts";
import LoyaltySystem from "./Loyalty_points";

export default function TouristDashboard() {
  const [activeSection, setActiveSection] = useState("profile");
  const [userId, setUserId] = useState(null);
  const [touristId, setTouristId] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(true);
  const [isExploreOpen, setIsExploreOpen] = useState(true);
  const [isAccountOpen, setIsAccountOpen] = useState(true);
  const [isProductsOpen, setIsProductsOpen] = useState(true); // Added state for Products section

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user._id) {
      setUserId(user._id);
    }

    const tourist_id = localStorage.getItem("roleId");
    setTouristId(tourist_id);
  }, []);

  const renderContent = () => {
    if (userId === null) {
      return (
        <div className="flex justify-center items-center h-full text-gray-500">
          Loading...
        </div>
      );
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
      case "loyalty":
        return <LoyaltySystem userId={userId} touristId={touristId} />;
      default:
        return <Profile userId={userId} touristId={touristId} />;
    }
  };

  const navItems = {
    profile: [
      { key: "profile", label: "Profile", icon: <FaUser /> },
      { key: "changePassword", label: "Change Password", icon: <FaLock /> },
    ],
    complaints: [
      { key: "complaint", label: "Make a Complaint", icon: <FaFileAlt /> },
      {
        key: "viewComplaints",
        label: "View My Complaints",
        icon: <FaClipboardList />,
      },
    ],
    explore: [
      { key: "activities", label: "View Activities", icon: <FaMapSigns /> },
      { key: "itineraries", label: "View Itineraries", icon: <FaMapSigns /> },
      { key: "landmarks", label: "View Landmarks", icon: <FaMapSigns /> },
    ],
    products: [
      { key: "products", label: "View Products", icon: <FaProductHunt /> },
      {
        key: "purchasedProducts",
        label: "View Purchased Products",
        icon: <FaProductHunt />,
      },
    ],
  };

  const toggleSection = (section) => {
    switch (section) {
      case "profile":
        setIsProfileOpen(!isProfileOpen);
        break;
      case "complaints":
        setIsAccountOpen(!isAccountOpen);
        break;
      case "explore":
        setIsExploreOpen(!isExploreOpen);
        break;
      case "products": // Toggle products section visibility
        setIsProductsOpen(!isProductsOpen);
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white shadow-xl p-6 space-y-4 fixed top-0 left-0 h-screen">
        <h2 className="text-2xl font-semibold text-center border-b border-blue-700 pb-4">
          Tourist Dashboard
        </h2>
        <nav>
          {/* Profile Section */}
          <div>
            <button
              onClick={() => toggleSection("profile")}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-blue-700 text-lg transition duration-200"
            >
              <span className="flex items-center">
                <FaUser className="mr-4 text-xl" />
                Profile
              </span>
              {isProfileOpen ? <FaChevronDown /> : <FaChevronUp />}
            </button>
            {isProfileOpen && (
              <div className="space-y-2 pl-8">
                {navItems.profile.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setActiveSection(item.key)}
                    className={`w-full flex items-center p-3 rounded-lg hover:bg-blue-700 text-lg transition duration-200 ${
                      activeSection === item.key ? "bg-blue-600" : ""
                    }`}
                  >
                    <span className="mr-4 text-xl">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Complaints Section */}
          <div>
            <button
              onClick={() => toggleSection("complaints")}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-blue-700 text-lg transition duration-200"
            >
              <span className="flex items-center">
                <FaFileAlt className="mr-4 text-xl" />
                Complaints
              </span>
              {isAccountOpen ? <FaChevronDown /> : <FaChevronUp />}
            </button>
            {isAccountOpen && (
              <div className="space-y-2 pl-8">
                {navItems.complaints.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setActiveSection(item.key)}
                    className={`w-full flex items-center p-3 rounded-lg hover:bg-blue-700 text-lg transition duration-200 ${
                      activeSection === item.key ? "bg-blue-600" : ""
                    }`}
                  >
                    <span className="mr-4 text-xl">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Explore Section */}
          <div>
            <button
              onClick={() => toggleSection("explore")}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-blue-700 text-lg transition duration-200"
            >
              <span className="flex items-center">
                <FaMapSigns className="mr-4 text-xl" />
                Explore
              </span>
              {isExploreOpen ? <FaChevronDown /> : <FaChevronUp />}
            </button>
            {isExploreOpen && (
              <div className="space-y-2 pl-8">
                {navItems.explore.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setActiveSection(item.key)}
                    className={`w-full flex items-center p-3 rounded-lg hover:bg-blue-700 text-lg transition duration-200 ${
                      activeSection === item.key ? "bg-blue-600" : ""
                    }`}
                  >
                    <span className="mr-4 text-xl">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Products Section */}
          <div>
            <button
              onClick={() => toggleSection("products")}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-blue-700 text-lg transition duration-200"
            >
              <span className="flex items-center">
                <FaProductHunt className="mr-4 text-xl" />
                Products
              </span>
              {isProductsOpen ? <FaChevronDown /> : <FaChevronUp />}
            </button>
            {isProductsOpen && (
              <div className="space-y-2 pl-8">
                {navItems.products.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setActiveSection(item.key)}
                    className={`w-full flex items-center p-3 rounded-lg hover:bg-blue-700 text-lg transition duration-200 ${
                      activeSection === item.key ? "bg-blue-600" : ""
                    }`}
                  >
                    <span className="mr-4 text-xl">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Loyalty System Section (New standalone section) */}
          <div>
            <button
              onClick={() => setActiveSection("loyalty")}
              className={`w-full flex items-center p-3 rounded-lg hover:bg-blue-700 text-lg transition duration-200 ${
                activeSection === "loyalty" ? "bg-blue-600" : ""
              }`}
            >
              <span className="mr-4 text-xl">
                <FaStar />
              </span>
              Loyalty System
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-white p-8 ml-64 overflow-y-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-blue-900 capitalize">
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
          </h1>
        </header>
        <div className="bg-white shadow-lg p-6 rounded-lg">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
