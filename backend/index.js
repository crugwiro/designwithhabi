// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
let authRoutes, classRoutes, bookingRoutes;

try {
    authRoutes = require('./routes/authRoutes'); // Corrected
} catch (e) {
    console.error("Error loading authRoutes:", e.message); // Log the actual error
    authRoutes = (req, res, next) => res.status(500).send("Auth routes failed to load");
}
try {
    classRoutes = require('./routes/classRoutes'); // Corrected
} catch (e) {
    console.error("Error loading classRoutes:", e.message); // Log the actual error
    classRoutes = (req, res, next) => res.status(500).send("Class routes failed to load");
}
try {
    bookingRoutes = require('./routes/bookingRoutes'); // Corrected
} catch (e) {
    console.error("Error loading bookingRoutes:", e.message); // Log the actual error
    bookingRoutes = (req, res, next) => res.status(500).send("Booking routes failed to load");
}

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
    res.send('Dance Studio MVP Backend Running!');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/bookings', bookingRoutes);

// Basic Error Handler (Optional, but good for seeing issues)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`); // Use http://localhost
});