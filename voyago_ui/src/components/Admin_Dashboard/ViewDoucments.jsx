import { useState } from "react";

const mockDocuments = [
  { id: 1, name: "John Doe", type: "Tour Guide", documents: ["License", "ID"] },
  {
    id: 2,
    name: "Jane Smith",
    type: "Advertiser",
    documents: ["Business Permit", "Ad Samples"],
  },
  {
    id: 3,
    name: "Bob Johnson",
    type: "Seller",
    documents: ["Product Catalog", "Tax Certificate"],
  },
];

export default function ViewDocuments() {
  const [documents, setDocuments] = useState(mockDocuments);

  const handleDocumentAction = (id, action) => {
    // Logic to accept or reject documents
    setDocuments(documents.filter((doc) => doc.id !== id));
    alert(`Application ${action}`);
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
            <th>Name</th>
            <th>Type</th>
            <th>Documents</th>
            <th>Action</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id}>
              <td>{doc.name}</td>
              <td>{doc.type}</td>
              <td>{doc.documents.join(", ")}</td>
              <td>
                <button
                  onClick={() => handleDocumentAction(doc.id, "accepted")}
                  className="accept"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleDocumentAction(doc.id, "rejected")}
                  className="reject"
                >
                  Reject
                </button>
              </td>
              <td>
                <button
                  onClick={() => handleDocumentDownload(doc.id)}
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
