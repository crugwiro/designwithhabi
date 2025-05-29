// backend/db/index.js
const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' }); // Adjust path if needed
//*
// Reduces overhead by reusing connections.
// Handles concurrent queries efficiently.
// Prevents exhausting database resources.
//
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false // For Heroku/Render
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};