-- dance-studio-mvp/db_init/init.sql

-- Ensure this script is idempotent (can be run multiple times safely)

-- =============================================
-- USERS
-- =============================================

-- Admin/Instructor User
-- Password for 'habiclemmo@gmail.com' (e.g., 'adminpass')
INSERT INTO users (email, password_hash, role)
VALUES ('habiclemmo@gmail.com', '$2b$10$6yGPxUAuZXz0xER.u25CNe6o5r42myzMOyidZQdpkEWu8kCytHLrW', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Student Users
-- Password for 'student1@example.com' (e.g., 'studentpass1') - Generate a real hash!
INSERT INTO users (email, password_hash, role)
VALUES ('student1@example.com', '$2a$10$replaceWithRealHashForStudent1', 'student')
ON CONFLICT (email) DO NOTHING;

-- Password for 'student2@example.com' (e.g., 'studentpass2') - Generate a real hash!
INSERT INTO users (email, password_hash, role)
VALUES ('student2@example.com', '$2a$10$replaceWithRealHashForStudent2', 'student')
ON CONFLICT (email) DO NOTHING;

-- Add more student users as needed
INSERT INTO users (email, password_hash, role)
VALUES ('student3@example.com', '$2a$10$replaceWithRealHashForStudent3', 'student')
ON CONFLICT (email) DO NOTHING;


-- =============================================
-- CLASSES
-- =============================================
-- Insert classes, ensuring instructor_id is correctly fetched.

INSERT INTO classes (title, description, instructor_id, start_time, end_time, capacity, status)
SELECT
    'HipHop Fundamentals',                                  -- Class Title
    'Learn the basics of Hip Hop dance, grooves, and footwork.', -- Description
    (SELECT user_id FROM users WHERE email = 'habiclemmo@gmail.com'), -- Fetch instructor_id
    NOW() AT TIME ZONE 'UTC' + INTERVAL '1 day' + TIME '18:00:00',       -- Start time (e.g., tomorrow 6 PM UTC)
    NOW() AT TIME ZONE 'UTC' + INTERVAL '1 day' + TIME '19:00:00',       -- End time (e.g., tomorrow 7 PM UTC)
    15,                                                     -- Capacity
    'scheduled'                                             -- Status
WHERE
    NOT EXISTS (SELECT 1 FROM classes WHERE title = 'HipHop Fundamentals') AND
    EXISTS (SELECT 1 FROM users WHERE email = 'habiclemmo@gmail.com'); -- Ensure instructor exists

INSERT INTO classes (title, description, instructor_id, start_time, end_time, capacity, status)
SELECT
    'Afrobeats Grooves',
    'Feel the rhythm and energy of Afrobeats dance styles.',
    (SELECT user_id FROM users WHERE email = 'habiclemmo@gmail.com'),
    NOW() AT TIME ZONE 'UTC' + INTERVAL '2 days' + TIME '19:30:00',
    NOW() AT TIME ZONE 'UTC' + INTERVAL '2 days' + TIME '20:30:00',
    20,
    'scheduled'
WHERE
    NOT EXISTS (SELECT 1 FROM classes WHERE title = 'Afrobeats Grooves') AND
    EXISTS (SELECT 1 FROM users WHERE email = 'habiclemmo@gmail.com');

INSERT INTO classes (title, description, instructor_id, start_time, end_time, capacity, status)
SELECT
    'Contemporary Flow',
    'Explore expressive movement and contemporary dance techniques.',
    (SELECT user_id FROM users WHERE email = 'habiclemmo@gmail.com'),
    NOW() AT TIME ZONE 'UTC' + INTERVAL '3 days' + TIME '17:00:00',
    NOW() AT TIME ZONE 'UTC' + INTERVAL '3 days' + TIME '18:30:00',
    12,
    'scheduled'
WHERE
    NOT EXISTS (SELECT 1 FROM classes WHERE title = 'Contemporary Flow') AND
    EXISTS (SELECT 1 FROM users WHERE email = 'habiclemmo@gmail.com');


-- =============================================
-- BOOKINGS (formerly enrollments)
-- =============================================
-- Booking student1 into 'HipHop Fundamentals'
INSERT INTO bookings (student_id, class_id, status, booking_time)
SELECT
    u.user_id,
    c.class_id,
    'confirmed',                                                  -- Status
    NOW() AT TIME ZONE 'UTC'                                      -- Booking time
FROM
    users u, classes c
WHERE
    u.email = 'student1@example.com' AND
    c.title = 'HipHop Fundamentals' AND
    EXISTS (SELECT 1 FROM users WHERE email = 'student1@example.com') AND -- Ensure student exists
    EXISTS (SELECT 1 FROM classes WHERE title = 'HipHop Fundamentals')   -- Ensure class exists
ON CONFLICT (student_id, class_id) DO NOTHING;


-- Booking student2 into 'Afrobeats Grooves'
INSERT INTO bookings (student_id, class_id, status, booking_time)
SELECT
    u.user_id,
    c.class_id,
    'confirmed',
    NOW() AT TIME ZONE 'UTC'
FROM
    users u, classes c
WHERE
    u.email = 'student2@example.com' AND
    c.title = 'Afrobeats Grooves' AND
    EXISTS (SELECT 1 FROM users WHERE email = 'student2@example.com') AND
    EXISTS (SELECT 1 FROM classes WHERE title = 'Afrobeats Grooves')
ON CONFLICT (student_id, class_id) DO NOTHING;

-- Booking student1 also into 'Afrobeats Grooves'
INSERT INTO bookings (student_id, class_id, status, booking_time)
SELECT
    u.user_id,
    c.class_id,
    'confirmed',
    NOW() AT TIME ZONE 'UTC'
FROM
    users u, classes c
WHERE
    u.email = 'student1@example.com' AND
    c.title = 'Afrobeats Grooves' AND
    EXISTS (SELECT 1 FROM users WHERE email = 'student1@example.com') AND
    EXISTS (SELECT 1 FROM classes WHERE title = 'Afrobeats Grooves')
ON CONFLICT (student_id, class_id) DO NOTHING;


-- Booking student3 into 'Contemporary Flow'
INSERT INTO bookings (student_id, class_id, status, booking_time)
SELECT
    u.user_id,
    c.class_id,
    'confirmed',
    NOW() AT TIME ZONE 'UTC'
FROM
    users u, classes c
WHERE
    u.email = 'student3@example.com' AND
    c.title = 'Contemporary Flow' AND
    EXISTS (SELECT 1 FROM users WHERE email = 'student3@example.com') AND
    EXISTS (SELECT 1 FROM classes WHERE title = 'Contemporary Flow')
ON CONFLICT (student_id, class_id) DO NOTHING;


SELECT 'Database initialization script complete.' AS message;