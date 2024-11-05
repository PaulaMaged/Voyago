
import mongoose from "mongoose";
import Itinerary from "./Itinerary.js";
import Tourist from "./Tourist.js";

const ItineraryBookingSchema = new mongoose.Schema(
{
    itinerary: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Itinerary",
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
    active: {
      type: Boolean,
      default: true,
    },
    booking_date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const ItineraryBooking = mongoose.model("ItineraryBooking", ItineraryBookingSchema);

export default ItineraryBooking;
