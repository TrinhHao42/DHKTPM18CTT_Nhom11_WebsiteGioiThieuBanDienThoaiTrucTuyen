'use client';
import React, { useState } from 'react';
import Badge from '@/components/ui/badge/Badge';

type PaymentMethod = {
  id: string;
  name: string;
  code: string;
  type: 'bank' | 'ewallet' | 'cod' | 'card';
  icon: string;
  status: 'active' | 'inactive';
  transactions: number;
  revenue: number;
  successRate: number;
  avgProcessTime: number; // in seconds
  fee: {
    fixed: number;
    percentage: number;
  };
  settings: {
    autoSettle: boolean;
    requireOTP: boolean;
    maxAmount: number;
    minAmount: number;
  };
};

const paymentMethods: PaymentMethod[] = [
  {
    id: '1',
    name: 'Chuyển khoản ngân hàng',
    code: 'BANK_TRANSFER',
    type: 'bank',
    icon: '🏦',
    status: 'active',
    transactions: 1245,
    revenue: 1850000000,
    successRate: 98.5,
    avgProcessTime: 120,
    fee: { fixed: 0, percentage: 0 },
    settings: {
      autoSettle: true,
      requireOTP: false,
      maxAmount: 500000000,
      minAmount: 10000,
    },
  },
  {
    id: '2',
    name: 'Ví MoMo',
    code: 'MOMO',
    type: 'ewallet',
    icon: '💳',
    status: 'active',
    transactions: 987,
    revenue: 856000000,
    successRate: 99.2,
    avgProcessTime: 5,
    fee: { fixed: 1000, percentage: 1.5 },
    settings: {
      autoSettle: true,
      requireOTP: true,
      maxAmount: 50000000,
      minAmount: 5000,
    },
  },
  {
    id: '3',
    name: 'ZaloPay',
    code: 'ZALOPAY',
    type: 'ewallet',
    icon: '💰',
    status: 'active',
    transactions: 654,
    revenue: 478000000,
    successRate: 98.8,
    avgProcessTime: 8,
    fee: { fixed: 1000, percentage: 1.2 },
    settings: {
      autoSettle: true,
      requireOTP: true,
      maxAmount: 50000000,
      minAmount: 5000,
    },
  },
  {
    id: '4',
    name: 'VNPay',
    code: 'VNPAY',
    type: 'ewallet',
    icon: '🔵',
    status: 'active',
    transactions: 523,
    revenue: 412000000,
    successRate: 99.0,
    avgProcessTime: 6,
    fee: { fixed: 500, percentage: 1.0 },
    settings: {
      autoSettle: true,
      requireOTP: true,
      maxAmount: 100000000,
      minAmount: 5000,
    },
  },
  {
    id: '5',
    name: 'Thẻ tín dụng/ghi nợ',
    code: 'CARD',
    type: 'card',
    icon: '💳',
    status: 'active',
    transactions: 412,
    revenue: 523000000,
    successRate: 96.5,
    avgProcessTime: 15,
    fee: { fixed: 2000, percentage: 2.5 },
    settings: {
      autoSettle: false,
      requireOTP: true,
      maxAmount: 100000000,
      minAmount: 10000,
    },
  },
  {
    id: '6',
    name: 'Thanh toán khi nhận hàng',
    code: 'COD',
    type: 'cod',
    icon: '💵',
    status: 'active',
    transactions: 1456,
    revenue: 1245000000,
    successRate: 92.3,
    avgProcessTime: 0,
    fee: { fixed: 0, percentage: 0 },
    settings: {
      autoSettle: false,
      requireOTP: false,
      maxAmount: 20000000,
      minAmount: 0,
    },
  },
];

