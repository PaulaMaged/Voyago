import mongoose from "mongoose";

const activityReviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  activity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Activity",
    required: true,
  },
  rating: { type: Number, required: true },
  comment: { type: String },
  review_date: { type: Date, default: Date.now },
});

const ActivityReview = mongoose.model("ActivityReview", activityReviewSchema);
export default ActivityReview;
