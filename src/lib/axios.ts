import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function to get cookie value
const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;
  const cookies = document.cookie.split('; ');
  const cookie = cookies.find(c => c.startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
};

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = getCookie('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear cookies on unauthorized
      if (typeof window !== 'undefined') {
        document.cookie = 'adminToken=; max-age=0; path=/';
        document.cookie = 'admin-storage=; max-age=0; path=/';
        if (window.location.pathname.includes('/admin')) {
          window.location.href = '/admin/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
