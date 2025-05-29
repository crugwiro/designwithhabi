// backend/controllers/classController.js
const db = require('../db');

// Admin: Create a new class
exports.createClass = async (req, res) => {
    const { title, description, start_time, end_time, capacity } = req.body;
    // In a real app, instructor_id would come from req.user.id if an instructor creates it
    // For MVP admin, we can leave instructor_id null or assign the admin's ID
    const instructor_id = req.user.id; // Assuming admin is logged in

    if (!title || !start_time || !end_time || !capacity) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const newClass = await db.query(
            'INSERT INTO classes (title, description, instructor_id, start_time, end_time, capacity) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title, description, instructor_id, start_time, end_time, capacity]
        );
        res.status(201).json(newClass.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error creating class' });
    }
};

// Student/Public: Get upcoming classes (next 7 days)
exports.getUpcomingClasses = async (req, res) => {
    try {
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

        // Also include classes that started recently but haven't ended
        const now = new Date();

        const result = await db.query(
            `SELECT c.*, u.email as instructor_email 
             FROM classes c
             LEFT JOIN users u ON c.instructor_id = u.user_id
             WHERE c.start_time >= $1 AND c.start_time <= $2 AND c.status = 'scheduled'
             ORDER BY c.start_time ASC`,
            [now, sevenDaysFromNow.toISOString()]
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error fetching classes' });
    }
};

// Admin: Get all classes (for their management view)
exports.getAllClassesAdmin = async (req, res) => {
    try {
        // If only one admin, or if specific instructors should only see their classes
        // const instructorId = req.user.id;
        // const result = await db.query('SELECT * FROM classes WHERE instructor_id = $1 ORDER BY start_time DESC', [instructorId]);
        const result = await db.query('SELECT c.*, u.email as instructor_email FROM classes c LEFT JOIN users u ON c.instructor_id = u.user_id ORDER BY c.start_time DESC');
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error fetching admin classes' });
    }
};

// Admin: Cancel a class
exports.cancelClass = async (req, res) => {
    const { classId } = req.params;
    try {
        // First, check if class exists and belongs to this admin or if admin has global cancel rights
        const classResult = await db.query('SELECT * FROM classes WHERE class_id = $1', [classId]);
        if (classResult.rows.length === 0) {
            return res.status(404).json({ message: 'Class not found' });
        }
        // Optional: Add instructor_id check if not global admin
        // if (classResult.rows[0].instructor_id !== req.user.id) {
        //     return res.status(403).json({ message: 'Not authorized to cancel this class' });
        // }

        const updatedClass = await db.query(
            "UPDATE classes SET status = 'cancelled' WHERE class_id = $1 RETURNING *",
            [classId]
        );
        // Optionally, also update related bookings to 'cancelled_by_admin'
        await db.query("UPDATE bookings SET status = 'cancelled_by_admin' WHERE class_id = $1", [classId]);

        res.json({ message: 'Class cancelled successfully', class: updatedClass.rows[0] });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error cancelling class' });
    }
};

// Admin: View students signed up for a class
exports.getClassSignups = async (req, res) => {
    const { classId } = req.params;
    try {
        // Optional: check if admin is instructor for this class
        const result = await db.query(
            `SELECT b.booking_id, u.user_id, u.email, b.booking_time, b.status
             FROM bookings b
             JOIN users u ON b.student_id = u.user_id
             WHERE b.class_id = $1 AND b.status = 'confirmed'`, // Only show confirmed bookings
            [classId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error fetching signups' });
    }
};