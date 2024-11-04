import mongoose from "mongoose";
import User from "./User.js";
import Product from "./Product.js";

const productReviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  rating: { type: Number, required: true },
  comment: { type: String },
  review_date: { type: Date, default: Date.now },
});

const ProductReview = mongoose.model("ProductReview", productReviewSchema);
export default ProductReview;
