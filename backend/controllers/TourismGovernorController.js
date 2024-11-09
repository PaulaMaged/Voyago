import Landmark from "../models/Landmark.js";
import Tag from "../models/Tag.js";
import TourGovernor from "../models/TourGovernor.js";
import Location from "../models/Location.js";

//Create a new TourGov
const createTourGovernor = async (req, res) => {
  try {
    const newTourGovernor = new TourGovernor(req.body);
    const savedTourGovernor = await newTourGovernor.save();
    res.status(201).json(savedTourGovernor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET all Landmarks
const getAllLandmarks = async (req, res) => {
  try {
    const landmarks = await Landmark.find().populate("tour_governor").populate("tags").populate("location");
    res.status(200).json(landmarks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Delete a TourGov
const deleteTourGovernor = async (req, res) => {
  try {
    const tourGovernor = await TourGovernor.findByIdAndDelete(req.params.tourgovernorId);
    if (!tourGovernor)
      return res.status(404).json({ message: "Tour Governor not found" });
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//update
const updateTourGovernor = async (req, res) => {
  try {
    const tourGovernor = await TourGovernor.findByIdAndUpdate(
      req.params.tourgovernorId,
      req.body,
      { new: true }
    );
    if (!tourGovernor)
      return res.status(404).json({ message: "Tour Governor not found" });
    res.status(200).json(tourGovernor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get tourGovernor
const getTourGovernor = async (req, res) => {
  try {
    const tourGovernor = await TourGovernor.findById(req.params.tourgovernorId).populate(
      "user"
    );
    if (!tourGovernor)
      return res.status(404).json({ message: "Tour Governor not found" });
    res.status(200).json(tourGovernor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTourGovernorByUserId = async (req, res) => {
  try {
    const tourGovernor = await TourGovernor.findOne({
      user: req.params.userId,
    }).populate("user");

    if (!tourGovernor) {
      return res
        .status(404)
        .json({ message: "Tour Governor not found for this user" });
    }
    res.status(200).json(tourGovernor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//create a Tag
const createTag = async (req, res) => {
  try {
    const newTag = new Tag(req.body);
    const savedTag = await newTag.save();
    res.status(201).json(savedTag);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Update a Tag
const updateTag = async (req, res) => {
  try {
    const { tag_name, description } = req.body;

    // Find the tag by its ID and update it
    const updatedTag = await Tag.findByIdAndUpdate(
      req.params.TagId,
      { tag_name, description }, // Using tag_name to match the schema
      { new: true }
    );

    if (!updatedTag) return res.status(404).json({ message: "Tag not found" });

    // Send back the updated tag
    res.status(200).json(updatedTag);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Delete a Tag
const deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findByIdAndDelete(req.params.TagId);
    if (!tag) return res.status(404).json({ message: "Tag not found" });
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//GET all Tags
const getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// View All Landmarks with a specific Tag
const getLandmarksByTag = async (req, res) => {
  try {
    const landmarks = await Landmark.find({ tags: req.params.tagId });
    res.status(200).json(landmarks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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
      req.params.landmarkId,
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
    const deletedLandmark = await Landmark.findByIdAndDelete(req.params.landmarkId);
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
    const landmarks = await Landmark.find({ tour_governor: req.params.tourgovernorId });
    res.status(200).json(landmarks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//create Location
const createLocation = async (req, res) => {
  try {
    const newLocation = new Location(req.body);
    const savedLocation = await newLocation.save();
    res.status(201).json(savedLocation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//delete Location
const deleteLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.locationId);
    if (!location)
      return res.status(404).json({ message: "Location not found" });
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get Location
const getLocation = async (req, res) => {
  try {
    const location = await Location.findById(req.params.locationId);
    if (!location)
      return res.status(404).json({ message: "Location not found" });
    res.status(200).json(location);
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
  createTag,
  deleteTag,
  updateTag,
  getAllLandmarks,
  getLandmarksByTag,
  getAllTags,
  createTourGovernor,
  deleteTourGovernor,
  updateTourGovernor,
  getTourGovernor,
  createLocation,
  deleteLocation,
  getLocation,
  getTourGovernorByUserId,
};
