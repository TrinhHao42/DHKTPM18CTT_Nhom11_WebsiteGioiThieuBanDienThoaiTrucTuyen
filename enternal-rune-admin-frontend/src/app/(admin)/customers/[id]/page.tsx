"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import { customerService } from "@/services/customerService";
import { UserDetailResponse } from "@/types/customer";
import Image from "next/image";
import Badge from "@/components/ui/badge/Badge";
import Link from "next/link";

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = Number(params.id);

  const [customer, setCustomer] = useState<UserDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await customerService.getDetail(customerId);
        setCustomer(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch customer detail");
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchCustomer();
    }
  }, [customerId]);

  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
      return;
    }

    try {
      await customerService.deleteCustomer(customerId);
      router.push("/customers");
    } catch (error) {
      console.error("Xóa khách hàng thất bại:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageBreadCrumb pageTitle="Chi tiết khách hàng" />
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-brand-600" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="space-y-6">
        <PageBreadCrumb pageTitle="Chi tiết khách hàng" />
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex flex-col items-center justify-center py-12">
            <svg
              className="h-12 w-12 text-gray-400 dark:text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              {error || "Không tìm thấy khách hàng"}
            </p>
            <Link
              href="/customers"
              className="mt-4 text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-500"
            >
              ← Quay lại danh sách
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const defaultAvatar = "/images/user/user-01.jpg";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <PageBreadCrumb pageTitle="Chi tiết khách hàng" />
        <div className="flex gap-3">
          <Link
            href="/customers"
            className="text-theme-sm shadow-theme-xs inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Quay lại
          </Link>
          <button
            onClick={handleDelete}
            className="text-theme-sm shadow-theme-xs inline-flex items-center gap-2 rounded-lg border border-error-600 bg-white px-4 py-2.5 font-medium text-error-600 hover:bg-error-50 dark:border-error-600 dark:bg-gray-800 dark:hover:bg-error-950"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Xóa khách hàng
          </button>
        </div>
      </div>

      {/* Customer Info */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex flex-col items-center">
            <div className="h-24 w-24 overflow-hidden rounded-full">
              <Image
                width={96}
                height={96}
                src={defaultAvatar}
                className="h-24 w-24 object-cover"
                alt={customer.name}
              />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white/90">
              {customer.name}
            </h3>
            <div className="mt-2">
              <Badge
                size="sm"
                color={customer.activate ? "success" : "error"}
              >
                {customer.activate ? "Đã kích hoạt" : "Chưa kích hoạt"}
              </Badge>
            </div>

            <div className="mt-6 w-full space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-gray-600 dark:text-gray-400">{customer.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Stats */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
              Thống kê mua hàng
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Tổng đơn hàng</p>
                <p className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">
                  {customer.totalOrder}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Tổng chi tiêu</p>
                <p className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">
                  {customer.totalPrice.toLocaleString("vi-VN")} ₫
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Addresses */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
              Địa chỉ giao hàng ({customer.addresses?.length || 0})
            </h4>
            {customer.addresses && customer.addresses.length > 0 ? (
              <div className="space-y-3">
                {customer.addresses.map((address, index) => (
                  <div
                    key={address.id || index}
                    className="rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white/90">
                          {address.recipientName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {address.phoneNumber}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {address.detailAddress}, {address.ward}, {address.district},{" "}
                          {address.province}
                        </p>
                      </div>
                      {address.isDefault && (
                        <Badge size="sm" color="primary">
                          Mặc định
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Chưa có địa chỉ giao hàng
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
