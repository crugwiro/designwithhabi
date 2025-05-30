import React, { useState, useEffect } from 'react';
import { studentGetMyBookings } from '../../services/api';

function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            setError('');
            try {
                const { data } = await studentGetMyBookings();
                setBookings(data);
            } catch (err) {
                setError('Failed to load your bookings.');
                console.error("Fetch bookings error:", err.response || err);
            }
            setLoading(false);
        };
        fetchBookings();
    }, []);
    
    const formatTime = (dateTimeString) => {
        if (!dateTimeString) return 'N/A';
        try {
            return new Date(dateTimeString).toLocaleString([], {dateStyle: 'medium', timeStyle: 'short'});
        } catch (e) {
            return dateTimeString; // fallback
        }
    };


    if (loading) return <p>Loading your bookings...</p>;

    return (
        <div className="my-bookings-container">
            <h2>My Bookings</h2>
            {error && <p className="error-message">{error}</p>}
            {bookings.length === 0 && !loading && <p>You have no bookings.</p>}
            <ul className="booking-list">
                {bookings.map((booking) => (
                    <li key={booking.booking_id} className="booking-item">
                        <h3>{booking.title}</h3>
                        <p><strong>Booked on:</strong> {formatTime(booking.booking_time)}</p>
                        <p><strong>Class Time:</strong> {formatTime(booking.start_time)} - {new Date(booking.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        <p><strong>Your Booking Status:</strong> {booking.status}</p>
                        <p><strong>Class Status:</strong> {booking.class_status}</p>
                        {/* Add cancel booking button if implemented */}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MyBookings;