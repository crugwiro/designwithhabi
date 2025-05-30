import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Nav({ user, onLogout }) {
    const navigate = useNavigate();

    const handleLogoutClick = () => {
        onLogout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="nav-brand">DanceStudio</Link>
            <ul className="nav-links">
                <li><Link to="/">Schedule</Link></li>
                {user ? (
                    <>
                        {user.role === 'student' && <li><Link to="/my-bookings">My Bookings</Link></li>}
                        {user.role === 'admin' && <li><Link to="/admin/classes">Manage Classes</Link></li>}
                        <li className="nav-user-info">Welcome, {user.email} ({user.role})</li>
                        <li><button onClick={handleLogoutClick} className="nav-button">Logout</button></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Nav;