"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, roles } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      // Nếu chưa đăng nhập, redirect về trang login
      if (!isAuthenticated) {
        router.push("/signin");
        return;
      }

      // Kiểm tra role admin
      const isAdmin = roles.some(
        (role) => role === "ROLE_ADMIN" || role === "ADMIN"
      );

      if (!isAdmin) {
        // Nếu không phải admin, có thể redirect về trang unauthorized hoặc login
        router.push("/signin");
        return;
      }
    }
  }, [isAuthenticated, isLoading, roles, router, pathname]);

  // Hiển thị loading khi đang kiểm tra auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Nếu chưa xác thực hoặc không phải admin, không hiển thị gì (sẽ redirect)
  if (!isAuthenticated || !roles.some((role) => role === "ROLE_ADMIN" || role === "ADMIN")) {
    return null;
  }

  // Nếu đã xác thực và là admin, hiển thị children
  return <>{children}</>;
}
