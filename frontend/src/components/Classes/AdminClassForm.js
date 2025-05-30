import React, { useState /*, useEffect, useParams */ } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminCreateClass /*, adminUpdateClass, adminGetClass */ } from '../../services/api';

function AdminClassForm() {
    // const { classId } = useParams(); // For edit mode
    // const isEditMode = Boolean(classId);
    const navigate = useNavigate();

    const [classData, setClassData] = useState({
        title: '',
        description: '',
        start_time: '', // Expects ISO string e.g., 2024-08-15T10:00:00
        end_time: '',
        capacity: 10,
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     if (isEditMode) {
    //         // Fetch class data to populate form for editing
    //         // adminGetClass(classId).then(response => {
    //         //     const fetchedClass = response.data;
    //         //     setClassData({
    //         //         title: fetchedClass.title,
    //         //         description: fetchedClass.description,
    //         //         start_time: new Date(fetchedClass.start_time).toISOString().slice(0, 16), // Format for datetime-local
    //         //         end_time: new Date(fetchedClass.end_time).toISOString().slice(0, 16),
    //         //         capacity: fetchedClass.capacity,
    //         //     });
    //         // }).catch(err => setError("Could not load class data for editing."));
    //     }
    // }, [classId, isEditMode]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setClassData({
            ...classData,
            [name]: type === 'number' ? parseInt(value, 10) : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Convert local datetime input to ISOString (or ensure backend handles it)
        const payload = {
            ...classData,
            start_time: new Date(classData.start_time).toISOString(),
            end_time: new Date(classData.end_time).toISOString(),
        };
        
        try {
            // if (isEditMode) {
            //     await adminUpdateClass(classId, payload);
            // } else {
                await adminCreateClass(payload);
            // }
            navigate('/admin/classes');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save class. Ensure all fields are correct.');
            console.error("Save class error:", err.response || err);
        }
        setLoading(false);
    };

    return (
        <div className="admin-class-form-container">
            <h2>{false ? 'Edit Class' : 'Create New Class'}</h2> {/* Update for editMode */}
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="class-form">
                <div>
                    <label htmlFor="title">Title:</label>
                    <input type="text" name="title" id="title" value={classData.title} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea name="description" id="description" value={classData.description} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="start_time">Start Date & Time:</label>
                    <input type="datetime-local" name="start_time" id="start_time" value={classData.start_time} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="end_time">End Date & Time:</label>
                    <input type="datetime-local" name="end_time" id="end_time" value={classData.end_time} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="capacity">Capacity:</label>
                    <input type="number" name="capacity" id="capacity" value={classData.capacity} onChange={handleChange} required min="1" />
                </div>
                <button type="submit" disabled={loading} className="button-submit">
                    {loading ? 'Saving...' : (false ? 'Update Class' : 'Create Class')} {/* Update for editMode */}
                </button>
            </form>
        </div>
    );
}

export default AdminClassForm;