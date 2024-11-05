import mongoose from "mongoose";

const tourGovernorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  region: { type: String },
  years_of_service: { type: Number },
  contact_info: { type: String },
});

const TourGovernor = mongoose.model("TourGovernor", tourGovernorSchema);
export default TourGovernor;