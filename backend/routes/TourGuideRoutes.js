import express from "express";
import TourGuideController from "../controllers/TourGuideController.js";
import ItineraryController from "../controllers/ItineraryController.js";
import upload from "../middlewares/uploadMiddleware.js";
import multer from "multer";
const router = express.Router();

// *********************************************
// *************** ITINERARY ENDPOINTS *********
// *********************************************
// Create an Itinerary
router.post("/create-tourguide", (req, res) => {
  upload.single("upFile")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.error("Multer Error:", err);
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // An unknown error occurred when uploading.
      console.error("Unknown Error:", err);
      return res.status(400).json({ error: err.message });
    }

    // Everything went fine. Proceed with the controller function.
    TourGuideController.createTourGuide(req, res);
  });
});


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
router.get(
  "/getItineraryReview/:itineraryId",
  ItineraryController.getItineraryRating
);
router.get(
  "/deactivateItinerary/:itineraryId",
  ItineraryController.deactivateItinerary
);
router.get(
  "/activateItinerary/:itineraryId",
  ItineraryController.activateItinerary
);
router.get(
  "/getActivityReviews/:activityId",
  TourGuideController.getActivityRate
);
router.get(
  "/getTourGuideReviews/:tourGuideId",
  TourGuideController.getTourGuideReview
);

export default router;
