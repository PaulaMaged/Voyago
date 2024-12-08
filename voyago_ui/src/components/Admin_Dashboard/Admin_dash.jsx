import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaUser,
  FaUserPlus,
  FaUsers,
  FaFileAlt,
  FaClipboardList,
  FaExclamationTriangle,
  FaLayerGroup,
  FaTags,
  FaMapSigns,
  FaRoute,
  FaChartLine,
  FaGift,
  FaChevronDown,
  FaChevronUp,
  FaFlask,
} from 'react-icons/fa';

import AddUser from "./AddUser";
import ViewUsers from "./ViewAllusers";
import ViewDocuments from "./ViewDoucments";
import ManageComplaints from "./ManageComplaints";
import ManageActCategories from "./manageActCategories";
import ManageTags from "./manageTags";
import ViewActivitiesAdmin from "./ViewActivitiesAdmin";
import ViewItinerariesAdmin from "./ViewItinerariesAdmin";
import SalesReport from './SalesReport';
import CreatePromoCode from "./CreatePromoCode";
import ShowcasePromoCodes from "./ShowcasePromoCodes";
import ThemeSwitcher from '../ThemeSwitcher';
import { applyTheme } from '../../utils/themeManager';

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("addUser");
  const [expandedSections, setExpandedSections] = useState(['userManagement']);
  const [isHovered, setIsHovered] = useState(false);
  const [theme, setTheme] = useState('default');

  useEffect(() => {
    const savedTheme = localStorage.getItem('preferred-theme');
    if (savedTheme) {
      handleThemeChange(savedTheme);
    }
  }, []);

  const navItems = {
    userManagement: [
      { key: "addUser", label: "Add User", icon: <FaUserPlus /> },
      { key: "viewUsers", label: "View Users", icon: <FaUsers /> },
      { key: "viewDocuments", label: "View Documents", icon: <FaFileAlt /> },
    ],
    complaints: [
      { key: "manageComplaints", label: "Manage Complaints", icon: <FaExclamationTriangle /> },
    ],
    contentManagement: [
      { key: "manageActCategories", label: "Manage Activity Categories", icon: <FaLayerGroup /> },
      { key: "manageTags", label: "Manage Tags", icon: <FaTags /> },
    ],
    activities: [
      { key: "viewActivities", label: "View Activities", icon: <FaMapSigns /> },
      { key: "viewItineraries", label: "View Itineraries", icon: <FaRoute /> },
    ],
    analytics: [
      { key: "salesReport", label: "Sales Report", icon: <FaChartLine /> },
    ],
    promotions: [
      { key: "createPromoCode", label: "Create Promo Code", icon: <FaGift /> },
      { key: "showcasePromoCodes", label: "View Promo Codes", icon: <FaClipboardList /> },
    ],
  };

  const renderContent = () => {
    switch (activeSection) {
      case "addUser":
        return <AddUser />;
      case "viewUsers":
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
      case "salesReport":
        return <SalesReport />;
      case "createPromoCode":
        return <CreatePromoCode />;
      case "showcasePromoCodes":
        return <ShowcasePromoCodes />;
      default:
        return <AddUser />;
    }
  };

  const toggleSection = (section) => {
    if (expandedSections.includes(section)) {
      setExpandedSections(expandedSections.filter((item) => item !== section));
    } else {
      setExpandedSections([...expandedSections, section]);
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('preferred-theme', newTheme);
  };

  return (
    <div className={`flex h-screen bg-[var(--background)]`}>
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
              <h2 className="text-xl font-semibold text-[var(--surface)]">Admin Dashboard</h2>
            ) : (
              <div className="text-2xl">🏷️</div>
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
                    {items[0].icon}
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
                            ? 'bg-[var(--secondary)] text-[var(--surface)] hover:bg-[var(--secondaryLight)] active:bg-[var(--secondaryDark)]' 
                            : 'bg-[var(--primary)] text-[var(--surface)] hover:bg-[var(--primaryLight)] active:bg-[var(--primaryDark)]'
                          }
                          hover:translate-x-1
                          hover:shadow-md
                          border-none
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

          <Link
            to="/demo/admin-dashboard"
            className={`
              flex items-center gap-3 px-4 py-3 
              text-[var(--surface)] hover:bg-[var(--primaryLight)] 
              transition-all duration-300 group
              ${isHovered ? 'justify-between' : 'justify-center'}
            `}
          >
            <span className="flex items-center gap-2 min-w-0">
              <FaFlask className="text-xl group-hover:scale-110 transition-transform" />
              {isHovered && (
                <span className="font-medium truncate text-[var(--surface)]">Try Demo</span>
              )}
            </span>
            {isHovered && (
              <span className="bg-[var(--accent)] text-[var(--surface)] text-xs px-2 py-1 rounded-full shrink-0">
                New
              </span>
            )}
          </Link>
        </div>
      </aside>

      <main className={`
        flex-1 p-8 transition-all duration-300 ease-[var(--ease-out)]
        ${isHovered ? 'ml-64' : 'ml-16'}
      `}>
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-[var(--textPrimary)] capitalize">
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