export default function PaymentMethodsManagement() {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(paymentMethods[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMethods = paymentMethods.filter(
    (method) =>
      method.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      method.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeColor = (status: string): 'success' | 'error' => {
    return status === 'active' ? 'success' : 'error';
  };

  const getSuccessRateColor = (rate: number): string => {
    if (rate >= 98) return 'text-green-600 dark:text-green-400';
    if (rate >= 95) return 'text-blue-600 dark:text-blue-400';
    if (rate >= 90) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const formatCurrency = (amount: number): string => {
    if (amount >= 1_000_000_000) {
      return (amount / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
    } else if (amount >= 1_000_000) {
      return (amount / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (amount >= 1_000) {
      return (amount / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    } else {
      return amount.toString();
    }
  };

  const getTypeLabel = (type: string): string => {
    switch (type) {
      case 'bank':
        return 'Ngân hàng';
      case 'ewallet':
        return 'Ví điện tử';
      case 'card':
        return 'Thẻ';
      case 'cod':
        return 'COD';
      default:
        return type;
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left Panel - Methods List */}
      <div className="lg:col-span-5">
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  Phương thức thanh toán
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredMethods.length} phương thức
                </p>
              </div>
              <button className="bg-brand-500 hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-700 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Thêm phương thức
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm phương thức..."
                className="focus:border-brand-500 focus:ring-brand-500/20 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pl-10 text-sm focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <svg
                className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
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

          {/* Methods List */}
          <div className="max-h-[600px] overflow-y-auto p-4">
            <div className="space-y-2">
              {filteredMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method)}
                  className={`w-full rounded-xl border p-4 text-left transition-all ${
                    selectedMethod?.id === method.id
                      ? 'border-brand-500 bg-brand-50 dark:border-brand-600 dark:bg-brand-900/20 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 text-2xl dark:from-gray-800 dark:to-gray-700">
                      {method.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {method.name}
                          </h4>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                              {getTypeLabel(method.type)}
                            </span>
                            <Badge color={getStatusBadgeColor(method.status)} size="sm">
                              {method.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Giao dịch:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {method.transactions.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Doanh thu:</span>
                          <span className="text-brand-600 dark:text-brand-400 font-semibold">
                            {formatCurrency(method.revenue)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Tỉ lệ thành công:
                          </span>
                          <span
                            className={`font-medium ${getSuccessRateColor(method.successRate)}`}
                          >
                            {method.successRate}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Method Details */}
      <div className="lg:col-span-7">
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          {selectedMethod ? (
            <>
              {/* Method Header */}
              <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="dark:border-white-600 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl border border-gray-400 text-3xl shadow-lg">
                      {selectedMethod.icon}
                    </div>
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {selectedMethod.name}
                        </h3>
                        <Badge color={getStatusBadgeColor(selectedMethod.status)}>
                          {selectedMethod.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="rounded-lg bg-gray-100 px-2 py-1 font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                          {getTypeLabel(selectedMethod.type)}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          Mã:{' '}
                          <span className="font-mono font-medium text-gray-700 dark:text-gray-300">
                            {selectedMethod.code}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.03]">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Chỉnh sửa
                    </button>
                  </div>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-1 gap-4 p-6 lg:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <svg
                        className="h-5 w-5 text-blue-600 dark:text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Giao dịch</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {selectedMethod.transactions.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                      <svg
                        className="h-5 w-5 text-green-600 dark:text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Doanh thu</p>
                      <p className={`text-xl font-bold text-brand-500`}>
                        {formatCurrency(selectedMethod.revenue)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                      <svg
                        className="h-5 w-5 text-yellow-600 dark:text-yellow-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Xử lý TB</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {selectedMethod.avgProcessTime}s
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fee Information */}
              <div className="border-t border-gray-200 px-6 py-5 dark:border-gray-800">
                <h4 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
                  Thông tin phí
                </h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                    <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">Phí cố định</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatCurrency(selectedMethod.fee.fixed)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                    <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">Phí theo %</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {selectedMethod.fee.percentage}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Settings Section */}
              <div className="border-t border-gray-200 p-6 dark:border-gray-800">
                <h4 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
                  Cấu hình thanh toán
                </h4>
                <div className="space-y-4">
                  {/* Auto Settle */}
                  <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                    <div className="flex-1">
                      <h5 className="mb-1 font-medium text-gray-900 dark:text-white">
                        Tự động đối soát
                      </h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Tự động xác nhận và đối soát giao dịch thành công
                      </p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        defaultChecked={selectedMethod.settings.autoSettle}
                      />
                      <div className="peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 peer peer-checked:bg-brand-600 h-6 w-11 rounded-full bg-gray-200 peer-focus:ring-4 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700"></div>
                    </label>
                  </div>

                  {/* Require OTP */}
                  <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                    <div className="flex-1">
                      <h5 className="mb-1 font-medium text-gray-900 dark:text-white">
                        Yêu cầu OTP
                      </h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Bắt buộc xác thực OTP khi thanh toán
                      </p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        defaultChecked={selectedMethod.settings.requireOTP}
                      />
                      <div className="peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 peer peer-checked:bg-brand-600 h-6 w-11 rounded-full bg-gray-200 peer-focus:ring-4 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700"></div>
                    </label>
                  </div>

                  {/* Amount Limits */}
                  <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                    <h5 className="mb-3 font-medium text-gray-900 dark:text-white">
                      Giới hạn giao dịch
                    </h5>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm text-gray-600 dark:text-gray-400">
                          Số tiền tối thiểu
                        </label>
                        <input
                          type="text"
                          value={formatCurrency(selectedMethod.settings.minAmount)}
                          readOnly
                          className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm text-gray-600 dark:text-gray-400">
                          Số tiền tối đa
                        </label>
                        <input
                          type="text"
                          value={formatCurrency(selectedMethod.settings.maxAmount)}
                          readOnly
                          className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3">
                  <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.03]">
                    Hủy
                  </button>
                  <button className="bg-brand-600 hover:bg-brand-700 rounded-lg px-4 py-2 text-sm font-medium text-white">
                    Lưu cấu hình
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <svg
                className="mb-4 h-20 w-20 text-gray-400 dark:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                Chọn phương thức thanh toán
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Chọn một phương thức từ danh sách để xem chi tiết và cấu hình
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
