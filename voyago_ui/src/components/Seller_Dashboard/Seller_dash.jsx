import {
  FaUser,
  FaLock,
  FaStore,
  FaChartBar,
  FaPlus,
  FaList,
  FaChevronDown,
  FaChevronUp,
  FaBox,
  FaBoxes,
  FaShoppingBag,
  FaMoneyBillWave,
  FaCog,
  FaUserCog,
  FaClipboardList,
  FaChartLine,
  FaFlask
} from "react-icons/fa";
import React, { useState, useEffect } from "react";
import Profile from "../Profiles/Seller_profile";
import ChangePassword from "../Profiles/Changepassword";
import AddProduct from "../addProduct";
import ViewProducts from "../viewProductSeller";
import SellerSales from "../Sales/SellerSales";
import ThemeSwitcher from '../ThemeSwitcher';
import { applyTheme } from '../../utils/themeManager';
import { Link } from 'react-router-dom';

export default function SellerDashboard() {
  const [activeSection, setActiveSection] = useState("profile");
  const [userId, setUserId] = useState(null);
  const [sellerId, setSellerId] = useState(null);
  const [expandedSections, setExpandedSections] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [theme, setTheme] = useState('default');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user._id) {
      setUserId(user._id);
    }

    const seller_id = localStorage.getItem("roleId");
    setSellerId(seller_id);
  }, []);

  useEffect(() => {
    applyTheme('default');
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
      case "profile":
        return <Profile userId={userId} sellerId={sellerId} />;
      case "changePassword":
        return <ChangePassword userId={userId} sellerId={sellerId} />;
      case "addProduct":
        return <AddProduct />;
      case "viewProducts":
        return <ViewProducts />;
      case "sales":
        return <SellerSales />;
      default:
        return <Profile userId={userId} sellerId={sellerId} />;
    }
  };

  const navItems = {
    profile: [
      { key: "profile", label: "Profile", icon: FaUserCog },
      { key: "changePassword", label: "Change Password", icon: FaLock },
    ],
    products: [
      { key: "viewProducts", label: "Manage Products", icon: FaBoxes },
    ],
    sales: [
      { key: "sales", label: "Sales Report", icon: FaChartLine },
    ],
  };

  const sectionIcons = {
    profile: FaUser,
    products: FaStore,
    sales: FaMoneyBillWave,
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
                <FaStore className="mr-2" />
                Seller Dashboard
              </h2>
            ) : (
              <div className="text-2xl">
                <FaStore />
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
                        <span className="mr-3">
                          {React.createElement(item.icon, { className: 'text-lg' })}
                        </span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <Link
            to="/demo/seller-dashboard"
            className={`
              flex items-center gap-3 px-4 py-3 
              text-[var(--textPrimary)] hover:bg-[var(--primaryLight)] 
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
        min-h-screen
      `}>
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-blue-900 capitalize">
            {activeSection.replace(/([A-Z])/g, ' $1').trim()}
          </h1>
        </header>
        <div className="bg-[var(--surface)] shadow-lg rounded-lg p-6 
          transition-all duration-300 ease-[var(--ease-out)]
          hover:shadow-xl h-full"
        >
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
