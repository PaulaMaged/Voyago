import React from "react";
import PropTypes from "prop-types";

const WelcomeModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-blue-900">
          Welcome to Your Tourist Dashboard!
        </h2>
        <p className="mb-4">
          We&apos;re excited to have you here. Let&apos;s get you started with a
          quick guide:
        </p>
        <ul className="list-disc pl-5 mb-6 space-y-2">
          <li>
            Check your <strong>Profile</strong> to view and update your
            information.
          </li>
          <li>
            Explore <strong>Activities</strong>, <strong>Itineraries</strong>,
            and <strong>Landmarks</strong> to plan your trip.
          </li>
          <li>
            Browse and purchase <strong>Products</strong> related to your
            travels.
          </li>
          <li>
            Use the <strong>Loyalty System</strong> to earn points and unlock
            rewards.
          </li>
          <li>
            If you need help, you can always submit a <strong>Complaint</strong>{" "}
            or view your existing ones.
          </li>
        </ul>
        <p className="mb-6">
          Feel free to explore all the features, and don&apos;t hesitate to
          reach out if you need any assistance!
        </p>
        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Got it, let&apos;s explore!
        </button>
      </div>
    </div>
  );
};
WelcomeModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default WelcomeModal;
