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

export default api;
