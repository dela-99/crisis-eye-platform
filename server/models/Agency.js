import mongoose from 'mongoose';

const agencySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Police', 'Fire Service', 'Ambulance', 'NADMO', 'Other'],
    required: true,
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  address: String,
  contactNumber: String,
}, { timestamps: true });

agencySchema.index({ location: '2dsphere' });

export default mongoose.model('Agency', agencySchema);
