import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dev_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Global error handler — redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('dev_token')
      localStorage.removeItem('dev_admin')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
