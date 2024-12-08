import {
  FaUser,
  FaLock,
  FaCalendarAlt,
  FaChartLine,
  FaClipboardList,
  FaEdit,
  FaPlus,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import React, { useState, useEffect } from "react";
import Profile from "../Profiles/Advertiser_profile";
import ChangePassword from "../Profiles/Changepassword";
import ViewActivityAdv from "../viewActivityAdv";
import ManageActivities from "./ManageActivities";
import ActivityStats from "./ActivityStats";
import BookingHistory from "./BookingHistory";
import ThemeSwitcher from '../ThemeSwitcher';
import { applyTheme } from '../../utils/themeManager';

export default function AdvertiserDashboard() {
  const [activeSection, setActiveSection] = useState("profile");
  const [userId, setUserId] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    const id = localStorage.getItem("roleId");
    setUserId(id);
    applyTheme();
  }, []);

  const navItems = {
    profile: [
      { key: "profile", label: "Profile", icon: <FaUser /> },
      { key: "changePassword", label: "Change Password", icon: <FaLock /> },
    ],
    activities: [
      { key: "viewActivities", label: "View Activities", icon: <FaClipboardList /> },
      { key: "manageActivities", label: "Manage Activities", icon: <FaEdit /> },
      { key: "createActivity", label: "Create Activity", icon: <FaPlus /> },
    ],
    analytics: [
      { key: "activityStats", label: "Activity Statistics", icon: <FaChartLine /> },
      { key: "bookingHistory", label: "Booking History", icon: <FaCalendarAlt /> },
    ],
  };

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
        return <Profile />;
      case "changePassword":
        return <ChangePassword />;
      case "viewActivities":
        return <ViewActivityAdv />;
      case "manageActivities":
        return <ManageActivities />;
      case "activityStats":
        return <ActivityStats />;
      case "bookingHistory":
        return <BookingHistory />;
      default:
        return <Profile />;
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="flex h-screen bg-[var(--background)]">
      {/* Sidebar */}
      <nav className="w-64 bg-[var(--surface)] shadow-lg">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Advertiser Dashboard
          </h1>
        </div>
        <div className="mt-4">
          {Object.entries(navItems).map(([section, items]) => (
            <div key={section} className="mb-4">
              <button
                className="flex items-center justify-between w-full p-4 text-left 
                  text-[var(--text-primary)] hover:bg-[var(--hover)]"
                onClick={() => toggleSection(section)}
              >
                <span className="capitalize">{section}</span>
                {expandedSections[section] ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {expandedSections[section] && (
                <div className="pl-4">
                  {items.map((item) => (
                    <button
                      key={item.key}
                      className={`flex items-center w-full p-3 text-left 
                        ${
                          activeSection === item.key
                            ? "bg-[var(--primary)] text-white"
                            : "text-[var(--text-primary)] hover:bg-[var(--hover)]"
                        }`}
                      onClick={() => setActiveSection(item.key)}
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="absolute bottom-0 w-64 p-4">
          <ThemeSwitcher />
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] capitalize">
            {activeSection.replace(/([A-Z])/g, " $1").trim()}
          </h1>
        </header>
        <div className="bg-[var(--surface)] shadow-lg rounded-lg p-6 
          transition-all duration-300 ease-[var(--ease-out)]
          hover:shadow-xl"
        >
          {renderContent()}
        </div>
      </main>
    </div>
  );
} 