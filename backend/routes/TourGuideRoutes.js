import express from "express";
import TourGuideController from "../controllers/TourGuideController.js";

const router = express.Router();

// *********************************************
// *************** ITINERARY ENDPOINTS *********
// *********************************************
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

// *********************************************
// *************** TOUR GUIDE ENDPOINTS ********
// *********************************************
// Create Tour Guide
router.post("/create-tourguide", TourGuideController.createTourGuide);

// Get Tour Guide Profile
router.get(
  "/get-tourguide/:tourGuideId",
  TourGuideController.getTourGuideProfileInfo
);

// Get Tour Guide Information
router.get("/get-tourguide/:tourGuideId", TourGuideController.getTourGuide);

// Get Tour Guide by User ID
router.get(
  "/get-tourguide-by-userId/:userId",
  TourGuideController.getTourGuideByUserId
);

// Update Tour Guide
router.put(
  "/update-tourguide/:tourGuideId",
  TourGuideController.updateTourGuide
);

// Delete Tour Guide
router.delete(
  "/delete-tourguide/:tourGuideId",
  TourGuideController.deleteTourGuide
);

// ***********************************************
// ********* TOUR GUIDE ITINERARY ENDPOINTS ********
// ***********************************************
// Get All Itineraries
router.get("/get-all-itineraries", TourGuideController.getAllItineraries);

// View All Tour Guide's Itineraries
router.get(
  "/get-tourguide-itineraries/:tourGuideId",
  TourGuideController.getTourGuideItineraries
);

router.post("/getActivityReviews", TourGuideController.getActivityRate);
router.post("/getTourGuideReviews", TourGuideController.getTourGuideReview);


export default router;
