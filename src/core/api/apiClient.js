// API Client Configuration với Axios
import axios from 'axios';


// Base configuration
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://aster-camera-online-store-backend.onrender.com/api';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';


// Tạo axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor - Thêm token vào mọi request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Xử lý response và error
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper functions
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    // NestJS throws errors in format: { statusCode: 400, message: "...", error: "Bad Request" }
    // API Gateway returns error in format: { isSuccess: false, error: { message: "...", details: null } }
    const errorMessage =
      error.response.data?.error?.message ||  // API Gateway format
      error.response.data?.message ||         // NestJS direct message format
      error.response.data?.error ||           // NestJS error type
      `HTTP Error: ${error.response.status}`;

    return {
      success: false,
      message: errorMessage,
      status: error.response.status,
      data: error.response.data
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      success: false,
      message: 'Network Error: Không thể kết nối đến server',
      status: 0
    };
  } else {
    // Something else happened
    return {
      success: false,
      message: error.message || 'Unknown Error',
      status: 0
    };
  }
};

// Export configured axios instance
export default apiClient;
