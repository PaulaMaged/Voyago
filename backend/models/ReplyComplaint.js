// Import the mongoose library
import mongoose from "mongoose";

// Define the replyComplaintSchema
const replyComplaintSchema = new mongoose.Schema({
  complaint: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Complaint",
  },
  text: {
    type: String,
    required: true,
  },
});

// Create a model called ReplyComplaint and export it
const ReplyComplaint = mongoose.model("ReplyComplaint", replyComplaintSchema);
export default ReplyComplaint;
