"use client";
import React, { useState } from "react";
import Badge from "@/components/ui/badge/Badge";

type Transaction = {
  id: string;
  transactionCode: string;
  orderId: string;
  customer: string;
  amount: number;
  method: string;
  methodIcon: string;
  status: "completed" | "pending" | "failed" | "refunded" | "processing";
  createdAt: string;
  completedAt: string | null;
  gatewayRef: string;
  gatewayFee: number;
  netAmount: number;
  reconciled: boolean;
};

const transactions: Transaction[] = [
  {
    id: "1",
    transactionCode: "TXN2024010001",
    orderId: "ORD2024010543",
    customer: "Nguyễn Văn A",
    amount: 2500000,
    method: "MoMo",
    methodIcon: "💳",
    status: "completed",
    createdAt: "2024-01-15 10:30:00",
    completedAt: "2024-01-15 10:30:15",
    gatewayRef: "MOMO123456789",
    gatewayFee: 38500,
    netAmount: 2461500,
    reconciled: true,
  },
  {
    id: "2",
    transactionCode: "TXN2024010002",
    orderId: "ORD2024010544",
    customer: "Trần Thị B",
    amount: 1850000,
    method: "VNPay",
    methodIcon: "🔵",
    status: "completed",
    createdAt: "2024-01-15 11:15:00",
    completedAt: "2024-01-15 11:15:08",
    gatewayRef: "VNPAY987654321",
    gatewayFee: 19000,
    netAmount: 1831000,
    reconciled: true,
  },
  {
    id: "3",
    transactionCode: "TXN2024010003",
    orderId: "ORD2024010545",
    customer: "Lê Văn C",
    amount: 3200000,
    method: "Chuyển khoản",
    methodIcon: "🏦",
    status: "pending",
    createdAt: "2024-01-15 12:00:00",
    completedAt: null,
    gatewayRef: "BANK20240115001",
    gatewayFee: 0,
    netAmount: 3200000,
    reconciled: false,
  },
  {
    id: "4",
    transactionCode: "TXN2024010004",
    orderId: "ORD2024010546",
    customer: "Phạm Thị D",
    amount: 980000,
    method: "ZaloPay",
    methodIcon: "💰",
    status: "processing",
    createdAt: "2024-01-15 13:20:00",
    completedAt: null,
    gatewayRef: "ZALO456789123",
    gatewayFee: 12760,
    netAmount: 967240,
    reconciled: false,
  },
  {
    id: "5",
    transactionCode: "TXN2024010005",
    orderId: "ORD2024010547",
    customer: "Hoàng Văn E",
    amount: 1500000,
    method: "Thẻ tín dụng",
    methodIcon: "💳",
    status: "failed",
    createdAt: "2024-01-15 14:05:00",
    completedAt: null,
    gatewayRef: "CARD789456123",
    gatewayFee: 40000,
    netAmount: 1460000,
    reconciled: false,
  },
  {
    id: "6",
    transactionCode: "TXN2024010006",
    orderId: "ORD2024010548",
    customer: "Võ Thị F",
    amount: 750000,
    method: "MoMo",
    methodIcon: "💳",
    status: "refunded",
    createdAt: "2024-01-14 16:30:00",
    completedAt: "2024-01-15 09:00:00",
    gatewayRef: "MOMO321654987",
    gatewayFee: 12250,
    netAmount: 737750,
    reconciled: true,
  },
];

