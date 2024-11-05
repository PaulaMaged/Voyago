// Import the required modules
import express from "express";
import AdminController from "../controllers/AdminController.js";

// Create a new router instance
const router = express.Router();

// Define the admin routes
/**
 * Marks a complaint as either pending or resolved.
 *
 * A POST Request
 */
router.post("/mark-complaint", AdminController.markComplaint);

/**
 * Add a reply to a complaint.
 *
 * A POST request to add a reply to a specific complaint
 */
router.post("/reply-to-complaint", AdminController.replyToComplaint);

/**
 * Retrieves and returns all complaints, sorted by date in descending order.
 *
 * A GET request
 */
router.get("/get-complaints-by-date", AdminController.getComplaintsByDate);

/**
 * Retrieves and returns complaints filtered by status.
 *
 * A POST request to filter complaints by status
 */
router.post("/get-complaints-by-status", AdminController.getComplaintsByStatus);

/**
 * Retrieves and returns all complaints with their statuses.
 *
 * A GET request to view all complaints and their statuses
 */
router.get("/get-all-complaints", AdminController.getAllComplaints);

/**
 * Retrieves and returns the details of a specific complaint.
 *
 * A GET request to view the details of a selected complaint
 */
router.get(
  "/get-complaint-details/:complaintId",
  AdminController.getComplaintDetails
);

// Export the router
export default router;
