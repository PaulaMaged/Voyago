import mongoose, { Schema } from "mongoose";
import Order from "./Order.js";

const productSchema = new Schema({
  seller: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
  name: { type: String, required: true },
  description: { type: String, default: "" }, // Optional with a default empty string
  picture: { type: String, default: "" }, // Optional with a default empty string
  price: { type: Number, required: true },
  archived: { type: Boolean, default: false }, // Adding a default value for clarity
  available_quantity: { type: Number, required: true },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "ProductReview",
      required: false,
    },
  ],
});

// add a method to calculate sales and available quantity
productSchema.methods.calculateSalesAndQuantity = async function () {
  const product = this;
  const orders = await Order.find({ Product: product._id });
  let totalQuantitySold = 0;
  orders.forEach((order) => {
    totalQuantitySold += order.quantity;
  });
  const sales = totalQuantitySold;
  const availableQuantity = product.available_quantity - totalQuantitySold;
  return { sales, availableQuantity };
};

const Product = mongoose.model("Product", productSchema);
export default Product;
