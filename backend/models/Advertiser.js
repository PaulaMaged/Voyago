import mongoose from "mongoose";

const advertiserSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  URL_Website: { type: String },
  company_name: { type: String },
  company_hotline: { type: String },
  contact_info: { type: String },

  ad_campaign: { type: String },
});

const Advertiser = mongoose.model("Advertiser", advertiserSchema);
export default Advertiser;
