import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    tourist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tourist",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    description: { type: String },
    quantity: { type: Number, required: true },
    arrival_date: { type: Date },
    arrival_location: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
