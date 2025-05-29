// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
// Import routes later
let authRoutes, classRoutes, bookingRoutes;
try {
    authRoutes = require('./routes/auth');
} catch (e) {
    console.warn("Warning: './routes/auth' not found.");
    authRoutes = (req, res, next) => next();
}
try {
    classRoutes = require('./routes/classes');
} catch (e) {
    console.warn("Warning: './routes/classes' not found.");
    classRoutes = (req, res, next) => next();
}
try {
    bookingRoutes = require('./routes/bookings');
} catch (e) {
    console.warn("Warning: './routes/bookings' not found.");
    bookingRoutes = (req, res, next) => next();
}

const app = express();
const PORT = process.env.PORT || 5001; // Different from React's default 3000

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

// Basic Route
app.get('/', (req, res) => {
    res.send('Dance Studio MVP Backend Running!');
});

// API Routes (to be created)
app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/bookings', bookingRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
