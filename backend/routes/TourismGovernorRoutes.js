import express from "express";
const router = express.Router();
import TourismGovernorController from "../controllers/TourismGovernorController.js";

// Create a Landmark (Museum/Historical Place)
router.post("/landmarks", TourismGovernorController.createLandmark);

// Read Landmark (By ID)
router.get("/landmarks/:id", TourismGovernorController.getLandmark);

// Update a Landmark
router.put("/landmarks/:id", TourismGovernorController.updateLandmark);

// Delete a Landmark
router.delete("/landmarks/:id", TourismGovernorController.deleteLandmark);

// View All Tourism Governor's Landmarks
router.get(
  "/governor/:id/landmarks",
  TourismGovernorController.getGovernorLandmarks
);

export default router;
