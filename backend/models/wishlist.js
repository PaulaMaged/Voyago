// models/Wishlist.js
import mongoose, { Schema } from "mongoose";

const wishlistSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true }, // Each user has one wishlist
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
}, { timestamps: true });

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
export default Wishlist;

