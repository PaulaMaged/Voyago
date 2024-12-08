import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaLock,
  FaCalendarAlt,
  FaChartLine,
  FaClipboardList,
  FaEdit,
  FaChevronDown,
  FaChevronUp,
  FaRoute,
  FaMoneyBillWave,
  FaUserCog,
  FaUserCheck,
} from "react-icons/fa";

import Profile from "../Profiles/Advertiser_profile";
import ChangePassword from "../Profiles/Changepassword";
import ViewActivityAdv from "../viewActivityAdv";
import ManageActivities from "./ManageActivities";
import AdvSales from '../Sales/AdvSales';
import BookingHistory from "./BookingHistory";
import ThemeSwitcher from '../ThemeSwitcher';
import { applyTheme } from '../../utils/themeManager';
import ActivityAttendance from './ActivityAttendance';

export default function AdvertiserDashboard() {
  const [activeSection, setActiveSection] = useState("profile");
  const [userId, setUserId] = useState(null);
  const [expandedSections, setExpandedSections] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [theme, setTheme] = useState('default');
  const [activeTab, setActiveTab] = useState('activities');

  useEffect(() => {
    const id = localStorage.getItem("roleId");
    if (id) {
      setUserId(id);
    }
    applyTheme();
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('preferred-theme');
    if (savedTheme) {
      handleThemeChange(savedTheme);
    }
  }, []);

  const navItems = {
    profile: [
      { key: "profile", label: "Profile", icon: <FaUserCog /> },
      { key: "changePassword", label: "Change Password", icon: <FaLock /> },
    ],
    activities: [
      { key: "viewActivities", label: "View Activities", icon: <FaClipboardList /> },
      { key: "manageActivities", label: "Manage Activities", icon: <FaEdit /> },
      { key: "attendance", label: "Activity Attendance", icon: <FaUserCheck /> },
    ],
    analytics: [
      { key: "salesStats", label: "Sales Statistics", icon: <FaChartLine /> },
      { key: "bookingHistory", label: "Booking History", icon: <FaCalendarAlt /> },
    ],
  };

  const sectionIcons = {
    profile: FaUser,
    activities: FaRoute,
    analytics: FaMoneyBillWave,
  };

  const toggleSection = (section) => {
    setExpandedSections(prev =>
      prev.includes(section) 
        ? prev.filter(item => item !== section)
        : [...prev, section]
    );
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('preferred-theme', newTheme);
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
      case "salesStats":
        return <AdvSales />;
      case "bookingHistory":
        return <BookingHistory />;
      case "attendance":
        return <ActivityAttendance />;
      default:
        return <Profile />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <aside 
        className={`
          transition-all duration-300 ease-[var(--ease-out)]
          bg-[var(--primary)] text-[var(--surface)] 
          shadow-xl p-4 fixed top-0 left-0 h-screen
          ${isHovered ? 'w-64' : 'w-16'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col h-full">
          <div className={`sidebar-header mb-6 ${isHovered ? 'text-center' : 'text-center'}`}>
            {isHovered ? (
              <h2 className="text-xl font-semibold">Advertiser Dashboard</h2>
            ) : (
              <div className="text-2xl">📢</div>
            )}
          </div>

          <nav className="space-y-2">
            {Object.entries(navItems).map(([section, items]) => (
              <div key={section} className="relative group">
                <button
                  onClick={() => toggleSection(section)}
                  className={`
                    w-full flex items-center 
                    justify-${isHovered ? 'between' : 'center'} 
                    p-3 rounded-lg 
                    transition-all duration-300 ease-in-out
                    bg-[var(--primary)]
                    hover:bg-[var(--primaryLight)]
                    active:bg-[var(--primaryDark)]
                    text-[var(--surface)]
                    hover:translate-x-1
                    hover:shadow-md
                  `}
                >
                  <span className="flex items-center">
                    {React.createElement(sectionIcons[section], { className: 'text-xl' })}
                    {isHovered && (
                      <span className="ml-3">{section.replace(/([A-Z])/g, ' $1').trim()}</span>
                    )}
                  </span>
                  {isHovered && (
                    <span className="transition-transform duration-200">
                      {expandedSections.includes(section) ? <FaChevronDown /> : <FaChevronUp />}
                    </span>
                  )}
                </button>

                {expandedSections.includes(section) && isHovered && (
                  <div className="pl-4 mt-1 space-y-1">
                    {items.map((item) => (
                      <button
                        key={item.key}
                        onClick={() => setActiveSection(item.key)}
                        className={`
                          w-full flex items-center 
                          p-2 rounded-lg 
                          transition-all duration-300 ease-in-out
                          text-sm
                          ${
                            activeSection === item.key 
                            ? 'bg-[var(--secondary)] hover:bg-[var(--secondaryLight)] active:bg-[var(--secondaryDark)]' 
                            : 'bg-[var(--primary)] hover:bg-[var(--primaryLight)] active:bg-[var(--primaryDark)]'
                          }
                          hover:translate-x-1
                          hover:shadow-md
                        `}
                      >
                        <span className="mr-3">{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="mt-auto pb-4">
            <ThemeSwitcher 
              onThemeChange={handleThemeChange}
              currentTheme={theme}
              isHovered={isHovered}
            />
          </div>
        </div>
      </aside>

      <main className={`
        flex-1 p-8 transition-all duration-300 ease-[var(--ease-out)]
        ${isHovered ? 'ml-64' : 'ml-16'}
      `}>
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] capitalize">
            {activeSection.replace(/([A-Z])/g, ' $1').trim()}
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