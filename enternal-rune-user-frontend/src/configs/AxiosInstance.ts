import axios from 'axios'

const BACK_END_URL = process.env.BACK_END_URL || 'http://localhost:8080'

const AxiosInstance = axios.create({
  baseURL: BACK_END_URL,
  timeout: 30000, // 30s cho các thao tác phức tạp
  headers: {
    'Content-Type': 'application/json',
  },
})

// ✅ Thêm interceptor để tự động gửi token
AxiosInstance.interceptors.request.use(
  (config) => {
    // Luôn thêm token nếu có (cho tất cả các request)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    
    // Handle multipart/form-data requests
    if (config.data instanceof FormData) {
      // Remove Content-Type header to let Axios set multipart/form-data with boundary
      delete config.headers['Content-Type']
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// ✅ Thêm interceptor để xử lý response errors
AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Redirect khi gặp lỗi 401 (Unauthorized)
    if (error.response?.status === 401) {
      // Token expired hoặc invalid
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/LoginScreen'
      }
    }
    return Promise.reject(error)
  }
)

export default AxiosInstance