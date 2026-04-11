import axios from 'axios';

// Local dev  → set in .env.local  → VITE_API_URL=http://localhost:5000
// VPS prod   → set in .env.production → VITE_API_URL=https://booking.upliftsportsarena.com
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add authorization interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (stored as 'userToken' in Login.jsx)
    const token = localStorage.getItem('userToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token added to request');
    } else {
      console.warn('No userToken found in localStorage');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
