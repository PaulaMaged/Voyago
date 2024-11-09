import axios from "axios";
import { useState, useEffect } from "react";

const getAllComplaints = async (setComplaints) => {
  const response = await axios.get(
    `http://localhost:8000/api/tourist/get-all-complaints`
  );
  console.log(response.status, response.data);

  if (response.data) {
    setComplaints(response.data);
  } else {
    alert("Could not fetch the data!");
  }
};

export default function ManageComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      await getAllComplaints(setComplaints);
    };
    fetchData();
  }, []);

  const handleComplaintAction = async (id, action) => {
    setComplaints(
      complaints.map((complaint) =>
        complaint._id === id ? { ...complaint, state: action } : complaint
      )
    );
    const response = await axios.put(
      `http://localhost:8000/api/tourist/update-complaint/${id}`,
      {
        state: action,
      }
    );
    if (response.data) {
      alert("Complaint's status has been  updated successfully!");
    } else {
      alert("Could not update the complaint's status!");
    }
  };

  const handleSortComplaints = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    setComplaints(
      [...complaints].sort((a, b) =>
        newOrder === "asc"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date)
      )
    );
  };

  const filteredComplaints = complaints.filter(
    (complaint) => filterStatus === "all" || complaint.state === filterStatus
  );

  const handleResponseSubmit = (e) => {
    e.preventDefault();
    const response = e.target.response.value;

    const updatedComplaint = {
      ...selectedComplaint,
      reply: response,
      state: "resolved",
    };

    setSelectedComplaint(updatedComplaint);
    console.log(updatedComplaint);
    updateComplaint(updatedComplaint);
  };

  const updateComplaint = async (complaint) => {
    const response = await axios.put(
      `http://localhost:8000/api/tourist/update-complaint/${complaint._id}`,
      { state: complaint.state, reply: complaint.reply }
    );

    if (response.data) {
      setComplaints(
        complaints.map((c) => (c._id === complaint._id ? response.data : c))
      );
      alert("Complaint updated successfully!");
    } else {
      alert("Could not update the complaint!");
    }
  };

  return (
    <div className="manage-complaints">
      <h2>Manage Complaints</h2>
      <div className="complaint-controls">
        <button onClick={handleSortComplaints}>
          Sort by Date ({sortOrder === "asc" ? "Oldest First" : "Newest First"})
        </button>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredComplaints.map((complaint) => (
            <tr key={complaint._id}>
              <td>{complaint.title}</td>
              <td>{new Date(complaint.date).toLocaleDateString()}</td>
              <td>{complaint.state}</td>
              <td>
                <button onClick={() => setSelectedComplaint(complaint)}>
                  View Details
                </button>
                <button
                  onClick={() =>
                    handleComplaintAction(complaint._id, "pending")
                  }
                >
                  Mark Pending
                </button>
                <button
                  onClick={() =>
                    handleComplaintAction(complaint._id, "resolved")
                  }
                >
                  Mark Resolved
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedComplaint && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedComplaint.title}</h3>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(selectedComplaint.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Status:</strong> {selectedComplaint.state}
            </p>
            <p>
              <strong>Description:</strong> {selectedComplaint.body}
            </p>

            {selectedComplaint.reply && (
              <div>
                <p>
                  <strong>Response:</strong> {selectedComplaint.reply}
                </p>
                <button
                  onClick={() =>
                    setSelectedComplaint({ ...selectedComplaint, reply: "" })
                  }
                >
                  Send new response
                </button>
              </div>
            )}
            {!selectedComplaint.reply && (
              <form onSubmit={handleResponseSubmit}>
                <textarea
                  name="response"
                  placeholder="Enter your response"
                  required
                ></textarea>
                <button type="submit">Send Response</button>
              </form>
            )}

            <button onClick={() => setSelectedComplaint(null)}>Close</button>
          </div>
        </div>
      )}
      <style>{`
        .manage-complaints {
          width: 100%;
        }
        h2 {
          color: #2c3e50;
          margin-bottom: 20px;
        }
        .complaint-controls {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th,
        td {
          border: 1px solid #bdc3c7;
          padding: 10px;
          text-align: left;
        }
        th {
          background-color: #34495e;
          color: white;
        }
        button,
        select {
          padding: 5px 10px;
          border: 1px solid #bdc3c7;
          border-radius: 4px;
          background-color: #3498db;
          color: white;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        button:hover {
          background-color: #2980b9;
        }
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .modal-content {
          background-color: white;
          padding: 20px;
          border-radius: 4px;
          max-width: 500px;
          width: 100%;
        }
        textarea {
          width: 100%;
          height: 100px;
          margin-bottom: 10px;
          padding: 10px;
          border: 1px solid #bdc3c7;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
