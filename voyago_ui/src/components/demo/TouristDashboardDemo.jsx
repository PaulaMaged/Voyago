import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ViewProductTourist from '../viewProductTourist';
import ViewPurchasedProducts from '../viewPurchasedProducts';
import ViewActivityGuest from '../viewActivityGuest';
import ViewItineraryGuest from '../viewItineraryGuest';
import '../viewProductTourist.css';
import '../viewPurchasedProducts.css';
import './TouristDashboardDemo.css';
import { 
  FaArrowRight, 
  FaLightbulb, 
  FaInfoCircle, 
  FaShoppingCart, 
  FaHeart, 
  FaHistory, 
  FaStar,
  FaMapMarkedAlt,
  FaRoute,
  FaCalendarAlt
} from 'react-icons/fa';

export default function TouristDashboardDemo() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [showTip, setShowTip] = useState(true);
  const [activeSection, setActiveSection] = useState('products');

  const tutorialSteps = [
    {
      title: "Welcome to Voyago!",
      content: "Discover amazing local products and experiences.",
      tip: "Click 'Next' to start exploring our features",
      icon: <FaShoppingCart className="text-2xl text-primary" />,
      section: 'products'
    },
    {
      title: "Browse Products",
      content: "Find the perfect items from our local sellers.",
      tip: "Try using filters and search to find specific items",
      icon: <FaHeart className="text-2xl text-accent" />,
      section: 'products'
    },
    {
      title: "Explore Activities",
      content: "Discover exciting local activities and events.",
      tip: "Browse through various activities offered by local guides",
      icon: <FaMapMarkedAlt className="text-2xl text-green-500" />,
      section: 'activities'
    },
    {
      title: "Plan Your Journey",
      content: "Check out curated itineraries for your trip.",
      tip: "View detailed itineraries created by experienced guides",
      icon: <FaRoute className="text-2xl text-blue-500" />,
      section: 'itineraries'
    },
    {
      title: "Purchase History",
      content: "Track your orders and leave reviews.",
      tip: "View your past purchases and share your experience",
      icon: <FaHistory className="text-2xl text-secondary" />,
      section: 'purchases'
    },
    {
      title: "Rate & Review",
      content: "Help other tourists by sharing your feedback.",
      tip: "Leave ratings and reviews for purchased items",
      icon: <FaStar className="text-2xl text-yellow-500" />,
      section: 'purchases'
    }
  ];

  useEffect(() => {
    // Auto-hide tip after 5 seconds
    const timer = setTimeout(() => {
      setShowTip(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentStep]);

  // Update active section when step changes
  useEffect(() => {
    setActiveSection(tutorialSteps[currentStep].section);
    setShowTip(true); // Show tip when step changes
  }, [currentStep]);

  const handleNextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    // Find the first step that matches this section
    const stepIndex = tutorialSteps.findIndex(step => step.section === section);
    if (stepIndex !== -1) {
      setCurrentStep(stepIndex);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'products':
        return <ViewProductTourist />;
      case 'purchases':
        return <ViewPurchasedProducts />;
      case 'activities':
        return <ViewActivityGuest />;
      case 'itineraries':
        return <ViewItineraryGuest />;
      default:
        return <ViewProductTourist />;
    }
  };

  return (
    <div className="demo-container">
      {/* Header Section */}
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
          
          {/* Progress Bar */}
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
            onClick={() => handleSectionChange('products')}
            className={`demo-button ${activeSection === 'products' ? 'active' : ''}`}
          >
            <FaShoppingCart className="mr-2" />
            Products
          </button>
          <button 
            onClick={() => handleSectionChange('activities')}
            className={`demo-button ${activeSection === 'activities' ? 'active' : ''}`}
          >
            <FaMapMarkedAlt className="mr-2" />
            Activities
          </button>
          <button 
            onClick={() => handleSectionChange('itineraries')}
            className={`demo-button ${activeSection === 'itineraries' ? 'active' : ''}`}
          >
            <FaRoute className="mr-2" />
            Itineraries
          </button>
          <button 
            onClick={() => handleSectionChange('purchases')}
            className={`demo-button ${activeSection === 'purchases' ? 'active' : ''}`}
          >
            <FaHistory className="mr-2" />
            My Purchases
          </button>
        </div>

        {/* Feature Preview */}
        <div className="feature-preview mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="feature-card">
              <FaShoppingCart className="text-3xl mb-2 text-primary" />
              <h3 className="font-semibold">Local Products</h3>
              <p className="text-sm text-gray-600">Discover unique local items</p>
            </div>
            <div className="feature-card">
              <FaMapMarkedAlt className="text-3xl mb-2 text-green-500" />
              <h3 className="font-semibold">Activities</h3>
              <p className="text-sm text-gray-600">Join exciting local events</p>
            </div>
            <div className="feature-card">
              <FaRoute className="text-3xl mb-2 text-blue-500" />
              <h3 className="font-semibold">Itineraries</h3>
              <p className="text-sm text-gray-600">Follow curated travel plans</p>
            </div>
            <div className="feature-card">
              <FaCalendarAlt className="text-3xl mb-2 text-accent" />
              <h3 className="font-semibold">Bookings</h3>
              <p className="text-sm text-gray-600">Manage your reservations</p>
            </div>
          </div>
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
              onClick={() => navigate('/Tourist_Dashboard')}
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