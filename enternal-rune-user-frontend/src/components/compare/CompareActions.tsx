'use client'

import Link from 'next/link'
import { Product } from '@/types/Product'

interface CompareActionsProps {
  products: Product[]
}

export const CompareActions = ({ products }: CompareActionsProps) => {
  return (
    <div className={`grid ${products.length === 1 ? 'grid-cols-2' : products.length === 2 ? 'grid-cols-3' : 'grid-cols-4'} gap-0 border-t border-gray-200`}>
      {/* Empty cell for spec name column */}
      <div className="p-6 bg-gray-50 border-r border-gray-200">
        <div className="text-center">
          <h4 className="font-semibold text-gray-900 mb-2">Hành động</h4>
          <p className="text-xs text-gray-600">Chọn sản phẩm phù hợp</p>
        </div>
      </div>

      {/* Action buttons for each product */}
      {products.map((product, index) => (
        <div
          key={`actions-${product.prodId}`}
          className={`p-6 ${index > 0 ? 'border-l border-gray-200' : ''} ${index === 0 ? 'bg-blue-50/50' : 'bg-white'}`}
        >
          <div className="space-y-3">
            <Link
              href={`/products/${product.prodId}`}
              className={`block w-full text-center py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                index === 0
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Xem chi tiết
              </div>
            </Link>

            <button
              className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                index === 0
                  ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl'
                  : 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                Thêm vào giỏ
              </div>
            </button>

            {index === 0 && (
              <div className="mt-2 text-center">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Đang chọn
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}