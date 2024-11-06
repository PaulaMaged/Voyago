// backend/routes/PublicRoutes.js
import express from "express";
const router = express.Router();
import PublicController from "../controllers/PublicController.js";

// View All Upcoming Activities
router.get("/get-upcoming-events", PublicController.getUpcomingActivities);

// View All Itineraries
router.get("get-all-itineraries", PublicController.getAllItineraries);

// View All Historical Places/Museums
router.get("/get-all-landmarks", PublicController.getAllLandmarks);

export default router;
