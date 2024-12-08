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
  FaBell,
  FaShoppingCart,
  FaBookmark,
  FaHeart,
  FaFlask,
  FaCalendarAlt,
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
import Notifications from '../Notifications';
import Cart from '../Cart';
import ThemeSwitcher from '../ThemeSwitcher';
import { applyTheme } from '../../utils/themeManager';
import Bookmarks from '../../pages/Bookmarks';
import WishlistPage from '../../pages/WishlistPage';
import { Link } from 'react-router-dom';
import OrdersSummary from '../dashboard/OrdersSummary';
import UpcomingBookingsSection from '../UpcomingBookings';
export default function TouristDashboard() {
  const [activeSection, setActiveSection] = useState("profile");
  const [userId, setUserId] = useState(null);
  const [touristId, setTouristId] = useState(null);
  const [expandedSections, setExpandedSections] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [theme, setTheme] = useState('default');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user._id) {
      setUserId(user._id);
    }

    const tourist_id = localStorage.getItem("roleId");
    setTouristId(tourist_id);
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
      case "notifications":
        return <Notifications />;
      case "cart":
        return <Cart />;
      case "bookmarks":
        return <Bookmarks />;
      case "wishlist":
        return <WishlistPage />;
      case "orders":
        return <OrdersSummary />;
      case "upcomingBookings":
        return <UpcomingBookingsSection />;
      default:
        return <Profile userId={userId} touristId={touristId} />;
    }
  };

  const navItems = {
    profile: [
      { key: "profile", label: "Profile", icon: <FaUser /> },
      { key: "changePassword", label: "Change Password", icon: <FaLock /> },
    ],
    bookings: [
      { key: "upcomingBookings", label: "Upcoming Bookings", icon: <FaCalendarAlt /> },
    ],
    complaints: [
      { key: "complaint", label: "Make a Complaint", icon: <FaFileAlt /> },
      { key: "viewComplaints", label: "View My Complaints", icon: <FaClipboardList /> },
    ],
    explore: [
      { key: "activities", label: "View Activities", icon: <FaMapSigns /> },
      { key: "itineraries", label: "View Itineraries", icon: <FaMapSigns /> },
      { key: "landmarks", label: "View Landmarks", icon: <FaMapSigns /> },
    ],
    products: [
      { key: "products", label: "View Products", icon: <FaProductHunt /> },
      { key: "purchasedProducts", label: "View Purchased Products", icon: <FaProductHunt /> },
      { key: "orders", label: "View Orders", icon: <FaProductHunt /> },
    ],
    rewards: [
      { key: "loyalty", label: "Loyalty Points", icon: <FaStar /> },
    ],
    notifications: [
      { key: "notifications", label: "Notifications", icon: <FaBell /> },
    ],
    cart: [
      { key: "cart", label: "Shopping Cart", icon: <FaShoppingCart /> },
    ],
    bookmarks: [
      { key: "bookmarks", label: "Bookmarks", icon: <FaBookmark /> },
    ],
    wishlist: [
      { key: "wishlist", label: "Wishlist", icon: <FaHeart /> },
    ],
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
              <h2 className="text-xl font-semibold">Tourist Dashboard</h2>
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

          <Link
            to="/demo/tourist-dashboard"
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
