'use client';
import React, { useState } from 'react'

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: "Làm thế nào để mua điện thoại?",
            answer: "Để mua điện thoại, bạn có thể chọn sản phẩm trên website, thêm vào giỏ hàng và tiến hành thanh toán. Chúng tôi hỗ trợ nhiều phương thức thanh toán an toàn.",
        },
        {
            question: "Các phương thức thanh toán nào được chấp nhận?",
            answer: "Chúng tôi chấp nhận thanh toán bằng thẻ tín dụng, thẻ ghi nợ, chuyển khoản ngân hàng, ví điện tử và thanh toán khi nhận hàng (COD).",
        },
        {
            question: "Thời gian giao hàng là bao lâu?",
            answer: "Thời gian giao hàng thường từ 1-3 ngày trong nội thành và 3-7 ngày cho các tỉnh khác, tùy thuộc vào địa điểm và phương thức vận chuyển bạn chọn.",
        },
        {
            question: "Chính sách bảo hành như thế nào?",
            answer: "Chúng tôi cung cấp bảo hành chính hãng từ 12-24 tháng tùy model. Ngoài ra, có dịch vụ bảo hành mở rộng và hỗ trợ kỹ thuật 24/7.",
        },
        {
            question: "Có thể đổi trả sản phẩm không?",
            answer: "Có, bạn có thể đổi trả sản phẩm trong vòng 30 ngày với điều kiện sản phẩm còn nguyên seal và hóa đơn. Chi tiết vui lòng xem chính sách đổi trả.",
        },
    ];
    return (
        <div className="my-10 px-4">
            <div className="max-w-xl mx-auto flex flex-col items-center justify-center px-4 md:px-0">
                <p className="text-indigo-600 text-sm font-medium py-2">Câu hỏi thường gặp</p>
                <h1 className="text-3xl font-semibold text-center">Bạn có câu hỏi?</h1>
                <p className="text-sm text-slate-500 mt-2 pb-8 text-center">
                    Tìm hiểu thêm về các sản phẩm điện thoại, chính sách mua hàng và dịch vụ của chúng tôi.
                </p>
                {faqs.map((faq, index) => (
                    <div className="border-b border-slate-200 py-4 cursor-pointer w-full" key={index} onClick={() => setOpenIndex(openIndex === index ? null : index)}>
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-medium">
                                {faq.question}
                            </h3>
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${openIndex === index ? "rotate-180" : ""} transition-all duration-500 ease-in-out`}>
                                <path d="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2" stroke="#1D293D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <p className={`text-sm text-slate-500 transition-all duration-500 ease-in-out max-w-md ${openIndex === index ? "opacity-100 max-h-[300px] translate-y-0 pt-4" : "opacity-0 max-h-0 -translate-y-2"}`} >
                            {faq.answer}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQