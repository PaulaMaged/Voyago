import Activity from "../models/Activity.js";
import Advertiser from "../models/Advertiser.js";

//create Advertiser
const createAdvertiser = async (req, res) => {
  const advertiser = req.body;
  try {
    const newAdvertiser = new Advertiser(advertiser);
    const savedAdvertiser = await newAdvertiser.save();
    res.status(201).json(savedAdvertiser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//GET Advertiser by id
const getAdvertiserById = async (req, res) => {
  try {
    const advertiser = await Advertiser.findById(req.params.id).populate(
      "user"
    );
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
      req.params.id,
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
    const deletedAdvertiser = await Advertiser.findByIdAndDelete(req.params.id);
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
    const activity = await Activity.findById(req.params.id);
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
      req.params.id,
      { $set: req.body },
      { new: true }
    );
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
    const deletedActivity = await Activity.findByIdAndDelete(req.params.id);
    if (!deletedActivity)
      return res.status(404).json({ message: "Activity not found" });
    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// View All Advertiser's Activities
const getAdvertiserActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ advertiser: req.params.id });
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find();
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//export all functions
export default {
  createActivity,
  getActivity,
  updateActivity,
  deleteActivity,
  getAdvertiserActivities,
  createAdvertiser,
  getAdvertiserById,
  updateAdvertiser,
  deleteAdvertiser,
  getAllActivities,
};
