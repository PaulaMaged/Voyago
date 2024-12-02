import User from "../models/User.js";
import Admin from "../models/Admin.js";
import ActivityCategory from "../models/ActivityCategory.js";
import ActivityComplaint from "../models/ActivityComplaint.js";
import ItineraryComplaint from "../models/ItineraryComplaint.js";
import ReplyActivityComplaint from "../models/ReplyActivityComplaint.js";
import ReplyItineraryComplaint from "../models/ReplyItineraryComplaint.js";
import Activity from "../models/Activity.js";
import ActivityBooking from "../models/ActivityBooking.js";
import Tourist from "../models/Tourist.js";
import Itinerary from "../models/Itinerary.js";
import Notification from "../models/Notification.js";
import ItineraryBooking from "../models/ItineraryBooking.js";
import Order from "../models/Order.js";

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
 * Marks an Activity Complaint as either pending or resolved.
 *
 * A POST Request
 *
 * @param {Object} req - The incoming HTTP request.
 * @param {Object} res - The outgoing HTTP response.
 */
const markActivityComplaint = async (req, res) => {
  try {
    const { complaintId, status } = req.body;

    if (!complaintId || !status) {
      return res
        .status(400)
        .json({ message: "Activity Complaint ID and status are required" });
    }

    if (status !== "pending" && status !== "resolved") {
      return res
        .status(400)
        .json({ message: 'Invalid status. Must be "pending" or "resolved"' });
    }

    const complaint = await ActivityComplaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({ message: "Activity Complaint not found" });
    }

    complaint.state = status;
    await complaint.save();

    res.status(200).json({
      message: "Activity Complaint status updated successfully",
      complaint,
    });
  } catch (error) {
    console.error("Error marking activity complaint:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Marks an Itinerary Complaint as either pending or resolved.
 *
 * A POST Request
 *
 * @param {Object} req - The incoming HTTP request.
 * @param {Object} res - The outgoing HTTP response.
 */
const markItineraryComplaint = async (req, res) => {
  try {
    const { complaintId, status } = req.body;

    if (!complaintId || !status) {
      return res
        .status(400)
        .json({ message: "Itinerary Complaint ID and status are required" });
    }

    if (status !== "pending" && status !== "resolved") {
      return res
        .status(400)
        .json({ message: 'Invalid status. Must be "pending" or "resolved"' });
    }

    const complaint = await ItineraryComplaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({ message: "Itinerary Complaint not found" });
    }

    complaint.state = status;
    await complaint.save();

    res.status(200).json({
      message: "Itinerary Complaint status updated successfully",
      complaint,
    });
  } catch (error) {
    console.error("Error marking itinerary complaint:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Adds a reply to an Activity Complaint.
 *
 * A POST request to add a reply to a specific activity complaint
 *
 * @param {Object} req - The incoming HTTP request.
 * @param {Object} res - The outgoing HTTP response.
 */
const replyToActivityComplaint = async (req, res) => {
  try {
    const { complaintId, text } = req.body;

    if (!complaintId || !text) {
      return res.status(400).json({
        message: "Activity Complaint ID and reply text are required.",
      });
    }

    const complaint = await ActivityComplaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({ message: "Activity Complaint not found." });
    }

    const reply = new ReplyActivityComplaint({
      description: text,
      complaint: complaint._id,
    });
    await reply.save();

    complaint.state = "resolved";
    await complaint.save();

    res.status(200).json({
      message: "Reply added to activity complaint successfully.",
      complaint,
      reply,
    });
  } catch (error) {
    console.error("Error replying to activity complaint:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Adds a reply to an Itinerary Complaint.
 *
 * A POST request to add a reply to a specific itinerary complaint
 *
 * @param {Object} req - The incoming HTTP request.
 * @param {Object} res - The outgoing HTTP response.
 */
const replyToItineraryComplaint = async (req, res) => {
  try {
    const { complaintId, text } = req.body;

    if (!complaintId || !text) {
      return res.status(400).json({
        message: "Itinerary Complaint ID and reply text are required.",
      });
    }

    const complaint = await ItineraryComplaint.findById(complaintId);

    if (!complaint) {
      return res
        .status(404)
        .json({ message: "Itinerary Complaint not found." });
    }

    const reply = new ReplyItineraryComplaint({
      description: text,
      complaint: complaint._id,
    });
    await reply.save();

    complaint.state = "resolved";
    await complaint.save();

    res.status(200).json({
      message: "Reply added to itinerary complaint successfully.",
      complaint,
      reply,
    });
  } catch (error) {
    console.error("Error replying to itinerary complaint:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Retrieves and returns all Activity Complaints, sorted by date in descending order.
 *
 * A GET request
 *
 * @param {Object} req - The incoming HTTP request.
 * @param {Object} res - The outgoing HTTP response.
 */
const getActivityComplaintsByDate = async (req, res) => {
  try {
    const complaints = await ActivityComplaint.find().sort({ date: -1 });
    res.status(200).json({ complaints });
  } catch (error) {
    console.error("Error retrieving activity complaints:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Retrieves and returns all Itinerary Complaints, sorted by date in descending order.
 *
 * A GET request
 *
 * @param {Object} req - The incoming HTTP request.
 * @param {Object} res - The outgoing HTTP response.
 */
const getItineraryComplaintsByDate = async (req, res) => {
  try {
    const complaints = await ItineraryComplaint.find().sort({ date: -1 });
    res.status(200).json({ complaints });
  } catch (error) {
    console.error("Error retrieving itinerary complaints:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Retrieves and returns Activity Complaints filtered by status.
 *
 * A POST request to filter activity complaints by status
 *
 * @param {Object} req - The incoming HTTP request.
 * @param {Object} res - The outgoing HTTP response.
 */
const getActivityComplaintsByStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    if (status !== "pending" && status !== "resolved") {
      return res
        .status(400)
        .json({ message: 'Invalid status. Must be "pending" or "resolved"' });
    }

    const complaints = await ActivityComplaint.find({ state: status });
    res.status(200).json({ complaints });
  } catch (error) {
    console.error("Error retrieving activity complaints by status:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Retrieves and returns Itinerary Complaints filtered by status.
 *
 * A POST request to filter itinerary complaints by status
 *
 * @param {Object} req - The incoming HTTP request.
 * @param {Object} res - The outgoing HTTP response.
 */
const getItineraryComplaintsByStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    if (status !== "pending" && status !== "resolved") {
      return res
        .status(400)
        .json({ message: 'Invalid status. Must be "pending" or "resolved"' });
    }

    const complaints = await ItineraryComplaint.find({ state: status });
    res.status(200).json({ complaints });
  } catch (error) {
    console.error("Error retrieving itinerary complaints by status:", error);
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

    if (adminUser.role != "ADMIN") {
      return res.status(400).json({ message: "User not assigned as admin" });
    }

    // Create a new admin document with the provided data
    const newAdmin = new Admin(req.body);

    // Save the new admin to the database
    await newAdmin.save();

    // Return a 201 success response with the created admin
    res
      .status(201)
      .json({ message: "Admin created successfully", admin: newAdmin });
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
    res
      .status(200)
      .json({ message: "Admin updated successfully", admin: updatedAdmin });
  } catch (error) {
    // Log any errors that occur during the execution of this function
    console.error("Error updating admin:", error);

    // Return a 500 error response to indicate an internal server error
    res.status(500).json({ message: "Internal server error" });
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

// ┏━┓┏━┓┏━┓╻┏┓╻╺┳╸   ┏━┓     ┏━╸╺┳┓╻╺┳╸┏━╸╺┳┓   ╻┏┓╻   ┏━┓
// ┗━┓┣━┛┣┳┛┃┃┗┫ ┃    ┏━┛     ┣╸  ┃┃┃ ┃ ┣╸  ┃┃   ┃┃┗┫   ╺━┫
// ┗━┛╹  ╹┗╸╹╹ ╹ ╹    ┗━╸ ┛   ┗━╸╺┻┛╹ ╹ ┗━╸╺┻┛   ╹╹ ╹   ┗━┛

const setInapproperiateFlagActivity = async (req, res) => {
  try {
    const { activityId } = req.params;

    const activity = await Activity.findByIdAndUpdate(activityId, req.body, {
      new: true,
      runValidators: true,
    }).populate("advertiser");

    if (!activity) {
      return res.status(404).json({ message: "activity not found" });
    }

    if (req.body.flag_inapproperiate == false)
      return res.status(200).json(activity);

    //cancel bookings for all tourists and refund amount
    const bookings = await ActivityBooking.find({ activity: activityId });
    for (const booking of bookings) {
      await Tourist.findByIdAndUpdate(booking.tourist, {
        $inc: { wallet: activity.price },
      });
    }

    await ActivityBooking.deleteMany({ activity: activityId });

    // Create a notification for the advertiser
    const notification = new Notification({
      recipient: activity.advertiser.user, // Access user ID after populating
      message: `Your activity "${activity.title}" has been flagged as inappropriate and removed. All bookings have been cancelled and tourists refunded.`,
      type: "WARNING",
    });
    await notification.save();

    return res.status(200).json({
      message:
        "successfully refunded all tourists and cancelled all bookings relevant to this activity",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ message: `Error while setting inapproperiate flag: ${error}` });
  }
};

const setInapproperiateFlagItinerary = async (req, res) => {
  try {
    const { itineraryId } = req.params;

    const itinerary = await Itinerary.findByIdAndUpdate(itineraryId, req.body, {
      new: true,
      runValidators: true,
    }).populate("tour_guide"); // Populate the tour_guide field

    if (!itinerary) {
      return res.status(404).json({ message: "itinerary not found" });
    }

    if (req.body.flag_inapproperiate == false)
      return res.status(200).json(itinerary);

    //cancel bookings for all tourists and refund amount
    const bookings = await ItineraryBooking.find({ itinerary: itineraryId });
    for (const booking of bookings) {
      await Tourist.findByIdAndUpdate(booking.tourist, {
        $inc: { wallet: itinerary.price },
      });
    }

    await ItineraryBooking.deleteMany({ itinerary: itineraryId });

    // Create a notification for the tour guide
    const notification = new Notification({
      recipient: itinerary.tour_guide.user, // Access user ID after populating
      message: `Your itinerary "${itinerary.title}" has been flagged as inappropriate and removed. All bookings have been cancelled and tourists refunded.`,
      type: "WARNING",
    });
    await notification.save();

    return res.status(200).json({
      message:
        "successfully refunded all tourists and cancelled all bookings relevant to this itinerary",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ message: `Error while setting inapproperiate flag: ${error}` });
  }
};

// ┏━┓┏━┓┏━┓╻┏┓╻╺┳╸   ┏━┓
// ┗━┓┣━┛┣┳┛┃┃┗┫ ┃    ╺━┫
// ┗━┛╹  ╹┗╸╹╹ ╹ ╹    ┗━┛

async function getTotalItineraryRevenue() {
  try {
    const bookings = await ItineraryBooking.find().populate(
      "itinerary",
      "price"
    );

    let totalRevenue = 0;
    for (const booking of bookings) {
      if (booking.itinerary && booking.itinerary.price && booking.attended) {
        totalRevenue += booking.itinerary.price;
      }
    }

    return totalRevenue;
  } catch (error) {
    console.error("Error calculating total itinerary revenue:", error);
    throw error;
  }
}

async function getTotalActivityRevenue() {
  try {
    const bookings = await ActivityBooking.find().populate("activity", "price");

    let totalRevenue = 0;
    for (const booking of bookings) {
      if (booking.activity && booking.activity.price && booking.attended) {
        totalRevenue += booking.activity.price;
      }
    }

    return totalRevenue;
  } catch (error) {
    console.error("Error calculating total activity revenue:", error);
    throw error;
  }
}

async function getTotalProductRevenue() {
  try {
    // Fetch all orders and populate the 'product' field
    const orders = await Order.find().populate("product", "price");

    // Calculate the total revenue by summing up the prices of all products
    let totalRevenue = 0;
    for (const order of orders) {
      if (order.product && order.product.price) {
        totalRevenue += order.quantity * order.product.price;
      }
    }

    return totalRevenue;
  } catch (error) {
    console.error("Error calculating total product revenue:", error);
    throw error;
  }
}

const getTotalRevenue = async (req, res) => {
  try {
    const itineraryRevenue = await getTotalItineraryRevenue();
    const activityRevenue = await getTotalActivityRevenue();
    const productRevenue = await getTotalProductRevenue();

    const totalRevenue = itineraryRevenue + activityRevenue + productRevenue;

    // Return the data in the expected format
    return res.status(200).json({
      itineraryRevenue,
      activityRevenue,
      productRevenue
    });
  } catch (error) {
    console.error("Error calculating total revenue:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ┏┳┓┏━┓┏┓╻╺┳╸╻ ╻   ┏━╸╻╻  ╺┳╸┏━╸┏━┓
// ┃┃┃┃ ┃┃┗┫ ┃ ┣━┫   ┣╸ ┃┃   ┃ ┣╸ ┣┳┛
// ╹ ╹┗━┛╹ ╹ ╹ ╹ ╹   ╹  ╹┗━╸ ╹ ┗━╸╹┗╸

async function getTotalItineraryRevenueByMonth(month, year) {
  try {
    const bookings = await ItineraryBooking.find({
      // Filter by month and year
      booking_date: {
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1),
      },
      attended: true, // Only include attended bookings
    }).populate("itinerary", "price");

    let totalRevenue = 0;
    for (const booking of bookings) {
      if (booking.itinerary && typeof booking.itinerary.price === "number") {
        totalRevenue += booking.itinerary.price;
      }
    }

    return totalRevenue;
  } catch (error) {
    console.error("Error calculating total itinerary revenue by month:", error);
    throw error;
  }
}

async function getTotalActivityRevenueByMonth(month, year) {
  try {
    const bookings = await ActivityBooking.find({
      // Filter by month and year
      booking_date: {
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1),
      },
      attended: true, // Only include attended bookings
    }).populate("activity", "price");

    let totalRevenue = 0;
    for (const booking of bookings) {
      if (booking.activity && typeof booking.activity.price === "number") {
        totalRevenue += booking.activity.price;
      }
    }

    return totalRevenue;
  } catch (error) {
    console.error("Error calculating total activity revenue by month:", error);
    throw error;
  }
}

async function getTotalProductRevenueByMonth(month, year) {
  try {
    const orders = await Order.find({
      // Filter by month and year
      createdAt: {
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1),
      },
    }).populate("product", "price");

    let totalRevenue = 0;
    for (const order of orders) {
      if (
        order.product &&
        typeof order.product.price === "number" &&
        typeof order.quantity === "number"
      ) {
        totalRevenue += order.quantity * order.product.price;
      }
    }

    return totalRevenue;
  } catch (error) {
    console.error("Error calculating total product revenue by month:", error);
    throw error;
  }
}

const getProductRevenueByMonth = async (req, res) => {
  try {
    const month = parseInt(req.body.month, 10);
    const year = parseInt(req.body.year, 10);

    // Enhanced input validation
    if (
      isNaN(month) ||
      isNaN(year) ||
      month < 1 ||
      month > 12 ||
      year < 1900 ||
      year > new Date().getFullYear() + 1
    ) {
      return res.status(400).json({ message: "Invalid month or year provided" });
    }

    const productRevenue = await getTotalProductRevenueByMonth(month, year);

    return res.status(200).json({
      message: `Total product revenue for ${month}/${year}`,
      productRevenue,
    });
  } catch (error) {
    console.error("Error calculating total product revenue:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getItineraryRevenueByMonth = async (req, res) => {
  try {
    const month = parseInt(req.body.month, 10);
    const year = parseInt(req.body.year, 10);

    // Enhanced input validation
    if (
      isNaN(month) ||
      isNaN(year) ||
      month < 1 ||
      month > 12 ||
      year < 1900 ||
      year > new Date().getFullYear() + 1
    ) {
      return res.status(400).json({ message: "Invalid month or year provided" });
    }

    const itineraryRevenue = await getTotalItineraryRevenueByMonth(month, year);

    return res.status(200).json({
      message: `Total itinerary revenue for ${month}/${year}`,
      itineraryRevenue,
    });
  } catch (error) {
    console.error("Error calculating total itinerary revenue:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getActivityRevenueByMonth = async (req, res) => {
  try {
    const month = parseInt(req.body.month, 10);
    const year = parseInt(req.body.year, 10);

    // Enhanced input validation
    if (
      isNaN(month) ||
      isNaN(year) ||
      month < 1 ||
      month > 12 ||
      year < 1900 ||
      year > new Date().getFullYear() + 1
    ) {
      return res.status(400).json({ message: "Invalid month or year provided" });
    }

    const activityRevenue = await getTotalActivityRevenueByMonth(month, year);

    return res.status(200).json({
      message: `Total activity revenue for ${month}/${year}`,
      activityRevenue,
    });
  } catch (error) {
    console.error("Error calculating total activity revenue:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getTotalRevenueByMonth = async (req, res) => {
  try {
    // Parse month and year from query parameters
    const month = parseInt(req.body.month, 10);
    const year = parseInt(req.body.year, 10);

    // Basic input validation
    if (!month || !year) {
      return res.status(400).json({ message: "Month and year are required" });
    }

    // Optionally, add range validation
    if (month < 1 || month > 12) {
      return res
        .status(400)
        .json({ message: "Month must be between 1 and 12" });
    }

    // Execute revenue calculations in parallel
    const [itineraryRevenue, activityRevenue, productRevenue] =
      await Promise.all([
        getTotalItineraryRevenueByMonth(month, year),
        getTotalActivityRevenueByMonth(month, year),
        getTotalProductRevenueByMonth(month, year),
      ]);

    const totalRevenue = itineraryRevenue + activityRevenue + productRevenue;

    return res.status(200).json({
      message: `Total revenue for ${month}/${year}`,
      revenue: totalRevenue,
    });
  } catch (error) {
    console.error("Error calculating total revenue by month:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  getAdminByUserId,
  getItineraryComplaintsByStatus,
  getActivityComplaintsByStatus,
  getItineraryComplaintsByDate,
  getActivityComplaintsByDate,
  replyToItineraryComplaint,
  replyToActivityComplaint,
  markItineraryComplaint,
  markActivityComplaint,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  createActivityCategory,
  updateActivityCategory,
  getActivityCategory,
  deleteActivityCategory,
  getAllActivityCategories,
  setInapproperiateFlagActivity,
  setInapproperiateFlagItinerary,
  getTotalRevenue,
  getTotalItineraryRevenue,
  getTotalActivityRevenue,
  getTotalProductRevenue,
};