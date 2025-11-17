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
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
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
AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
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