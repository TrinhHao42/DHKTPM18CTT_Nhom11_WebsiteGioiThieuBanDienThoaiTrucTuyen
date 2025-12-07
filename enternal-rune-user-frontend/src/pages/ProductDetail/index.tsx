'use client'
import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import ProductImageGallery from '@/pages/ProductDetail/ProductImageGallery'
import ProductInfoPanel from '@/pages/ProductDetail/ProductInfoPanel'
import SpecificationsSection from '@/pages/ProductDetail/SpecificationsSection'
import { Product } from '@/types/Product'
import { renderBestSellers } from '../Home/components/ProductList'
import { ProductService, FilterParams } from '@/services/productService'
import ProductRating from '@/components/ProductRating'
import { Image } from '@/types/Image'
import { CommentService } from '@/services/commentService'
import { CommentsPageResponse } from '@/types/Comment'

const RelatedProducts = React.memo(function RelatedProducts({ product }: { product?: Product }) {
  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true

    // Only load once per product (product.prodId as dependency) or if brand changes
    if (!product) return
    setLoading(true)

    const brandId = product?.prodBrand?.brandId

    const params: FilterParams = { page: 0, size: 4 }
    if (brandId) params.brands = [brandId]

    ProductService.getFilteredProducts(params)
      .then(data => {
        if (mounted && data) {
          setItems(data)
        }
      })
      .catch((err) => { console.error('Error loading related products:', err) })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => { mounted = false }
  }, [product])

  if (!product) return null

  if (loading) {
    return <div className="pt-6 text-center py-6">Đang tải sản phẩm liên quan...</div>
  }

  if (!items || items.length === 0) {
    return (
      <div className="pt-6 text-center py-6 text-gray-500">Không có sản phẩm liên quan</div>
    )
  }

  return (
    <div className="pt-6">
      {renderBestSellers(items, true)}
    </div>
  )
})

