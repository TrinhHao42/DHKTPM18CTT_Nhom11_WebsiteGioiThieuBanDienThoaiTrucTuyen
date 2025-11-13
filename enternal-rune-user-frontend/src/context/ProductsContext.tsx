"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { Product } from "@/types/Product"
import AxiosInstance from "@/configs/AxiosInstance"
import { API_ROUTES } from '@/router/router'

type ProductsContextType = {
    products: Product[],
    productLatest: Product[],
    loading: boolean
    error: string | null
    refetch: () => void
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
    const [products, setProducts] = useState<Product[]>([])
    const [productLatest, setProductLatest] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchProducts = async () => {
        setLoading(true)
        setError(null)

        try {
            console.log('🔄 [ProductsContext] Fetching products from:', API_ROUTES.PRODUCTS_TOP_BRAND)
            const productsRes = await AxiosInstance.get(API_ROUTES.PRODUCTS_TOP_BRAND)
            console.log('✅ [ProductsContext] Response status:', productsRes.status)
            console.log('✅ [ProductsContext] Response data:', productsRes.data)
            
            if (!productsRes || productsRes.status !== 200) {
                throw new Error("Không thể tải dữ liệu sản phẩm.")
            }

            // Xử lý response format linh hoạt: có thể là array hoặc object có content
            let productsData = productsRes.data
            if (!Array.isArray(productsData)) {
                if (productsData?.content && Array.isArray(productsData.content)) {
                    productsData = productsData.content
                } else if (productsData?.data && Array.isArray(productsData.data)) {
                    productsData = productsData.data
                } else {
                    console.warn('⚠️ [ProductsContext] Unexpected response format:', productsData)
                    productsData = []
                }
            }
            console.log('✅ [ProductsContext] Products to set:', productsData.length, 'items')
            setProducts(productsData)

            console.log('🔄 [ProductsContext] Fetching latest products from:', API_ROUTES.PRODUCTS_LATEST)
            const productLatestRes = await AxiosInstance.get(API_ROUTES.PRODUCTS_LATEST)
            console.log('✅ [ProductsContext] Latest response status:', productLatestRes.status)
            console.log('✅ [ProductsContext] Latest response data:', productLatestRes.data)
            
            // Xử lý response format linh hoạt
            let latestData = productLatestRes.data
            if (!Array.isArray(latestData)) {
                if (latestData?.content && Array.isArray(latestData.content)) {
                    latestData = latestData.content
                } else if (latestData?.data && Array.isArray(latestData.data)) {
                    latestData = latestData.data
                } else {
                    console.warn('⚠️ [ProductsContext] Unexpected latest response format:', latestData)
                    latestData = []
                }
            }
            console.log('✅ [ProductsContext] Latest products to set:', latestData.length, 'items')
            setProductLatest(latestData)
        } catch (err: any) {
            console.error("❌ [ProductsContext] Error fetching products:", err)
            console.error("❌ [ProductsContext] Error details:", {
                message: err?.message,
                response: err?.response?.data,
                status: err?.response?.status,
                url: err?.config?.url
            })
            setError(err instanceof Error ? err.message : "Lỗi không xác định khi tải dữ liệu")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    return (
        <ProductsContext.Provider value={{ products, productLatest, loading, error, refetch: fetchProducts }}>
            {children}
        </ProductsContext.Provider>
    )
}

// Custom hook
export const useProducts = (): ProductsContextType => {
    const context = useContext(ProductsContext)
    if (!context) throw new Error("useProducts phải được sử dụng trong ProductsProvider")
    return context
}

export default ProductsContext