export default function TransactionMonitoring() {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(
    transactions[0]
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = transactions.filter((txn) => {
    const matchesStatus = statusFilter === "all" || txn.status === statusFilter;
    const matchesSearch =
      txn.transactionCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.method.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadgeColor = (
    status: string
  ): "success" | "warning" | "error" | "info" => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
      case "processing":
        return "warning";
      case "failed":
        return "error";
      case "refunded":
        return "info";
      default:
        return "info";
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case "completed":
        return "Thành công";
      case "pending":
        return "Chờ xử lý";
      case "processing":
        return "Đang xử lý";
      case "failed":
        return "Thất bại";
      case "refunded":
        return "Đã hoàn tiền";
      default:
        return status;
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDateTime = (dateTime: string): string => {
    return new Date(dateTime).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left Panel - Transactions List */}
      <div className="lg:col-span-5">
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  Giao dịch gần đây
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredTransactions.length} giao dịch
                </p>
              </div>
              <button className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3 py-2 text-sm font-medium text-white hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Xuất báo cáo
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm giao dịch, đơn hàng, khách hàng..."
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

            {/* Status Filter */}
            <div className="flex flex-wrap gap-2">
              {[
                { value: "all", label: "Tất cả" },
                { value: "completed", label: "Thành công" },
                { value: "pending", label: "Chờ xử lý" },
                { value: "processing", label: "Đang xử lý" },
                { value: "failed", label: "Thất bại" },
                { value: "refunded", label: "Đã hoàn" },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setStatusFilter(filter.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    statusFilter === filter.value
                      ? "bg-brand-500 text-white dark:bg-brand-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Transactions List */}
          <div className="max-h-[600px] overflow-y-auto p-4">
            <div className="space-y-2">
              {filteredTransactions.map((txn) => (
                <button
                  key={txn.id}
                  onClick={() => setSelectedTransaction(txn)}
                  className={`w-full rounded-xl border p-4 text-left transition-all ${
                    selectedTransaction?.id === txn.id
                      ? "border-brand-500 bg-brand-50 shadow-sm dark:border-brand-600 dark:bg-brand-900/20"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-gray-700"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center text-xl">
                      {txn.methodIcon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900 dark:text-white text-sm">
                              {txn.transactionCode}
                            </span>
                            <Badge color={getStatusBadgeColor(txn.status)} size="sm">
                              {getStatusLabel(txn.status)}
                            </Badge>
                          </div>
                          <div className="space-y-0.5 text-xs">
                            <p className="text-gray-600 dark:text-gray-400">
                              Đơn hàng: <span className="font-medium text-gray-900 dark:text-white">{txn.orderId}</span>
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                              {txn.customer} • {txn.method}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-base font-bold text-brand-600 dark:text-brand-400">
                          {formatCurrency(txn.amount)}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDateTime(txn.createdAt)}
                        </span>
                      </div>
                      {!txn.reconciled && txn.status === "completed" && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          Chưa đối soát
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Transaction Details */}
      <div className="lg:col-span-7">
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          {selectedTransaction ? (
            <>
              {/* Transaction Header */}
              <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl border border-gray-400 dark:border-white-600 flex items-center justify-center text-2xl shadow-lg">
                      {selectedTransaction.methodIcon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {selectedTransaction.transactionCode}
                        </h3>
                        <Badge color={getStatusBadgeColor(selectedTransaction.status)}>
                          {getStatusLabel(selectedTransaction.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Đơn hàng: <span className="font-medium text-gray-900 dark:text-white">{selectedTransaction.orderId}</span>
                      </p>
                    </div>
                  </div>
                  {!selectedTransaction.reconciled && selectedTransaction.status === "completed" && (
                    <button className="inline-flex items-center gap-2 rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Đối soát
                    </button>
                  )}
                </div>
              </div>

              {/* Amount Summary */}
              <div className="border-b border-gray-200 p-6 dark:border-gray-800">
                <div className="rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 p-6 text-white shadow-lg">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm opacity-90 mb-1">Số tiền giao dịch</p>
                      <p className="text-2xl font-bold">{formatCurrency(selectedTransaction.amount)}</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-90 mb-1">Phí cổng thanh toán</p>
                      <p className="text-2xl font-bold">-{formatCurrency(selectedTransaction.gatewayFee)}</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-90 mb-1">Số tiền thực nhận</p>
                      <p className="text-2xl font-bold">{formatCurrency(selectedTransaction.netAmount)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="border-b border-gray-200 p-6 dark:border-gray-800">
                <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                  Thông tin chi tiết
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Khách hàng</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedTransaction.customer}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Phương thức</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{selectedTransaction.methodIcon}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedTransaction.method}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Mã tham chiếu</span>
                    <span className="text-sm font-mono font-medium text-gray-900 dark:text-white">
                      {selectedTransaction.gatewayRef}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Thời gian tạo</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatDateTime(selectedTransaction.createdAt)}
                    </span>
                  </div>
                  {selectedTransaction.completedAt && (
                    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Thời gian hoàn thành</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatDateTime(selectedTransaction.completedAt)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Trạng thái đối soát</span>
                    <div className="flex items-center gap-2">
                      {selectedTransaction.reconciled ? (
                        <>
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">
                            Đã đối soát
                          </span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                            Chưa đối soát
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6">
                <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                  Thao tác
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-white/[0.03]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Xem chi tiết đơn hàng
                  </button>
                  {selectedTransaction.status === "completed" && (
                    <button className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                      Hoàn tiền
                    </button>
                  )}
                  {selectedTransaction.status === "failed" && (
                    <button className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Thử lại giao dịch
                    </button>
                  )}
                  <button className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-white/[0.03]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Xuất hóa đơn
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-white/[0.03]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Liên hệ hỗ trợ
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <svg className="w-20 h-20 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Chọn giao dịch
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Chọn một giao dịch từ danh sách để xem chi tiết
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
