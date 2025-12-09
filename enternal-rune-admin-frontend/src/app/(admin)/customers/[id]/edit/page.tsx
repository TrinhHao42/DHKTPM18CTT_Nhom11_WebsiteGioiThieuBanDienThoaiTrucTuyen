import type { Metadata } from "next";
import React from "react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chỉnh sửa khách hàng | Admin Dashboard",
  description: "Chỉnh sửa thông tin khách hàng",
};

// Mock function to get customer data (replace with actual API call)
function getCustomerById(id: string) {
  return {
    id: id,
    name: "Nguyễn Văn An",
    email: "nguyenvanan@email.com",
    phone: "0901234567",
    dateOfBirth: "1990-05-15",
    gender: "male",
    address: "123 Đường Lê Lợi",
    ward: "Phường Bến Nghé",
    district: "Quận 1",
    province: "TP. Hồ Chí Minh",
    notes: "Khách hàng VIP, ưu tiên phục vụ",
    status: "vip" as 'active' | 'inactive' | 'vip',
    customerType: "retail",
    discountPercent: 10,
    avatar: "/images/user/user-01.png",
  };
}

interface EditCustomerPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCustomerPage({ params }: EditCustomerPageProps) {
  const { id } = await params;
  const customer = getCustomerById(id);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/customers"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </Link>
            <h1 className="text-title-md font-bold text-gray-800 dark:text-white/90">
              Chỉnh sửa khách hàng
            </h1>
          </div>
          <p className="text-theme-sm text-gray-500 dark:text-gray-400">
            Cập nhật thông tin khách hàng {customer.name}
          </p>
        </div>
      </div>

      {/* Form Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="text-theme-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
              Thông tin cá nhân
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-theme-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Họ và tên <span className="text-error-600">*</span>
                </label>
                <input
                  type="text"
                  defaultValue={customer.name}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  placeholder="Nhập họ và tên"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-theme-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email <span className="text-error-600">*</span>
                  </label>
                  <input
                    type="email"
                    defaultValue={customer.email}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-theme-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Số điện thoại <span className="text-error-600">*</span>
                  </label>
                  <input
                    type="tel"
                    defaultValue={customer.phone}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    placeholder="0901234567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-theme-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    defaultValue={customer.dateOfBirth}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-theme-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Giới tính
                  </label>
                  <select
                    defaultValue={customer.gender}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="text-theme-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
              Địa chỉ
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-theme-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  defaultValue={customer.address}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  placeholder="Số nhà, tên đường"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-theme-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tỉnh/Thành phố
                  </label>
                  <select
                    defaultValue={customer.province}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  >
                    <option value="">Chọn Tỉnh/TP</option>
                    <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Cần Thơ">Cần Thơ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-theme-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quận/Huyện
                  </label>
                  <select
                    defaultValue={customer.district}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  >
                    <option value="">Chọn Quận/Huyện</option>
                    <option value="Quận 1">Quận 1</option>
                    <option value="Quận 2">Quận 2</option>
                    <option value="Quận 3">Quận 3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-theme-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phường/Xã
                  </label>
                  <select
                    defaultValue={customer.ward}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  >
                    <option value="">Chọn Phường/Xã</option>
                    <option value="Phường Bến Nghé">Phường Bến Nghé</option>
                    <option value="Phường Bến Thành">Phường Bến Thành</option>
                    <option value="Phường Cầu Kho">Phường Cầu Kho</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="text-theme-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
              Thông tin bổ sung
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-theme-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ghi chú
                </label>
                <textarea
                  rows={4}
                  defaultValue={customer.notes}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  placeholder="Ghi chú về khách hàng"
                />
              </div>
            </div>
          </div>

          {/* Avatar Upload */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="text-theme-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
              Ảnh đại diện
            </h3>
            
            {/* Current Avatar */}
            <div className="mb-4">
              <label className="block text-theme-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ảnh hiện tại
              </label>
              <div className="flex items-center gap-4">
                <img
                  src={customer.avatar}
                  alt={customer.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                />
                <button
                  type="button"
                  className="px-4 py-2 text-theme-sm text-error-600 hover:text-error-700 font-medium"
                >
                  Xóa ảnh
                </button>
              </div>
            </div>

            {/* Upload New Avatar */}
            <div>
              <label className="block text-theme-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tải ảnh mới
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center dark:border-gray-700">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <p className="mt-2 text-theme-sm text-gray-600 dark:text-gray-400">
                  Kéo thả ảnh vào đây hoặc{" "}
                  <button type="button" className="text-brand-600 hover:text-brand-700">
                    chọn file
                  </button>
                </p>
                <p className="text-theme-xs text-gray-500 dark:text-gray-500">
                  PNG, JPG tới 5MB
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Status */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="text-theme-base font-semibold text-gray-800 dark:text-white/90 mb-4">
              Trạng thái
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="vip"
                  defaultChecked={customer.status === "vip"}
                  className="w-4 h-4 text-brand-600 focus:ring-brand-500"
                />
                <span className="text-theme-sm text-gray-700 dark:text-gray-300">
                  VIP
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  defaultChecked={customer.status === "active"}
                  className="w-4 h-4 text-brand-600 focus:ring-brand-500"
                />
                <span className="text-theme-sm text-gray-700 dark:text-gray-300">
                  Hoạt động
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="inactive"
                  defaultChecked={customer.status === "inactive"}
                  className="w-4 h-4 text-brand-600 focus:ring-brand-500"
                />
                <span className="text-theme-sm text-gray-700 dark:text-gray-300">
                  Không hoạt động
                </span>
              </label>
            </div>
          </div>

          {/* Customer Type */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="text-theme-base font-semibold text-gray-800 dark:text-white/90 mb-4">
              Loại khách hàng
            </h3>
            <select
              defaultValue={customer.customerType}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value="retail">Bán lẻ</option>
              <option value="wholesale">Bán sỉ</option>
              <option value="distributor">Nhà phân phối</option>
            </select>
          </div>

          {/* Discount */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="text-theme-base font-semibold text-gray-800 dark:text-white/90 mb-4">
              Ưu đãi
            </h3>
            <div>
              <label className="block text-theme-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phần trăm giảm giá (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                defaultValue={customer.discountPercent}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                placeholder="0"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="space-y-3">
              <button className="w-full px-4 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium text-theme-sm">
                Lưu thay đổi
              </button>
              <Link
                href="/customers"
                className="block w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-theme-sm text-center dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Hủy
              </Link>
              <button
                type="button"
                className="w-full px-4 py-2.5 bg-error-50 text-error-600 rounded-lg hover:bg-error-100 font-medium text-theme-sm dark:bg-error-900/20 dark:hover:bg-error-900/30"
              >
                Xóa khách hàng
              </button>
            </div>
          </div>

          {/* Customer Info */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="text-theme-base font-semibold text-gray-800 dark:text-white/90 mb-4">
              Thông tin
            </h3>
            <div className="space-y-3 text-theme-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">ID:</span>
                <span className="text-gray-800 dark:text-gray-200 font-medium">
                  #{customer.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Tổng đơn:</span>
                <span className="text-gray-800 dark:text-gray-200">
                  45 đơn
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Tổng chi:</span>
                <span className="text-gray-800 dark:text-gray-200 font-semibold">
                  127,450,000đ
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Tạo lúc:</span>
                <span className="text-gray-800 dark:text-gray-200">
                  01/01/2024
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
