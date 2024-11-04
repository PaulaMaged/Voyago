import mongoose, { Schema } from "mongoose";
import Itinerary from "./Itinerary.js";
import Activity from "./Activity.js";

const complaintSchema = new Schema({
  subject_of_complaint: {
    type: Schema.Types.ObjectId,
    ref: "Itinerary",
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

const Complaint = mongoose.model("Complaint", complaintSchema);
export default Complaint;
