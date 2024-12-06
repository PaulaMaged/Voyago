import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddProduct from '../addProduct';
import ViewProduct from '../viewProductSeller';
import ViewSales from '../Sales/SellerSales';
import '../viewProductTourist.css';
import './TouristDashboardDemo.css';
import { 
  FaArrowRight, 
  FaLightbulb, 
  FaInfoCircle, 
  FaStore, 
  FaBoxOpen, 
  FaChartLine,
  FaStar,
  FaClipboardList,
  FaUserCog,
  FaCalendarAlt,
  FaArrowLeft
} from 'react-icons/fa';

export default function SellerDashboardDemo() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [showTip, setShowTip] = useState(true);
  const [activeSection, setActiveSection] = useState('view-products');

  const tutorialSteps = [
    {
      title: "Welcome to Seller Dashboard!",
      content: "Your central hub for managing your business on Voyago.",
      tip: "Click 'Next' to start exploring your dashboard features",
      description: "This guided tour will show you how to manage products, track sales, and grow your business.",
      icon: <FaStore className="text-2xl text-primary" />,
      section: 'view-products'
    },
    {
      title: "Add New Products",
      content: "Start listing your products for tourists to discover.",
      tip: "Pro tip: High-quality images and detailed descriptions attract more customers",
      description: "Create compelling product listings with prices, descriptions, and multiple images to showcase your offerings.",
      icon: <FaBoxOpen className="text-2xl text-accent" />,
      section: 'add-products'
    },
    {
      title: "View Products",
      content: "Manage your product listings.",
      tip: "Edit, update or remove products as needed",
      icon: <FaClipboardList className="text-2xl text-green-500" />,
      section: 'view-products'
    },
    {
      title: "Track Sales",
      content: "Monitor your business performance.",
      tip: "View sales analytics and reports",
      icon: <FaChartLine className="text-2xl text-blue-500" />,
      section: 'sales'
    },
    {
      title: "Manage Reviews",
      content: "View and respond to customer feedback.",
      tip: "Maintain good relationships with your customers",
      icon: <FaStar className="text-2xl text-yellow-500" />,
      section: 'reviews'
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTip(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, [currentStep]);

  useEffect(() => {
    setActiveSection(tutorialSteps[currentStep].section);
    setShowTip(true);
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
    const stepIndex = tutorialSteps.findIndex(step => step.section === section);
    if (stepIndex !== -1) {
      setCurrentStep(stepIndex);
      setShowTip(true);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'add-products':
        return <AddProduct />;
      case 'view-products':
        return <ViewProduct />;
      case 'sales':
        return <ViewSales />;
      default:
        return <ViewProduct />;
    }
  };

  return (
    <div className="demo-container">
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
          <p className="text-surface/80 mb-4">
            {tutorialSteps[currentStep].description}
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Tutorial Tip - Same as TouristDashboardDemo */}
        {/* Reference lines 154-170 */}

        {/* Navigation Tabs */}
        <div className="demo-nav">
          <button 
            onClick={() => handleSectionChange('add-products')}
            className={`demo-button ${activeSection === 'add-products' ? 'active' : ''}`}
          >
            <FaBoxOpen className="mr-2" />
            Add Products
          </button>
          <button 
            onClick={() => handleSectionChange('view-products')}
            className={`demo-button ${activeSection === 'view-products' ? 'active' : ''}`}
          >
            <FaClipboardList className="mr-2" />
            View Products
          </button>
          <button 
            onClick={() => handleSectionChange('sales')}
            className={`demo-button ${activeSection === 'sales' ? 'active' : ''}`}
          >
            <FaChartLine className="mr-2" />
            Sales Analytics
          </button>
        </div>

        {/* Feature Preview */}
        <div className="feature-preview mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="feature-card">
              <FaBoxOpen className="text-3xl mb-2 text-primary" />
              <h3 className="font-semibold">Product Management</h3>
              <p className="text-sm text-gray-600">Add and manage your products</p>
            </div>
            <div className="feature-card">
              <FaChartLine className="text-3xl mb-2 text-green-500" />
              <h3 className="font-semibold">Sales Analytics</h3>
              <p className="text-sm text-gray-600">Track your business growth</p>
            </div>
            <div className="feature-card">
              <FaStar className="text-3xl mb-2 text-yellow-500" />
              <h3 className="font-semibold">Reviews</h3>
              <p className="text-sm text-gray-600">Manage customer feedback</p>
            </div>
            <div className="feature-card">
              <FaUserCog className="text-3xl mb-2 text-accent" />
              <h3 className="font-semibold">Account Settings</h3>
              <p className="text-sm text-gray-600">Customize your profile</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="demo-section">
          {renderSection()}
        </div>

        {/* Navigation Buttons - Same structure as TouristDashboardDemo */}
        {/* Reference lines 236-262 */}

        {/* Help Button - Same as TouristDashboardDemo */}
        {/* Reference lines 265-271 */}

        <div className="fixed bottom-8 right-8 flex gap-4">
          {currentStep > 0 && (
            <button
              onClick={handlePreviousStep}
              className="nav-button secondary"
              title="Go back to previous step"
            >
              <FaArrowLeft className="mr-2" />
              Previous
            </button>
          )}
          {currentStep < tutorialSteps.length - 1 ? (
            <button
              onClick={handleNextStep}
              className="nav-button primary"
              title="Continue to next feature"
            >
              Next
              <FaArrowRight className="ml-2" />
            </button>
          ) : (
            <button
              onClick={() => navigate('/seller-dashboard')}
              className="nav-button primary"
              title="Complete tutorial and go to main dashboard"
            >
              Go to Dashboard
              <FaArrowRight className="ml-2" />
            </button>
          )}
        </div>

        {showTip && (
          <div className="tutorial-tip" role="alert">
            <button 
              onClick={() => setShowTip(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              title="Dismiss tip"
            >
              ×
            </button>
            <div className="flex items-start gap-3">
              <FaLightbulb className="text-accent text-xl mt-1" />
              <div>
                <h3 className="font-semibold mb-1">{tutorialSteps[currentStep].content}</h3>
                <p className="text-sm text-gray-600">
                  {tutorialSteps[currentStep].tip}
                  {currentStep === 0 && (
                    <span className="block mt-1 text-xs text-accent">
                      Tips will automatically hide after 8 seconds. Click the help icon to show them again.
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        <button 
          className="help-button"
          onClick={() => setShowTip(true)}
          aria-label="Show help tips"
          title="Click to show current step tips"
        >
          <FaInfoCircle />
        </button>
      </main>
    </div>
  );
} 