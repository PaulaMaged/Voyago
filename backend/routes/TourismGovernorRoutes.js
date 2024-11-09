import express from "express";
const router = express.Router();
import TourismGovernorController from "../controllers/TourismGovernorController.js";

// ============================================ Landmark Routes ============================================
router.post("/create-landmark", TourismGovernorController.createLandmark);
router.get("/get-landmarks/:landmarkId", TourismGovernorController.getLandmark);
router.get(
  "/get-all-landmarks-by-tag/:tagId",
  TourismGovernorController.getLandmarksByTag
);
router.get("/get-all-landmarks", TourismGovernorController.getAllLandmarks);
router.put(
  "/update-landmark/:landmarkId",
  TourismGovernorController.updateLandmark
);
router.delete("/delete/:landmarkId", TourismGovernorController.deleteLandmark);

// ============================================== Tag Routes ==============================================
router.post("/create-tag", TourismGovernorController.createTag);
router.delete("/delete-tag/:TagId", TourismGovernorController.deleteTag);
router.get("/get-all-tags", TourismGovernorController.getAllTags);
router.put('/update-tag/:TagId', TourismGovernorController.updateTag);

// ====================================== Tourism Governor Routes ======================================
router.post(
  "/create-tourgovernor",
  TourismGovernorController.createTourGovernor
);
router.get(
  "/get-tourgovernor/:tourgovernorId",
  TourismGovernorController.getTourGovernor
);
router.put(
  "/update-tourgovernor/:tourgovernorId",
  TourismGovernorController.updateTourGovernor
);
router.delete(
  "/delete-tourgovernor/:tourgovernorId",
  TourismGovernorController.deleteTourGovernor
);
router.get(
  "/get-tourgovernor-landmarks/:tourgovernorId",
  TourismGovernorController.getGovernorLandmarks
);
router.get(
  "/get-tourgovernor-by-userid/:userId",
  TourismGovernorController.getTourGovernorByUserId
);

// ========================================== Location Routes ==========================================
router.post("/create-location", TourismGovernorController.createLocation);
router.get("/get-location/:locationId", TourismGovernorController.getLocation);
router.delete(
  "/delete-location/:locationId",
  TourismGovernorController.deleteLocation
);

export default router;
