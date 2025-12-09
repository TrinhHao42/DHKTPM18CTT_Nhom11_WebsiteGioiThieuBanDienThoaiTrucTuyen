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
  description: string;
};

const paymentMethods: PaymentMethod[] = [
  {
    id: '1',
    name: 'Chuyển khoản ngân hàng',
    code: 'BANK_TRANSFER',
    type: 'bank',
    icon: '🏦',
    status: 'active',
    description: 'Chuyển khoản trực tiếp qua ngân hàng'
  },
  {
    id: '2',
    name: 'Ví MoMo',
    code: 'MOMO',
    type: 'ewallet',
    icon: '💳',
    status: 'active',
    description: 'Thanh toán qua ví điện tử MoMo'
  },
  {
    id: '3',
    name: 'ZaloPay',
    code: 'ZALOPAY',
    type: 'ewallet',
    icon: '💰',
    status: 'active',
    description: 'Thanh toán qua ví điện tử ZaloPay'
  },
  {
    id: '4',
    name: 'VNPay',
    code: 'VNPAY',
    type: 'ewallet',
    icon: '🔵',
    status: 'active',
    description: 'Thanh toán qua cổng VNPay'
  },
  {
    id: '5',
    name: 'Thẻ tín dụng/ghi nợ',
    code: 'CARD',
    type: 'card',
    icon: '💳',
    status: 'inactive',
    description: 'Thanh toán bằng thẻ tín dụng hoặc ghi nợ'
  },
  {
    id: '6',
    name: 'Thanh toán khi nhận hàng',
    code: 'COD',
    type: 'cod',
    icon: '💵',
    status: 'active',
    description: 'Thanh toán khi nhận hàng (COD)'
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

  const toggleMethodStatus = (methodId: string) => {
    // This would be API call in real implementation
    console.log(`Toggle status for method: ${methodId}`);
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
                  Quản lý các phương thức thanh toán
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm phương thức..."
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

          {/* Methods List */}
          <div className="max-h-[600px] overflow-y-auto p-4">
            <div className="space-y-2">
              {filteredMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => setSelectedMethod(method)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all ${
                    selectedMethod?.id === method.id
                      ? 'border-brand-500 bg-brand-50 shadow-sm dark:border-brand-600 dark:bg-brand-900/20'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-xl dark:bg-gray-800">
                      {method.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {method.name}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {getTypeLabel(method.type)} • {method.code}
                          </p>
                        </div>
                        <Badge color={getStatusBadgeColor(method.status)}>
                          {method.status === 'active' ? 'Hoạt động' : 'Tắt'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Method Details */}
      <div className="lg:col-span-7">
        {selectedMethod ? (
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-xl dark:bg-gray-800">
                    {selectedMethod.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                      {selectedMethod.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {getTypeLabel(selectedMethod.type)}
                    </p>
                  </div>
                </div>
                <Badge color={getStatusBadgeColor(selectedMethod.status)}>
                  {selectedMethod.status === 'active' ? 'Hoạt động' : 'Tắt'}
                </Badge>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h4 className="mb-3 font-medium text-gray-900 dark:text-white">
                    Thông tin cơ bản
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Mã phương thức</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedMethod.code}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Loại</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {getTypeLabel(selectedMethod.type)}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Mô tả</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedMethod.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status Control */}
                <div>
                  <h4 className="mb-3 font-medium text-gray-900 dark:text-white">
                    Điều khiển trạng thái
                  </h4>
                  <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedMethod.status === 'active' 
                          ? 'Phương thức đang hoạt động' 
                          : 'Phương thức đã tắt'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedMethod.status === 'active'
                          ? 'Khách hàng có thể sử dụng phương thức này để thanh toán'
                          : 'Phương thức này không khả dụng cho khách hàng'}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleMethodStatus(selectedMethod.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
                        selectedMethod.status === 'active'
                          ? 'bg-brand-600'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          selectedMethod.status === 'active' ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Configuration Note */}
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-blue-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Lưu ý:</strong> Cấu hình phương thức thanh toán được quản lý ở cấp độ hệ thống. 
                        Các thay đổi sẽ ảnh hưởng đến tất cả giao dịch mới.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="text-center text-gray-500 dark:text-gray-400">
              Chọn một phương thức thanh toán để xem chi tiết
            </div>
          </div>
        )}
      </div>
    </div>
  );
}