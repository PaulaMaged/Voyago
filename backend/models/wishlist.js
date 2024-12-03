// models/Wishlist.js
import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  tourist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tourist',
    required: true,
    unique: true
  },
  items: [{
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'items.itemType',
      required: true
    },
    itemType: {
      type: String,
      required: true,
      enum: ['Itinerary', 'Activity', 'Product']
    }
  }]
}, { timestamps: true });

export default mongoose.model('Wishlist', wishlistSchema);

