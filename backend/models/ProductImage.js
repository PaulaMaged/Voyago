import mongoose from 'mongoose';

const ProductImageSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

ProductImageSchema.virtual('image_url').get(function() {
  return `uploads/${this.filename}`;
});

ProductImageSchema.set('toJSON', { virtuals: true });
ProductImageSchema.set('toObject', { virtuals: true });

export default mongoose.model('ProductImage', ProductImageSchema); 