export default function ProductDetail() {
  const params = useParams()
  const [product, setProduct] = useState<Product | undefined>()
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedImage, setSelectedImage] = useState<Image | undefined>(undefined)

  // State để quản lý comments data
  const [commentsData, setCommentsData] = useState<CommentsPageResponse | null>(null)
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [commentsLoadingMore, setCommentsLoadingMore] = useState(false)
  const [commentsInitialized, setCommentsInitialized] = useState(false)

  // Functions để thay thế useComments hook
  const loadComments = useCallback(async (page = 0, append = false) => {
    try {
      if (!append) setCommentsLoading(true)
      const data = await CommentService.getComments(params?.id as string, page, 10)

      if (append && commentsData) {
        setCommentsData({
          ...data,
          comments: [...commentsData.comments, ...data.comments]
        })
      } else {
        setCommentsData(data)
      }

      // ✅ Mark as initialized after first successful load
      if (!append) setCommentsInitialized(true)
    } catch (error) {
      console.error('Error loading comments:', error)
    } finally {
      setCommentsLoading(false)
      setCommentsLoadingMore(false)
    }
  }, [params?.id, commentsData])

  const loadMoreComments = useCallback(async () => {
    if (!commentsData?.hasNext || commentsLoadingMore) return

    setCommentsLoadingMore(true)
    const nextPage = commentsData.currentPage + 1
    await loadComments(nextPage, true)
  }, [commentsData, commentsLoadingMore, loadComments])

  const refreshComments = useCallback(() => {
    loadComments(0, false)
  }, [loadComments])

  // Load comments chỉ khi ProductRating component được render và cần data
  useEffect(() => {
    // ✅ Load comments chỉ một lần khi product được load
    if (product && !commentsInitialized && !commentsLoading) {
      loadComments()
    }
  }, [product, commentsInitialized, commentsLoading, loadComments])

  useEffect(() => {
    const id = params?.id as string | undefined
    if (!id) {
      setError('ID sản phẩm không hợp lệ')
      setLoading(false)
      return
    }

    let mounted = true
    setLoading(true)
    ProductService.getProductById(id)
      .then(p => {
        if (!mounted) return
        if (!p) setError('Sản phẩm không tồn tại')
        setProduct(p || undefined)
        // Set initial selected color
        if (p?.prodColor && p.prodColor.length > 0) {
          setSelectedColor(p.prodColor[0])
          setSelectedImage(p.images[0])
        }
      })
      .catch(err => {
        console.error(err)
        if (!mounted) return
        setError(err instanceof Error ? err.message : 'Lỗi khi tải sản phẩm')
      })
      .finally(() => {
        if (!mounted) return
        setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [params?.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải sản phẩm...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy sản phẩm</h1>
          <p className="text-gray-600 mb-8">{error || 'Sản phẩm không tồn tại'}</p>
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    )
  }

  const handleColorChange = (color: string) => {
    setSelectedColor(color)
    const colorIndex = product.prodColor.indexOf(color)
    setSelectedImage(product.images[colorIndex])
  }

  const images = product?.images?.map(img => img.imageData) || ['/images/iphone.png']

  // Chuyển đổi prodSpecs từ product sang định dạng phù hợp cho SpecificationsSection
  const getSpecificationsForDisplay = (prodSpecs?: { [key: string]: string | number | boolean }) => {
    if (!prodSpecs) return {}

    const displayMap: { [key: string]: string } = {
      screenSize: 'Kích thước màn hình',
      displayTech: 'Công nghệ màn hình',
      resolution: 'Độ phân giải',
      displayFeatures: 'Tính năng màn hình',
      rearCamera: 'Camera sau',
      frontCamera: 'Camera trước',
      chipset: 'Chipset',
      cpuType: 'Loại CPU',
      ram: 'RAM',
      storage: 'Bộ nhớ trong',
      battery: 'Pin',
      os: 'Hệ điều hành',
      th_sim: 'SIM',
      nfcTech: 'Công nghệ NFC',
      cm_bin: 'Cảm Biến'
    }

    const specifications: Record<string, string> = {}

    Object.entries(prodSpecs).forEach(([key, value]) => {
      const displayKey = displayMap[key] || key
      const displayValue = String(value)
      specifications[displayKey] = displayValue
    })

    return specifications
  }

  const specifications = getSpecificationsForDisplay(product?.prodSpecs)

  return (
    <div className="container mx-auto px-20 py-6">
      <div className="container mx-auto py-2">
        <nav className="text-sm breadcrumbs">
          <ul className="flex items-center space-x-2 text-gray-600">
            <li><Link href="/" className="hover:text-blue-600">Trang chủ</Link></li>
            <li><span className="mx-2">/</span></li>
            <li><Link href="/products" className="hover:text-blue-600">Sản phẩm</Link></li>
            <li><span className="mx-2">/</span></li>
            <li className="text-gray-800">{product.prodName}</li>
          </ul>
        </nav>
      </div>
      <div className="grid lg:grid-cols-2 gap-8 pt-2 pb-6">
        <ProductImageGallery
          images={images}
          product={product}
          selectedColorIndex={product.prodColor?.indexOf(selectedColor) ?? 0}
          onImageSelect={(index) => {
            if (product.prodColor && product.prodColor[index]) {
              setSelectedColor(product.prodColor[index])
            }
          }}
        />
        <ProductInfoPanel
          product={product}
          selectedColor={selectedColor}
          selectedImage={selectedImage}
          onColorChange={handleColorChange}
          commentData={commentsData || undefined}
        />
      </div>
      {/* Hiển thị thông số kỹ thuật */}
      {product.prodSpecs && Object.keys(product.prodSpecs).length > 0 ? (
        <SpecificationsSection specifications={specifications} />
      ) : (
        <div className="w-full bg-gray-50 rounded-2xl p-8 text-center">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
          <p className="text-gray-500 mt-4">Đang tải thông tin sản phẩm...</p>
        </div>
      )}

      {/* Product Rating & Comments */}
      <div className="mt-12">
        <ProductRating
          productId={product.prodId.toString()}
          externalCommentsData={commentsData}
          externalSetCommentsData={setCommentsData}
          externalLoading={commentsLoading}
          externalLoadingMore={commentsLoadingMore}
          externalLoadMoreComments={loadMoreComments}
          externalRefreshComments={refreshComments}
          productInfo={{ prodId: product.prodId, prodName: product.prodName }}
        />
      </div>

      <RelatedProducts product={product} />
    </div>
  )
}

