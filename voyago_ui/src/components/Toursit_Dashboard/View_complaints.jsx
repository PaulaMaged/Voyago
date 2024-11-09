import axios from "axios";
// import { set } from "mongoose";
import { useState } from "react";

import { useEffect } from "react";

const get_my_complaints = async (setLoading, setMockComplaints, setError) => {
  try {
    const response = await axios.get(
      "http://localhost:8000/api/tourist/get-all-user-complaints/672e1234ee2a6ba6b26f1c1c"
    );
    if (response.data) {
      console.log(response.data);
      setMockComplaints(response.data);
      setLoading(false);
      setError(false);
    } else {
      console.log("No complaints found");
      setLoading(false);
    }
  } catch (error) {
    setError(true);
    console.log("Error fetching complaints", error);
  }
};

export default function ViewComplaints() {
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isloading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [mockComplaints, setMockComplaints] = useState([]);
  useEffect(() => {
    get_my_complaints(setLoading, setMockComplaints, setError);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleViewResponse = (complaint) => {
    setSelectedComplaint(complaint);
  };

  const closePopup = () => {
    setSelectedComplaint(null);
  };

  return (
    <div className="complaints-container">
      <h2>Your Complaints</h2>
      <div className="complaints-list">
        {error && <p>There was an error fetching complaints</p>}
        {isloading && !error && <p>Loading complaints...</p>}
        {!isloading &&
          !error &&
          mockComplaints.map((complaint, index) => (
            <div key={index} className={`complaint-card ${complaint.state}`}>
              <h3>{complaint.title}</h3>
              <p>
                <strong>Category:</strong> {complaint.category}
              </p>
              <p>
                <strong>Status:</strong> {complaint.state}
              </p>
              <p>
                <strong>Date:</strong> {formatDate(complaint.date)}
              </p>
              <p>
                <strong>Description:</strong> {complaint.body}
              </p>
              {complaint.state && (
                <button
                  onClick={() => handleViewResponse(complaint)}
                  className="view-response-btn"
                >
                  View Response
                </button>
              )}
            </div>
          ))}
      </div>

      {selectedComplaint && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h3>Response to complaint : {selectedComplaint.title}</h3>

            <p>
              response :
              {selectedComplaint.reply ||
                "Your complaint will be resolved as soon as possible!"}
            </p>
            <button onClick={closePopup} className="close-btn">
              Close
            </button>
          </div>
        </div>
      )}

      <style>{`
        .complaints-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        h2 {
          color: #333;
          margin-bottom: 20px;
        }

        .complaints-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }

        .complaint-card {
          background-color: #f9f9f9;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease-in-out;
        }

        .complaint-card:hover {
          transform: translateY(-5px);
        }

        .complaint-card h3 {
          margin-top: 0;
          color: #2c3e50;
        }

        .complaint-card p {
          margin: 5px 0;
          font-size: 14px;
        }

        .complaint-card.pending {
          border-left: 5px solid #f39c12;
        }

        .complaint-card.resolved {
          border-left: 5px solid #2ecc71;
        }

        .view-response-btn {
          background-color: #3498db;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .view-response-btn:hover {
          background-color: #2980b9;
        }

        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .popup-content {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          max-width: 400px;
          width: 100%;
        }

        .close-btn {
          background-color: #e74c3c;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .close-btn:hover {
          background-color: #c0392b;
        }
      `}</style>
    </div>
  );
}
