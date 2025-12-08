/**
 * ProductService.ts
 * API service để gọi backend filter products
 */

import AxiosInstance from '@/configs/AxiosInstance'
import { API_ROUTES } from '@/router/router'
import { Product } from '@/types/Product'

export interface FilterParams {
  brands?: number[]
  priceRange?: string[]
  colors?: string[]
  memory?: string[]
  search?: string
  page?: number
  size?: number
}

export class ProductService {
  /**
   * Gọi API filter products từ backend
   */
  static async getFilteredProducts(params: FilterParams): Promise<Product[]> {
    try {
      const response = await AxiosInstance.get(API_ROUTES.PRODUCTS_FILTER, {
        params: {
          brands: params.brands?.join(','),
          priceRange: params.priceRange?.join(','),
          colors: params.colors?.join(','),
          memory: params.memory?.join(','),
          search: params.search,
          page: params.page || 0,
          size: params.size || 20
        }
      })
      
      // Backend trả về một Page object với structure: { content: Product[], ... }
      const data = response.data
      
      // Kiểm tra nếu response có structure của Page object
      if (data && typeof data === 'object' && Array.isArray(data.content)) {
        return data.content as Product[]
      }
      
      // Fallback: nếu trực tiếp là array
      if (Array.isArray(data)) {
        return data as Product[]
      }

      return []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error fetching filtered products:', error)
      
      // Cung cấp thông tin lỗi chi tiết hơn
      if (error.response) {
        // Server responded with error status
        const status = error.response.status
        const message = error.response.data?.message || 'Lỗi từ server'
        throw new Error(`Lỗi ${status}: ${message}`)
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.')
      } else {
        // Something else happened
        throw new Error(`Lỗi không xác định: ${error.message}`)
      }
    }
  }

  /**
   * Fetch a single product by id from the backend (uses active-price endpoint)
   */
  static async getProductById(id: string | number): Promise<Product | null> {
    try {
      const url = `/products/${id}/active-price`
      const response = await AxiosInstance.get<Product>(url)
      
      // response.data should be a single Product object
      if (response.data && typeof response.data === 'object') {
        return response.data as Product
      }
      
      return null
    } catch (error: unknown) {
      console.error(`Error fetching product ${id}:`, error)
      
      // Có thể throw error hoặc return null tùy theo requirement
      // Hiện tại return null để không break UI
      return null
    }
  }
}