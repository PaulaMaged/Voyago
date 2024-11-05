import mongoose from "mongoose";

const tourGuideReviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TourGuide",
    required: true,
  },
  rating: { type: Number, required: true },
  comment: { type: String },
  review_date: { type: Date, default: Date.now },
});

const TourGuideReview = mongoose.model(
  "TourGuideReview",
  tourGuideReviewSchema
);
export default TourGuideReview;
