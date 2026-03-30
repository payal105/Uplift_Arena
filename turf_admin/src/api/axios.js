import axios from 'axios';

const api = axios.create({
  // In dev, Vite proxies /api → backend (no CORS).
  // In production, set VITE_API_BASE_URL to the deployed backend URL.
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('backendToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
