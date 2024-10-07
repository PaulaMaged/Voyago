import mongoose from 'mongoose';
import User from './User.js';

const adminSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String },
  permissions: { type: String },
  date_of_assignment: { type: Date }
});

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;