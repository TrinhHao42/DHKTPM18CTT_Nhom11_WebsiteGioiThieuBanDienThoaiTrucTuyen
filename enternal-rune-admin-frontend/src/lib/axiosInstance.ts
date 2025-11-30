import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',

  },
});

// ✅ Thêm interceptor để tự động gửi token
axiosInstance.interceptors.request.use(
  (config) => {
    // Luôn thêm token nếu có (cho tất cả các request)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token')  // ⚠️ Admin dùng admin_token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// ✅ Thêm interceptor để xử lý response errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Redirect khi gặp lỗi 401 (Unauthorized)
    if (error.response?.status === 401) {
      // Token expired hoặc invalid
      if (typeof window !== 'undefined') {
        console.warn('⚠️ Token expired or invalid, redirecting to login...')
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_user')
        localStorage.removeItem('admin_roles')
        window.location.href = '/auth/sign-in'
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance;
