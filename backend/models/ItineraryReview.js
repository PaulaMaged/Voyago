import mongoose from "mongoose";

const itineraryReviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Itinerary",
    required: true,
  },
  rating: { type: Number, required: true },
  comment: { type: String },
  review_date: { type: Date, default: Date.now },
});

const ItineraryReview = mongoose.model(
  "ItineraryReview",
  itineraryReviewSchema
);
export default ItineraryReview;
