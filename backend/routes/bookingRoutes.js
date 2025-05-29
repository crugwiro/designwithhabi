// backend/routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const { bookClass, getMyBookings } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware'); // Only protect, no admin needed for student actions

router.route('/')
    .post(protect, bookClass); // Student books a class

router.route('/mine')
    .get(protect, getMyBookings); // Student views their bookings

module.exports = router;