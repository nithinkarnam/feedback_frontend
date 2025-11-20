import axios from 'axios'
import { getToken, removeToken } from '../utils/token'

const api = axios.create({
  baseURL: '/api' // proxied to backend via Vite dev server (see vite.config.js)
})

// Attach token
api.interceptors.request.use(cfg => {
  const t = getToken()
  if (t) cfg.headers.Authorization = `Bearer ${t}`
  return cfg
})

// Response interceptor to handle 401 globally
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response && err.response.status === 401) {
      // clear token and reload to force login
      removeToken()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
