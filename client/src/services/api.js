import axios from 'axios';

// Axios instance với base URL từ BE (giả sử BE chạy trên localhost:3000)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // lấy từ biến môi trường
  headers: {
    'Content-Type': 'application/json',
  },
});


// Interceptor để thêm token vào header nếu có
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor để handle response errors (e.g., 401 logout)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Logout nếu token hết hạn
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;