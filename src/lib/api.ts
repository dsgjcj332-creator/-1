import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor: attach JWT token from localStorage
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('alasaree_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 (unauthorized) globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage and optionally redirect
      localStorage.removeItem('alasaree_token');
      localStorage.removeItem('alasaree_user');
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Helper to store auth token after login/register
 */
export function setAuthToken(token: string, user: any): void {
  localStorage.setItem('alasaree_token', token);
  localStorage.setItem('alasaree_user', JSON.stringify(user));
}

/**
 * Helper to clear auth data on logout
 */
export function clearAuthData(): void {
  localStorage.removeItem('alasaree_token');
  localStorage.removeItem('alasaree_user');
}

/**
 * Get stored user from localStorage
 */
export function getStoredUser(): any {
  try {
    const raw = localStorage.getItem('alasaree_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default api;