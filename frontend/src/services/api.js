import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api'; // Your backend URL

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add JWT token to requests
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// --- Auth Services ---
export const register = (userData) => apiClient.post('/auth/register', userData);
export const login = (credentials) => apiClient.post('/auth/login', credentials);

// --- Class Services ---
export const getUpcomingClasses = () => apiClient.get('/classes'); // Public
export const adminGetAllClasses = () => apiClient.get('/classes/admin'); // Admin
export const adminCreateClass = (classData) => apiClient.post('/classes', classData); // Admin
export const adminCancelClass = (classId) => apiClient.patch(`/classes/${classId}/cancel`); // Admin
export const adminGetClassSignups = (classId) => apiClient.get(`/classes/${classId}/signups`); // Admin
// Add adminUpdateClass if you implement it

// --- Booking Services ---
export const studentBookClass = (classId) => apiClient.post('/bookings', { class_id: classId }); // Student
export const studentGetMyBookings = () => apiClient.get('/bookings/mine'); // Student
// Add studentCancelBooking if you implement it

export default apiClient;