// backend/controllers/bookingController.js
const db = require('../db');

// Student: Book a class
exports.bookClass = async (req, res) => {
    const { class_id } = req.body;
    const student_id = req.user.id; // From protect middleware

    if (!class_id) {
        return res.status(400).json({ message: "Class ID is required" });
    }

    try {
        // Check class capacity and if already booked
        const classResult = await db.query('SELECT capacity, status FROM classes WHERE class_id = $1', [class_id]);
        if (classResult.rows.length === 0) {
            return res.status(404).json({ message: 'Class not found' });
        }
        if (classResult.rows[0].status !== 'scheduled') {
            return res.status(400).json({ message: 'Class is not available for booking (e.g., cancelled or full)' });
        }

        const currentBookings = await db.query(
            "SELECT COUNT(*) FROM bookings WHERE class_id = $1 AND status = 'confirmed'",
            [class_id]
        );
        if (parseInt(currentBookings.rows[0].count) >= classResult.rows[0].capacity) {
            return res.status(400).json({ message: 'Class is full' });
        }

        // Check if student already booked this class
        const existingBooking = await db.query(
            "SELECT * FROM bookings WHERE student_id = $1 AND class_id = $2 AND status = 'confirmed'",
            [student_id, class_id]
        );
        if (existingBooking.rows.length > 0) {
            return res.status(400).json({ message: 'You have already booked this class' });
        }

        const newBooking = await db.query(
            'INSERT INTO bookings (student_id, class_id) VALUES ($1, $2) RETURNING *',
            [student_id, class_id]
        );
        res.status(201).json({ message: 'Class booked successfully!', booking: newBooking.rows[0] });
    } catch (error) {
        console.error(error.message);
        // Handle unique constraint violation (student already booked) if not caught above
        if (error.code === '23505') { // PostgreSQL unique violation
             return res.status(400).json({ message: 'You have already booked this class (or a conflict occurred).' });
        }
        res.status(500).json({ message: 'Server error booking class' });
    }
};

// Student: View their own bookings
exports.getMyBookings = async (req, res) => {
    const student_id = req.user.id;
    try {
        const result = await db.query(
            `SELECT b.*, c.title, c.start_time, c.end_time, c.status as class_status
             FROM bookings b
             JOIN classes c ON b.class_id = c.class_id
             WHERE b.student_id = $1
             ORDER BY c.start_time DESC`,
            [student_id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error fetching bookings' });
    }
};