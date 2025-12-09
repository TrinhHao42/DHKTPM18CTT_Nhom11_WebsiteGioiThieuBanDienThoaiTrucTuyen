"use client";
import React, { useState, useEffect } from "react";
import Badge from "@/components/ui/badge/Badge";
import { getAllOrders, OrderListItem, updateShippingStatus, getAvailableShippingStatuses } from "@/services/orderService";
import { useToast } from "@/hooks/useToast";

type TrackingStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "RECEIVED" | "CANCELLED";

export default function ShippingTracking() {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderListItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [availableStatuses, setAvailableStatuses] = useState<Array<{code: string, name: string}>>([]);
  const toast = useToast();

  useEffect(() => {
    fetchOrders();
    fetchStatuses();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Lấy orders với trạng thái đang giao (PROCESSING, SHIPPED)
      const data = await getAllOrders(0, 50, undefined, undefined, undefined);
      setOrders(data.content);
      if (data.content.length > 0 && !selectedOrder) {
        setSelectedOrder(data.content[0]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatuses = async () => {
    try {
      const statuses = await getAvailableShippingStatuses();
      setAvailableStatuses(statuses);
    } catch (error) {
      console.error('Error fetching statuses:', error);
    }
  };

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      setUpdating(true);
      await updateShippingStatus(orderId, newStatus);
      toast.success('Cập nhật trạng thái thành công!');
      
      // Refresh orders
      const data = await getAllOrders(0, 50, undefined, undefined, undefined);
      setOrders(data.content);
      
      // Update selected order from fresh data
      if (selectedOrder && selectedOrder.orderId === orderId) {
        const updatedOrder = data.content.find((o: OrderListItem) => o.orderId === orderId);
        if (updatedOrder) {
          setSelectedOrder(updatedOrder);
        }
      }
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error(error?.response?.data?.message || 'Không thể cập nhật trạng thái');
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.orderId.toString().includes(searchTerm) ||
      order.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeColor = (
    status: string
  ): "success" | "error" | "warning" | "info" => {
    const upperStatus = status.toUpperCase();
    if (upperStatus.includes('RECEIVED')) return "success";
    if (upperStatus.includes('DELIVERED')) return "info";
    if (upperStatus.includes('CANCEL')) return "error";
    if (upperStatus.includes('PENDING')) return "warning";
    if (upperStatus.includes('SHIP') || upperStatus.includes('PROCESS')) return "info";
    return "info";
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

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-8">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
            <p className="mt-2 text-sm text-gray-500">Đang tải đơn hàng...</p>
          </div>
        </div>
      </div>
    );
  }

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
            {filteredOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Không tìm thấy đơn hàng nào
              </div>
            ) : (
              filteredOrders.map((order) => (
                <button
                  key={order.orderId}
                  onClick={() => setSelectedOrder(order)}
                  className={`w-full rounded-xl border p-4 text-left transition-all ${
                    selectedOrder?.orderId === order.orderId
                      ? "border-brand-500 bg-brand-50 shadow-sm dark:border-brand-600 dark:bg-brand-900/20"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-gray-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">📦</span>
                      <div>
                        <p className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                          #ORD{order.orderId}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatCurrency(order.totalAmount)}
                        </p>
                      </div>
                    </div>
                    <Badge color={getStatusBadgeColor(order.currentShippingStatus.statusCode)} size="sm">
                      {order.currentShippingStatus.statusName}
                    </Badge>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="truncate">{order.userName || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="truncate text-xs">{order.userEmail || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs">{formatDateTime(order.orderDate)}</span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Tracking Details */}
        <div className="lg:col-span-7 p-6">
          {selectedOrder ? (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                      Đơn hàng #ORD{selectedOrder.orderId}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDateTime(selectedOrder.orderDate)}
                    </p>
                  </div>
                  <Badge color={getStatusBadgeColor(selectedOrder.currentShippingStatus.statusCode)}>
                    {selectedOrder.currentShippingStatus.statusName}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Mã đơn hàng</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      #ORD{selectedOrder.orderId}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tổng tiền</p>
                    <p className="font-semibold text-brand-600 dark:text-brand-400">
                      {formatCurrency(selectedOrder.totalAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Khách hàng</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedOrder.userName || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email</p>
                    <p className="font-medium text-gray-900 dark:text-white text-xs">
                      {selectedOrder.userEmail || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-400">
                      Thanh toán:{" "}
                      <Badge color={selectedOrder.currentPaymentStatus.statusCode.includes('PAID') ? 'success' : 'warning'} size="sm">
                        {selectedOrder.currentPaymentStatus.statusName}
                      </Badge>
                    </span>
                  </div>
                </div>
              </div>

              {/* Update Status Section */}
              <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
                <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                  Cập nhật trạng thái giao hàng
                </h4>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Trạng thái hiện tại: <strong>{selectedOrder.currentShippingStatus.statusName}</strong>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {availableStatuses.map((status) => (
                      <button
                        key={status.code}
                        onClick={() => handleUpdateStatus(selectedOrder.orderId, status.code)}
                        disabled={updating || status.code === selectedOrder.currentShippingStatus.statusCode}
                        className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          status.code === selectedOrder.currentShippingStatus.statusCode
                            ? 'bg-brand-100 text-brand-700 border-2 border-brand-500 cursor-not-allowed'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent hover:border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {status.name}
                      </button>
                    ))}
                  </div>
                  {updating && (
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500 py-2">
                      <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
                      <span>Đang cập nhật...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
                <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                  Thao tác nhanh
                </h4>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`/orders/${selectedOrder.orderId}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors text-sm font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Xem chi tiết
                  </a>
                </div>
              </div>

              {/* Info Note */}
              <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 dark:bg-blue-900/20 dark:border-blue-800">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Lưu ý khi cập nhật trạng thái
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      Vui lòng cập nhật trạng thái theo đúng quy trình giao hàng. Khách hàng sẽ nhận được thông báo về thay đổi trạng thái.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-lg font-medium">Chọn đơn hàng để xem chi tiết</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

