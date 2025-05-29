-- dance-studio-mvp/db_init/init.sql
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'student', -- 'student' or 'admin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS classes (
    class_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructor_id INTEGER REFERENCES users(user_id), -- For MVP, admin creates, not necessarily assigned
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    capacity INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
    booking_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES users(user_id),
    class_id INTEGER NOT NULL REFERENCES classes(class_id),
    booking_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'confirmed', -- 'confirmed', 'cancelled_by_student', 'cancelled_by_admin'
    UNIQUE (student_id, class_id), -- A student can book a specific class only once
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Create a default admin user (change email/password)
-- Password 'adminpass' hashed (use bcrypt to generate a real hash for a strong password)
-- For bcryptjs: require('bcryptjs').hashSync('adminpass', 10)
-- Example hash (DO NOT USE THIS IN PRODUCTION, generate your own!):
-- $2a$10$SOMEKINDOFRANDOMSTRINGFORSALT.HUIOEH/94u5Kq9E63e
INSERT INTO users (email, password_hash, role)
VALUES ('habiclemmo@gmail.com', '$2b$10$0RZCXFwRD3TzXZsJwbxLDOoGfHJCt6flzMmfuvKrurC0WC4JgeNv2', 'admin')
ON CONFLICT (email) DO NOTHING;

