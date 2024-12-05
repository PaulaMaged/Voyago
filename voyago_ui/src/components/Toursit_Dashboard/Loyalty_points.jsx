import React, { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import axios from "axios";

const badges = [
  { level: 1, name: "Bronze", icon: "🥉" },
  { level: 2, name: "Silver", icon: "🥈" },
  { level: 3, name: "Gold", icon: "🥇" },
];

export default function LoyaltySystem() {
  const [loyaltyData, setLoyaltyData] = useState({
    points: 0,
    wallet: 0,
    level: 1,
    maxLevel: 3
  });
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const touristId = localStorage.getItem("roleId");

  useEffect(() => {
    if (touristId) {
      fetchLoyaltyData();
    }
  }, [touristId]);

  const fetchLoyaltyData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/tourist/get-tourist/${touristId}`
      );
      if (response.status === 200) {
        setLoyaltyData(response.data);
      }
    } catch (error) {
      console.error("Error fetching loyalty data:", error);
    }
  };

  const currentBadge = (() => {
    if (loyaltyData.points <= 100000) {
      return badges[0];
    } else if (loyaltyData.points <= 500000) {
      return badges[1];
    } else {
      return badges[2];
    }
  })();
  const nextBadge =
    currentBadge.level === 3 ? "MAX" : badges[currentBadge.level];
  const progress = (loyaltyData.level / loyaltyData.maxLevel) * 100;

  const handleRedeem = async () => {
    if (loyaltyData.points < 1000) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    setIsRedeeming(true);
    try {
      await axios.put(
        ` http://localhost:8000/api/tourist/update-tourist/${touristId}`,
        {
          points: loyaltyData.points - 1000,
          wallet: loyaltyData.wallet + 100,
        }
      );
    } catch (error) {
      console.error("Error redeeming points:", error);
      alert("Failed to redeem points. Please try again.");
    }

    // TODO: Implement redemption logic with backend
    // try {
    //   const response = await fetch('/api/redeem', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ points: 1000 }),
    //   });
    //   const data = await response.json();
    //   if (data.success) {
    //     setLoyaltyData(prev => ({
    //       ...prev,
    //       points: prev.points - 1000,
    //       wallet: prev.wallet + 100
    //     }));
    //   }
    // } catch (error) {
    //   console.error('Error redeeming points:', error);
    //   alert('Failed to redeem points. Please try again.');
    // }

    // Simulating successful redemption
    setTimeout(() => {
      setLoyaltyData((prev) => ({
        ...prev,
        points: prev.points - 1000,
        wallet: prev.wallet + 100,
      }));
      setIsRedeeming(false);
    }, 1000);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Loyalty Program</h2>
      </div>
      <div className="card-content">
        <div className="balance-container">
          <div className="balance-item">
            <p className="balance-value">{loyaltyData.points}</p>
            <p className="balance-label">Total Points</p>
          </div>
          <div className="balance-item">
            <p className="balance-value">${loyaltyData.wallet}</p>
            <p className="balance-label">Wallet Balance</p>
          </div>
        </div>

        <div className="badge-container">
          <div className="badge-item">
            <p className="badge-icon">{currentBadge.icon}</p>
            <p className="badge-name">{currentBadge.name}</p>
            <p className="badge-label">Current Level</p>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          {nextBadge && (
            <div className="badge-item">
              <p className="badge-icon">{nextBadge.icon}</p>
              <p className="badge-name">{nextBadge.name}</p>
              <p className="badge-label">Next Level</p>
            </div>
          )}
        </div>

        <div className="redeem-section">
          <h3 className="redeem-title">Redeem Points</h3>
          <p className="redeem-info">1000 points = $100</p>
          <button
            onClick={handleRedeem}
            disabled={loyaltyData.points < 1000 || isRedeeming}
            className="redeem-button"
          >
            {isRedeeming ? "Redeeming..." : "Redeem 1000 Points"}
          </button>
        </div>

        <div className="info-section">
          <p>Keep earning points to reach the next level!</p>
          <p>Max Level: {loyaltyData.maxLevel}</p>
        </div>

        {showAlert && (
          <div className="alert">
            <AlertCircle className="alert-icon" />
            <h4 className="alert-title">Error</h4>
            <p className="alert-description">
              You need at least 1000 points to redeem.
            </p>
          </div>
        )}
      </div>
      <style>{`
        .card {
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .card-header {
          padding: 20px;
          border-bottom: 1px solid #e0e0e0;
        }
        .card-title {
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          margin: 0;
        }
        .card-content {
          padding: 20px;
        }
        .balance-container {
          display: flex;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .balance-item {
          text-align: center;
        }
        .balance-value {
          font-size: 32px;
          font-weight: bold;
          margin: 0 0 4px 0;
        }
        .balance-label {
          font-size: 14px;
          color: #666;
          margin: 0;
        }
        .badge-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .badge-item {
          text-align: center;
        }
        .badge-icon {
          font-size: 32px;
          margin: 0 0 4px 0;
        }
        .badge-name {
          font-weight: bold;
          margin: 0 0 4px 0;
        }
        .badge-label {
          font-size: 14px;
          color: #666;
          margin: 0;
        }
        .progress-bar {
          width: 33%;
          height: 8px;
          background-color: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background-color: #4caf50;
          transition: width 0.3s ease;
        }
        .redeem-section {
          background-color: #f5f5f5;
          padding: 16px;
          border-radius: 4px;
          margin-bottom: 24px;
        }
        .redeem-title {
          font-weight: bold;
          margin: 0 0 8px 0;
        }
        .redeem-info {
          font-size: 14px;
          color: #666;
          margin: 0 0 16px 0;
        }
        .redeem-button {
          width: 100%;
          padding: 10px;
          background-color: #4caf50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s ease;
        }
        .redeem-button:hover:not(:disabled) {
          background-color: #45a049;
        }
        .redeem-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        .info-section {
          text-align: center;
          font-size: 14px;
          color: #666;
        }
        .alert {
          margin-top: 16px;
          padding: 12px;
          background-color: #ffebee;
          border: 1px solid #ffcdd2;
          border-radius: 4px;
          display: flex;
          align-items: center;
        }
        .alert-icon {
          width: 20px;
          height: 20px;
          margin-right: 8px;
          color: #f44336;
        }
        .alert-title {
          font-weight: bold;
          margin: 0 8px 0 0;
          color: #f44336;
        }
        .alert-description {
          margin: 0;
          color: #b71c1c;
        }
      `}</style>
    </div>
  );
}
