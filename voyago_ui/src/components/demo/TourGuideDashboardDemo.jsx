import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaRoute,
  FaChartLine,
  FaUsers,
  FaCalendarAlt,
  FaInfoCircle,
  FaLightbulb,
  FaArrowRight,
  FaStar,
  FaMoneyBillWave,
  FaClipboardList,
  FaPlus
} from 'react-icons/fa';
import './DashboardDemo.css';

export default function TourGuideDashboardDemo() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [showTip, setShowTip] = useState(true);
  const [activeSection, setActiveSection] = useState('view-itineraries');

  const tutorialSteps = [
    {
      title: "Welcome to Tour Guide Dashboard!",
      content: "Manage your itineraries and track your business performance.",
      tip: "Click 'Next' to explore the features",
      icon: <FaRoute className="text-2xl text-primary" />,
      section: 'view-itineraries'
    },
    {
      title: "Manage Itineraries",
      content: "Create and manage your tour itineraries.",
      tip: "Add new itineraries or modify existing ones",
      icon: <FaCalendarAlt className="text-2xl text-accent" />,
      section: 'view-itineraries'
    },
    {
      title: "Track Bookings",
      content: "Monitor your itinerary bookings and customer details.",
      tip: "View booking history and upcoming tours",
      icon: <FaUsers className="text-2xl text-green-500" />,
      section: 'bookings'
    },
    {
      title: "Sales Analytics",
      content: "View your earnings and performance metrics.",
      tip: "Track revenue and popular itineraries",
      icon: <FaChartLine className="text-2xl text-blue-500" />,
      section: 'sales'
    }
  ];

  const handleNextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setActiveSection(tutorialSteps[currentStep + 1].section);
      setShowTip(true);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setActiveSection(tutorialSteps[currentStep - 1].section);
      setShowTip(true);
    }
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const renderSection = () => {
    // Mock content for demo purposes
    return (
      <div className="demo-content">
        <div className="stats-preview">
          <div className="stat-card">
            <FaRoute className="text-3xl text-primary" />
            <h3>Total Itineraries</h3>
            <p className="text-2xl font-bold">12</p>
          </div>
          <div className="stat-card">
            <FaUsers className="text-3xl text-accent" />
            <h3>Active Bookings</h3>
            <p className="text-2xl font-bold">28</p>
          </div>
          <div className="stat-card">
            <FaStar className="text-3xl text-yellow-500" />
            <h3>Average Rating</h3>
            <p className="text-2xl font-bold">4.8</p>
          </div>
          <div className="stat-card">
            <FaMoneyBillWave className="text-3xl text-green-500" />
            <h3>Monthly Earnings</h3>
            <p className="text-2xl font-bold">$2,450</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="demo-container">
      {/* Header Section - Similar to TouristDashboardDemo */}
      <header className="demo-header">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {tutorialSteps[currentStep].title}
            </h1>
            <div className="flex items-center gap-4">
              {tutorialSteps[currentStep].icon}
              <span className="text-sm bg-surface/10 px-3 py-1 rounded-full">
                Step {currentStep + 1} of {tutorialSteps.length}
              </span>
            </div>
          </div>
          
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Tutorial Tip */}
        {showTip && (
          <div className="tutorial-tip">
            <button 
              onClick={() => setShowTip(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
            <div className="flex items-start gap-3">
              <FaLightbulb className="text-accent text-xl mt-1" />
              <div>
                <h3 className="font-semibold mb-1">{tutorialSteps[currentStep].content}</h3>
                <p className="text-sm text-gray-600">{tutorialSteps[currentStep].tip}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="demo-nav">
          <button 
            onClick={() => handleSectionChange('view-itineraries')}
            className={`demo-button ${activeSection === 'view-itineraries' ? 'active' : ''}`}
          >
            <FaClipboardList className="mr-2" />
            View Itineraries
          </button>
          <button 
            onClick={() => handleSectionChange('add-itinerary')}
            className={`demo-button ${activeSection === 'add-itinerary' ? 'active' : ''}`}
          >
            <FaPlus className="mr-2" />
            Add Itinerary
          </button>
          <button 
            onClick={() => handleSectionChange('bookings')}
            className={`demo-button ${activeSection === 'bookings' ? 'active' : ''}`}
          >
            <FaUsers className="mr-2" />
            Bookings
          </button>
          <button 
            onClick={() => handleSectionChange('sales')}
            className={`demo-button ${activeSection === 'sales' ? 'active' : ''}`}
          >
            <FaChartLine className="mr-2" />
            Sales Analytics
          </button>
        </div>

        {/* Main Content */}
        <div className="demo-section">
          {renderSection()}
        </div>

        {/* Navigation Buttons */}
        <div className="fixed bottom-8 right-8 flex gap-4">
          {currentStep > 0 && (
            <button
              onClick={handlePreviousStep}
              className="nav-button secondary"
            >
              Previous
            </button>
          )}
          {currentStep < tutorialSteps.length - 1 ? (
            <button
              onClick={handleNextStep}
              className="nav-button primary"
            >
              Next
              <FaArrowRight />
            </button>
          ) : (
            <button
              onClick={() => navigate('/TourGuide_Dashboard')}
              className="nav-button primary"
            >
              Go to Dashboard
              <FaArrowRight />
            </button>
          )}
        </div>

        {/* Help Button */}
        <button 
          className="help-button"
          onClick={() => setShowTip(true)}
          aria-label="Show help"
        >
          <FaInfoCircle />
        </button>
      </main>
    </div>
  );
} 