
// Import the mongoose library
import mongoose from 'mongoose';
// Import the Complaint model
import Complaint from './Complaint'

// Define the replyComplaintSchema
const replyComplaintSchema = new mongoose.Schema({
text: {
    type: String,
    required: true
  },
  complaint: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint'
  }
});

// Create a model called ReplyComplaint and export it
const ReplyComplaint = mongoose.model('ReplyComplaint', replyComplaintSchema);
export default ReplyComplaint;
