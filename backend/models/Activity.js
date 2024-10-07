import mongoose from "mongoose";
import Advertiser from "./Advertiser.js";
import Tag from "./Tag.js";

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
  activity_date: { type: Date, required: true },
  activity_time: { type: String, required: true },
  activity_end: { type: String },
  price: { type: Number, required: true },
  category: { type: String },
  discount: { type: Number, default: 0 },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
  booking_open: { type: Boolean, default: true },
});

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;