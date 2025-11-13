"use client";
import React, { useState } from "react";
import Badge from "@/components/ui/badge/Badge";

type TrackingStatus = "pending" | "picked" | "transit" | "out_for_delivery" | "delivered" | "failed";

type ShipmentTracking = {
  id: string;
  trackingNumber: string;
  orderNumber: string;
  customer: string;
  provider: string;
  providerLogo: string;
  status: TrackingStatus;
  currentLocation: string;
  destination: string;
  estimatedDelivery: string;
  timeline: {
    status: string;
    location: string;
    timestamp: string;
    description: string;
  }[];
};

const mockTrackings: ShipmentTracking[] = [
  {
    id: "1",
    trackingNumber: "GHN12345678",
    orderNumber: "ORD-2024-001",
    customer: "Nguyễn Văn A",
    provider: "Giao Hàng Nhanh",
    providerLogo: "🚚",
    status: "out_for_delivery",
    currentLocation: "Bưu cục Quận 1, TP.HCM",
    destination: "Quận 3, TP.HCM",
    estimatedDelivery: "2024-03-16 14:00",
    timeline: [
      {
        status: "Đang giao hàng",
        location: "Bưu cục Quận 1, TP.HCM",
        timestamp: "2024-03-16 09:30",
        description: "Shipper đang trên đường giao hàng",
      },
      {
        status: "Đang vận chuyển",
        location: "Hub TP.HCM",
        timestamp: "2024-03-16 07:00",
        description: "Hàng đã được phân loại và chuẩn bị giao",
      },
      {
        status: "Đã lấy hàng",
        location: "Kho người gửi",
        timestamp: "2024-03-15 15:30",
        description: "Shipper đã lấy hàng thành công",
      },
      {
        status: "Chờ lấy hàng",
        location: "Kho người gửi",
        timestamp: "2024-03-15 10:00",
        description: "Đơn hàng đã được tạo, chờ lấy hàng",
      },
    ],
  },
  {
    id: "2",
    trackingNumber: "GHTK87654321",
    orderNumber: "ORD-2024-002",
    customer: "Trần Thị B",
    provider: "GHTK",
    providerLogo: "📦",
    status: "transit",
    currentLocation: "Hub Hà Nội",
    destination: "Hải Phòng",
    estimatedDelivery: "2024-03-17 16:00",
    timeline: [
      {
        status: "Đang vận chuyển",
        location: "Hub Hà Nội",
        timestamp: "2024-03-16 08:00",
        description: "Hàng đang trên đường đến Hải Phòng",
      },
      {
        status: "Đã lấy hàng",
        location: "Bưu cục Ba Đình, Hà Nội",
        timestamp: "2024-03-15 14:00",
        description: "Shipper đã lấy hàng",
      },
    ],
  },
];

