import express from "express";

const router = express.Router();
import TourGuideController from "../controllers/TourGuideController.js";

// Create an Itinerary
router.post("/create-itinerary", TourGuideController.createItinerary);

// Read Itinerary (By ID)
router.get("/get-itinerary/:itineraryId", TourGuideController.getItinerary);

// Update an Itinerary
router.put(
  "/update-itinerary/:itineraryId",
  TourGuideController.updateItinerary
);

// Delete an Itinerary (Prevent if bookings exist)
router.delete(
  "/delete-itinerary/:itineraryId",
  TourGuideController.deleteItinerary
);

//create Tour Guide
router.post("/create-tourguide", TourGuideController.createTourGuide);

//get Tour Guide Profile
router.get(
  "/get-tourguide/:tourGuideId",
  TourGuideController.getTourGuideProfileInfo
);

//get Tour Guide
router.get("/get-tourguide/:tourGuideId", TourGuideController.getTourGuide);

//get Tour Guide by User ID
router.get(
  "/get-tourguide-by-userId/:userId",
  TourGuideController.getTourGuideByUserId
);

//update Tour Guide
router.put(
  "/update-tourguide/:tourGuideId",
  TourGuideController.updateTourGuide
);

//delete Tour Guide
router.delete(
  "/delete-tourguide/:tourGuideId",
  TourGuideController.deleteTourGuide
);

// View All Tour Guide's Itineraries
router.get(
  "/get-tourguide-itineraries/:tourGuideId",
  TourGuideController.getTourGuideItineraries
);

export default router;
