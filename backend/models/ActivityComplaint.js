
// models/ActivityComplaint.js
import mongoose, { Schema } from "mongoose";

const activityComplaintSchema = new Schema({
activity: {
    type: Schema.Types.ObjectId,
    ref: "Activity",
    required: true,
  },
  reviewer: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  state: {
    type: String,
    enum: ["pending", "resolved"],
    default: "pending",
  },
  date: { type: Date, default: Date.now },
});

const ActivityComplaint = mongoose.model("ActivityComplaint", activityComplaintSchema);
export default ActivityComplaint;
