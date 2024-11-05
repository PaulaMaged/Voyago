// backend/routes/PublicRoutes.js
import express from "express";
const router = express.Router();
import PublicController from "../controllers/PublicController.js";

// View All Upcoming Activities
router.get("/activities/upcoming", PublicController.getUpcomingActivities);

// View All Itineraries
router.get("/itineraries", PublicController.getAllItineraries);

// View All Historical Places/Museums
router.get("/landmarks", PublicController.getAllLandmarks);

export default router;
