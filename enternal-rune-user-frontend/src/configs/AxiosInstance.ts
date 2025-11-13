import axios from 'axios'

const BACK_END_URL = process.env.BACK_END_URL || 'http://localhost:8080'

const AxiosInstance = axios.create({
  baseURL: BACK_END_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default AxiosInstance