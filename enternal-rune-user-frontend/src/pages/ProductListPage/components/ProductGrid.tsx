import React from 'react'
import { Product } from '@/types/Product'
import ProductCard from '../../../components/ProductCard'
import { useProductList } from '@/context/ProductListContext'
import { ProductGridSkeleton } from '@/components/LoadingSkeleton'

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  const { isLoading, error } = useProductList()

  // Loading state
  if (isLoading) {
    return <ProductGridSkeleton count={6} />
  }

  // Error state
  if (error) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-20">
        <div className="text-red-400 mb-4">
          <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-red-700 mb-2">Có lỗi xảy ra</h3>
        <p className="text-red-500 text-center">{error}</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-20">
        <div className="text-gray-400 mb-4">
          <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Không tìm thấy sản phẩm</h3>
        <p className="text-gray-500">Vui lòng thử điều chỉnh bộ lọc của bạn</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.prodId} product={product} />
      ))}
    </div>
  )
}
