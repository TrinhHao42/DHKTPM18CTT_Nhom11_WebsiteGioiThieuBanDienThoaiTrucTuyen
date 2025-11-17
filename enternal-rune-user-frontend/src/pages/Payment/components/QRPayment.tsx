"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { PaymentStatus } from "@/types/enums/PaymentStatus";
import { CreateOrderResponse, getOrderPaymentStatus, getQrCodeSepay } from "@/services/checkoutService";

interface QRPaymentProps {
    order: CreateOrderResponse
    onPaymentSuccess: () => void;
}

const QRPayment = ({ order, onPaymentSuccess }: QRPaymentProps) => {
    const [qrCode, setQrCode] = useState("")
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(PaymentStatus.PENDING)

    useEffect(() => {
        const getQrCode = async (amount: number, description: string) => {
            try {
                const res = await getQrCodeSepay(amount, description)

                setQrCode(URL.createObjectURL(res))
            } catch (error) {
                console.error("Error fetching QR code:", error)
            }
        }

        getQrCode(order.totalAmount, `Thanh toan ORD${order.orderId}`)

        const intervalId = setInterval(async () => {
            try {
                const statusRes = await getOrderPaymentStatus(order.orderId)
                
                setPaymentStatus(statusRes)
                
                // Nếu thanh toán thành công, gọi callback
                if (statusRes === PaymentStatus.PAID) {
                    clearInterval(intervalId)
                    setTimeout(() => {
                        onPaymentSuccess()
                    }, 2000) // Đợi 2s để user thấy thông báo thành công
                }
            } catch (error) {
                console.error("Error checking payment status:", error)
            }
        }, 2000)

        return () => {
            if (intervalId) clearInterval(intervalId)
        }
    }, [order, onPaymentSuccess])

    return (
        <div className="w-full max-w-md mx-auto flex flex-col items-center">
            {paymentStatus === PaymentStatus.PENDING ? (
                <>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 tracking-tight text-center">
                        Quét mã để thanh toán
                    </h2>
                    <p className="text-gray-500 text-center mb-6">
                        Vui lòng sử dụng ứng dụng ngân hàng hoặc ví điện tử để quét mã QR bên dưới
                    </p>

                    <div className="relative flex items-center justify-center mb-6">
                        <div className="rounded-xl flex items-center justify-center relative">
                            {qrCode ? (
                                <Image
                                    src={qrCode}
                                    alt="QR Code"
                                    width={250}
                                    height={250}
                                    className="rounded-lg"
                                />
                            ) : (
                                <div className="relative">
                                    <div className="w-[250px] h-[250px] bg-gray-100 rounded-lg flex items-center justify-center">
                                        <div className="w-16 h-16 border-8 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                </div>
                            )}

                            <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
                        </div>
                    </div>
                    <div className="flex gap-2 items-center justify-center mb-2">
                        <span className="font-medium text-gray-700">Số tiền cần thanh toán:</span>
                        <span className="font-bold text-blue-600">
                            {order.totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </span>
                    </div>

                    <div className="flex items-center justify-center w-full">
                        <span className="text-yellow-700 font-semibold animate-pulse">⏳ Đang chờ thanh toán...</span>
                        <div className="ml-2 w-4 h-4 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center py-10">
                    <div className="w-24 h-24 mb-6 flex items-center justify-center rounded-full bg-green-100">
                        <svg className="w-16 h-16 text-green-500" viewBox="0 0 52 52" fill="none">
                            <circle cx="26" cy="26" r="25" stroke="currentColor" strokeWidth="2" className="opacity-20" />
                            <path
                                className="checkmark"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16 27l8 8 12-14"
                                style={{
                                    strokeDasharray: '40',
                                    strokeDashoffset: '40',
                                    animation: 'draw 0.6s ease forwards'
                                }}
                            />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-green-600 mb-3 animate-fade-in">
                        ✓ Thanh toán thành công!
                    </h2>
                    <p className="text-gray-600 text-center text-lg animate-fade-in">
                        Đơn hàng của bạn đang được xử lý
                    </p>
                </div>
            )}

            <style jsx>{`
                @keyframes draw {
                    to {
                        stroke-dashoffset: 0;
                    }
                }
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.7s ease forwards;
                }
            `}</style>
        </div>
    )
}

export default QRPayment
