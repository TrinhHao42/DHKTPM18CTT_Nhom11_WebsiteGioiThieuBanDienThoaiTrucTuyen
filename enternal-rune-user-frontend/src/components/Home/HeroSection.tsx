import React from 'react'
import Button from "@/components/Button"

const HeroSection = () => {
  return (
    <section
      className="relative overflow-hidden h-120 py-24 md:py-32 lg:py-40 rounded-4xl my-8 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/hero-bg.png')" }}
    >
      {/* <div className="absolute inset-0 bg-black/40" />

      <div className="absolute inset-0 z-10 flex items-center justify-start px-6 md:px-12 lg:px-20">
        <div className="flex flex-col items-start text-left max-w-2xl space-y-6">
          
          <h1 className="font-bold lg:text-4xl text-white leading-tight tracking-tight drop-shadow-lg">
            Điện thoại <span className="text-primary">giá tốt</span> nhất hôm nay
          </h1>

          <p className="text-lg sm:text-xl text-gray-200 leading-relaxed drop-shadow-md">
            Ưu đãi khủng lên đến <span className="text-primary font-semibold">50%</span> — Trả góp 0%, bảo hành chính hãng.  
            Đặt mua ngay để nhận quà tặng độc quyền 🎁
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:justify-center lg:justify-start">
            <Button
              size="lg"
              className="bg-primary text-white hover:bg-primary/90 px-8 py-3 text-lg rounded-full shadow-lg transition-all"
            >
              Mua ngay
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg rounded-full transition-all"
            >
              Xem khuyến mãi
            </Button>
          </div>
        </div>
      </div> */}
    </section>
  )
}

export default HeroSection
