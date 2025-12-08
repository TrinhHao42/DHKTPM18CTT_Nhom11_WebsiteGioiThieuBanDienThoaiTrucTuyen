"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import CouponForm from "@/components/coupons/CouponForm";

export default function EditCouponPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  return (
    <div className="p-6">
      <CouponForm 
        discountId={Number(id)}
        onSuccess={() => router.push("/coupons")}
        onCancel={() => router.back()}
      />
    </div>
  );
}
