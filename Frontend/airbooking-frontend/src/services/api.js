// src/services/api.js
import axios from 'axios';

// CORRECT: No trailing slash to avoid double slashes
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
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
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Flight services
export const flightService = {
  searchFlights: (params) => api.get('/flights/search/', { params }).then(response => {
    // Normalize the response structure
    if (response.data && Array.isArray(response.data)) {
      return response;
    } else if (response.data && response.data.results && Array.isArray(response.data.results)) {
      // If paginated, return the results array
      return { ...response, data: response.data.results };
    } else {
      console.warn('Unexpected flights response structure, returning empty array');
      return { ...response, data: [] };
    }
  }),
  getFlight: (id) => api.get(`/flights/${id}/`),
};

// Booking services
// src/services/api.js - Update bookingService
export const bookingService = {
  createBooking: async (bookingData) => {
    try {
      console.log('Sending booking data:', bookingData);

      const response = await axios.post(`${API_BASE_URL}/bookings/create/`, bookingData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      });

      console.log('Booking response:', response.data);
      return { success: true, data: response.data };

    } catch (error) {
      console.error('Booking API error:', error);

      const errorMessage = error.response?.data?.error ||
                          error.response?.data?.message ||
                          error.response?.data?.detail ||
                          (typeof error.response?.data === 'object' ? JSON.stringify(error.response.data) : 'Booking failed. Please try again.');

      return {
        success: false,
        error: errorMessage,
        status: error.response?.status,
        data: error.response?.data
      };
    }
  },

  getUserBookings: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/bookings/`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get bookings error:', error);
      return {
        success: false,
        error: 'Failed to load bookings'
      };
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