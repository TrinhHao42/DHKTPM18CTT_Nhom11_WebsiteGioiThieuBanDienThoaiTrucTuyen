import React from 'react'
import Image from 'next/image'

const FeedBack = () => {
    const cards = [
        {
            src: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&h=400&auto=format&fit=crop",
            alt: "iPhone",
            title: "iPhone Series",
            description: "Trải nghiệm sức mạnh của iOS với camera tuyệt đẹp, hiệu năng vượt trội và thiết kế tinh tế.",
            objectPosition: "object-center"
        },
        {
            src: "https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=800&h=400&auto=format&fit=crop",
            alt: "Samsung Galaxy",
            title: "Samsung Galaxy",
            description: "Đa dạng tùy chọn với màn hình AMOLED lớn, camera đa lớp và tính năng đa nhiệm mạnh mẽ.",
            objectPosition: "object-right"
        },
        {
            src: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=800&h=400&auto=format&fit=crop",
            alt: "Xiaomi Phone",
            title: "Xiaomi & Google",
            description: "Giá cả phải chăng với công nghệ tiên tiến, camera AI thông minh và pin lâu dài.",
            objectPosition: "object-center"
        },
        {
            src: "https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=800&h=400&auto=format&fit=crop",
            alt: "Samsung Galaxy",
            title: "Samsung Galaxy",
            description: "Đa dạng tùy chọn với màn hình AMOLED lớn, camera đa lớp và tính năng đa nhiệm mạnh mẽ.",
            objectPosition: "object-center"
        },
    ]

    return (
        <div className="my-20 px-4">
            <h1 className="text-3xl font-semibold text-center mx-auto">Điện Thoại Nổi Bật</h1>
            <p className="text-sm text-slate-500 text-center mt-2 max-w-lg mx-auto">
                Khám phá bộ sưu tập điện thoại di động mới nhất với công nghệ tiên tiến,
                camera chất lượng cao và thiết kế sang trọng phù hợp mọi nhu cầu.
            </p>

            <div className="flex items-center gap-6 h-[400px] w-full max-w-5xl mt-10 mx-auto">
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className="relative group flex-grow transition-all w-56 h-[400px] duration-500 
                                   hover:w-full overflow-hidden rounded-2xl"
                    >
                        <Image
                            fill
                            className={`object-cover ${card.objectPosition} rounded-2xl`}
                            src={card.src}
                            alt={card.alt}
                        />
                        <div
                            className="absolute inset-0 flex flex-col justify-end p-10 text-white 
                                       bg-black/50 opacity-0 group-hover:opacity-100 
                                       transition-all duration-300 rounded-2xl"
                        >
                            <h1 className="text-3xl">{card.title}</h1>
                            <p className="text-sm">{card.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FeedBack
