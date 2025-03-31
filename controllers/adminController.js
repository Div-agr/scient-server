// controllers/adminController.js
const Booking = require('../models/Booking');
const Club = require('../models/Club');
const Slot = require('../models/Slot');
const bcrypt = require('bcrypt'); // Hashing the password

exports.getPendingBookings = async (req, res) => {
  const pendingBookings = await Booking.find({ approved: null }).populate('club');
  res.send(pendingBookings);
}

exports.approveBooking = async (req, res) => {
  const bookingId = req.params.id;
  const booking = await Booking.findById(bookingId).populate('club slot'); // Populate to get club and slot details

  if (!booking) return res.status(404).send('Booking not found.');

  // Check if the club has enough credits
  const club = await Club.findById(booking.club._id);
  if (!club) return res.status(404).send('Club not found.');
  if (club.credits <= 0) return res.status(403).send('Insufficient credits to approve booking.');

  // Approve the booking
  booking.approved = true;
  await booking.save();

  // Mark the corresponding slot as booked
  const slot = await Slot.findById(booking.slot._id);
  if (slot) {
    slot.booked = true; // Slot is confirmed
    slot.booking = booking._id; // Reference to the approved booking
    await slot.save();
  }

  // Reduce credits for the club
  club.credits -= 1; // Deduct one credit
  await club.save();

  res.send({ message: 'Booking approved successfully.' });
};

exports.rejectBooking = async (req, res) => {
  const bookingId = req.params.id;
  const booking = await Booking.findById(bookingId).populate('club slot'); // Populate to get club and slot details

  if (!booking) return res.status(404).send('Booking not found.');

  // Check if the club has enough credits
  booking.approved=false;
  await booking.save();
  const club = await Club.findById(booking.club._id);
  if (!club) return res.status(404).send('Club not found.');

  // Mark the corresponding slot as unbooked
  const slot = await Slot.findById(booking.slot._id);
  if (slot) {
    slot.booked = false; // Slot is confirmed
    slot.booking = null; // Reference to the approved booking
    await slot.save();
  }

  await club.save();

  res.send({ message: 'Booking rejected successfully.' });
};

exports.getPendingBookingsForSlot = async (req, res) => {
  const { slotId } = req.params; // Get slot ID from the URL
  const pendingBookings = await Booking.find({ slot: slotId, approved: false }).populate('club');

  if (!pendingBookings.length) {
    return res.status(404).send('No pending bookings for this slot.');
  }

  res.send(pendingBookings);
};

// Fetch all pending bookings for admin review
exports.getAllPendingBookings = async (req, res) => {
  const pendingBookings = await Booking.find({ approved: false }).populate('club slot');

  if (!pendingBookings.length) {
    return res.status(404).send('No pending bookings.');
  }

  res.send(pendingBookings);
};
exports.resetClubPassword = async (req, res) => {
  const { username, newPassword } = req.body;

  try {
    // Find the club by username
    const club = await Club.findOne({ username });
    if (!club) return res.status(404).send({ message: 'Club not found.' });

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the club's password
    club.password = hashedPassword;
    await club.save();

    res.status(200).send({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error.' });
  }
}