export default function ShippingTracking() {
  const [selectedTracking, setSelectedTracking] = useState<ShipmentTracking | null>(
    mockTrackings[0]
  );
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTrackings = mockTrackings.filter(
    (tracking) =>
      tracking.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tracking.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tracking.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeColor = (
    status: TrackingStatus
  ): "success" | "error" | "warning" | "info" => {
    switch (status) {
      case "delivered":
        return "success";
      case "failed":
        return "error";
      case "pending":
        return "warning";
      case "out_for_delivery":
        return "info";
      default:
        return "info";
    }
  };

  const getStatusText = (status: TrackingStatus): string => {
    switch (status) {
      case "pending":
        return "Chờ lấy hàng";
      case "picked":
        return "Đã lấy hàng";
      case "transit":
        return "Đang vận chuyển";
      case "out_for_delivery":
        return "Đang giao hàng";
      case "delivered":
        return "Đã giao hàng";
      case "failed":
        return "Giao thất bại";
      default:
        return status;
    }
  };

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Theo dõi vận chuyển
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Theo dõi trạng thái và vị trí đơn hàng theo thời gian thực
            </p>
          </div>
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm mã vận đơn, đơn hàng..."
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 dark:divide-gray-800">
        {/* Left Panel - Tracking List */}
        <div className="lg:col-span-5 p-4 max-h-[700px] overflow-y-auto">
          <div className="space-y-3">
            {filteredTrackings.map((tracking) => (
              <button
                key={tracking.id}
                onClick={() => setSelectedTracking(tracking)}
                className={`w-full rounded-xl border p-4 text-left transition-all ${
                  selectedTracking?.id === tracking.id
                    ? "border-brand-500 bg-brand-50 shadow-sm dark:border-brand-600 dark:bg-brand-900/20"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-gray-700"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{tracking.providerLogo}</span>
                    <div>
                      <p className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                        {tracking.trackingNumber}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {tracking.orderNumber}
                      </p>
                    </div>
                  </div>
                  <Badge color={getStatusBadgeColor(tracking.status)} size="sm">
                    {getStatusText(tracking.status)}
                  </Badge>
                </div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="truncate">{tracking.customer}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{tracking.currentLocation}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs">Dự kiến: {formatDateTime(tracking.estimatedDelivery)}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel - Tracking Details */}
        <div className="lg:col-span-7 p-6">
          {selectedTracking ? (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-brand-50 to-blue-50 dark:from-brand-900/20 dark:to-blue-900/20 dark:border-gray-800 p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-2xl shadow-sm">
                      {selectedTracking.providerLogo}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {selectedTracking.provider}
                      </p>
                      <p className="font-mono text-lg font-bold text-gray-900 dark:text-white">
                        {selectedTracking.trackingNumber}
                      </p>
                    </div>
                  </div>
                  <Badge color={getStatusBadgeColor(selectedTracking.status)}>
                    {getStatusText(selectedTracking.status)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Đơn hàng</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedTracking.orderNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Khách hàng</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedTracking.customer}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Vị trí hiện tại</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedTracking.currentLocation}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Điểm đến</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedTracking.destination}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-400">
                      Dự kiến giao hàng:{" "}
                      <span className="font-semibold text-brand-600 dark:text-brand-400">
                        {formatDateTime(selectedTracking.estimatedDelivery)}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                  Lịch sử vận chuyển
                </h4>
                <div className="relative space-y-6">
                  {/* Timeline Line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800"></div>

                  {selectedTracking.timeline.map((event, index) => (
                    <div key={index} className="relative flex gap-4">
                      {/* Timeline Dot */}
                      <div
                        className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          index === 0
                            ? "bg-brand-600 ring-4 ring-brand-100 dark:ring-brand-900/30"
                            : "bg-gray-300 dark:bg-gray-700"
                        }`}
                      >
                        {index === 0 ? (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <div className="w-2 h-2 bg-white dark:bg-gray-900 rounded-full"></div>
                        )}
                      </div>

                      {/* Event Content */}
                      <div className="flex-1 pb-8">
                        <div
                          className={`rounded-xl border p-4 ${
                            index === 0
                              ? "border-brand-200 bg-brand-50 dark:border-brand-800 dark:bg-brand-900/20"
                              : "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h5
                              className={`font-semibold ${
                                index === 0
                                  ? "text-brand-900 dark:text-brand-100"
                                  : "text-gray-900 dark:text-white"
                              }`}
                            >
                              {event.status}
                            </h5>
                            <span
                              className={`text-xs ${
                                index === 0
                                  ? "text-brand-600 dark:text-brand-400"
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                            >
                              {formatDateTime(event.timestamp)}
                            </span>
                          </div>
                          <p
                            className={`text-sm mb-2 ${
                              index === 0
                                ? "text-brand-700 dark:text-brand-300"
                                : "text-gray-600 dark:text-gray-400"
                            }`}
                          >
                            {event.description}
                          </p>
                          <div
                            className={`flex items-center gap-1.5 text-xs ${
                              index === 0
                                ? "text-brand-600 dark:text-brand-400"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.03]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Làm mới
                </button>
                <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.03]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Chia sẻ
                </button>
                <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                  Liên hệ shipper
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <svg className="w-20 h-20 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Chọn đơn hàng để theo dõi
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Chọn một đơn hàng từ danh sách để xem chi tiết vận chuyển
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
