import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
  tag_name: { type: String, required: true },
  description: { type: String },
});

const Tag = mongoose.model("Tag", tagSchema);
export default Tag;