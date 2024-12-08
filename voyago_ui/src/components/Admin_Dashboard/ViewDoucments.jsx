import { useState, useEffect } from "react";

import axios from "axios";

const getnewusers = async (setDocuments) => {
  try {
    const response = await axios.get(
      "http://localhost:8000/api/user/get-new-users"
    );
    if (response.status === 200) {
      setDocuments(response.data);
    } else {
      console.error("Error getting new users:", response.data);
      alert(
        "An error occurred while getting new users. Please try again later."
      );
    }
  } catch (error) {
    console.error("Error getting new users:", error);
    alert("An error occurred while getting new users. Please try again later.");
  }
};

export default function ViewDocuments() {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    getnewusers(setDocuments);
  }, []);

  const handleDocumentAction = async (id, action) => {
    // Logic to accept or reject documents
    console.log(id);
    if (action === "accepted") {
      axios.put(`http://localhost:8000/api/user/update-user/${id}`, {
        is_accepted: true,
        is_new: false,
      });
    } else {
      await axios.delete(`http://localhost:8000/api/user/delete-user/${id}`);

      alert(`Application has been ${action}`);
      setDocuments(documents.filter((doc) => doc._id !== id));

      await axios.post(`http://localhost:8000/api/user/send-email`, {
        email: "Number1bos@hotmail.com",
        message: "Your application has been rejected!",
      });
    }
  };

  const handleDocumentDownload = (id) => {
    // Simulating PDF download
    console.log(`Downloading PDF for document ID: ${id}`);
    alert("PDF download started. (This is a simulation)");
  };

  return (
    <div className="view-documents">
      <h2>View Documents</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Type</th>
            <th>Documents</th>
            <th>Action</th>
            <th>Download PDF</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc._id}>
              <td>{doc.username}</td>
              <td>{doc.email}</td>
              <td>{doc.role}</td>
              <td>{doc.is_accepted ? "Accepted" : "Pending"}</td>
              <td>
                <button
                  onClick={() => handleDocumentAction(doc._id, "accepted")}
                  className="accept"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleDocumentAction(doc._id, "rejected")}
                  className="reject"
                >
                  Reject
                </button>
              </td>
              <td>
                <button
                  onClick={() => handleDocumentDownload(doc._id)}
                  className="download"
                >
                  Download PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <style>{`
        .view-documents {
          width: 100%;
          overflow-x: auto;
        }
        h2 {
          color: #2c3e50;
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
        button {
          padding: 5px 10px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-right: 5px;
          transition: background-color 0.3s;
        }
        .accept {
          background-color: #2ecc71;
          color: white;
        }
        .accept:hover {
          background-color: #27ae60;
        }
        .reject {
          background-color: #e74c3c;
          color: white;
        }
        .reject:hover {
          background-color: #c0392b;
        }
        .download {
          background-color: #3498db;
          color: white;
        }
        .download:hover {
          background-color: #2980b9;
        }
      `}</style>
    </div>
  );
}
