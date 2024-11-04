
import mongoose from "mongoose";
import TourGuide from "./TourGuide.js";
import Activity from "./Activity.js";
import Location from "./Location.js";

const itinerarySchema = new mongoose.Schema({
tour_guide: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TourGuide",
    required: true,
  },
  name: { type: String, required: true },
  description: { type: String },
  language: { type: String },
  price: { type: Number },
  activities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity" }],
  accessibility: { type: Boolean, default: false },
  pick_up: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
  drop_off: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
  start_date: { type: Date, required: true },
  start_time: { type: String, required: true },
});

const Itinerary = mongoose.model("Itinerary", itinerarySchema);
export default Itinerary;