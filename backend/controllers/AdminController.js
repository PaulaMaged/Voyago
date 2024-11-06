import Complaint from "../models/Complaint.js";
import User from "../models/User.js";
import Admin from "../models/Admin.js";
import ReplyComplaint from "../models/ReplyComplaint.js";
import ActivityCategory from "../models/ActivityCategory.js";

//create Activity Category
const createActivityCategory = async (req, res) => {
  const activityCategory = req.body;
  try {
    const newActivityCategory = new ActivityCategory(activityCategory);
    const savedActivityCategory = await newActivityCategory.save();
    res.status(201).json(savedActivityCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//GET All Activity Categories
const getAllActivityCategories = async (req, res) => {
  try {
    const activityCategories = await ActivityCategory.find();
    res.status(200).json(activityCategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//GET Activity Category by id
const getActivityCategory = async (req, res) => {
  try {
    const activityCategory = await ActivityCategory.findById(
      req.params.activityCategoryId
    );
    if (!activityCategory)
      return res.status(404).json({ message: "Activity Category not found" });
    res.status(200).json(activityCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Update Activity Category
const updateActivityCategory = async (req, res) => {
  try {
    const updatedActivityCategory = await ActivityCategory.findByIdAndUpdate(
      req.params.activityCategoryId,
      { $set: req.body },
      { new: true }
    );
    if (!updatedActivityCategory)
      return res.status(404).json({ message: "Activity Category not found" });
    res.status(200).json(updatedActivityCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//delete Activity Category
const deleteActivityCategory = async (req, res) => {
  try {
    const deletedActivityCategory = await ActivityCategory.findByIdAndDelete(
      req.params.activityCategoryId
    );
    if (!deletedActivityCategory)
      return res.status(404).json({ message: "Activity Category not found" });
    res.status(200).json({ message: "Activity Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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
 * Creates a new admin.
 *
 * A POST request to create a new admin.
 *
 * @param {Object} req - The incoming HTTP request.
 * @param {Object} res - The outgoing HTTP response.
 */
const createAdmin = async (req, res) => {
try {
    // Validate the presence of required fields in the request body
    if (!req.body) {
      // Return a 400 error if the request body is empty
      return res.status(400).json({ message: "Request body is required" });
    }

    const adminUser = await User.findById(req.body.user);

    if (adminUser.role != 'ADMIN') {
      return res.status(400).json({ message: "User not assigned as admin" });
    }

    // Create a new admin document with the provided data
    const newAdmin = new Admin(req.body);

    // Save the new admin to the database
    await newAdmin.save();

    // Return a 201 success response with the created admin
    res.status(201).json({ message: "Admin created successfully", admin: newAdmin });
  } catch (error) {
    // Log any errors that occur during the execution of this function
    console.error("Error creating admin:", error);

    // Return a 500 error response to indicate an internal server error
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Removes an admin from the system.
 *
 * A DELETE request to delete an admin
 *
 * @param {Object} req - The incoming HTTP request.
 * @param {Object} res - The outgoing HTTP response.
 */
const deleteAdmin = async (req, res) => {
  try {
    // Extract the admin ID from the request parameters
    const { adminId } = req.params;

    // Validate the presence of the admin ID
    if (!adminId) {
      return res.status(400).json({ message: "Admin ID is required" });
    }

    // Retrieve the admin from the database by its ID
    const admin = await Admin.findById(adminId);

    // Check if the admin exists
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Remove the admin from the database
    await admin.remove();

    // Return a 200 success response
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    // Log any errors that occur during the execution of this function
    console.error("Error deleting admin:", error);

    // Return a 500 error response to indicate an internal server error
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Updates an existing admin.
 *
 * A PATCH request to update an existing admin
 *
 * @param {Object} req - The incoming HTTP request.
 * @param {Object} res - The outgoing HTTP response.
 */
const updateAdmin = async (req, res) => {
  try {
    // Extract the admin ID from the request parameters
    const { adminId } = req.params;

    // Validate the presence of the admin ID
    if (!adminId) {
      return res.status(400).json({ message: "Admin ID is required" });
    }

    // Retrieve the admin from the database by its ID
    const admin = await Admin.findById(adminId);

    // Check if the admin exists
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Update the admin's details
    const updatedAdmin = await Admin.findByIdAndUpdate(adminId, req.body, {
      new: true,
      runValidators: true,
    });

    // Return a 200 success response with the updated admin
    res.status(200).json({ message: "Admin updated successfully", admin: updatedAdmin });
  } catch (error) {
    // Log any errors that occur during the execution of this function
    console.error("Error updating admin:", error);

    // Return a 500 error response to indicate an internal server error
    res.status(500).json({ message: "Internal server error" });
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
 * Retrieves and returns the details of an admin associated with a specific user ID.
 *
 * A GET request to retrieve an admin by their user ID
 *
 * @param {Object} req - The incoming HTTP request.
 * @param {Object} res - The outgoing HTTP response.
 */
const getAdminByUserId = async (req, res) => {
  try {
    // Extract the user ID from the request parameters
    const { userId } = req.params;

    // Validate the presence of the user ID
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Retrieve the admin from the database by the user ID
    // NOTE: This requires a model for admins, which is not provided in the original code.
    const admin = await Admin.findOne({ user: userId }).populate("user");

    // Check if the admin exists
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Return a 200 success response with the admin details
    res.status(200).json({ admin });
  } catch (error) {
    // Log any errors that occur during the execution of this function
    console.error("Error retrieving admin by user ID:", error);

    // Return a 500 error response to indicate an internal server error
    res.status(500).json({ message: "Internal server error" });
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
  getAdminByUserId,
  getComplaintDetails,
  replyToComplaint,
  getComplaintsByDate,
  getComplaintsByStatus,
  getAllComplaints,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  createActivityCategory,
  updateActivityCategory,
  getActivityCategory,
  deleteActivityCategory,
  getAllActivityCategories
};
