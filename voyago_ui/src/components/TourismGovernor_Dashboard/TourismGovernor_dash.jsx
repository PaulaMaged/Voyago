import React, { useState, useEffect } from 'react';
import {
  FaUser,
  FaLock,
  FaMapMarker,
  FaTag,
  FaChartLine,
  FaChevronDown,
  FaChevronUp,
  FaBell,
  FaFlask,
  FaLandmark,
} from 'react-icons/fa';
import ChangePassword from '../Profiles/Changepassword';
import GovernorLandmarks from '../GovernorLandmarks';
import ManageTags from '../Admin_Dashboard/manageTags';
import ThemeSwitcher from '../ThemeSwitcher';
import { applyTheme } from '../../utils/themeManager';
import { Link } from 'react-router-dom';

export default function TourismGovernorDashboard() {
  const [activeSection, setActiveSection] = useState("profile");
  const [userId, setUserId] = useState(null);
  const [governorId, setGovernorId] = useState(null);
  const [expandedSections, setExpandedSections] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [theme, setTheme] = useState('default');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user._id) {
      setUserId(user._id);
    }

    const governor_id = localStorage.getItem("roleId");
    setGovernorId(governor_id);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('preferred-theme');
    if (savedTheme) {
      handleThemeChange(savedTheme);
    }
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
    
      case "changePassword":
        return <ChangePassword />;
      case "landmarks":
        return <GovernorLandmarks governorId={governorId} />;
      case "manageTags":
        return <ManageTags governorId={governorId} />;
      default:
        return <ChangePassword/>;
    }
  };

  const navItems = {
    profile: [
      { key: "changePassword", label: "Change Password", icon: <FaLock /> },
    ],
    landmarks: [
      { key: "landmarks", label: "Manage Landmarks", icon: <FaLandmark /> },
      { key: "manageTags", label: "Manage Tags", icon: <FaTag /> },
    ],
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
              <h2 className="text-xl font-semibold">Tourism Governor Dashboard</h2>
            ) : (
              <div className="text-2xl"><FaMapMarker /></div>
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
                      <span className="ml-3 capitalize">
                        {section.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
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
                            ? 'bg-[var(--secondary)] hover:bg-[var(--secondaryLight)]' 
                            : 'bg-[var(--primary)] hover:bg-[var(--primaryLight)]'
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
          <h1 className="text-3xl font-bold text-blue-900 capitalize">
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