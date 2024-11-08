import mongoose from "mongoose";

const tourGuideSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  phone_number: { type: String },
  years_of_experience: { type: Number },
  previous_work: { type: String },
  license_number: { type: String },
  specialization: { type: String },

  available: { type: Boolean, default: true },
});

const TourGuide = mongoose.model("TourGuide", tourGuideSchema);
export default TourGuide;
