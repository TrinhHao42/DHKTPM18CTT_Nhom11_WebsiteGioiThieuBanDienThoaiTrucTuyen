import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import HeroSection from './HeroSection'

const HeroSection2 = () => {
    return (
        <section className="bg-gradient-to-b from-[#f7f9ff] via-[#fffbee] to-[#fff] py-20">

            <div className="max-w-7xl mx-auto px-6 text-center">
                <button className="mb-6 flex items-center space-x-2 border border-blue-600 text-blue-600 text-xs rounded-full px-4 py-2 hover:bg-blue-50 transition mx-auto">
                    <span>Khám phá bộ sưu tập điện thoại mới nhất.</span>
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600">
                        <ArrowRight className="w-4 h-4 text-white" />
                    </span>
                </button>
                <h1 className="text-gray-900 font-semibold text-3xl sm:text-4xl md:text-5xl max-w-2xl mx-auto leading-tight mb-4">
                    Điện thoại hàng đầu cho
                    <span className="text-blue-600"> mọi nhu cầu</span>
                </h1>
                <p className="mt-4 text-gray-600 max-w-md mx-auto text-sm sm:text-base leading-relaxed mb-8">
                    Khám phá tại sao hàng ngàn khách hàng tin tưởng chúng tôi với các sản phẩm điện thoại chất lượng cao và dịch vụ tận tâm.
                </p>
                <Link href="#" className="bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-medium inline-flex items-center space-x-2 hover:bg-blue-700 transition mx-auto">
                    <span>Xem Sản Phẩm Nổi Bật</span>
                    <ArrowRight className="w-5 h-5" />
                </Link>
                <HeroSection />
            </div>
        </section>
    )
}

export default HeroSection2