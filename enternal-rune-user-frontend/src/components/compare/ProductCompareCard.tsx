'use client'

import Image from 'next/image'
import { Product } from '@/types/Product'

import { formatPrice } from '@/lib/format'
import { Star } from 'lucide-react'

interface ProductCompareCardProps {
  product: Product
  index: number
  getCurrentPrice: (product: Product) => number
}

export const ProductCompareCard = ({
  product,
  index,
  getCurrentPrice
}: ProductCompareCardProps) => {
  // ✅ Use rating data from product response (no more individual API calls)
  const ratingsTotal = product.ratingDistribution ? Object.values(product.ratingDistribution).reduce((s, v) => s + (Number(v) || 0), 0) : (product.totalComments || 0)
  const averageRating = ratingsTotal > 0 ? (product.averageRating || product.prodRating) : 0

  const renderRating = () => (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${ratingsTotal > 0 && i <= Math.floor(averageRating)
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-200 fill-gray-200'
              }`}
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-gray-900">{averageRating.toFixed(1)}</span>
      <span className="text-gray-500 text-sm">
        ({ratingsTotal > 0 ? `${ratingsTotal.toLocaleString()} đánh giá` : 'Chưa có đánh giá'})
      </span>
    </div>
  )

  return (
    <div
      className={`relative ${index === 0 ? 'bg-gradient-to-br from-blue-50 to-indigo-50' : 'bg-gradient-to-br from-gray-50 to-white'} ${index > 0 ? 'border-l border-gray-200' : ''} border-b border-gray-200`}
    >
      {/* Product Header */}
      <div className="p-6 text-center">
        {/* Product Image */}
        <div className="relative mb-4 group">
          <div className={`p-4 rounded-2xl ${index === 0 ? 'bg-blue-100/50' : 'bg-white'} border border-gray-200 hover:shadow-lg transition-all duration-300`}>
            <Image
              src={product.primaryImageUrl || product.images?.[0]?.imageData || product.imageUrl || "/images/iphone.png"}
              alt={product.prodName}
              width={160}
              height={160}
              className="mx-auto object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Badge for selected product */}
          {index === 0 && (
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Đang chọn
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <h3 className={`text-lg font-bold mb-2 ${index === 0 ? 'text-blue-900' : 'text-gray-900'} line-clamp-2`}>
          {product.prodName}
        </h3>

        {/* Rating */}
        <div className="flex items-center justify-center gap-2 mb-3">
          {renderRating()}
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className={`text-2xl font-bold mb-1 ${index === 0 ? 'text-blue-700' : 'text-blue-600'}`}>
            {formatPrice(getCurrentPrice(product))}
          </div>
          <div className="text-sm text-gray-500">
            Giá hiện tại
          </div>
        </div>

        {/* Colors */}
        <div className="flex flex-wrap gap-2 justify-center">
          {product.prodColor?.slice(0, 3).map((color, i) => (
            <span
              key={i}
              className={`text-xs px-3 py-1 rounded-full border font-medium ${
                index === 0
                  ? 'bg-blue-100 text-blue-800 border-blue-200'
                  : 'bg-gray-100 text-gray-700 border-gray-200'
              }`}
            >
              {color}
            </span>
          ))}
          {product.prodColor && product.prodColor.length > 3 && (
            <span className="text-xs text-gray-500 px-2 py-1">
              +{product.prodColor.length - 3} màu
            </span>
          )}
        </div>
      </div>
    </div>
  )
}