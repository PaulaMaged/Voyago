import express from "express";
const router = express.Router();
import AdvertiserController from "../controllers/AdvertiserController.js";

// ================================================ //
//                  Advertiser Routes             //
// ================================================ //

// Create an Advertiser
router.post("/create-advertiser", AdvertiserController.createAdvertiser);

// Get Advertiser by ID
router.get(
  "/get-advertiser/:advertiserId",
  AdvertiserController.getAdvertiserById
);

router.get(
  "/get-advertiser-by-userId/:userId",
  AdvertiserController.getAdvertiserByUserId
);

// Get All Advertisers
router.get("/get-all-advertisers", AdvertiserController.getAllAdvertisers);

// Update Advertiser by ID
router.put(
  "/update-advertiser/:advertiserId",
  AdvertiserController.updateAdvertiser
);

// Delete Advertiser by ID
router.delete(
  "/delete-advertiser/:advertiserId",
  AdvertiserController.deleteAdvertiser
);

// ================================================ //
//                   Activity Routes              //
// ================================================ //

// Create an Activity
router.post("/create-activity", AdvertiserController.createActivity);

// Read Activity (By ID)
router.get("/get-activity/:activityId", AdvertiserController.getActivity);

// GET All Activities
router.get("/get-all-activities", AdvertiserController.getAllActivities);

// Update an Activity
router.put("/update-activity/:activityId", AdvertiserController.updateActivity);

// Delete an Activity
router.delete(
  "/delete-activity/:activityId",
  AdvertiserController.deleteActivity
);

// ================================================ //
//                  Activity Advertiser Routes     //
// ================================================ //

// View All Advertiser's Activities
router.get(
  "/get-advertiser-activities/:advertiserId",
  AdvertiserController.getAdvertiserActivities
);

export default router;
