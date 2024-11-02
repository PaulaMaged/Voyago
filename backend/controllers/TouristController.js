import Itinerary from "../models/Itinerary.js";
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
    const tourist = await Tourist.findById(req.params.id).populate("user");
    if (!tourist) return res.status(404).json({ message: "Tourist not found" });
    res.status(200).json(tourist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Tourist: pay for an activity or itinerary.
const touristPay = async (req, res) => {
  try {
    // Check if the tourist exists
    const tourist = await Tourist.findById(req.params.id);
    if (!tourist) return res.status(404).json({ message: "Tourist not found" });

    const itineraryIds = req.body.itineraryIds;

    // Check if itineraryIds are provided and valid
    if (!Array.isArray(itineraryIds) || itineraryIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid itinerary IDs provided" });
    }

    // Check if all itineraries exist and are active
    const plans = await Itinerary.find({ _id: { $in: itineraryIds } });

    if (plans.length !== itineraryIds.length) {
      return res
        .status(404)
        .json({ message: "One or more itineraries not found" });
    }

    // Calculate total price and update points
    let totalPrice = 0;
    plans.forEach((plan) => {
      tourist.plans.push(plan); // Or push plan._id
      totalPrice += plan.price;
    });

    const levelMultipliers = {
      1: 0.5,
      2: 1,
      3: 1.5,
    };

    // Update level and points
    tourist.points += totalPrice * levelMultipliers[tourist.level] || 0;

    try {
      await tourist.save();
    } catch (saveError) {
      return res.status(500).json({ error: "Failed to save tourist data" });
    }

    res.json(tourist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default { createTourist, getTouristById, touristPay };
