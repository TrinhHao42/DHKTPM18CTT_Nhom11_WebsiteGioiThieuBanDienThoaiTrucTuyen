// @/pages/coupons/new/page.jsx hoặc tương tự
'use client'
import React from "react";
import CouponForm from "@/components/coupons/CouponForm";
import { useRouter } from "next/navigation"; // <-- Cần import

const NewCouponPage = () => {
  const router = useRouter(); // <-- Cần khai báo
  return (
    <div className="p-6">
      <CouponForm
        onSuccess={() => router.push("/coupons")} // Thay vì console.log, chuyển về trang danh sách
        onCancel={() => router.back()} // <-- Dùng router.back()
      />
    </div>
  );
};

export default NewCouponPage;