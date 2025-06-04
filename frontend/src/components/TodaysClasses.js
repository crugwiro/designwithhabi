// src/components/TodaysClasses.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUpcomingClasses } from '../services/api'; // Assuming this fetches classes
import './TodaysClasses.css';

// Placeholder instructor images - replace with your actual logic
const instructorImages = {
    'instructor.anna@example.com': '/path/to/anna.jpg',
    'instructor.ben@example.com': '/path/to/ben.jpg',
    'default': '/path/to/default-instructor.jpg'
};

function TodaysClasses() {
    const [todaysClasses, setTodaysClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchClasses = async () => {
            setLoading(true);
            try {
                const { data: allClasses } = await getUpcomingClasses(); // Or a specific API for today
                const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

                const filteredClasses = allClasses.filter(cls => 
                    cls.start_time.startsWith(today) && cls.status === 'scheduled'
                ).sort((a, b) => new Date(a.start_time) - new Date(b.start_time)); // Sort by time

                setTodaysClasses(filteredClasses);
            } catch (err) {
                setError("Could not fetch today's classes.");
                console.error(err);
            }
            setLoading(false);
        };
        fetchClasses();
    }, []);

    const formatTime = (dateTimeString) => {
        return new Date(dateTimeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) return <p className="loading-message">Loading today's classes...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <section className="todays-classes-section">
            <div className="container">
                <h2>Today's Schedule</h2>
                {todaysClasses.length === 0 ? (
                    <p>No classes scheduled for today.</p>
                ) : (
                    <div className="classes-grid">
                        {todaysClasses.map(cls => (
                            <div key={cls.class_id} className="class-card">
                                <div className="class-card-image-container">
                                    <img 
                                        src={instructorImages[cls.instructor_email] || instructorImages.default} 
                                        alt={cls.instructor_email || 'Instructor'} 
                                        className="instructor-image"
                                    />
                                </div>
                                <div className="class-card-content">
                                    <p className="class-time">{formatTime(cls.start_time)} - {formatTime(cls.end_time)}</p>
                                    <h3 className="class-title">{cls.title}</h3>
                                    <p className="instructor-name">With: {cls.instructor_email ? cls.instructor_email.split('@')[0] : 'TBD'}</p>
                                    <Link to={`/class/${cls.class_id}`} className="button button-details">
                                        View Details & Book
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default TodaysClasses;