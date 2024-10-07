import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  description: { type: String },
  DOB: { type: Date },
});

const User = mongoose.model("User", userSchema);
export default User;