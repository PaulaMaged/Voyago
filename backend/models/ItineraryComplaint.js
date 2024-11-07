
// models/ItineraryComplaint.js
import mongoose, { Schema } from "mongoose";

const itineraryComplaintSchema = new Schema({
itinerary: {
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

const ItineraryComplaint = mongoose.model("ItineraryComplaint", itineraryComplaintSchema);
export default ItineraryComplaint;
