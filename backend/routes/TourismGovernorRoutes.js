import express from "express";
const router = express.Router();
import TourismGovernorController from "../controllers/TourismGovernorController.js";

// Create a Landmark (Museum/Historical Place)
router.post("/create-landmark", TourismGovernorController.createLandmark);

// Read Landmark (By ID)
router.get("/get-landmarks/:landmarkId", TourismGovernorController.getLandmark);

// View All Landmarks with a specific Tag
router.get(
  "/get-all-landmarks-by-tag/:tagId",
  TourismGovernorController.getLandmarksByTag
);

// Get All Landmarks
router.get("/get-all-landmarks", TourismGovernorController.getAllLandmarks);


// Update a Landmark
router.put(
  "/update-landmark/:landmarkId",
  TourismGovernorController.updateLandmark
);

// Delete a Landmark
router.delete("/delete/:landmarkId", TourismGovernorController.deleteLandmark);

//create a Tag
router.post("/create-tag", TourismGovernorController.createTag);

// Delete a Tag
router.delete("/delete-tag/:TagId", TourismGovernorController.deleteTag);

// GET all Tags
router.get("/get-all-tags", TourismGovernorController.getAllTags);

//create a TourismGov
router.post(
  "/create-tourgovernor",
  TourismGovernorController.createTourGovernor
);

//GET TourGoverner
router.get(
  "/get-tourgovernor/:tourgovernorId",
  TourismGovernorController.getTourGovernor
);

//Update TourGovernor
router.put(
  "/update-tourgovernor/:tourgovernorId",
  TourismGovernorController.updateTourGovernor
);

// Delete TourGovernor
router.delete(
  "/delete-tourgovernor/:tourgovernorId",
  TourismGovernorController.deleteTourGovernor
);

//Create Location
router.post("/create-location", TourismGovernorController.createLocation);
//Get Location
router.get("/get-location/:locationId", TourismGovernorController.getLocation);

//delete Location
router.delete(
  "/delete-location/:locationId",
  TourismGovernorController.deleteLocation
);

// View All Tourism Governor's Landmarks
router.get(
  "/get-tourgovernor-landmarks/:tourgovernorId",
  TourismGovernorController.getGovernorLandmarks
);

export default router;
