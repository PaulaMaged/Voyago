import mongoose from "mongoose";
import Activity from "./Activity.js";
import Tourist from "./Tourist.js";
import Itinerary from "./Itinerary.js";
import Location from "./Location.js";

const bookingSchema = new mongoose.Schema({
  activity: { type: mongoose.Schema.Types.ObjectId, ref: "Activity" },
  tourist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tourist",
    required: true,
  },
  itinerary: { type: mongoose.Schema.Types.ObjectId, ref: "Itinerary" },
  booking_date: { type: Date, default: Date.now },
  booking_time: { type: String },
  location: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;