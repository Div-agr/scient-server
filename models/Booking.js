// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
  slotTime: { type: Date, required: true },
  members: { type: Number, required: true },
  reason: { type: String, required: true },
  approved: { type: Boolean, default: null },
  createdAt: { type: Date, default: Date.now },
  slot: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true },
});

bookingSchema.methods.cancel = function() {
  if (new Date() < new Date(this.slotTime) - 60 * 60 * 1000) {
    return this.remove();
  }
  throw new Error('Cancellation allowed only up to 1 hour before slot start.');
};

module.exports = mongoose.model('Booking', bookingSchema);