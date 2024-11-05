import Complaint from "../models/Complaint.js";
import ReplyComplaint from "./ReplyComplaint.js";

/**
 * Marks a complaint as either pending or resolved.
 *
 * A POST Request
 *
 * @param {Object} req - The incoming HTTP request.
 * @param {Object} res - The outgoing HTTP response.
 */
const markComplaint = async (req, res) => {
  try {
    // Extract the complaint ID and status from the request body
    const { complaintId, status } = req.body;

    // Validate the presence of required fields in the request body
    if (!complaintId || !status) {
      // Return a 400 error if either field is missing
      return res
        .status(400)
        .json({ message: "Complaint ID and status are required" });
    }

    // Validate the status value to ensure it's either 'pending' or 'resolved'
    if (status !== "pending" && status !== "resolved") {
      // Return a 400 error if the status is invalid
      return res
        .status(400)
        .json({ message: 'Invalid status. Must be "pending" or "resolved"' });
    }

    // Retrieve the complaint from the database by its ID
    const complaint = await Complaint.findById(complaintId);

    // Check if the complaint exists
    if (!complaint) {
      // Return a 404 error if the complaint is not found
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Update the complaint's status
    complaint.status = status;

    // Save the updated complaint to the database
    await complaint.save();

    // Return a 200 success response with the updated complaint
    res
      .status(200)
      .json({ message: "Complaint status updated successfully", complaint });
  } catch (error) {
    // Log any errors that occur during the execution of this function
    console.error("Error marking complaint:", error);

    // Return a 500 error response to indicate an internal server error
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Adds a reply to a complaint.
 *
 * A POST request to add a reply to a specific complaint
 *
 * @param {Object} req - The incoming HTTP request.
 * @param {Object} res - The outgoing HTTP response.
 */
const replyToComplaint = async (req, res) => {
  try {
    // Extract the complaint ID and reply text from the request body
    const { complaintId, text } = req.body;

    // Validate the presence of required fields in the request body
    if (!complaintId || !text) {
      // Return a 400 error if either field is missing
      return res
        .status(400)
        .json({ message: "Complaint ID and reply text are required." });
    }

    // Retrieve the complaint from the database by its ID
    const complaint = await Complaint.findById(complaintId);

    // Check if the complaint exists
    if (!complaint) {
      // Return a 404 error if the complaint is not found
      return res.status(404).json({ message: "Complaint not found." });
    }

    // Create a new reply document and associate it with the complaint
    const reply = new ReplyComplaint({ text, complaint: complaint._id });

    // Save the reply to the database
    await reply.save();

    // Optionally, update the complaint's state if it's resolved by the reply
    complaint.state = "resolved";
    await complaint.save();

    // Return a 200 success response with the updated complaint and reply
    res.status(200).json({
      message: "Reply added to complaint successfully.",
      complaint,
      reply,
    });
  } catch (error) {
    // Log any errors that occur during the execution of this function
    console.error("Error replying to complaint:", error);

    // Return a 500 error response to indicate an internal server error
    res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Retrieves and returns all complaints, sorted by date in descending order.
 *
 * A GET request
 *
 * @param {Object} req - The incoming HTTP request.
 * @param {Object} res - The outgoing HTTP response.
 */

const getComplaintsByDate = async (req, res) => {
  try {
    // Retrieve all complaints from the database, sorted by date in descending order
    const complaints = await Complaint.find().sort({ date: -1 });

    // Return a 200 success response with the sorted complaints
    res.status(200).json({ complaints });
  } catch (error) {
    // Log any errors that occur during the execution of this function
    console.error("Error retrieving complaints:", error);

    // Return a 500 error response to indicate an internal server error
    res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Retrieves and returns complaints filtered by status.
 *
 * A POST request to filter complaints by status
 *
 * @param {Object} req - The incoming HTTP request.
 * @param {Object} res - The outgoing HTTP response.
 */
const getComplaintsByStatus = async (req, res) => {
  try {
    // Extract the status from the request body
    const { status } = req.body;

    // Validate the presence of required fields in the request body
    if (!status) {
      // Return a 400 error if the status is missing
      return res.status(400).json({ message: "Status is required" });
    }

    // Validate the status value to ensure it's either 'pending' or 'resolved'
    if (status !== "pending" && status !== "resolved") {
      // Return a 400 error if the status is invalid
      return res
        .status(400)
        .json({ message: 'Invalid status. Must be "pending" or "resolved"' });
    }

    // Retrieve complaints from the database where the status matches the filter
    const complaints = await Complaint.find({ status: status });

    // Return a 200 success response with the filtered complaints
    res.status(200).json({ complaints });
  } catch (error) {
    // Log any errors that occur during the execution of this function
    console.error("Error retrieving complaints by status:", error);

    // Return a 500 error response to indicate an internal server error
    res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Retrieves and returns all complaints with their statuses.
 *
 * A GET request to view all complaints and their statuses
 *
 * @param {Object} req - The incoming HTTP request.
 * @param {Object} res - The outgoing HTTP response.
 */
const getAllComplaints = async (req, res) => {
  try {
    // Retrieve all complaints from the database
    const complaints = await Complaint.find({}, "status");

    // Return a 200 success response with the complaints and their statuses
    res.status(200).json({ complaints });
  } catch (error) {
    // Log any errors that occur during the execution of this function
    console.error("Error retrieving all complaints:", error);

    // Return a 500 error response to indicate an internal server error
    res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Retrieves and returns the details of a specific complaint.
 *
 * A GET request to view the details of a selected complaint
 *
 * @param {Object} req - The incoming HTTP request.
 * @param {Object} res - The outgoing HTTP response.
 */

const getComplaintDetails = async (req, res) => {
  try {
    // Extract the complaint ID from the request parameters
    const { complaintId } = req.params;

    // Validate the presence of the complaint ID
    if (!complaintId) {
      return res.status(400).json({ message: "Complaint ID is required" });
    }

    // Retrieve the complaint from the database by its ID
    const complaint = await Complaint.findById(complaintId);

    // Check if the complaint exists
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Return a 200 success response with the complaint details
    res.status(200).json({ complaint });
  } catch (error) {
    // Log any errors that occur during the execution of this function
    console.error("Error retrieving complaint details:", error);

    // Return a 500 error response to indicate an internal server error
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  markComplaint,
  getComplaintDetails,
  replyToComplaint,
  getComplaintsByDate,
  getComplaintsByStatus,
  getAllComplaints,
};
