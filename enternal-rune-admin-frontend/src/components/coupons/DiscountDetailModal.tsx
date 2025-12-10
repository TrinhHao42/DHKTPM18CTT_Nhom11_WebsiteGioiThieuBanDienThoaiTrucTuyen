"use client";
import React from "react";
import { DiscountResponse } from "@/types/discount";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    coupon: DiscountResponse | null;
}

export default function DiscountDetailModal({ isOpen, onClose, coupon }: Props) {
    if (!isOpen || !coupon) return null;

    const formatCurrency = (amount: number): string =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

    const formatDate = (dateString: string | Date): string => {
        if (!dateString) return "Không rõ";
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? "Không rõ" : date.toLocaleDateString("vi-VN");
    };

    const DetailItem = ({
        label,
        value,
    }: {
        label: string;
        value: React.ReactNode;
    }) => (
        <div className="flex flex-col space-y-1">
            <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">
                {label}
            </p>
            <div className="text-[15px] font-medium text-gray-900 dark:text-gray-200">{value}</div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="w-full max-w-lg rounded-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-xl border border-gray-200/50 dark:border-gray-700 p-6 animate-scaleIn">

                {/* Header */}
                <div className="mb-6 flex items-start justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Chi tiết mã giảm giá
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {coupon.discountName}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300 transition"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="space-y-6">

                    {/* Code box */}
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">
                            Mã giảm giá
                        </p>
                        <p className="text-2xl font-extrabold font-mono tracking-wide text-gray-900 dark:text-white break-all mt-1">
                            {coupon.discountCode}
                        </p>
                    </div>

                    {/* Main grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-6">

                        <DetailItem
                            label="Loại giảm giá"
                            value={
                                <div className="flex flex-col">
                                    <span className="text-lg font-bold">
                                        {coupon.discountValueType === "PERCENT"
                                            ? `${coupon.discountValue}%`
                                            : formatCurrency(coupon.discountValue)}
                                    </span>

                                    {coupon.discountValueType === "PERCENT" &&
                                        coupon.discountMaxAmount > 0 && (
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                Tối đa: {formatCurrency(coupon.discountMaxAmount)}
                                            </span>
                                        )}
                                </div>
                            }
                        />

                        <DetailItem
                            label="Áp dụng cho"
                            value={
                                <>
                                    {coupon.discountTargetType === "ORDER" && "Đơn hàng"}
                                    {coupon.discountTargetType === "PRODUCT" && "Sản phẩm"}
                                    {coupon.discountTargetType === "EVENT" && "Sự kiện"}
                                </>
                            }
                        />

                        <DetailItem
                            label="Bắt đầu"
                            value={formatDate(coupon.discountStartDate)}
                        />

                        <DetailItem
                            label="Kết thúc"
                            value={formatDate(coupon.discountEndDate)}
                        />

                        <DetailItem
                            label="Đã dùng"
                            value={<span className="font-semibold">{coupon.usedQuantity}</span>}
                        />

                        <DetailItem
                            label="Giới hạn"
                            value={<span className="font-semibold">{coupon.discountQuantityLimit}</span>}
                        />

                        <DetailItem
                            label="Trạng thái"
                            value={
                                <span
                                    className={`font-semibold ${coupon.discountActive
                                            ? "text-green-600 dark:text-green-400"
                                            : "text-red-500 dark:text-red-400"
                                        }`}
                                >
                                    {coupon.discountActive ? "Đang hoạt động" : "Tạm dừng"}
                                </span>
                            }
                        />
                    </div>

                    {/* Description */}
                    {coupon.discountDescription && (
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 mb-2">
                                Mô tả
                            </p>
                            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                {coupon.discountDescription}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-lg bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 font-medium hover:opacity-90 transition"
                    >
                        Đóng
                    </button>
                </div>
            </div>

            {/* Animations */}
            <style>
                {`
          @keyframes fadeIn {
            from { opacity: 0 }
            to { opacity: 1 }
          }
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.95) }
            to { opacity: 1; transform: scale(1) }
          }
          .animate-fadeIn { animation: fadeIn 0.2s ease-out }
          .animate-scaleIn { animation: scaleIn 0.2s ease-out }
        `}
            </style>
        </div>
    );
}
