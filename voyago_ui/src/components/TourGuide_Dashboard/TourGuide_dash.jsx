import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ViewItineraryGuide from '../ViewItineraryGuide';
import GuideSales from '../Sales/GuideSales';
import GuideTouristStats from '../Statistics/GuideTouristStats';
import TourGuideNotifications from '../Notifications/TourGuideNotifications';
import ItineraryAttendance from './ItineraryAttendance';
import {
  FaUser,
  FaRoute,
  FaMoneyBillWave,
  FaUserCog,
  FaLock,
  FaPlus,
  FaList,
  FaChartLine,
  FaChevronDown,
  FaChevronUp,
  FaFlask,
  FaUsers,
  FaBell,
  FaUserCheck,
} from 'react-icons/fa';
import ThemeSwitcher from '../ThemeSwitcher';
import { applyTheme } from '../../utils/themeManager';

export default function TourGuideDashboard() {
  const [isHovered, setIsHovered] = useState(false);
  const [expandedSections, setExpandedSections] = useState(['itineraries']);
  const [activeSection, setActiveSection] = useState('viewItineraries');
  const [theme, setTheme] = useState(localStorage.getItem('preferred-theme') || 'default');

  useEffect(() => {
    const savedTheme = localStorage.getItem('preferred-theme');
    if (savedTheme) {
      handleThemeChange(savedTheme);
    }
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case 'addItinerary':
        return <ViewItineraryGuide mode="add" />;
      case 'viewItineraries':
        return <ViewItineraryGuide mode="view" />;
      case 'sales':
        return <GuideSales />;
      case 'touristStats':
        return <GuideTouristStats />;
      case 'notifications':
        return <TourGuideNotifications />;
      case 'attendance':
        return <ItineraryAttendance />;
      default:
        return <div>Select a section</div>;
    }
  };

  const navItems = {
    profile: [
      { key: "profile", label: "Profile", icon: FaUserCog },
      { key: "changePassword", label: "Change Password", icon: FaLock },
    ],
    itineraries: [
      { key: "viewItineraries", label: "View Itineraries", icon: FaList },
      { key: "attendance", label: "Itinerary Attendance", icon: FaUserCheck },
    ],
    analytics: [
      { key: "sales", label: "Sales Report", icon: FaChartLine },
      { key: "touristStats", label: "Tourist Statistics", icon: FaUsers },
    ],
    notifications: [
      { key: "notifications", label: "View Notifications", icon: FaBell },
    ],
  };

  const sectionIcons = {
    profile: FaUser,
    itineraries: FaRoute,
    analytics: FaChartLine,
    notifications: FaBell,
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
    <div className="flex min-h-screen bg-[var(--background)]">
      <aside 
        className={`
          transition-all duration-300 ease-[var(--ease-out)]
          bg-[var(--primary)] text-[var(--surface)] 
          shadow-xl p-4 fixed top-0 left-0 h-full
          ${isHovered ? 'w-64' : 'w-16'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col h-full">
          <div className={`sidebar-header mb-6 ${isHovered ? 'text-center' : 'text-center'}`}>
            {isHovered ? (
              <h2 className="text-xl font-semibold flex items-center justify-center">
                <FaRoute className="mr-2" />
                Tour Guide Dashboard
              </h2>
            ) : (
              <div className="text-2xl">
                <FaRoute />
              </div>
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

                {expandedSections.includes(section) && (
                  <div className={`mt-1 space-y-1 ${isHovered ? 'block' : 'hidden'}`}>
                    {items.map((item) => (
                      <button
                        key={item.key}
                        onClick={() => setActiveSection(item.key)}
                        className={`
                          w-full flex items-center px-4 py-2 rounded-lg
                          transition-all duration-300 ease-in-out
                          ${activeSection === item.key 
                            ? 'bg-[var(--secondary)] text-[var(--surface)]' 
                            : 'text-[var(--surface)] hover:bg-[var(--primaryLight)]'
                          }
                          hover:translate-x-2
                        `}
                      >
                        {React.createElement(item.icon, { className: 'text-sm mr-3' })}
                        <span className="text-sm">{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="mt-auto">
            <ThemeSwitcher 
              onThemeChange={handleThemeChange}
              currentTheme={theme}
              isHovered={isHovered}
            />
          </div>

          <Link
            to="/demo/tour-guide-dashboard"
            className={`
              flex items-center gap-3 px-4 py-3 mt-4
              text-[var(--surface)] hover:bg-[var(--primaryLight)] 
              transition-all duration-300 group
              ${isHovered ? 'justify-between' : 'justify-center'}
            `}
          >
            <span className="flex items-center gap-2 min-w-0">
              <FaFlask className="text-xl group-hover:scale-110 transition-transform" />
              {isHovered && (
                <span className="font-medium truncate">Try Demo</span>
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
        min-h-screen bg-[var(--background)]
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