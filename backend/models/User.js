import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: {
    type: String,
  },
  role: {
    type: String,
    enum: ["ADMIN", "USER", "TOURIST", "TOUR_GUIDE", "TOUR_GOVERNOR", "SELLER"],
    default: "USER",
  },
  description: { type: String },
  DOB: { type: String },
});

const User = mongoose.model("User", userSchema);
export default User;
