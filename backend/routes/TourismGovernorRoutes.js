import express from "express";
const router = express.Router();
import TourismGovernorController from "../controllers/TourismGovernorController.js";

// Create a Landmark (Museum/Historical Place)
router.post("/landmarks", TourismGovernorController.createLandmark);

// Read Landmark (By ID)
router.get("/landmarks/:id", TourismGovernorController.getLandmark);

// View All Landmarks with a specific Tag
router.get(
  "/tags/:tagId/landmarks",
  TourismGovernorController.getLandmarksByTag
);

// Update a Landmark
router.put("/landmarks/:id", TourismGovernorController.updateLandmark);

// Delete a Landmark
router.delete("/landmarks/:id", TourismGovernorController.deleteLandmark);

//create a Tag
router.post("/tags", TourismGovernorController.createTag);

// Delete a Tag
router.delete("/tags/:id", TourismGovernorController.deleteTag);

// GET all Tags
router.get("/tags", TourismGovernorController.getAllTags);

//create a TourismGov
router.post("/tourgovernor", TourismGovernorController.createTourGovernor);

//GET TourGoverner
router.get("/tourGovernors/:id", TourismGovernorController.getTourGovernor);

//Update TourGovernor
router.put("/tourGovernors/:id", TourismGovernorController.updateTourGovernor);

// Delete TourGovernor
router.delete(
  "/tourGovernors/:id",
  TourismGovernorController.deleteTourGovernor
);

//Create Location
router.post("/locations", TourismGovernorController.createLocation);
//Get Location
router.get("/locations/:id", TourismGovernorController.getLocation);

//delete Location
router.delete("/locations/:id", TourismGovernorController.deleteLocation);

// View All Tourism Governor's Landmarks
router.get(
  "/governor/:id/landmarks",
  TourismGovernorController.getGovernorLandmarks
);

export default router;
