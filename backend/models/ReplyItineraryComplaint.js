
// Import the mongoose library
import mongoose from "mongoose";

// Define the replyItineraryComplaintSchema
const replyItineraryComplaintSchema = new mongoose.Schema({
complaint: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ItineraryComplaint",
  },
  description: {
    type: String,
    required: true,
  },
});

// Create a model called ReplyItineraryComplaint and export it
const ReplyItineraryComplaint = mongoose.model("ReplyItineraryComplaint", replyItineraryComplaintSchema);
export default ReplyItineraryComplaint;
