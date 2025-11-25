'use client'

import React from 'react'
import Image from 'next/image'
import { TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'

const categories = [
    {
        id: 1,
        name: 'iPhone',
        description: 'Điện thoại Apple chính hãng',
        color: 'from-gray-600 to-gray-800',
        bgColor: 'bg-gray-50',
        products: '150+ sản phẩm',
        trending: true,
        image: 'https://cdn-media.sforum.vn/storage/app/media/thunguyen/y-nghia-logo-apple-2.jpg',
        brandId: 1 // Apple
    },
    {
        id: 2,
        name: 'Samsung',
        description: 'Galaxy Series mới nhất',
        color: 'from-blue-600 to-blue-800',
        bgColor: 'bg-blue-50',
        products: '200+ sản phẩm',
        trending: true,
        image: 'https://hienlaptop.com/wp-content/uploads/2024/12/logo-samsung-vector-6.png',
        brandId: 9
    },
    {
        id: 3,
        name: 'Xiaomi',
        description: 'Công nghệ tiên tiến, giá tốt',
        color: 'from-orange-500 to-orange-700',
        bgColor: 'bg-orange-50',
        products: '180+ sản phẩm',
        trending: false,
        image: 'https://cellphones.com.vn/sforum/wp-content/uploads/2021/03/Xiaomi-Mi-Logo.jpg',
        brandId: 10
    },
    {
        id: 4,
        name: 'Realme',
        description: 'Smartphone cho giới trẻ',
        color: 'from-yellow-500 to-yellow-700',
        bgColor: 'bg-yellow-50',
        products: '120+ sản phẩm',
        trending: false,
        image: 'https://crystalpng.com/wp-content/uploads/2025/05/realme_logo.png',
        brandId: 13
    },
    {
        id: 5,
        name: 'Vivo',
        description: 'Camera selfie hoàn hảo',
        color: 'from-blue-500 to-blue-700',
        bgColor: 'bg-blue-100',
        products: '90+ sản phẩm',
        trending: false,
        image: 'https://www.vivosmartphone.vn/themes/vivo/img/vivo-fb-page.png',
        brandId: 12
    },
    {
        id: 6,
        name: 'Oppo',
        description: 'RAM lớn, hệ thống tối ưu',
        color: 'from-green-500 to-green-700',
        bgColor: 'bg-green-50',
        products: '500+ sản phẩm',
        trending: true,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR71YHRC0euvSwQX0q_i-uSS4Jzxck0PbEcvMAB9ACCsRVuYI0Z4g2ANRG5UTs3VsAR3QA&usqp=CAU',
        brandId: 3
    }
]

const CategoriesSection = () => {
    const router = useRouter()
    const displayCategories = categories.slice(0, 6);

    const handleCategoryClick = (brandId: number) => {
        router.push(`/ProductListScreen?brand=${brandId}`)
    }

    return (
        <section className="py-8 lg:py-12 bg-white">
            <div className="container mx-auto px-4">
                {/* Section Header - Smaller */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                        <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Thương hiệu </span>
                        nổi bật
                    </h2>
                </div>

                {/* Categories Horizontal Scroll */}
                <div className="flex gap-4 max-w-7xl mx-auto overflow-x-auto scrollbar-hide pb-4">
                    {displayCategories.map((category, index) => (
                        <div
                            key={category.id}
                            className={`group flex-shrink-0 w-48 relative overflow-hidden rounded-2xl ${category.bgColor} border border-gray-100 hover:shadow-sm transition-all duration-300 hover:scale-102 cursor-pointer`}
                            style={{
                                animationDelay: `${index * 50}ms`
                            }}
                            onClick={() => handleCategoryClick(category.brandId)}
                        >
                            {/* Trending Badge */}
                            {category.trending && (
                                <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                    <TrendingUp className="w-2 h-2" />
                                    HOT
                                </div>
                            )}

                            {/* Content */}
                            <div className="relative p-4 h-full flex flex-col items-center text-center">
                                {/* Product Image */}
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    width={64}
                                    height={64}
                                    className=" w-full h-24 rounded-xl mb-2 object-cover group-hover:scale-105 transition-transform duration-300"
                                />


                                {/* Name */}
                                <h3 className={`text-lg font-bold bg-gradient-to-r ${category.color} bg-clip-text text-transparent mb-1`}>
                                    {category.name}
                                </h3>

                                {/* Products count */}
                                <p className="text-xs text-gray-500 mb-3">
                                    {category.products}
                                </p>

                                {/* CTA */}
                                <button className={`text-xs font-medium bg-gradient-to-r ${category.color} bg-clip-text text-transparent hover:opacity-80 transition-opacity`}>
                                    Xem thêm
                                </button>

                                {/* Hover overlay effect */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-40 h-40 bg-blue-100 rounded-full opacity-50 blur-xl" />
                <div className="absolute bottom-1/4 -right-20 w-60 h-60 bg-blue-200 rounded-full opacity-30 blur-xl" />
            </div>
        </section>
    )
}

export default CategoriesSection