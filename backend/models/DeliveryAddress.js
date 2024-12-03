import mongoose, { Schema } from "mongoose";

const deliveryAddressSchema = new Schema({
  tourist: { type: Schema.Types.ObjectId, ref: "Tourist", required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  postalCode: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
}, { timestamps: true });

const DeliveryAddress = mongoose.model("DeliveryAddress", deliveryAddressSchema);
export default DeliveryAddress; 