import { useState, useEffect } from "react";
import axios from "axios";
import { set } from "mongoose";

// This is hardcoded data for demonstration purposes
const hardcodedPromoCodes = [
  { id: 1, code: "SUMMER2023", discount: 20, expirationDate: "2023-08-31" },
  { id: 2, code: "WELCOME10", discount: 10, expirationDate: "2023-12-31" },
  { id: 3, code: "FLASH50", discount: 50, expirationDate: "2023-06-30" },
];

const hardcodedUsers = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com" },
];

export default function ShowcasePromoCodes() {
  const [selectedPromoCode, setSelectedPromoCode] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [PromoCodes, setPromoCodes] = useState([]);
  const [users, setUsers] = useState([]);

  // In a real application, you would fetch promo codes and users from your backend
  useEffect(() => {
    async function fetchData() {
      try {
        const promoCodesResponse = await axios.get(
          "http://localhost:8000/api/promo-codes/"
        );
        setPromoCodes(promoCodesResponse.data);

        const usersResponse = await axios.get(
          "http://localhost:8000/api/tourist/get-all-tourists"
        );
        setUsers(usersResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  const handleSendPromoCode = async () => {
    if (!selectedPromoCode || selectedUsers.length === 0) {
      setMessage("Please select a promo code and at least one user.");
      return;
    }

    // In a real application, you would send this data to your backend
    try {
      const response = await axios.post(
        "http://localhost:8000/api/promo-codes/send-promo-code",
        {
          promoCodeId: selectedPromoCode,
          userIds: selectedUsers,
        }
      );
      if (response.status === 200) {
        setMessage("Promo code sent successfully!");
        alert("Promo code sent successfully!");
        setSelectedPromoCode(null);
        setSelectedUsers([]);
      } else {
        setMessage("Failed to send promo code. Please try again.");
      }
    } catch (error) {
      console.error("Error sending promo code:", error);
      setMessage("Failed to send promo code. Please try again.");
    }

    // For demonstration, we'll just show a success message
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Showcase Promo Codes</h2>

      <div>
        <h3 className="text-lg font-semibold mb-2">Select Promo Code</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PromoCodes.map((promoCode) => (
            <div
              key={promoCode._id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                selectedPromoCode === promoCode._id
                  ? "bg-blue-100 border-blue-500"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setSelectedPromoCode(promoCode._id)}
            >
              <p className="font-bold">{promoCode.code}</p>
              <p>{promoCode.discount}% off</p>
              <p>Expires: {promoCode.expirationDate}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Select Users</h3>
        <div className="space-y-2">
          {users
            .filter((user) => user.user.role === "TOURIST")
            .map((user) => (
              <label key={user._id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user._id)}
                  onChange={() => {
                    setSelectedUsers((prev) =>
                      prev.includes(user._id)
                        ? prev.filter((id) => id !== user._id)
                        : [...prev, user._id]
                    );
                  }}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span>
                  {user.user.name} ({user.user.email})
                </span>
              </label>
            ))}
        </div>
      </div>

      <button
        onClick={handleSendPromoCode}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
      >
        Send Promo Code
      </button>

      {message && (
        <p className="mt-4 p-2 bg-green-100 text-green-800 rounded">
          {message}
        </p>
      )}
    </div>
  );
}
