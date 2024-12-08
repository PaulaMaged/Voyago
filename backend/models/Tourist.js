import mongoose from "mongoose";

const touristSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  first_login: { type: Boolean, default: true },
  points: {
    type: Number,
    default: 0,
    min: 0,
  },
  level: {
    type: Number,
    default: 1,
    min: 1,
    max: 3,
  },
  wallet: {
    type: Number,
    default: 0,
    min: 0,
  },
  badges: [
    {
      type: String,
    },
  ],
  phone_number: { type: String },
  nationality: { type: String },
  DOB: { type: String },
  Total_points_collected: { type: Number, default: 0 },
  is_student: { type: Boolean, default: false },
});

const Tourist = mongoose.model("Tourist", touristSchema);
export default Tourist;
