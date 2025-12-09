'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Product } from '@/types/Product'
import { ProductService } from '@/services/productService'

export const useCompareData = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [compareProducts, setCompareProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const prodId = searchParams?.get('id')

  useEffect(() => {
    if (!prodId) {
      router.push('/')
      return
    }

    fetchCompareData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prodId, router])

  const fetchCompareData = async () => {
    try {
      setLoading(true)
      setError(null)

      // 1. Lấy sản phẩm được chọn
      const product = await ProductService.getProductById(prodId!)
      if (!product) {
        router.push('/')
        return
      }
      setSelectedProduct(product)

      // 2. Tìm tất cả sản phẩm để filter
      const allProducts = await ProductService.getFilteredProducts({
        brands: product.prodBrand ? [Number(product.prodBrand.brandId)] : undefined,
        size: 100 // Lấy nhiều để filter
      })

      // 3. Tìm sản phẩm cùng model
      const compareTargets = allProducts
        .filter(p => p.prodId !== product.prodId)
        .filter(p => p.prodModel === product.prodModel)
        .slice(0, 2)

      // 4. Load full product data for compare products (to get specs)
      const fullCompareProducts = await Promise.all(
        compareTargets.map(async (target) => {
          try {
            return await ProductService.getProductById(target.prodId.toString())
          } catch (error) {
            console.error(`Error loading product ${target.prodId}:`, error)
            return target // fallback to basic data if full data fails
          }
        })
      )

      setCompareProducts(fullCompareProducts.filter((p): p is Product => p !== null))

      // Rating data is now included in Product object, no need to fetch comments
    } catch (err) {
      console.error('Error fetching compare data:', err)
      setError('Không thể tải dữ liệu so sánh. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const getCurrentPrice = (product: Product): number => {
    // Use optimized API pricing - prioritize activePrice from ProductListResponse, then currentPrice, then fallback
    return product.activePrice || product.currentPrice || product.productPrices?.[0]?.ppPrice || 0
  }

  const getAllSpecKeys = (): string[] => {
    // Collect all unique spec keys from all products (selected + compare products)
    const allProducts = selectedProduct ? [selectedProduct, ...compareProducts] : compareProducts
    const allSpecKeys = new Set<string>()
    
    allProducts.forEach(product => {
      if (product?.prodSpecs) {
        Object.keys(product.prodSpecs).forEach(key => allSpecKeys.add(key))
      }
    })
    
    return Array.from(allSpecKeys).sort()
  }

  return {
    selectedProduct,
    compareProducts,
    loading,
    error,
    getCurrentPrice,
    getAllSpecKeys,
    fetchCompareData
  }
}