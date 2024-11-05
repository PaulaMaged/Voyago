import express from "express";
const router = express.Router();
import AdvertiserController from "../controllers/AdvertiserController.js";

// Create an Advertiser
router.post("/advertisers", AdvertiserController.createAdvertiser);

// Get Advertiser by ID
router.get("/advertisers/:id", AdvertiserController.getAdvertiserById);

// Get All Advertisers
router.get("/advertisers", AdvertiserController.getAllAdvertisers);

// Update Advertiser by ID
router.put("/advertisers/:id", AdvertiserController.updateAdvertiser);

// Delete Advertiser by ID
router.delete("/advertisers/:id", AdvertiserController.deleteAdvertiser);

// Create an Activity
router.post("/activities", AdvertiserController.createActivity);

// Read Activity (By ID)
router.get("/activities/:id", AdvertiserController.getActivity);

//GET All Activities
router.get("/activities", AdvertiserController.getAllActivities);

// Update an Activity
router.put("/activities/:id", AdvertiserController.updateActivity);

// Delete an Activity
router.delete("/activities/:id", AdvertiserController.deleteActivity);

// View All Advertiser's Activities
router.get(
  "/advertiser/:id/activities",
  AdvertiserController.getAdvertiserActivities
);

export default router;
