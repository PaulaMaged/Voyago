import Activity from "../models/Activity.js";
import Advertiser from "../models/Advertiser.js";
import ActivityBooking from "../models/ActivityBooking.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

//create Advertiser
const createAdvertiser = async (req, res) => {
  try {
    // Log the received data for debugging
    console.log("Received body:", req.body);
    console.log("Received file:", req.file);

    // Extract advertiser data from the request body
    const advertiserData = {
      user: req.body.user,
      URL_Website: req.body.URL_Website,
      company_hotline: req.body.company_hotline,
      company_name: req.body.company_name,
      contact_info: req.body.contact_info,
      // Add the file path if a file was uploaded
      document_path: req.file ? req.file.path : null,
    };

    // Create a new Advertiser instance
    const newAdvertiser = new Advertiser(advertiserData);

    // Save the advertiser to the database
    const savedAdvertiser = await newAdvertiser.save();

    // Respond with the saved advertiser data
    res.status(201).json(savedAdvertiser);
  } catch (error) {
    console.error("Error in createAdvertiser:", error);
    res.status(500).json({ error: error.message });
  }
};

//GET All Advertiser
const getAllAdvertisers = async (req, res) => {
  try {
    const advertisers = await Advertiser.find().populate("user");
    res.status(200).json(advertisers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//GET Advertiser by id
const getAdvertiserById = async (req, res) => {
  try {
    const advertiser = await Advertiser.findById(
      req.params.advertiserId
    ).populate("user");
    if (!advertiser)
      return res.status(404).json({ message: "Advertiser not found" });
    res.status(200).json(advertiser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Update Advertiser
const updateAdvertiser = async (req, res) => {
  try {
    const updatedAdvertiser = await Advertiser.findByIdAndUpdate(
      req.params.advertiserId,
      { $set: req.body },
      { new: true }
    );
    if (!updatedAdvertiser)
      return res.status(404).json({ message: "Advertiser not found" });
    res.status(200).json(updatedAdvertiser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//delete advertiser
const deleteAdvertiser = async (req, res) => {
  try {
    const deletedAdvertiser = await Advertiser.findByIdAndDelete(
      req.params.advertiserId
    );
    if (!deletedAdvertiser)
      return res.status(404).json({ message: "Advertiser not found" });
    res.status(200).json({ message: "Advertiser deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create an Activity
const createActivity = async (req, res) => {
  const activity = req.body;
  try {
    const newActivity = new Activity(activity);
    const savedActivity = await newActivity.save();
    res.status(201).json(savedActivity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read Activity (By ID)
const getActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.activityId);

    if (!activity)
      return res.status(404).json({ message: "Activity not found" });
    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an Activity
const updateActivity = async (req, res) => {
  try {
    const updatedActivity = await Activity.findByIdAndUpdate(
      req.params.activityId,
      { $set: req.body },
      { new: true }
    )
      .populate("advertiser")
      .populate("category")
      .populate("location")
      .populate("tags");
    if (!updatedActivity)
      return res.status(404).json({ message: "Activity not found" });
    res.status(200).json(updatedActivity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an Activity
const deleteActivity = async (req, res) => {
  try {
    const deletedActivity = await Activity.findByIdAndDelete(
      req.params.activityId
    );
    if (!deletedActivity)
      return res.status(404).json({ message: "Activity not found" });
    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// AdvertiserController.js
const getAdvertiserByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const advertiser = await Advertiser.findOne({ user: userId }).populate("user");
    
    if (!advertiser) {
      return res.status(404).json({ message: "Advertiser not found for this user" });
    }
    
    res.status(200).json(advertiser);
  } catch (error) {
    console.error('Error in getAdvertiserByUserId:', error);
    res.status(500).json({ error: error.message });
  }
};

// View All Advertiser's Activities
const getAdvertiserActivities = async (req, res) => {
  try {
    const activities = await Activity.find({
      advertiser: req.params.advertiserId,
    })
      .populate("advertiser")
      .populate("category")
      .populate("location")
      .populate("tags");
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find()

      .populate("advertiser")
      .populate("category")
      .populate("location")
      .populate("tags");
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getActivityBookings = async (req, res) => {
  try {
    const activityId = req.params.activityId;
    const bookings = await ActivityBooking.find({ activity: activityId })
      .populate('tourist')
      .populate('activity');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update getAllRevenue to include more detailed information
const getAllRevenue = async (req, res) => {
  try {
    const advertiserId = req.params.advertiserId;
    const activities = await Activity.find({ advertiser: advertiserId });
    
    let totalRevenue = 0;
    const activityStats = {};

    for (const activity of activities) {
      const activityBookings = await ActivityBooking.find({
        activity: activity._id
      });

      const attendedBookings = activityBookings.filter(booking => booking.attended);
      const revenue = attendedBookings.length * activity.price;

      activityStats[activity._id] = {
        totalSales: revenue,
        bookingCount: activityBookings.length,
        attendedCount: attendedBookings.length
      };

      totalRevenue += revenue;
    }

    res.status(200).json({
      totalRevenue,
      activityStats,
      activities
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Update getAllRevenueByDate to include more detailed information
const getAllRevenueByDate = async (req, res) => {
  try {
    const advertiserId = req.params.advertiserId;
    const { date } = req.query;
    const activities = await Activity.find({ advertiser: advertiserId });

    let totalRevenue = 0;
    const activityStats = {};

    for (const activity of activities) {
      let activityBookings;
      
      if (date) {
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(startDate.getDate() + 1);

        activityBookings = await ActivityBooking.find({
          activity: activity._id,
          booking_date: { $gte: startDate, $lt: endDate }
        });
      } else {
        activityBookings = await ActivityBooking.find({
          activity: activity._id
        });
      }

      const attendedBookings = activityBookings.filter(booking => booking.attended);
      const revenue = attendedBookings.length * activity.price;

      activityStats[activity._id] = {
        totalSales: revenue,
        bookingCount: activityBookings.length,
        attendedCount: attendedBookings.length
      };

      totalRevenue += revenue;
    }

    res.status(200).json({
      totalRevenue,
      activityStats,
      activities
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fix the getAllRevenueByActivity method
const getAllRevenueByActivity = async (req, res) => {
  try {
    const { advertiserId, activityId } = req.params;

    // Get the specific activity
    const activity = await Activity.findOne({
      _id: activityId,
      advertiser: advertiserId
    });

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    // Get all bookings for this activity
    const bookings = await ActivityBooking.find({ activity: activityId });
    const attendedBookings = bookings.filter(booking => booking.attended);
    const revenue = attendedBookings.length * activity.price;

    // Get all activities for the dropdown (important!)
    const allActivities = await Activity.find({ advertiser: advertiserId });

    res.status(200).json({
      revenue,
      bookingCount: bookings.length,
      attendedCount: attendedBookings.length,
      activities: allActivities, // Send all activities
      activity: activity // Send the specific activity data
    });
  } catch (error) {
    console.error('Controller Error:', error);
    res.status(500).json({ error: error.message });
  }
};

const getAllRevenueByMonth = async (req, res) => {
  try {
    const advertiserId = req.params.advertiserId;
    const { month } = req.query;
    const activities = await Activity.find({ advertiser: advertiserId });

    let totalRevenue = 0;
    const activityStats = {};

    for (const activity of activities) {
      // Create date range for the specified month
      const year = new Date().getFullYear();
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0); // Last day of the month

      const activityBookings = await ActivityBooking.find({
        activity: activity._id,
        booking_date: {
          $gte: startDate,
          $lte: endDate
        }
      });

      const attendedBookings = activityBookings.filter(booking => booking.attended);
      const revenue = attendedBookings.length * activity.price;

      activityStats[activity._id] = {
        totalSales: revenue,
        bookingCount: activityBookings.length,
        attendedCount: attendedBookings.length
      };

      totalRevenue += revenue;
    }

    res.status(200).json({
      totalRevenue,
      activityStats,
      activities
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTotalTourists = async (req, res) => {
  try {
    const advertiserId = req.params.advertiserId;
    const activities = await Activity.find({ advertiser: advertiserId });

    let totalTourists = 0;
    const activityStats = {};

    for (const activity of activities) {
      const bookings = await ActivityBooking.find({
        activity: activity._id
      });

      const attendedCount = bookings.filter(booking => booking.attended).length;
      
      activityStats[activity._id] = {
        totalBookings: bookings.length,
        attendedCount: attendedCount
      };

      totalTourists += attendedCount;
    }

    res.status(200).json({
      totalTourists,
      activityStats,
      activities
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTouristsByMonth = async (req, res) => {
  try {
    const advertiserId = req.params.advertiserId;
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ error: "Month parameter is required" });
    }

    const year = new Date().getFullYear();
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const activities = await Activity.find({ advertiser: advertiserId });
    let totalTourists = 0;
    const activityStats = {};

    for (const activity of activities) {
      const bookings = await ActivityBooking.find({
        activity: activity._id,
        booking_date: {
          $gte: startDate,
          $lte: endDate
        }
      });

      const attendedCount = bookings.filter(booking => booking.attended).length;
      
      activityStats[activity._id] = {
        totalBookings: bookings.length,
        attendedCount: attendedCount
      };

      totalTourists += attendedCount;
    }

    res.status(200).json({
      totalTourists,
      activityStats,
      activities
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllNotifications = async (req, res) => {
  try {
    const advertiserId = req.params.advertiserId; // Assuming advertiserId is in the URL params

    // Fetch the advertiser by their ID
    const advertiser = await Advertiser.findById(advertiserId).populate("user");
    if (!advertiser) {
      return res.status(404).json({ message: "Advertiser not found" });
    }

    // Get the user associated with the advertiser
    const user = advertiser.user;

    // Fetch all notifications for this user
    const notifications = await Notification.find({ recipient: user._id });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllNotificationsByType = async (req, res) => {
  try {
    const advertiserId = req.params.advertiserId;
    const type = req.body.type; // Assuming type is passed as a query parameter

    if (!type) {
      return res.status(400).json({ error: "Notification type is required" });
    }

    const advertiser = await Advertiser.findById(advertiserId).populate("user");
    if (!advertiser) {
      return res.status(404).json({ message: "Advertiser not found" });
    }

    const user = advertiser.user;
    const notifications = await Notification.find({ recipient: user._id, type: type });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAdvertiserNotifications = async (req, res)=> {
  try {
    const advertiserId = req.params.advertiserId;
    const advertiser = await Advertiser.findById(advertiserId).populate('user');
    
    if (!advertiser) {
      return res.status(404).json({ message: "Advertiser not found" });
    }

    const notifications = await Notification.find({ 
      recipient: advertiser.user._id,
      type: "ACTIVITY_FLAG"
    }).sort({ created_at: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

const createActivityFlagNotification = async (advertiserId, activityTitle) => {
  try {
    const advertiser = await Advertiser.findById(advertiserId).populate('user');
    if (!advertiser) {
      throw new Error('Advertiser not found');
    }

    const notification = new Notification({
      recipient: advertiser.user._id,
      type: "ACTIVITY_FLAG",
      message: `Your activity "${activityTitle}" has been flagged as inappropriate by an admin.`,
      is_read: false,
      created_at: new Date()
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating activity flag notification:', error);
    throw error;
  }
};

//export all functions
export default {
  createActivity,
  getActivity,
  updateActivity,
  getAllAdvertisers,
  deleteActivity,
  getAdvertiserActivities,
  getAdvertiserByUserId,
  createAdvertiser,
  getAdvertiserById,
  updateAdvertiser,
  deleteAdvertiser,
  getAllActivities,
  getAllRevenue,
  getAllRevenueByDate,
  getAllRevenueByActivity,
  getActivityBookings,
  getAllRevenueByMonth,
  getTotalTourists,
  getTouristsByMonth,
  getAdvertiserNotifications,
  createActivityFlagNotification,
};
