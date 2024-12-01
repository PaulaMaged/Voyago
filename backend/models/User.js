import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: {
    type: String,
    unique: true,
  },
  createdAt: { type: Date, default: Date.now },

  role: {
    type: String,
    enum: [
      "ADMIN",
      "USER",
      "TOURIST",
      "TOUR_GUIDE",
      "TOUR_GOVERNOR",
      "SELLER",
      "ADVERTISER",
    ],
    required: true,
  },
  description: { type: String },
  requested_to_be_deleted: { type: Boolean, default: false },
  is_accepted: { type: Boolean, default: false },
  is_new: { type: Boolean, default: true },
  terms_and_conditions: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);
export default User;
