import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['Fire', 'Flood', 'Road accident', 'Medical emergency', 'Severe weather', 'Public safety', 'Crime', 'Other'],
    required: true,
  },
  severity: {
    type: String,
    enum: ['low', 'moderate', 'high', 'critical'],
    required: true,
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  address: String,
  status: {
    type: String,
    enum: ['Report Received', 'Dispatcher Reviewing', 'Team Assigned', 'Team En Route', 'Resolved'],
    default: 'Report Received',
  },
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null, // null for guest/anonymous
  },
  anonymous: {
    type: Boolean,
    default: true,
  },
  description: String,
  mediaUrls: [String],
  witnessCount: {
    type: Number,
    default: 1,
  },
  assignedAgency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agency',
    default: null,
  }
}, { timestamps: true });

// 2dsphere index for geospatial queries
incidentSchema.index({ location: '2dsphere' });

export default mongoose.model('Incident', incidentSchema);
