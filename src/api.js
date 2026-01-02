import axios from 'axios';
import store from './store';
import router from './router';

// Flag to prevent multiple logout calls
let isLoggingOut = false;

// Base URL configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:9001/api';

// Utility function to get CSRF token from cookie
function getCsrfTokenFromCookie() {
  const name = 'csrf_token=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
}

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies (CSRF, refresh token)
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add authorization header if token exists
    const token = store.getters.accessToken;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Add CSRF token to non-GET requests
    if (config.method !== 'get') {
      const csrfToken = getCsrfTokenFromCookie();
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error is due to an invalid/expired token and we haven't tried to refresh yet
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const response = await axios.post(`${API_URL}/refresh-token`, {}, {
          withCredentials: true,
        });

        // If token refresh was successful
        if (response.status === 200) {
          // Update the token in the store
          store.commit('setAccessToken', response.data.access_token);
          
          // Update the authorization header and retry
          originalRequest.headers['Authorization'] = `Bearer ${response.data.access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh token is also invalid/expired, logout and redirect to login
        // Only dispatch logout if we're not already in the process of logging out
        if (!isLoggingOut) {
          isLoggingOut = true;
          store.dispatch('logout').finally(() => {
            isLoggingOut = false;
          });
          router.push({ name: 'login' });
        }
        return Promise.reject(refreshError);
      }
    }

    // For other errors
    return Promise.reject(error);
  }
);

// Public API endpoints (no auth required)
export const publicApi = {
  login: (email, password) => {
    return api.post('/login', { email, password });
  },
};

// Protected API endpoints (auth required)
export const protectedApi = {
  // Auth
  logout: () => {
    // Set the flag to prevent multiple calls
    isLoggingOut = true;
    return api.get('/logout').finally(() => {
      // Reset the flag when the request completes (success or failure)
      isLoggingOut = false;
    });
  },
  
  // Admin endpoints
  getAdmins: () => api.get('/admin'),
  getAdmin: (id) => api.get(`/admin/${id}`),
  updateAdmin: (id, data) => api.put(`/admin/${id}`, data),
  deleteAdmin: (id) => api.delete(`/admin/${id}`),
  
  // Member endpoints
  getMembers: () => api.get('/members'),
  getMember: (id) => api.get(`/members/${id}`),
  createMember: (data) => api.post('/members', data),
  updateMember: (id, data) => api.put(`/members/${id}`, data),
  deleteMember: (id) => api.delete(`/members/${id}`),
  
  // Loan endpoints
  getLoans: () => api.get('/loans'),
  getLoan: (id) => api.get(`/loans/${id}`),
  createLoan: (data) => api.post('/loans', data),
  updateLoan: (id, data) => api.put(`/loans/${id}`, data),
  deleteLoan: (id) => api.delete(`/loans/${id}`),

  // Payments endpoints
  getPayments: () => api.get('/payments'),
  getPayment: (id) => api.get(`/payments/${id}`),
  createPayment: (data) => api.post('/payments', data),
  updatePayment: (id, data) => api.put(`/payments/${id}`, data),
  deletePayment: (id) => api.delete(`/payments/${id}`),
  
  // Disbursements endpoints
  getDisbursements: () => api.get('/disbursements'),
  getDisbursement: (id) => api.get(`/disbursements/${id}`),
  createDisbursement: (data) => api.post('/disbursements', data),
  updateDisbursement: (id, data) => api.put(`/disbursements/${id}`, data),
  deleteDisbursement: (id) => api.delete(`/disbursements/${id}`),
  
  // Settings
  getSettings: () => api.get('/settings'),
  updateSettings: (id, data) => api.put(`/settings/${id}`, data),
};

export default api;