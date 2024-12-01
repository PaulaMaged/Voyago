import Activity from "../models/Activity.js";
import Advertiser from "../models/Advertiser.js";
import ActivityBooking from "../models/ActivityBooking.js";
import User from "../models/User.js";

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
    const advertiser = await Advertiser.findOne({
      user: req.params.userId,
    }).populate("user");

    if (!advertiser) {
      return res
        .status(404)
        .json({ message: "Advertiser not found for this user" });
    }
    res.status(200).json(advertiser);
  } catch (error) {
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

const getAllRevenue = async (req, res) => {
  try {
    const advertiserId = req.params.advertiserId;
    const activities = await Activity.find({
      advertiser: advertiserId,
    });
    let totalRevenue = 0;

    for (let i = 0; i < activities.length; i++) {
      const activityBookings = await ActivityBooking.find({
        activity: activities[i].id,
      });
      for (let j = 0; j < activityBookings.length; j++) {
        if (activityBookings[j].attended) {
          totalRevenue += activities[i].price;
        }
      }
    }

    res.status(200).json({ revenue: totalRevenue });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllRevenueByDate = async (req, res) => {
  try {
    const advertiserId = req.params.advertiserId;
    const { date } = req.query; // Assuming the date is passed as a query parameter
    const activities = await Activity.find({ advertiser: advertiserId });

    let totalRevenue = 0;
    for (let i = 0; i < activities.length; i++) {
      let activityBookings;
      if (date) {
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(startDate.getDate() + 1); // Add one day to include the whole target day

        activityBookings = await ActivityBooking.find({
          activity: activities[i]._id,
          booking_date: { $gte: startDate, $lt: endDate },
        });
      } else {
        activityBookings = await ActivityBooking.find({
          activity: activities[i].id,
        });
      }

      for (let j = 0; j < activityBookings.length; j++) {
        if (activityBookings[j].attended) {
          totalRevenue += activities[i].price;
        }
      }
    }
    res.status(200).json({ revenue: totalRevenue });
  } catch (error) {
    // This will catch invalid date formats as well
    res.status(500).json({ error: error.message });
  }
};

const getAllRevenueByActivity = async (req, res) => {
  try {
    const activityId = req.params.activityId; // Assuming activityId is in the URL params

    // Fetch the activity to get the price
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    let sum = 0;

    const activityBookings = await ActivityBooking.find({
      activity: activityId,
    });

    for (let i = 0; i < activityBookings.length; i++) {
      if (activityBookings[j].attended) {
        sum += activity.price;
      }
    }

    res.status(200).json({ revenue: sum });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getTotalTourists = async (req, res) => {
  try {
    const advertiserId = req.params.advertiserId; // Assuming advertiserId is in the URL params

    // Get all activities for this advertiser
    const activities = await Activity.find({ advertiser: advertiserId });

    let totalTourists = 0;

    // Iterate through each activity and sum up the number of tourists
    for (let i = 0; i < activities.length; i++) {
      const bookings = await ActivityBooking.find({ activity: activities[i]._id });
      totalTourists += bookings.filter(booking => booking.attended).length;
    }

    res.status(200).json({ totalTourists });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTouristsByMonth = async (req, res) => {
  try {
    const advertiserId = req.params.advertiserId;
    const { month } = req.body; // Assuming month is in the request body

    // Validate month input (optional, but recommended)
    if (!month || isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({ error: "Invalid month. Please provide a number between 1 and 12." });
    }

    const activities = await Activity.find({ advertiser: advertiserId });
    let touristsCount = 0;

    for (let i = 0; i < activities.length; i++) {
      // Use $month operator to filter bookings by month
      const bookings = await ActivityBooking.find({
        activity: activities[i]._id,
        booking_date: { $month: month },
        attended: true // Directly filter for attended bookings
      });

      touristsCount += bookings.length;
    }

    res.status(200).json({ touristsCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllNotificationsForAdvertiser = async (req, res) => {
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
};
