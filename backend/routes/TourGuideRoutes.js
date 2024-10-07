import express from "express";

const router = express.Router();
import TourGuideController from "../controllers/TourGuideController.js";

// Create an Itinerary
router.post("/itineraries", TourGuideController.createItinerary);

// Read Itinerary (By ID)
router.get("/itineraries/:id", TourGuideController.getItinerary);

// Update an Itinerary
router.put("/itineraries/:id", TourGuideController.updateItinerary);

// Delete an Itinerary (Prevent if bookings exist)
router.delete("/itineraries/:id", TourGuideController.deleteItinerary);

// View All Tour Guide's Itineraries
router.get(
  "/tourguide/:id/itineraries",
  TourGuideController.getTourGuideItineraries
);

export default router;
