import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/api';

function Register({ onRegisterSuccess }) {
    const [formData, setFormData] = useState({ email: '', password: '', role: 'student' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { data } = await register(formData);
            onRegisterSuccess(data); // Pass token and user info to App.js
            navigate('/'); // or to /login if you prefer manual login after register
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
            console.error("Registration error:", err.response || err);
        }
    };

    return (
        <div className="auth-form">
            <h2>Register</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="role">Register as:</label>
                    <select name="role" id="role" value={formData.role} onChange={handleChange}>
                        <option value="student">Student</option>
                        <option value="admin">Instructor (Admin)</option>
                    </select>
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;