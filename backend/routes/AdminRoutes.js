// Import the required modules
import express from "express";
import AdminController from "../controllers/AdminController.js";

// Create a new router instance
const router = express.Router();

// =====================================
// Admin Management Routes
// =====================================

/**
 * Creates a new admin.
 *
 * A POST request to register a new admin.
 */
router.post("/create-admin", AdminController.createAdmin);

/**
 * Deletes an admin account.
 *
 * A DELETE request to delete an admin's account
 */
router.delete("/delete-admin/:adminId", AdminController.deleteAdmin);

/**
 * Updates an admin's account details.
 *
 * A PATCH request to update an admin's account details
 */
router.put("/update-admin/:adminId", AdminController.updateAdmin);

// =====================================
// Complaint Management Routes
// =====================================

/**
 * Marks an itinerary complaint as either pending or resolved.
 *
 * A POST Request
 */
router.post(
  "/mark-itinerary-complaint",
  AdminController.markItineraryComplaint
);

/**
 * Marks an activity complaint as either pending or resolved.
 *
 * A POST Request
 */
router.post("/mark-activity-complaint", AdminController.markActivityComplaint);

/**
 * Add a reply to an itinerary complaint.
 *
 * A POST request to add a reply to a specific itinerary complaint
 */
router.post(
  "/reply-to-itinerary-complaint",
  AdminController.replyToItineraryComplaint
);

/**
 * Add a reply to an activity complaint.
 *
 * A POST request to add a reply to a specific activity complaint
 */
router.post(
  "/reply-to-activity-complaint",
  AdminController.replyToActivityComplaint
);

// =====================================
// Complaint Retrieval Routes
// =====================================

/**
 * Retrieves and returns all itinerary complaints, sorted by date in descending order.
 *
 * A GET request
 */
router.get(
  "/get-itinerary-complaints-by-date",
  AdminController.getItineraryComplaintsByDate
);

/**
 * Retrieves and returns all activity complaints, sorted by date in descending order.
 *
 * A GET request
 */
router.get(
  "/get-activity-complaints-by-date",
  AdminController.getActivityComplaintsByDate
);

/**
 * Retrieves and returns itinerary complaints filtered by status.
 *
 * A POST request to filter itinerary complaints by status
 */
router.post(
  "/get-itinerary-complaints-by-status",
  AdminController.getItineraryComplaintsByStatus
);

/**
 * Retrieves and returns activity complaints filtered by status.
 *
 * A POST request to filter activity complaints by status
 */
router.post(
  "/get-activity-complaints-by-status",
  AdminController.getActivityComplaintsByStatus
);

/**
 * Retrieves and returns the admin by user ID.
 *
 * A GET request
 */
router.get("/get-admin-by-userId/:userId", AdminController.getAdminByUserId);

// =====================================
// Activity Category Management Routes
// =====================================

// Create an Activity Category
router.post(
  "/create-activity-category",
  AdminController.createActivityCategory
);

// Get Activity Category by ID
router.get(
  "/get-activity-category/:activityCategoryId",
  AdminController.getActivityCategory
);

// Get All Activity Categories
router.get(
  "/get-all-activity-categories",
  AdminController.getAllActivityCategories
);

// Update Activity Category by ID
router.put(
  "/update-activity-category/:activityCategoryId",
  AdminController.updateActivityCategory
);

// Delete Activity Category by ID
router.delete(
  "/delete-activity-category/:activityCategoryId",
  AdminController.deleteActivityCategory
);

// =====================================
// Flagging innaproperiate events Routes
// =====================================

router.put(
  "/flag-inapproperiate-activity/:activityId",
  AdminController.setInapproperiateFlagActivity
);

router.put(
  "/flag-inapproperiate-itinerary/:itineraryId",
  AdminController.setInapproperiateFlagItinerary
);
router.get("/get-total-users", AdminController.getTotalUsers);
router.get("/get-total-new-users", AdminController.getTotalNewUsersInThismonth);

// Export the router
export default router;
