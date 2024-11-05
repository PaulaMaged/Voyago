import mongoose from "mongoose";

const ActivityBookingSchema = new mongoose.Schema(
{
    activity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Activity",
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

const ActivityBooking = mongoose.model("ActivityBooking", ActivityBookingSchema);

export default ActivityBooking;