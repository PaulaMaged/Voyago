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

//create Tour Guide
router.post("/tourguides", TourGuideController.createTourGuide);

//get Tour Guide Profile
router.get(
  "/tourguides/profile/:id",
  TourGuideController.getTourGuideProfileInfo
);

//get Tour Guide
router.get("/tourguides/:id", TourGuideController.getTourGuideById);

//update Tour Guide
router.put("/tourguides/:id", TourGuideController.updateTourGuideById);

//delete Tour Guide
router.delete("/tourguides/:id", TourGuideController.deleteTourGuideById);

// View All Tour Guide's Itineraries
router.get(
  "/tourguides/:id/itineraries",
  TourGuideController.getTourGuideItineraries
);

export default router;
