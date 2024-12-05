import mongoose from 'mongoose';

const touristImageSchema = new mongoose.Schema({
  tourist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tourist',
    required: true
  },
  image_url: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('TouristImage', touristImageSchema);