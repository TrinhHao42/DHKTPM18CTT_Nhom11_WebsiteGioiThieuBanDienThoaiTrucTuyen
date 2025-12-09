'use client'

import React from 'react'
import Image from 'next/image'
import { ArrowRight, Sparkles, Shield, Truck } from 'lucide-react'
import { useRouter } from 'next/navigation'

const HeroBanner = () => {
  const router = useRouter()
  return (
    <section className="px-10 md:px-20 relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Background Decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000" />
      </div>

      <div className="relative container mx-auto px-4 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-medium shadow-lg">
              <Sparkles className="w-4 h-4" />
              <span>Sản phẩm mới nhất 2025</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  Điện thoại
                </span>{' '}
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Chính hãng
                </span>
                <br />
                <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  Giá tốt nhất
                </span>
              </h1>

              <p className="text-base md:text-lg text-gray-600 max-w-lg leading-relaxed">
                Khám phá bộ sưu tập điện thoại thông minh mới nhất từ các thương hiệu hàng đầu với ưu đãi đặc biệt và dịch vụ tận tâm.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-xs">Bảo hành</p>
                  <p className="text-xs text-gray-500">12 tháng</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Truck className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-xs">Miễn phí</p>
                  <p className="text-xs text-gray-500">Giao hàng</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-xs">Chính hãng</p>
                  <p className="text-xs text-gray-500">100%</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => router.push('/ProductListScreen')}
                className="cursor-pointer group bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
                <span>Mua ngay</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => router.push('/ProductListScreen')}
                className="cursor-pointer group bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-all duration-300 flex items-center justify-center gap-2">
                <span>Xem sản phẩm</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 pt-2">
              <div className="text-center">
                <p className="text-xl md:text-2xl font-bold text-blue-600">1000+</p>
                <p className="text-xs text-gray-500">Sản phẩm</p>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div className="text-center">
                <p className="text-xl md:text-2xl font-bold text-blue-600">50k+</p>
                <p className="text-xs text-gray-500">Khách hàng</p>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div className="text-center">
                <p className="text-xl md:text-2xl font-bold text-blue-600">99%</p>
                <p className="text-xs text-gray-500">Hài lòng</p>
              </div>
            </div>
          </div>

          {/* Right Content - Product Showcase */}
          <div className="relative">
            {/* Main Product Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl transform rotate-6 scale-105 opacity-20" />
              <div className="relative bg-white rounded-3xl p-6 shadow-2xl border border-gray-100">
                <Image
                  src="https://skiesandscopes.com/wp-content/uploads/2023/11/iPhone-15-Pro-Max-Astrophotography-800x800.webp"
                  alt="iPhone mới nhất"
                  width={280}
                  height={350}
                  className="w-full h-full object-cover"
                  priority
                />

                {/* Floating Price Tag */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2.5 rounded-2xl shadow-lg transform rotate-12">
                  <p className="text-sm font-medium">Giảm 20%</p>
                  <p className="text-lg font-bold">15.999.000₫</p>
                </div>

                {/* Floating Features */}
                <div className="absolute -left-4 top-1/4 bg-white p-3.5 rounded-2xl shadow-xl border border-gray-100 max-w-44">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Còn hàng</p>
                      <p className="text-xs text-gray-500">Giao ngay trong ngày</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-7 bottom-1/4 bg-white p-3.5 rounded-2xl shadow-xl border border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-5 h-5 bg-blue-500 rounded-full border-2 border-white" />
                      ))}
                    </div>
                    <div className="ml-2">
                      <p className="text-sm font-semibold text-gray-900">4.9/5</p>
                      <p className="text-xs text-gray-500">2.3k đánh giá</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroBanner