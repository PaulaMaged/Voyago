import mongoose from "mongoose";

const landmarkSchema = new mongoose.Schema({
  tour_governor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TourGovernor",
    required: true,
  },
  name: { type: String, required: true },
  description: { type: String },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: true,
  },
  image: { type: String },
  opening_hours: { type: Number },
  types: { type: String },
});

const Landmark = mongoose.model("Landmark", landmarkSchema);
export default Landmark;