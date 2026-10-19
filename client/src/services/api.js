import axios from 'axios';
import { emitToast } from '../utils/toastBus';

const api = axios.create({
  // Falls back to the local server only in `vite dev`; production builds must set VITE_API_URL.
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : undefined),
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('finsight_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Wrong credentials on these endpoints are a normal 401, not an expired session.
const AUTH_PATHS = ['/auth/login', '/auth/register'];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url ?? '';

    if (status === 401 && !AUTH_PATHS.some((p) => url.startsWith(p))) {
      localStorage.removeItem('finsight_token');
      localStorage.removeItem('finsight_user');
      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    } else if (status >= 500) {
      error.toastShown = true;
      emitToast('Server error. Please try again later.', 'error');
    } else if (!error.response && error.code !== 'ERR_CANCELED') {
      error.toastShown = true;
      emitToast('Cannot reach the server. Check your connection.', 'error');
    }

    return Promise.reject(error);
  }
);

export default api;
