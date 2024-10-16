const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  pickupLocation: { type: String, required: true },
  dropOffLocation: { type: String, required: true },
  vehicleType: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  estimatedCost: { type: Number, required: true },
  status: { type: String, required: true, default: 'pending' },
  cabId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
});

module.exports = mongoose.model('Booking', bookingSchema);
