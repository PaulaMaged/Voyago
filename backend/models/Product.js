import mongoose from "mongoose";
import Seller from "./Seller.js";

const productSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
  },
  name: { type: String, required: true },
  description: { type: String },
  picture: { type: String },
  price: { type: Number, required: true },
  available_quantity: { type: Number, required: true },
});

const Product = mongoose.model("Product", productSchema);
export default Product;