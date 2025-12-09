'use client'

import { useState, useEffect, useRef } from 'react'
import { getUserOrders } from '@/services/checkoutService'
import { useAuth } from '@/context/AuthContext'

interface UseHasPurchasedProductProps {
  productId: string | number
  productName?: string // Tên sản phẩm để so sánh
}

export function useHasPurchasedProduct({ productId, productName }: UseHasPurchasedProductProps) {
  const { user } = useAuth()
  const [hasPurchased, setHasPurchased] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Cache để tránh gọi API nhiều lần cho cùng user và product
  const lastCheckedRef = useRef<{
    userId: number | null
    productId: string | number | null
    productName: string | null
    result: boolean
    timestamp: number
  }>({ userId: null, productId: null, productName: null, result: false, timestamp: 0 })

  useEffect(() => {
    // Cache thời gian (5 phút)
    const CACHE_DURATION = 5 * 60 * 1000
    const checkPurchaseStatus = async () => {
      if (!user?.userId || !productId) {
        setHasPurchased(false)
        lastCheckedRef.current = { userId: null, productId: null, productName: null, result: false, timestamp: 0 }
        return
      }

      // Nếu đã check cho user và product này rồi và cache chưa hết hạn, không check lại
      const now = Date.now()
      const cached = lastCheckedRef.current
      if (cached.userId === user.userId && 
          cached.productId === productId &&
          cached.productName === productName &&
          (now - cached.timestamp) < CACHE_DURATION) {
        setHasPurchased(cached.result)
        return
      }

      setIsLoading(true)
      
      try {
        // Lấy tất cả orders của user (có thể cần phân trang nếu user có nhiều order)
        const ordersResponse = await getUserOrders(user.userId, 0, 100)
        
        if (!ordersResponse?.content) {
          setHasPurchased(false)
          lastCheckedRef.current = { userId: user.userId, productId, productName: productName || null, result: false, timestamp: Date.now() }
          return
        }

        // Kiểm tra xem có order nào chứa product này và đã PAID không
        const hasPurchasedProduct = ordersResponse.content.some((order: unknown) => {
          const orderData = order as {
            currentPaymentStatus?: { statusCode?: string }
            orderDetails?: Array<{
              productVariantResponse?: {
                variantId?: number | string
                variantName?: string
                // Thêm các field khác có thể chứa product ID
                prodId?: number | string
                productId?: number | string
              }
              prodId?: number | string
              productId?: number | string
            }>
          }
          
          // Chỉ check những order đã thanh toán thành công
          if (orderData?.currentPaymentStatus?.statusCode !== "PAID") {
            return false
          }

          // Kiểm tra trong orderDetails có chứa sản phẩm này không
          return orderData?.orderDetails?.some((detail) => {
            const variantName = detail?.productVariantResponse?.variantName
            
            // Thử so sánh theo ID trước
            const possibleProductIds = [
              detail?.productVariantResponse?.prodId,
              detail?.productVariantResponse?.productId,
              detail?.productVariantResponse?.variantId, // Có thể variant ID chính là product ID
              detail?.prodId,
              detail?.productId
            ].filter(id => id !== undefined && id !== null)
            
            // Kiểm tra theo ID
            const hasIdMatch = possibleProductIds.some(itemProductId => {
              const matchesString = itemProductId.toString() === productId.toString()
              const matchesNumber = Number(itemProductId) === Number(productId)
              const matchesLoose = itemProductId == productId
              
              return matchesString || matchesNumber || matchesLoose
            })
            
            // Nếu không match theo ID, thử so sánh theo tên
            let hasNameMatch = false
            if (!hasIdMatch && variantName) {
              // Thử so sánh với productName trước (nếu có)
              if (productName) {
                const directNameMatch = variantName.toLowerCase().trim() === productName.toLowerCase().trim()
                const containsMatch = variantName.toLowerCase().includes(productName.toLowerCase()) ||
                                     productName.toLowerCase().includes(variantName.toLowerCase())
                
                if (directNameMatch || containsMatch) {
                  hasNameMatch = true
                }
              }
              
              // Nếu vẫn chưa match, thử so sánh với productId (có thể productId là tên)
              if (!hasNameMatch) {
                const productIdStr = productId.toString()
                const directIdNameMatch = variantName.toLowerCase().trim() === productIdStr.toLowerCase().trim()
                const containsIdMatch = variantName.toLowerCase().includes(productIdStr.toLowerCase()) ||
                                       productIdStr.toLowerCase().includes(variantName.toLowerCase())
                
                if (directIdNameMatch || containsIdMatch) {
                  hasNameMatch = true
                }
              }
            }
            
            return hasIdMatch || hasNameMatch
          })
        })
        
        setHasPurchased(hasPurchasedProduct)
        lastCheckedRef.current = { 
          userId: user.userId, 
          productId, 
          productName: productName || null,
          result: hasPurchasedProduct,
          timestamp: Date.now()
        }
        
      } catch (error) {
        console.error("Error checking purchase status:", error)
        setHasPurchased(false)
        lastCheckedRef.current = { userId: user.userId, productId, productName: productName || null, result: false, timestamp: Date.now() }
      } finally {
        setIsLoading(false)
      }
    }

    checkPurchaseStatus()
  }, [user?.userId, productId, productName])

  return { hasPurchased, isLoading }
}