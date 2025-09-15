import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// We'll set up interceptors later to avoid circular dependency
let storeReference: any = null;

// Function to set store reference after store is created
export const setStoreReference = (store: any) => {
  storeReference = store;
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (storeReference) {
      const state = storeReference.getState();
      const token = state.auth.token;
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry && storeReference) {
      originalRequest._retry = true;
      
      const state = storeReference.getState();
      const refreshToken = state.auth.refreshToken;
      
      if (refreshToken) {
        try {
          // Dynamic import to avoid circular dependency
          const { refreshAccessToken } = await import('@/store/slices/authSlice');
          await storeReference.dispatch(refreshAccessToken(refreshToken));
          const newToken = storeReference.getState().auth.token;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          const { logout } = await import('@/store/slices/authSlice');
          storeReference.dispatch(logout());
          if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
          return Promise.reject(refreshError);
        }
      } else {
        const { logout } = await import('@/store/slices/authSlice');
        storeReference.dispatch(logout());
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;