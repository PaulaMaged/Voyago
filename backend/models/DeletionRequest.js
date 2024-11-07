import mongoose, { Schema } from "mongoose";

const deletionRequestSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  reason: { type: String },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

const DeletionRequest = mongoose.model(
  "DeletionRequest",
  deletionRequestSchema
);

export default DeletionRequest;
