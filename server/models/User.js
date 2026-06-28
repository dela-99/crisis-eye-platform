import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['citizen', 'responder', 'admin'],
    default: 'citizen',
  },
  preferences: {
    receiveNotifications: { type: Boolean, default: true },
    alertRadiusKm: { type: Number, default: 10 },
  },
  savedLocations: [{
    label: String, // e.g., 'Home', 'Work'
    coordinates: {
      lat: Number,
      lng: Number,
    }
  }],
}, { timestamps: true });

export default mongoose.model('User', userSchema);
