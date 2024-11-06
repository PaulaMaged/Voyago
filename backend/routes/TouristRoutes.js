import express from "express";
import TouristController from "../controllers/TouristController.js";
const router = express.Router();

// Create a new tourist
router.post("/create-tourist", TouristController.createTourist);

router.get("/get-tourist/:touristId", TouristController.getTourist);

// Receive loyalty points upon payment for any event/itinerary
router.post("/tourist-pay/:touristId", TouristController.touristPay);

router.get(
  "/get-all-tourists-itinerary-bookings/:touristId",
  TouristController.getAllTouristsItineraryBooking
);

router.get(
  "/get-all-tourists-activity-bookings/:touristId",
  TouristController.getAllTouristActivityBooking
);

// Get all tourists
router.get("/get-all-tourists", TouristController.getAllTourists);

// Receive a badge based on my level and Redeem my points to cash in my wallet
router.put("/tourist-redeem-points/:touristId", TouristController.redeemPoints);

// Rate a product that I purchased
router.post("/tourist-rate-product/:touristId", TouristController.rateProduct);

// Rate an activity
router.post(
  "/tourist-rate-activity/:touristId",
  TouristController.rateActivity
);

// Rate an itinerary
router.post(
  "/tourist-rate-itinerary/:touristId",
  TouristController.rateItinerary
);

// Get the balance of a tourist
router.get(
  "/tourist-get-balance/touristId",
  TouristController.getTouristBalance
);

// Update the tourist's profile
router.put("/update-tourist/:touristId", TouristController.updateTourist);

// Rate a tour guide
router.post(
  "/tourist-rate-tourguide/:touristId",
  TouristController.rateTourGuide
);

// File a complaint
router.post(
  "/tourist-file-complaint/:touristId",
  TouristController.fileComplaint
);

router.get(
  "/get-tourist-by-user-id/:userId",
  TouristController.getTouristByUserId
);

// Delete tourist
router.delete("/delete-tourist/:touristId", TouristController.deleteTourist);

// Cancel an Activity Booking
router.delete(
  "/tourist-cancel-activity-booking/:activityBookingId",
  TouristController.cancelActivityBooking
);

// Cancel an Itinerary Booking
router.delete(
  "/tourist-cancel-itinerary-booking/:itineraryBookingId",
  TouristController.cancelItineraryBooking
);

// View my list of issued complaints and its status (pending/resolved)
router.get(
  "/tourist-get-all-complaints/:touristId",
  TouristController.viewComplaints
);

export default router;
