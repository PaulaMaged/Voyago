import mongoose from "mongoose";
import User from "./User.js";

const touristSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  phone_number: { type: String },
  nationality: { type: String },
  is_student: { type: Boolean, default: false },
});

const Tourist = mongoose.model("Tourist", touristSchema);
export default Tourist;