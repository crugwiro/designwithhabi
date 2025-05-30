import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Nav from './components/Nav';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ClassList from './components/Classes/ClassList';
import MyBookings from './components/Bookings/MyBookings';
import AdminClassList from './components/Classes/AdminClassList';
import AdminClassForm from './components/Classes/AdminClassForm';
import './App.css';

function App() {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');
        if (token && userString) {
            try {
                const user = JSON.parse(userString);
                setCurrentUser(user);
            } catch (e) {
                console.error("Error parsing user from localStorage", e);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
    }, []);

    const handleLogin = (userData) => {
        // Assuming userData from backend includes: user_id, email, role, token
        localStorage.setItem('token', userData.token);
        localStorage.setItem('user', JSON.stringify({ 
            id: userData.user_id, // Match backend response key
            email: userData.email, 
            role: userData.role 
        }));
        setCurrentUser({ 
            id: userData.user_id, 
            email: userData.email, 
            role: userData.role 
        });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setCurrentUser(null);
    };

    return (
        <Router>
            <Nav user={currentUser} onLogout={handleLogout} />
            <div className="container">
                <Routes>
                    <Route path="/login" element={currentUser ? <Navigate to="/" /> : <Login onLoginSuccess={handleLogin} />} />
                    <Route path="/register" element={currentUser ? <Navigate to="/" /> : <Register onRegisterSuccess={handleLogin} />} />
                    
                    <Route path="/" element={<ClassList user={currentUser} />} />
                    
                    {/* Student Routes */}
                    <Route path="/my-bookings" element={currentUser && currentUser.role === 'student' ? <MyBookings /> : <Navigate to="/login" />} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin/classes" element={currentUser && currentUser.role === 'admin' ? <AdminClassList /> : <Navigate to="/login" />} />
                    <Route path="/admin/classes/new" element={currentUser && currentUser.role === 'admin' ? <AdminClassForm /> : <Navigate to="/login" />} />
                    {/* <Route path="/admin/classes/edit/:classId" element={currentUser && currentUser.role === 'admin' ? <AdminClassForm /> : <Navigate to="/login" />} /> */}
                    
                    <Route path="*" element={<h1>404 Not Found</h1>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;