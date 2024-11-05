import express from "express";
import TouristController from "../controllers/TouristController.js";
const router = express.Router();

router.post("/tourists", TouristController.createTourist);
router.get("/tourists/:id", TouristController.getTouristById);

// Receive loyalty points upon payment for any event/itinerary
router.post("/tourists/:id/pay", TouristController.touristPay);

// Receive a badge based on my level and Redeem my points to cash in my wallet
router.put("/tourists/:id/redeem", TouristController.redeemPoints);

// Rate a product that I purchased
router.post("/tourists/:id/rate/product", TouristController.rateProduct);

// Rate an activity
router.post("/tourists/:id/rate/activity", TouristController.rateActivity);

// Rate an itinerary
router.post("/tourists/:id/rate/itinerary", TouristController.rateItinerary);

// Get the balance of a tourist
router.get("/tourists/:id/balance", TouristController.getTouristBalance);

// Update the tourist's profile
router.put("/tourists/:id/profile", TouristController.updateTouristProfile);

// Rate a tour guide
router.post("/tourists/:id/rate/tour-guide", TouristController.rateTourGuide);

// File a complaint
router.post("/tourists/:id/complaint", TouristController.fileComplaint);

// Cancel an Activity Booking
router.delete(
  "/activity-bookings/:bookingId",
  TouristController.cancelActivityBooking
);

// Cancel an Itinerary Booking
router.delete(
  "/itinerary-bookings/:bookingId",
  TouristController.cancelItineraryBooking
);

// View my list of issued complaints and its status (pending/resolved)
router.get("/tourists/:id/complaints", TouristController.viewComplaints);

export default router;
