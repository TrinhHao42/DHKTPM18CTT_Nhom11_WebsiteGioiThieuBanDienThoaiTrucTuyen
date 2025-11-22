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
            const productsRes = await AxiosInstance.get(API_ROUTES.PRODUCTS_TOP_BRAND)
            
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
            setProducts(productsData)

            const productLatestRes = await AxiosInstance.get(API_ROUTES.PRODUCTS_LATEST)
            
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
            setProductLatest(latestData)
        } catch (err) {
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
