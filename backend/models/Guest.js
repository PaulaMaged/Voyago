import mongoose from "mongoose";

const guestSchema = new mongoose.Schema({
  session_id: { type: String, required: true },
  session_start: { type: Date, default: Date.now },
  is_active: { type: Boolean, default: true },
});

const Guest = mongoose.model("Guest", guestSchema);
export default Guest;