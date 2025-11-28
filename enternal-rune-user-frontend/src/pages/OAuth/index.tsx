"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/types/User";

export default function OAuthSuccessPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { login } = useAuth();
  
  const token = params?.get("token");
  const loginUser = params?.get("user");
  const role = params?.get("role") || "ROLE_USER";

  useEffect(() => {
    if (token && loginUser) {
      const user: User = JSON.parse(decodeURIComponent(loginUser)) || null;
      
      login(token, user);
      
      localStorage.setItem("userRole", role);
      localStorage.setItem("isLoggedIn", "true");
      
      window.dispatchEvent(new Event("userSessionChanged"));
      setTimeout(() => router.push("/"), 1500);
    }
  }, [token, loginUser, role, router, login]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800">
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 flex items-center justify-center w-14 h-14 rounded-full bg-blue-50">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-7 h-7"
          />
        </div>
        <h1 className="text-2xl font-semibold text-blue-700 mb-2">
          Đang đăng nhập Google...
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Vui lòng chờ trong giây lát để hoàn tất phiên đăng nhập.
        </p>
        <div className="relative w-40 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="absolute top-0 left-0 h-full bg-blue-600 animate-progress" />
        </div>
      </div>
      <style jsx>{`
        @keyframes progress {
          0% {
            left: -40%;
            width: 40%;
          }
          50% {
            left: 30%;
            width: 60%;
          }
          100% {
            left: 100%;
            width: 80%;
          }
        }
        .animate-progress {
          animation: progress 1.4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
