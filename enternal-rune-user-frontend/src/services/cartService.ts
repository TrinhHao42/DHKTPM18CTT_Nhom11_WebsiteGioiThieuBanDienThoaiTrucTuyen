/**
 * CartService.ts
 * API service để xử lý giỏ hàng - Logic mới
 */

import AxiosInstance from '@/configs/AxiosInstance'
import { CartItem, CartResponse } from '@/types/CartItem'

// DTO request theo backend mới
interface AddToCartDTO {
  productId: number
  quantity: number
  color?: string      // Màu sắc (optional)
  storage?: string    // Dung lượng (optional)
  version?: string    // Phiên bản (optional)
}

// DTO update cart item
interface UpdateCartItemDTO {
  cartItemId: number
  quantity: number
}

export class CartService {
  /**
   * Lấy giỏ hàng của user
   * GET /cart/{userId}
   */
  static async getCart(userId: number): Promise<CartResponse> {
    try {
      const response = await AxiosInstance.get<CartResponse>(`/cart/${userId}`)
      return response.data
    } catch (error: any) {
      console.error('❌ CartService: Failed to fetch cart', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      })
      throw error
    }
  }

  /**
   * Thêm sản phẩm vào giỏ hàng
   * POST /cart/add/{userId}
   * 
   * @param userId - ID người dùng
   * @param productId - ID sản phẩm (Product ID, không phải ProductVariant ID)
   * @param quantity - Số lượng
   * @param options - Tùy chọn: { color?: string, storage?: string, version?: string }
   */
  static async addToCart(
    userId: number,
    productId: number,
    quantity: number = 1,
    options?: { color?: string; storage?: string; version?: string }
  ): Promise<CartResponse> {
    try {
      const request: AddToCartDTO = { 
        productId,
        quantity,
        color: options?.color,
        storage: options?.storage,
        version: options?.version,
      }
      
      const response = await AxiosInstance.post<CartResponse>(`/cart/add/${userId}`, request)
      
      return response.data
    } catch (error: any) {
      console.error('❌ CartService: Failed to add item to cart', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
      })
      
      const errorMsg = error.response?.data?.message || error.message || 'Không thể thêm sản phẩm vào giỏ hàng'
      throw new Error(errorMsg)
    }
  }

  /**
   * Cập nhật số lượng sản phẩm trong giỏ
   * PUT /cart/update/{userId}
   */
  static async updateCartItem(
    userId: number,
    cartItemId: number,
    quantity: number
  ): Promise<CartResponse> {
    try {
      const request: UpdateCartItemDTO = { 
        cartItemId, 
        quantity 
      }
      
      const response = await AxiosInstance.put<CartResponse>(`/cart/update/${userId}`, request)
      return response.data
    } catch (error: any) {
      console.error('❌ CartService: Failed to update cart item', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      })
      
      const errorMsg = error.response?.data?.message || error.message || 'Không thể cập nhật số lượng'
      throw new Error(errorMsg)
    }
  }

  /**
   * Xóa sản phẩm khỏi giỏ hàng
   * DELETE /cart/remove/{userId}/{cartItemId}
   */
  static async removeCartItem(userId: number, cartItemId: number): Promise<CartResponse> {
    try {
      const response = await AxiosInstance.delete<CartResponse>(
        `/cart/remove/${userId}/${cartItemId}`
      )
      
      return response.data
    } catch (error: any) {
      console.error('❌ CartService: Failed to remove cart item', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      })
      
      const errorMsg = error.response?.data?.message || error.message || 'Không thể xóa sản phẩm'
      throw new Error(errorMsg)
    }
  }

  /**
   * Xóa toàn bộ giỏ hàng
   * DELETE /cart/clear/{userId}
   */
  static async clearCart(userId: number): Promise<CartResponse> {
    try {
      const response = await AxiosInstance.delete<CartResponse>(`/cart/clear/${userId}`)
      
      return response.data
    } catch (error: any) {
      console.error('❌ CartService: Failed to clear cart', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      })
      
      const errorMsg = error.response?.data?.message || error.message || 'Không thể xóa giỏ hàng'
      throw new Error(errorMsg)
    }
  }
}
