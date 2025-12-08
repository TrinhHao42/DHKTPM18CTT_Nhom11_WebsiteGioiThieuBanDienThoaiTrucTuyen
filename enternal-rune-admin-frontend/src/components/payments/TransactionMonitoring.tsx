"use client";
import React, { useState, useEffect } from "react";
import Badge from "@/components/ui/badge/Badge";
import { paymentService } from "@/services/paymentService";
import { Transaction, TransactionListResponse } from "@/types/payment";

export default function TransactionMonitoring() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const fetchTransactions = async (page = 0) => {
    try {
      setLoading(true);
      const response = await paymentService.getTransactions({
        status: statusFilter === "all" ? undefined : statusFilter,
        method: methodFilter === "all" ? undefined : methodFilter,
        search: searchTerm || undefined,
        page,
        size: 10,
        sortBy: "createdAt",
        sortDir: "desc"
      });

      setTransactions(response.content);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);

      // Set first transaction as selected if none selected
      if (response.content.length > 0 && !selectedTransaction) {
        setSelectedTransaction(response.content[0]);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Không thể tải danh sách giao dịch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(0);
  }, [statusFilter, methodFilter, searchTerm]);

  const getMethodIcon = (method: string): string => {
    switch (method?.toLowerCase()) {
      case "momo":
        return "💳";
      case "vnpay":
        return "🔵";
      case "zalopay":
        return "💰";
      case "bank":
      case "chuyển khoản":
        return "🏦";
      default:
        return "💳";
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchTransactions(newPage);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] animate-pulse">
            <div className="p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded dark:bg-gray-700 w-1/3"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded dark:bg-gray-700"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] animate-pulse">
            <div className="p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded dark:bg-gray-700 w-1/4"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-800 dark:bg-red-900/20">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

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
                  {totalItems} giao dịch tổng cộng
                </p>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo mã GD, đơn hàng, khách hàng..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
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

              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="completed">Thành công</option>
                  <option value="pending">Chờ xử lý</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="failed">Thất bại</option>
                  <option value="refunded">Đã hoàn tiền</option>
                </select>

                <select
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option value="all">Tất cả phương thức</option>
                  <option value="momo">MoMo</option>
                  <option value="vnpay">VNPay</option>
                  <option value="zalopay">ZaloPay</option>
                  <option value="bank">Chuyển khoản</option>
                </select>
              </div>
            </div>
          </div>

          {/* Transaction List */}
          <div className="max-h-[600px] overflow-y-auto">
            {transactions.length === 0 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                Không có giao dịch nào
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {transactions.map((txn) => (
                  <div
                    key={txn.transId}
                    className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                      selectedTransaction?.transId === txn.transId
                        ? "bg-brand/5 border-r-2 border-brand"
                        : ""
                    }`}
                    onClick={() => setSelectedTransaction(txn)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{getMethodIcon(txn.paymentMethod)}</span>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {txn.transactionCode}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            #{txn.orderId} • {txn.customerName}
                          </p>
                        </div>
                      </div>
                      <Badge color={paymentService.getStatusBadgeColor(txn.status)}>
                        {paymentService.getStatusLabel(txn.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {paymentService.formatCurrency(txn.amount)}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {paymentService.formatDateTime(txn.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Trước
                  </button>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Trang {currentPage + 1} / {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sau →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Transaction Details */}
      <div className="lg:col-span-7">
        {selectedTransaction ? (
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  Chi tiết giao dịch
                </h3>
                <Badge color={paymentService.getStatusBadgeColor(selectedTransaction.status)}>
                  {paymentService.getStatusLabel(selectedTransaction.status)}
                </Badge>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {/* Transaction Overview */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Tổng quan
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Mã giao dịch</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedTransaction.transactionCode}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Mã đơn hàng</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        #{selectedTransaction.orderId}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Khách hàng</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedTransaction.customerName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedTransaction.customerEmail}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Phương thức</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {getMethodIcon(selectedTransaction.paymentMethod)} {selectedTransaction.paymentMethod}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Amount Details */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Chi tiết số tiền
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Số tiền giao dịch</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {paymentService.formatCurrency(selectedTransaction.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Phí cổng thanh toán</span>
                      <span className="text-red-600">
                        -{paymentService.formatCurrency(selectedTransaction.gatewayFee)}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between">
                      <span className="font-medium text-gray-900 dark:text-white">Số tiền thực nhận</span>
                      <span className="font-medium text-green-600">
                        {paymentService.formatCurrency(selectedTransaction.netAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Thời gian
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Tạo giao dịch</span>
                      <span className="text-gray-900 dark:text-white">
                        {paymentService.formatDateTime(selectedTransaction.createdAt)}
                      </span>
                    </div>
                    {selectedTransaction.completedAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Hoàn thành</span>
                        <span className="text-gray-900 dark:text-white">
                          {paymentService.formatDateTime(selectedTransaction.completedAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Gateway Info */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Thông tin cổng thanh toán
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Gateway Reference</span>
                      <span className="text-gray-900 dark:text-white font-mono text-sm">
                        {selectedTransaction.gatewayRef || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Trạng thái đối soát</span>
                      <Badge color={selectedTransaction.reconciled ? "success" : "warning"}>
                        {selectedTransaction.reconciled ? "Đã đối soát" : "Chưa đối soát"}
                      </Badge>
                    </div>
                    {selectedTransaction.cardNumber && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Số thẻ</span>
                          <span className="text-gray-900 dark:text-white font-mono text-sm">
                            {selectedTransaction.cardNumber}
                          </span>
                        </div>
                        {selectedTransaction.cardHolderName && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Chủ thẻ</span>
                            <span className="text-gray-900 dark:text-white">
                              {selectedTransaction.cardHolderName}
                            </span>
                          </div>
                        )}
                        {selectedTransaction.cardBrand && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Loại thẻ</span>
                            <span className="text-gray-900 dark:text-white">
                              {selectedTransaction.cardBrand}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
            <div className="text-center text-gray-500 dark:text-gray-400">
              Chọn một giao dịch để xem chi tiết
            </div>
          </div>
        )}
      </div>
    </div>
  );
}