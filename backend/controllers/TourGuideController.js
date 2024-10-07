import Itinerary from "../models/Itinerary.js";
import Booking from "../models/Booking.js";

// Create an Itinerary
const createItinerary = async (req, res) => {
  try {
    const newItinerary = new Itinerary(req.body);
    const savedItinerary = await newItinerary.save();
    res.status(201).json(savedItinerary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read Itinerary (By ID)
const getItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id).populate(
      "activities"
    );
    if (!itinerary)
      return res.status(404).json({ message: "Itinerary not found" });
    res.status(200).json(itinerary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an Itinerary
const updateItinerary = async (req, res) => {
  try {
    const updatedItinerary = await Itinerary.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedItinerary)
      return res.status(404).json({ message: "Itinerary not found" });
    res.status(200).json(updatedItinerary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an Itinerary (Prevent if bookings exist)
const deleteItinerary = async (req, res) => {
  try {
    const bookings = await Booking.find({ itinerary: req.params.id });
    if (bookings.length > 0) {
      return res
        .status(400)
        .json({ message: "Cannot delete itinerary with existing bookings" });
    }

    const deletedItinerary = await Itinerary.findByIdAndDelete(req.params.id);
    if (!deletedItinerary)
      return res.status(404).json({ message: "Itinerary not found" });
    res.status(200).json({ message: "Itinerary deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// View All Tour Guide's Itineraries
const getTourGuideItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ tour_guide: req.params.id });
    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  createItinerary,
  getItinerary,
  updateItinerary,
  deleteItinerary,
  getTourGuideItineraries,
};