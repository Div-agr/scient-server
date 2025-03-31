// routes/adminRoutes.js
const express = require('express');
const { protect, admin } = require('../middleware/auth');
const { getPendingBookings, approveBooking, rejectBooking,resetClubPassword} = require('../controllers/adminController');
const router = express.Router();

router.get('/pending-bookings', protect, admin, getPendingBookings);
router.put('/approve/:id', protect, admin, approveBooking);
router.put('/reject/:id', protect, admin, rejectBooking);
router.put('/clubs/reset-password',protect, admin, resetClubPassword);

module.exports = router;
