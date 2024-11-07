// backend/routes/PublicRoutes.js
import express from "express";
const router = express.Router();
import PublicController from "../controllers/PublicController.js";

// =================================== Upcoming Events ==================================
// View All Upcoming Activities
router.get("/get-upcoming-events", PublicController.getUpcomingActivities);

// =================================== Itineraries ==================================
// View All Itineraries
router.get("/get-all-itineraries", PublicController.getAllItineraries);

// =================================== Historical Places/Museums ==================================
// View All Historical Places/Museums
router.get("/get-all-landmarks", PublicController.getAllLandmarks);

export default router;
