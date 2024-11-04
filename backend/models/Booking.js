import mongoose from "mongoose";
import Activity from "./Activity.js";
import Tourist from "./Tourist.js";
import Itinerary from "./Itinerary.js";
import Location from "./Location.js";

const bookingSchema = new mongoose.Schema(
  {
    plan_type: {
      type: String,
      enum: ["Activity", "Itinerary"],
      required: true,
    },
    plan_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    tourist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tourist",
      required: true,
    },
    attended: {
      type: Boolean,
      default: false,
    },
    booking_date: {
      type: Date,
      default: Date.now,
    },
    booking_time: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
