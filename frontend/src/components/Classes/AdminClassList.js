import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminGetAllClasses, adminCancelClass, adminGetClassSignups } from '../../services/api';

function AdminClassList() {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [signupsData, setSignupsData] = useState({}); // { classId: [students] }

    useEffect(() => {
        fetchAdminClasses();
    }, []);

    const fetchAdminClasses = async () => {
        setLoading(true);
        setError('');
        try {
            const { data } = await adminGetAllClasses();
            setClasses(data);
        } catch (err) {
            setError('Failed to load classes.');
            console.error(err);
        }
        setLoading(false);
    };

    const handleCancel = async (classId) => {
        if (window.confirm('Are you sure you want to cancel this class? This will also update student bookings.')) {
            setError('');
            setSuccessMessage('');
            try {
                await adminCancelClass(classId);
                setSuccessMessage('Class cancelled successfully.');
                fetchAdminClasses(); // Refresh the list
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to cancel class.');
            }
        }
    };

    const handleViewSignups = async (classId) => {
        if (signupsData[classId]) { // Toggle view
            setSignupsData(prev => ({ ...prev, [classId]: null }));
            return;
        }
        try {
            const { data } = await adminGetClassSignups(classId);
            setSignupsData(prev => ({ ...prev, [classId]: data }));
        } catch (err) {
            setError(`Failed to load signups for class ${classId}.`);
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

    if (loading) return <p>Loading admin class list...</p>;

    return (
        <div className="admin-class-list-container">
            <h2>Manage Classes</h2>
            <Link to="/admin/classes/new" className="button-create">Create New Class</Link>
            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            
            {classes.length === 0 && !loading && <p>No classes found.</p>}
            <ul className="class-list-admin">
                {classes.map((cls) => (
                    <li key={cls.class_id} className="class-item-admin">
                        <h3>{cls.title}</h3>
                        <p><strong>Instructor:</strong> {cls.instructor_email || 'N/A'}</p>
                        <p><strong>Time:</strong> {formatTime(cls.start_time)} - {new Date(cls.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        <p><strong>Capacity:</strong> {cls.capacity}</p>
                        <p><strong>Status:</strong> {cls.status}</p>
                        {/* <p>Enrolled: {cls.enrolled_count || 0}</p> Backend needs to provide this for admin list */}
                        
                        {cls.status === 'scheduled' && (
                            <button onClick={() => handleCancel(cls.class_id)} className="button-cancel">Cancel Class</button>
                        )}
                        <button onClick={() => handleViewSignups(cls.class_id)} className="button-view-signups">
                            {signupsData[cls.class_id] ? 'Hide Signups' : 'View Signups'}
                        </button>
                        {/* Add Edit Link here if edit form is implemented */}
                        {/* <Link to={`/admin/classes/edit/${cls.class_id}`}>Edit</Link> */}

                        {signupsData[cls.class_id] && (
                            <div className="signups-details">
                                <h4>Signups for {cls.title}:</h4>
                                {signupsData[cls.class_id].length > 0 ? (
                                    <ul>
                                        {signupsData[cls.class_id].map(signup => (
                                            <li key={signup.booking_id}>{signup.email} (Booked: {formatTime(signup.booking_time)})</li>
                                        ))}
                                    </ul>
                                ) : <p>No students signed up yet.</p>}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AdminClassList;