// src/components/Header.js (or modify Nav.js)
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css'; // We'll create this CSS file

function Nav({ user, onLogout }) {
    const navigate = useNavigate();
    // State for dropdown visibility (example for 'Classes')
    const [isClassesDropdownOpen, setIsClassesDropdownOpen] = useState(false);
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);


    const handleLogoutClick = () => {
        onLogout();
        setIsAccountDropdownOpen(false); // Close dropdown on logout
        navigate('/login');
    };

    return (
        <header className="app-header">
            <div className="header-container">
                <Link to="/" className="header-brand">
                    {/* You can put your logo image here if you have one */}
                    {/* <img src="/path/to/your-logo.png" alt="Dance Studio Logo" /> */}
                    Dance With Habi {/* Or your chosen app name */}
                </Link>
                <nav className="header-nav">
                    <ul className="nav-links">
                        <li 
                            className="nav-item dropdown-parent"
                            onMouseEnter={() => setIsClassesDropdownOpen(true)}
                            onMouseLeave={() => setIsClassesDropdownOpen(false)}
                        >
                            <Link to="/schedule" className="nav-link">Classes</Link>
                            {isClassesDropdownOpen && (
                                <ul className="dropdown-menu">
                                    <li><Link to="/schedule/hiphop">Hip Hop</Link></li>
                                    <li><Link to="/schedule/afrobeats">Afrobeats</Link></li>
                                    <li><Link to="/schedule/contemporary">Contemporary</Link></li>
                                    <li><Link to="/schedule">Full Schedule</Link></li>
                                </ul>
                            )}
                        </li>
                        <li className="nav-item">
                            <Link to="/events" className="nav-link">Events</Link> {/* Assuming you'll have an events page */}
                        </li>
                        {/* More nav items can go here */}
                    </ul>
                </nav>
                <div className="header-actions">
                    {user ? (
                        <div 
                            className="nav-item dropdown-parent account-menu"
                            onMouseEnter={() => setIsAccountDropdownOpen(true)}
                            onMouseLeave={() => setIsAccountDropdownOpen(false)}
                        >
                            <button className="nav-link account-button">
                                {user.email.split('@')[0]} {/* Display username part */}
                            </button>
                            {isAccountDropdownOpen && (
                                 <ul className="dropdown-menu account-dropdown">
                                    {user.role === 'student' && <li><Link to="/my-bookings">My Bookings</Link></li>}
                                    {user.role === 'student' && <li><Link to="/profile">My Profile</Link></li>}
                                    {user.role === 'admin' && <li><Link to="/admin/classes">Manage Classes</Link></li>}
                                    {user.role === 'admin' && <li><Link to="/admin/profile">Admin Profile</Link></li>}
                                    <li><button onClick={handleLogoutClick} className="logout-button">Logout</button></li>
                                </ul>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="button button-login">Login</Link>
                            <Link to="/register" className="button button-signup">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Nav;