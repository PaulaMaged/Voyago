// Import the mongoose library
import mongoose from "mongoose";

// Define the replyActivityComplaintSchema
const replyActivityComplaintSchema = new mongoose.Schema({
  complaint: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ActivityComplaint",
  },
  description: {
    type: String,
    required: true,
  },
});

// Create a model called ReplyActivityComplaint and export it
const ReplyActivityComplaint = mongoose.model(
  "ReplyActivityComplaint",
  replyActivityComplaintSchema
);
export default ReplyActivityComplaint;
