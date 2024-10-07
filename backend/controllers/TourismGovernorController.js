import Landmark from "../models/Landmark.js";

// Create a Landmark (Museum/Historical Place)
const createLandmark = async (req, res) => {
  try {
    const newLandmark = new Landmark(req.body);
    const savedLandmark = await newLandmark.save();
    res.status(201).json(savedLandmark);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read Landmark (By ID)
const getLandmark = async (req, res) => {
  try {
    const landmark = await Landmark.findById(req.params.id);
    if (!landmark)
      return res.status(404).json({ message: "Landmark not found" });
    res.status(200).json(landmark);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a Landmark
const updateLandmark = async (req, res) => {
  try {
    const updatedLandmark = await Landmark.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedLandmark)
      return res.status(404).json({ message: "Landmark not found" });
    res.status(200).json(updatedLandmark);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a Landmark
const deleteLandmark = async (req, res) => {
  try {
    const deletedLandmark = await Landmark.findByIdAndDelete(req.params.id);
    if (!deletedLandmark)
      return res.status(404).json({ message: "Landmark not found" });
    res.status(200).json({ message: "Landmark deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// View All Tourism Governor's Landmarks
const getGovernorLandmarks = async (req, res) => {
  try {
    const landmarks = await Landmark.find({ tour_governor: req.params.id });
    res.status(200).json(landmarks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  createLandmark,
  getLandmark,
  updateLandmark,
  deleteLandmark,
  getGovernorLandmarks,
};
