import Tourist from "../models/Tourist.js";

//create Tourist 
const createTourist = async (req, res) => {
  try {
    const newTourist = new Tourist(req.body);
    const savedTourist = await newTourist.save();
    res.status(201).json(savedTourist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get Tourist by id
const getTouristById = async (req, res) => {
  try {
    const tourist = await Tourist.findById(req.params.id);
    if (!tourist) return res.status(404).json({ message: "Tourist not found" });
    res.status(200).json(tourist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {createTourist, getTouristById};