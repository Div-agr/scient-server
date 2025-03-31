const express = require('express');
const { protect, admin } = require('../middleware/auth');
const {
  createBooking,
  cancelBooking,
  getBookingHistory,
  getClubBooking
} = require('../controllers/bookingController');

const {
    approveBooking,
  getPendingBookingsForSlot,
  getAllPendingBookings,
} = require('../controllers/adminController')

const router = express.Router();

router.post('/', protect, createBooking);
router.delete('/:id', protect, cancelBooking);
router.put('/approve', protect, admin, approveBooking);
router.get('/pending/:slotId', protect, admin, getPendingBookingsForSlot);
router.get('/pending', protect, admin, getAllPendingBookings); // New route for all pending bookings

router.get('/history', protect, getBookingHistory);
router.get('/pastbookings',protect, getClubBooking);

module.exports = router;