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

// Helper function to get Tourist by id
const getTouristByIdHelper = async (id) => {
  try {
    const tourist = await Tourist.findById(id);
    if (!tourist) {
      throw new Error("Tourist not found");
    }
    return tourist;
  } catch (error) {
    throw error;
  }
};

// Tourist: pay for an activity or itinerary.
const touristPay = async (req, res) => {
  try {
    const tourist = await getTouristByIdHelper(req.params.id);

    if (!req.body.itineraryIds) {
      return res.status(400).json({ message: "Invalid itinerary IDs provided" });
    }

    const itineraryIds = req.body.itineraryIds;
    const plans = await getPlans(itineraryIds);

    if (plans.length !== itineraryIds.length) {
      return res.status(404).json({ message: "One or more itineraries not found" });
    }

    const totalPrice = calculateTotalPrice(plans);
    const updatedTourist = await updateTouristData(tourist, plans, totalPrice);

    res.json(updatedTourist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPlans = async (itineraryIds) => {
  try {
    const plans = await Itinerary.find({ _id: { $in: itineraryIds } });
    return plans;
  } catch (error) {
    throw error;
  }
};

const calculateTotalPrice = (plans) => {
  return plans.reduce((total, plan) => total + plan.price, 0);
};

const updateTouristData = async (tourist, plans, totalPrice) => {
  try {
    const levelMultipliers = {
      1: 0.5,
      2: 1,
      3: 1.5,
    };

    tourist.points += totalPrice * levelMultipliers[tourist.level] || 0;

    plans.forEach((plan) => {
      tourist.plans.push(plan);
    });

    await tourist.save();
    return tourist;
  } catch (error) {
    throw error;
  }
};



export default { createTourist, getTouristById, touristPay };