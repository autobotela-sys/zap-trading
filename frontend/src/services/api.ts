import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// API endpoints
export const authAPI = {
  register: (data: { email: string; password: string; full_name?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const accountsAPI = {
  getAccounts: () => api.get('/accounts'),
  createAccount: (data: {
    nickname: string;
    api_key: string;
    api_secret: string;
    zerodha_user_id?: string;
    zerodha_password?: string;
  }) => api.post('/accounts', data),
  deleteAccount: (id: number) => api.delete(`/accounts/${id}`),
  requestToken: (id: number) => api.post(`/accounts/${id}/request-token`),
  setToken: (data: { account_id: number; request_token: string }) =>
    api.post('/accounts/set-token', data),
};

export const ordersAPI = {
  placeOrder: (data: {
    account_ids: number[];
    index: string;
    expiry: string;
    strike: string;
    option_type: string;
    lots: number;
    transaction_type: string;
    product: string;
    order_type: string;
    price?: number;
    amo: boolean;
  }) => api.post('/orders/place', data),
};

export const positionsAPI = {
  getPositions: () => api.get('/positions'),
};
