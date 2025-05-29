// backend/routes/classRoutes.js
const express = require('express');
const router = express.Router();
const { createClass, getUpcomingClasses, getAllClassesAdmin, cancelClass, getClassSignups } = require('../controllers/classController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, admin, createClass) // Admin creates class
    .get(getUpcomingClasses);          // Public/Student gets upcoming schedule

router.get('/admin', protect, admin, getAllClassesAdmin); // Admin gets all classes for management

router.route('/:classId/cancel')
    .patch(protect, admin, cancelClass); // Admin cancels a class (use PATCH or PUT)

router.route('/:classId/signups')
    .get(protect, admin, getClassSignups); // Admin views signups

module.exports = router;