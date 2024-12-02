import { useState } from "react";
import axios from "axios";

export default function CreatePromoCode() {
  const [discount, setDiscount] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [message, setMessage] = useState("");

  const generatePromoCode = () => {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const promoCode = generatePromoCode();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/promo-codes/",
        {
          code: promoCode,
          discount,
          expirationDate,
        }
      );

      if (response.status === 201) {
        setMessage(
          `Promo code ${promoCode} created successfully! \n Discount: ${discount}%, \n Expiration Date: ${expirationDate}`
        );
        setDiscount("");
        setExpirationDate("");
      } else {
        setMessage("Failed to create promo code. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      console.error("Error creating promo code:", error);
    }
  };

  return (
    <div>
      <h2 className="form-title">Create Promo Code</h2>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="discount" className="form-label">
              Discount (%):
            </label>
            <input
              type="number"
              id="discount"
              min="1"
              max="100"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="expirationDate" className="form-label">
              Expiration Date:
            </label>
            <input
              type="date"
              id="expirationDate"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <button type="submit" className="submit-button">
            Create Promo Code
          </button>
          {message && <p className="message">{message}</p>}
        </form>
      </div>
      <style>{`
        /* Global styles */
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f7fafc;
        }

        /* Form container */
        .form-container {
          max-width: 500px;
          margin: 0 auto;
          padding: 20px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        /* Form title */
        .form-title {
          display: block;
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
          text-align: center;
        }

        /* Form styles */
        .form {
          display: flex;
          flex-direction: column;
          width: 100%;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          font-size: 14px;
          color: #333;
          margin-bottom: 8px;
        }

        .form-input {
          padding: 10px;
          font-size: 14px;
          border: 1px solid #ccc;
          border-radius: 4px;
          outline: none;
        }

        .form-input:focus {
          border-color: #4a90e2;
          box-shadow: 0 0 5px rgba(74, 144, 226, 0.2);
        }

        /* Submit button */
        .submit-button {
          padding: 12px;
          background-color: #4a90e2;
          color: white;
          font-size: 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .submit-button:hover {
          background-color: #357ab7;
        }

        .submit-button:focus {
          outline: none;
        }

        /* Message box */
        .message {
          margin-top: 20px;
          padding: 10px;
          background-color: #eaf7eb;
          color: #388e3c;
          border-radius: 4px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
