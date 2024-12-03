// models/Wishlist.js
import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

