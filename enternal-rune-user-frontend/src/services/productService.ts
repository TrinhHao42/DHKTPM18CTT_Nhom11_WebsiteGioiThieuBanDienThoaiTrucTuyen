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
  page?: number
  size?: number
}

export class ProductService {
  /**
   * Gọi API filter products từ backend
   */
  static async getFilteredProducts(params: FilterParams): Promise<Product[]> {
    try {
      const response = await AxiosInstance.get<Product[]>(API_ROUTES.PRODUCTS_FILTER, {
        params: {
          brands: params.brands?.join(','),
          priceRange: params.priceRange?.join(','),
          colors: params.colors?.join(','),
          memory: params.memory?.join(','),
          page: params.page || 0,
          size: params.size || 20
        }
      })
      
  // Backend may return a paginated response (Page) or a raw array.
  // If it's paginated, the array of items is in `response.data.content`.
  const maybeArray = response.data as Product[]
  if (Array.isArray(maybeArray)) return maybeArray

  const maybePage = response.data as { content?: Product[] }
  if (maybePage && Array.isArray(maybePage.content)) return maybePage.content!

  return []
    } catch (error) {
      console.error('Error fetching filtered products:', error)
      throw new Error('Không thể tải danh sách sản phẩm. Vui lòng thử lại.')
    }
  }

  /**
   * Fetch a single product by id from the backend (uses active-price endpoint)
   */
  static async getProductById(id: string | number): Promise<Product | null> {
    try {
      // API_ROUTES.PRODUCTS_BY_ID is a function
  const url = `/products/${id}/active-price`
      const response = await AxiosInstance.get<Product>(url)
      // response.data should be a single Product object
      return response.data as Product
    } catch (error) {
      console.error('Error fetching product by id:', error)
      return null
    }
  }
}