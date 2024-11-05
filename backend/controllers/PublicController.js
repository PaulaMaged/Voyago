import Activity from "../models/Activity.js";
import Itinerary from "../models/Itinerary.js";
import Landmark from "../models/Landmark.js";

// View All Upcoming Activities
const getUpcomingActivities = async (req, res) => {
  try {
    const activities = await Activity.find({
      start_time: { $gte: new Date() },
    });
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// View All Itineraries
const getAllItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find();
    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// View All Historical Places/Museums
const getAllLandmarks = async (req, res) => {
  try {
    const landmarks = await Landmark.find();
    res.status(200).json(landmarks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  getUpcomingActivities,
  getAllItineraries,
  getAllLandmarks,
};
