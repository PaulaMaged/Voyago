// models/ActivityComplaint.js
import mongoose, { Schema } from "mongoose";
import { REPL_MODE_SLOPPY } from "repl";

const ComplaintSchema = new Schema({
  complainer: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  state: {
    type: String,
    enum: ["pending", "resolved"],
    default: "pending",
  },
  date: { type: Date, default: Date.now },
  reply: { type: String },
  category: {
    type: String,
    enum: [
      "activity",
      "itinerary",
      "product",
      "accommodation",
      "transportation",
      "customer-service",
      "other",
    ],
    required: true,
  },
});

const Complaint = mongoose.model("Complaints", ComplaintSchema);
export default Complaint;
