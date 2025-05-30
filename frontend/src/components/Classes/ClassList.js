import React, { useState, useEffect } from 'react';
import { getUpcomingClasses, studentBookClass } from '../../services/api';
import { useNavigate } from 'react-router-dom';


function ClassList({ user }) {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        setLoading(true);
        setError('');
        try {
            const { data } = await getUpcomingClasses();
            setClasses(data);
        } catch (err) {
            setError('Failed to load classes. Please try again later.');
            console.error("Fetch classes error:", err.response || err);
        }
        setLoading(false);
    };

    const handleBook = async (classId) => {
        if (!user) {
            navigate('/login'); // Redirect to login if not logged in
            return;
        }
        setError('');
        setSuccessMessage('');
        try {
            await studentBookClass(classId);
            setSuccessMessage('Class booked successfully!');
            // Optionally, re-fetch classes to update available spots if your backend handles that
            // fetchClasses(); 
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed. The class might be full or already booked.');
            console.error("Booking error:", err.response || err);
        }
    };
    
    const formatTime = (dateTimeString) => {
        if (!dateTimeString) return 'N/A';
        try {
            return new Date(dateTimeString).toLocaleString([], {dateStyle: 'medium', timeStyle: 'short'});
        } catch (e) {
            return dateTimeString; // fallback
        }
    };


    if (loading) return <p>Loading classes...</p>;

    return (
        <div className="class-list-container">
            <h2>Upcoming Classes</h2>
            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            {classes.length === 0 && !loading && <p>No upcoming classes scheduled at the moment.</p>}
            
            <ul className="class-list">
                {classes.map((cls) => (
                    <li key={cls.class_id} className="class-item">
                        <h3>{cls.title}</h3>
                        <p><strong>Instructor:</strong> {cls.instructor_email || 'N/A'}</p>
                        <p>{cls.description}</p>
                        <p><strong>When:</strong> {formatTime(cls.start_time)} - {new Date(cls.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        <p><strong>Capacity:</strong> {cls.capacity}</p>
                        {/* <p><strong>Available:</strong> {cls.capacity - (cls.current_bookings || 0)}</p> */}
                        <p><strong>Status:</strong> {cls.status}</p>

                        {user && user.role === 'student' && cls.status === 'scheduled' && (
                            <button onClick={() => handleBook(cls.class_id)} className="button-book">Book Now</button>
                        )}
                        {cls.status !== 'scheduled' && <p>Booking not available</p>}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ClassList;