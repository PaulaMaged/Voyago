import mongoose from "mongoose";
import User from "./User.js";

const advertiserSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  company_name: { type: String },
  contact_info: { type: String },
  ad_campaign: { type: String },
});

const Advertiser = mongoose.model("Advertiser", advertiserSchema);
export default Advertiser;