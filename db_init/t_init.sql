-- dance-studio-mvp/db_init/init.sql
-- Optional: Create a default admin user (change email/password)
-- Password 'adminpass' hashed (use bcrypt to generate a real hash for a strong password)
-- For bcryptjs: require('bcryptjs').hashSync('adminpass', 10)
-- Example hash (DO NOT USE THIS IN PRODUCTION, generate your own!):
-- $2a$10$SOMEKINDOFRANDOMSTRINGFORSALT.HUIOEH/94u5Kq9E63e
INSERT INTO users (email, password_hash, role)
VALUES ('habiclemmo@gmail.com', '$2b$10$0RZCXFwRD3TzXZsJwbxLDOoGfHJCt6flzMmfuvKrurC0WC4JgeNv2', 'admin')
ON CONFLICT (email) DO NOTHING;

