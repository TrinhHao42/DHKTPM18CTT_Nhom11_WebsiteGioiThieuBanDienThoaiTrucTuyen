"use client";
import React, { useState } from "react";
import Badge from "@/components/ui/badge/Badge";

type ShippingProvider = {
  id: string;
  name: string;
  code: string;
  logo: string;
  status: "active" | "inactive";
  totalShipments: number;
  successRate: number;
  avgDeliveryTime: number; // in days
  pricing: string;
  contact: {
    phone: string;
    email: string;
  };
};

const shippingProviders: ShippingProvider[] = [
  {
    id: "1",
    name: "Giao Hàng Nhanh",
    code: "GHN",
    logo: "🚚",
    status: "active",
    totalShipments: 1245,
    successRate: 98.5,
    avgDeliveryTime: 2.5,
    pricing: "20,000₫ - 50,000₫",
    contact: {
      phone: "1900 1234",
      email: "support@ghn.vn",
    },
  },
  {
    id: "2",
    name: "Giao Hàng Tiết Kiệm",
    code: "GHTK",
    status: "active",
    logo: "📦",
    totalShipments: 987,
    successRate: 97.2,
    avgDeliveryTime: 3,
    pricing: "18,000₫ - 45,000₫",
    contact: {
      phone: "1900 5678",
      email: "support@ghtk.vn",
    },
  },
  {
    id: "3",
    name: "VNPost",
    code: "VNPOST",
    logo: "✉️",
    status: "active",
    totalShipments: 654,
    successRate: 95.8,
    avgDeliveryTime: 4,
    pricing: "15,000₫ - 40,000₫",
    contact: {
      phone: "1900 0000",
      email: "support@vnpost.vn",
    },
  },
  {
    id: "4",
    name: "Viettel Post",
    code: "VIETTEL",
    logo: "📮",
    status: "active",
    totalShipments: 523,
    successRate: 96.5,
    avgDeliveryTime: 3.5,
    pricing: "17,000₫ - 42,000₫",
    contact: {
      phone: "1900 8095",
      email: "support@viettelpost.vn",
    },
  },
  {
    id: "5",
    name: "J&T Express",
    code: "JT",
    logo: "🚛",
    status: "active",
    totalShipments: 412,
    successRate: 97.8,
    avgDeliveryTime: 2.8,
    pricing: "19,000₫ - 48,000₫",
    contact: {
      phone: "1900 1088",
      email: "support@jtexpress.vn",
    },
  },
  {
    id: "6",
    name: "Best Express",
    code: "BEST",
    logo: "🏃",
    status: "inactive",
    totalShipments: 156,
    successRate: 94.2,
    avgDeliveryTime: 4.5,
    pricing: "16,000₫ - 38,000₫",
    contact: {
      phone: "1900 2222",
      email: "support@best-inc.vn",
    },
  },
];

export default function ShippingProviders() {
  const [selectedProvider, setSelectedProvider] = useState<ShippingProvider | null>(
    shippingProviders[0]
  );
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProviders = shippingProviders.filter(
    (provider) =>
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeColor = (status: string): "success" | "error" => {
    return status === "active" ? "success" : "error";
  };

  const getSuccessRateColor = (rate: number): string => {
    if (rate >= 98) return "text-green-600 dark:text-green-400";
    if (rate >= 95) return "text-blue-600 dark:text-blue-400";
    if (rate >= 90) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left Panel - Provider List */}
      <div className="lg:col-span-5">
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  Đơn vị vận chuyển
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredProviders.length} đơn vị
                </p>
              </div>
              <button className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3 py-2 text-sm font-medium text-white hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Thêm đơn vị
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm đơn vị..."
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pl-10 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <svg
                className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Provider List */}
          <div className="max-h-[600px] overflow-y-auto p-4">
            <div className="space-y-2">
              {filteredProviders.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => setSelectedProvider(provider)}
                  className={`w-full rounded-xl border p-4 text-left transition-all ${
                    selectedProvider?.id === provider.id
                      ? "border-brand-500 bg-brand-50 shadow-sm dark:border-brand-600 dark:bg-brand-900/20"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-gray-700"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl">
                      {provider.logo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {provider.name}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {provider.code}
                          </p>
                        </div>
                        <Badge
                          color={getStatusBadgeColor(provider.status)}
                          size="sm"
                        >
                          {provider.status === "active" ? "Hoạt động" : "Tạm dừng"}
                        </Badge>
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-xs">
                        <span className="text-gray-600 dark:text-gray-400">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {provider.totalShipments}
                          </span>{" "}
                          đơn
                        </span>
                        <span className={`font-medium ${getSuccessRateColor(provider.successRate)}`}>
                          {provider.successRate}%
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          ~{provider.avgDeliveryTime} ngày
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Provider Details */}
      <div className="lg:col-span-7">
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          {selectedProvider ? (
            <>
              {/* Provider Header */}
              <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border border-gray-400 dark:border-white-800">
                      {selectedProvider.logo}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {selectedProvider.name}
                        </h3>
                        <Badge color={getStatusBadgeColor(selectedProvider.status)}>
                          {selectedProvider.status === "active" ? "Hoạt động" : "Tạm dừng"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Mã đơn vị: <span className="font-mono font-medium text-gray-700 dark:text-gray-300">{selectedProvider.code}</span>
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {selectedProvider.contact.phone}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {selectedProvider.contact.email}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.03]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Chỉnh sửa
                    </button>
                  </div>
                </div>
              </div>

              {/* Statistics Grid */}
              {/* <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Tổng đơn</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {selectedProvider.totalShipments}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Tỉ lệ thành công</p>
                      <p className={`text-xl font-bold ${getSuccessRateColor(selectedProvider.successRate)}`}>
                        {selectedProvider.successRate}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Thời gian TB</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {selectedProvider.avgDeliveryTime} ngày
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Phí ship</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {selectedProvider.pricing}
                      </p>
                    </div>
                  </div>
                </div>
              </div> */}

              {/* Configuration Section */}
              <div className="border-t border-gray-200 p-6 dark:border-gray-800">
                <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                  Cấu hình vận chuyển
                </h4>
                <div className="space-y-4">
                  {/* Auto Assignment */}
                  <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-1">
                        Tự động gán đơn
                      </h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Tự động gán đơn hàng cho đơn vị này khi đủ điều kiện
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked={selectedProvider.status === "active"}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
                    </label>
                  </div>

                  {/* COD Support */}
                  <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-1">
                        Hỗ trợ COD
                      </h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Cho phép thu tiền hộ khi giao hàng
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
                    </label>
                  </div>

                  {/* Insurance */}
                  <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-1">
                        Bảo hiểm hàng hóa
                      </h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Tự động mua bảo hiểm cho đơn hàng giá trị cao
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
                    </label>
                  </div>

                  {/* Priority */}
                  <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                    <h5 className="font-medium text-gray-900 dark:text-white mb-3">
                      Độ ưu tiên
                    </h5>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        defaultValue="7"
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      />
                      <span className="text-lg font-semibold text-brand-600 dark:text-brand-400 min-w-[3rem] text-right">
                        7/10
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Đơn vị có độ ưu tiên cao sẽ được ưu tiên chọn khi tự động gán đơn
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3">
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-white/[0.03]">
                    Hủy
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700">
                    Lưu cấu hình
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <svg className="w-20 h-20 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Chọn đơn vị vận chuyển
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Chọn một đơn vị từ danh sách để xem chi tiết và cấu hình
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
