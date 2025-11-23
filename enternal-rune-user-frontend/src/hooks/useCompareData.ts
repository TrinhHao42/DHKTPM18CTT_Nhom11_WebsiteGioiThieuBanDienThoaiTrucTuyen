'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Product } from '@/types/Product'
import { CommentsPageResponse } from '@/types/Comment'
import { ProductService } from '@/services/productService'
import { CommentService } from '@/services/commentService'

export const useCompareData = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [compareProducts, setCompareProducts] = useState<Product[]>([])
  const [commentData, setCommentData] = useState<Map<string, CommentsPageResponse>>(new Map())
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

      setCompareProducts(compareTargets)

      // 4. Lấy comment data cho tất cả sản phẩm
      await fetchCommentData([product, ...compareTargets])
    } catch (err) {
      console.error('Error fetching compare data:', err)
      setError('Không thể tải dữ liệu so sánh. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const fetchCommentData = async (products: Product[]) => {
    try {
      const commentPromises = products.map(async (product) => {
        try {
          const comments = await CommentService.getComments(product.prodId, 1, 1) // Chỉ lấy page đầu với 1 comment để có averageRating
          return { productId: product.prodId, data: comments }
        } catch (error) {
          console.error(`Error fetching comments for product ${product.prodId}:`, error)
          return { productId: product.prodId, data: null }
        }
      })

      const commentResults = await Promise.all(commentPromises)

      const newCommentData = new Map<string, CommentsPageResponse>()
      commentResults.forEach(({ productId, data }) => {
        if (data) {
          newCommentData.set(productId, data)
        }
      })

      setCommentData(newCommentData)
    } catch (error) {
      console.error('Error fetching comment data:', error)
    }
  }

  const getCurrentPrice = (product: Product): number => {
    return product.productPrices?.[0]?.ppPrice || 0
  }

  const getAllSpecKeys = (): string[] => {
    if (!selectedProduct?.prodSpecs) return []
    return Object.keys(selectedProduct.prodSpecs)
  }

  return {
    selectedProduct,
    compareProducts,
    commentData,
    loading,
    error,
    getCurrentPrice,
    getAllSpecKeys,
    fetchCompareData
  }
}