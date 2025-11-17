import React from 'react'
import { useRouter } from 'next/navigation'

interface CompleteProps {
    orderNumber: string;
    estimatedDelivery: string;
}

const Complete = ({ orderNumber, estimatedDelivery }: CompleteProps) => {
    const router = useRouter();

    return (
        <div className="flex items-center justify-center">
            <div className=" rounded-2xl max-w-lg w-full text-center">
                {/* Illustration/Icon */}
                <div className="mb-6">
                    <div className="relative mx-auto w-48 h-48 sm:w-56 sm:h-56">
                        {/* Shopping bag illustration */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Gradient background */}
                                <defs>
                                    <linearGradient id="bagGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#E0E7FF" />
                                        <stop offset="100%" stopColor="#C7D2FE" />
                                    </linearGradient>
                                </defs>

                                {/* Shopping bag */}
                                <rect x="50" y="70" width="100" height="100" rx="8" fill="url(#bagGradient)" />
                                <path d="M60 70 L140 70 L135 80 L65 80 Z" fill="#A5B4FC" />

                                {/* Products in bag */}
                                <rect x="70" y="50" width="30" height="35" rx="4" fill="#FFB84D" />
                                <rect x="110" y="40" width="25" height="40" rx="4" fill="#6366F1" />

                                {/* Checkmark circle */}
                                <circle cx="160" cy="150" r="25" fill="#10B981" />
                                <path d="M150 150 L157 157 L170 144" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />

                                {/* Decorative elements */}
                                <circle cx="40" cy="60" r="4" fill="#FCD34D" opacity="0.6" />
                                <circle cx="165" cy="50" r="3" fill="#F87171" opacity="0.6" />
                                <path d="M30 120 L45 110" stroke="#C084FC" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                                <path d="M170 80 L185 70" stroke="#34D399" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                    Đặt hàng thành công
                </h2>

                <p className="text-sm text-gray-600 mb-2">
                    Chúng tôi đã nhận được đơn hàng của bạn. Bạn sẽ nhận được
                </p>
                <p className="text-sm text-gray-600 mb-6">
                    email xác nhận tại <span className="font-semibold text-gray-900">rkai@maxind.agency</span>
                </p>

                {/* Order Details Link */}
                <button
                    onClick={() => router.push("/OrderManagementScreen")}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-8 transition-colors cursor-pointer"
                >
                    Xem chi tiết đơn hàng
                </button>

                {/* Continue Shopping Button */}
                <button
                    onClick={() => router.push('/')}
                    className="w-full bg-blue-600 text-white py-3.5 px-6 rounded-lg font-semibold hover:bg-blue-700 active:scale-95 transition-all duration-100 shadow-md"
                >
                    Tiếp tục mua sắm
                </button>
            </div>
        </div>
    )
}

export default Complete
