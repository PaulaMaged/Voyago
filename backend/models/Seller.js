import mongoose from "mongoose";
import User from "./User.js";

const sellerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  store_name: { type: String },
  description: { type: String },
});

const Seller = mongoose.model("Seller", sellerSchema);
export default Seller;