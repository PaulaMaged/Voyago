import mongoose  from "mongoose";
import Seller  from "./Seller.js";
import Location  from "./Location.js";

const orderSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
  },
  description: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  arrival_date: { type: Date },
  arrival_time: { type: String },
  arrival_location: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;