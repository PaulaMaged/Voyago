import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  advertiser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Advertiser",
    required: true,
  },

  start_time: {
    type: Date,
    required: true,
  },

  duration: {
    type: Number,
    required: true,
    default: 30, // 30 minutes
    min: 0,
  },

  price: { type: Number, required: true, min: 0 },
  category: { type: String },
  discount: { type: Number, default: 0 },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
  },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
  booking_open: { type: Boolean, default: true },
});

const Activity = mongoose.model("Activity", activitySchema);
export default Activity;
