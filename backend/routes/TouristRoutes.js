import express from "express";
import TouristController from "../controllers/TouristController.js";
import BookmarkController from "../controllers/BookmarkController.js";
import multer from "multer";
import path from "path";
const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

/**
 *********************************************
 *                  Creation Routes
 *********************************************
 */
router.post("/create-tourist", TouristController.createTourist);

/**
 *********************************************
 *                Information Routes
 *********************************************
 */

router.get("/get-tourist/:touristId", TouristController.getTourist);
router.get(
  "/get-tourist-by-user-id/:userId",
  TouristController.getTouristByUserId
);
router.get(
  "/get-tourist-balance/:touristId",
  TouristController.getTouristBalance
);
router.put("/update-tourist/:touristId", TouristController.updateTourist);

/**
 *********************************************
 *            Booking and Payment Routes
 *********************************************
 */

router.post("/tourist-pay/:touristId", TouristController.touristPay);
router.get(
  "/get-all-tourists-itinerary-bookings/:touristId",
  TouristController.getAllTouristsItineraryBooking
);
router.get(
  "/get-all-tourists-activity-bookings/:touristId",
  TouristController.getAllTouristActivityBooking
);
router.delete(
  "/tourist-cancel-activity-booking/:activityBookingId",
  TouristController.cancelActivityBooking
);
router.delete(
  "/tourist-cancel-itinerary-booking/:itineraryBookingId",
  TouristController.cancelItineraryBooking
);
router.get(
  "/get-upcoming-bookings/:touristId",
  TouristController.getUpcomingBookings
);
router.get(
  "/get-booking-history/:touristId",
  TouristController.getBookingHistory
);

/**
 *********************************************
 *             Rating and Review Routes
 *********************************************
 */

router.post("/tourist-rate-product/:touristId", TouristController.rateProduct);
router.post(
  "/tourist-rate-activity/:touristId",
  TouristController.rateActivity
);
router.post(
  "/tourist-rate-itinerary/:touristId",
  TouristController.rateItinerary
);
router.post(
  "/tourist-rate-tourGuide/:touristId",
  TouristController.rateTourGuide
);

/**
 *********************************************
 *          Complaint and Redemptions Routes
 *********************************************
 */

router.post(
  "/tourist-file-activity-complaint/:touristId",
  TouristController.fileActivityComplaint
);
router.post(
  "/tourist-file-itinerary-complaint/:touristId",
  TouristController.fileItineraryComplaint
);

router.post(
  "/create-user-complaint/:userId",
  TouristController.createUserComplaint
);

router.get(
  "/get-all-user-complaints/:userId",
  TouristController.getAllUserComplaints
);

router.get("/get-all-complaints", TouristController.getAllComplaints);

router.put("/update-complaint/:complaintId", TouristController.updateComplaint);
/**
 *********************************************
 *              Management Routes
 *********************************************
 */

router.get(
  "/view-all-activity-complaints",
  TouristController.viewAllActivityComplaints
);
router.get(
  "/view-all-itinerary-complaints",
  TouristController.viewAllItineraryComplaints
);

router.get("/get-all-tourists", TouristController.getAllTourists);
router.delete("/delete-tourist/:touristId", TouristController.deleteTourist);
router.post("/check-if-new", TouristController.checkIfNew);
router.post("/book-activties", TouristController.bookActivity);

router.post("/create-bookmark", BookmarkController.createBookmark);
router.get("/get-bookmarks/:touristId", BookmarkController.getTouristBookmarks);
router.delete(
  "/remove-bookmark/:touristId/:bookmarkId",
  BookmarkController.removeBookmark
);
router.post(
  "/upload-profile-picture/:touristId",
  upload.single("profile_picture"),
  TouristController.uploadProfilePicture
);

router.get(
  "/get-tourist-notifications/:touristId",
  TouristController.getTouristNotifications
);

router.get(
  "/profile-picture/:touristId",
  TouristController.getTouristProfilePicture
);

export default router;
