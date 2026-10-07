// src/services/api.js
import axios from 'axios';

// Use environment variable, fallback to localhost for local development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login if it's a 401 AND we are not already on the login page
    // (Prevents infinite redirect loops)
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// --- Services ---

// Auth services
export const authService = {
  login: async (username, password) => {
    // Using the api instance here means it automatically uses the correct base URL
    const response = await api.post('/api/auth/login/', { username, password });
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/api/auth/register/', userData);
    return response.data;
  }
};

// Flight services
export const flightService = {
  searchFlights: (params) => api.get('/flights/search/', { params }).then(response => {
    if (response.data && Array.isArray(response.data)) {
      return response;
    } else if (response.data && response.data.results && Array.isArray(response.data.results)) {
      return { ...response, data: response.data.results };
    } else {
      console.warn('Unexpected flights response structure, returning empty array');
      return { ...response, data: [] };
    }
  }),
  getFlight: (id) => api.get(`/flights/${id}/`),
};

// Booking services
export const bookingService = {
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/bookings/create/', bookingData, { timeout: 15000 });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.error ||
                          error.response?.data?.message ||
                          error.response?.data?.detail ||
                          'Booking failed. Please try again.';
      return { success: false, error: errorMessage, status: error.response?.status };
    }
  },
  getUserBookings: async () => {
    try {
      const response = await api.get('/bookings/');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: 'Failed to load bookings' };
    }
  }
};

// Admin services
export const adminService = {
  getPendingUsers: () => api.get('/admin/users/pending/'),
  approveUser: (userId, action) => api.post(`/admin/users/${userId}/approve/`, { action }),
  getFlights: () => api.get('/admin/flights/'),
  updateFlightStatus: (flightId, status) => api.put(`/admin/flights/${flightId}/status/`, { status }),
};

export default api;