// models/Club.js
const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true},
  credits: { type: Number, default: 7 },
  logo: String,
  isAdmin: { type: Boolean, default: false },
  bookingHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
  password: { type: String, required: true }
});

clubSchema.methods.resetCredits = function() {
  this.credits = this.name === 'SCIEnT' ? 100 : 14;
  return this.save();
};

module.exports = mongoose.model('Club', clubSchema);
