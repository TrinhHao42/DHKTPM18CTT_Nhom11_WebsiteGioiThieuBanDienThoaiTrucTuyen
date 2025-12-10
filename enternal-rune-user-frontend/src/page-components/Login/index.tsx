'use client'
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import { apiLogin, apiExchangeGoogleCode, LoginResp } from "@/services/authService";
import { saveUserSession } from "@/utils/auUtils";
import { User } from "@/types/User";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/useToast";

type ApiError = Error & { message?: string };

export default function LoginPage() {
    const router = useRouter();
    const { login ,token} = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const toast = useToast()

    const handleAuthSuccess = (res: LoginResp) => {
        // 1. Lưu vào AuthContext (sẽ tự động trigger load cart)
        login(res.token, res.user as User);

        // 2. Lưu userRole
        const userRole = res.roles.find(role => role === 'ROLE_ADMIN' || role === 'ROLE_USER') || 'ROLE_USER';
        localStorage.setItem('userRole', userRole);

        // 3. Redirect theo role
        const isAdmin = res.roles.includes('ROLE_ADMIN');
        if (isAdmin) {
            router.push("/Admin");
        } else {
            router.push("/");
        }
    };
    useEffect(() => {
        if (token) {
            router.push("/"); 
        }
    }, [token, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res: LoginResp = await apiLogin({ email, password });
            saveUserSession(res.token, res.user as User, res.roles?.[0] || "ROLE_USER");
            toast.success("Đăng nhập thành công!");
            handleAuthSuccess(res);
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data ||
                err?.message ||
                "Đăng nhập thất bại";

            if (msg.includes("kích hoạt")) {
                toast.error("Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email!");
            } else {
                toast.error(msg);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    };

    return (
        // Tối ưu container chính: min-h-screen để đảm bảo chiều cao, sử dụng grid cho bố cục 2 cột
        // Trên mobile, sẽ chỉ hiển thị 1 cột (form), quảng cáo sẽ bị ẩn
        <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50 overflow-hidden">

            {/* Script Google Sign-In (giữ nguyên) */}
            <script src="https://accounts.google.com/gsi/client" async defer></script>

            {/* Cột Quảng cáo (Chỉ hiển thị trên Large screens trở lên) */}
            <div className="hidden lg:flex flex-col items-center justify-center relative bg-white border-l border-slate-200">
                <div className="absolute inset-0 bg-blue-50/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,#f1f5f9)]"></div>
                <img
                    src="/images/iphone_card.png"
                    alt="Sản phẩm nổi bật"
                    // Điều chỉnh kích thước ảnh linh hoạt hơn (max-w)
                    className="max-w-sm xl:max-w-md 2xl:max-w-lg w-full drop-shadow-2xl transition-all duration-700 hover:scale-[1.02] cursor-pointer"
                />
                <div className="absolute bottom-12 text-center px-4">
                    <h3 className="text-2xl font-bold text-slate-800">EnternalRune - Công Nghệ Dẫn Đầu</h3>
                    <p className="text-slate-500 mt-2">Đăng nhập để nhận ưu đãi lên đến 15% cho đơn hàng đầu tiên.</p>
                </div>
            </div>

            {/* Cột Form Đăng nhập */}
            <div className="flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-white lg:bg-transparent">
                <div className="w-full max-w-sm sm:max-w-md bg-white p-6 sm:p-8 lg:p-10 rounded-2xl lg:shadow-none border border-slate-100 lg:border-none shadow-xl">

                    <h1 className="text-3xl font-extrabold text-slate-800 mb-2 text-center lg:text-left">
                        Chào mừng trở lại!
                    </h1>
                    <p className="text-slate-500 mb-8 text-center lg:text-left">
                        Tiếp tục mua sắm các sản phẩm công nghệ tại Tailadmin.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <input
                            className="w-full p-4 rounded-xl border border-slate-300 bg-slate-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition duration-150 text-slate-700"
                            placeholder="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            className="w-full p-4 rounded-xl border border-slate-300 bg-slate-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition duration-150 text-slate-700"
                            type="password"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-4 rounded-xl shadow-lg shadow-blue-500/30 transition duration-300 ease-in-out transform hover:scale-[1.005] active:scale-100 disabled:bg-blue-400"
                            disabled={loading}
                        >
                            {loading ? "Đang xử lý..." : "Đăng nhập"}
                        </button>
                    </form>

                    <div className="my-6 flex items-center gap-3">
                        <div className="flex-grow h-px bg-slate-200" />
                        <span className="text-slate-400 text-sm font-medium">HOẶC</span>
                        <div className="flex-grow h-px bg-slate-200" />
                    </div>

                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full border border-slate-300 p-4 rounded-xl flex items-center justify-center gap-3 bg-white hover:bg-blue-50 transition duration-150 active:scale-[0.99] shadow-sm"
                        aria-label="Đăng nhập bằng Google"
                    >
                        {/* SVG Icon cho Google (giữ nguyên) */}
                        <svg
                            viewBox="0 0 24 24"
                            className="w-5 h-5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M12.484 12.028v2.732h4.942c-.173 1.139-.774 2.128-1.638 2.768v3.568h4.587c2.7-2.5 4.26-6.26 4.26-10.378 0-.825-.133-1.626-.38-2.39H12.484v2.093z" fill="#4285F4"></path>
                            <path d="M12.484 24c3.27 0 6.004-1.08 8-2.912l-4.587-3.568c-1.26 1.157-2.887 1.83-4.593 1.83-3.57 0-6.612-2.37-7.697-5.617H0v3.66C2.07 21.9 6.84 24 12.484 24z" fill="#34A853"></path>
                            <path d="M4.787 14.654c-.212-.64-.335-1.32-.335-2.026 0-.705.123-1.385.335-2.025V6.94H.195C-.114 7.55-.195 8.24-.195 9.073c0 1.61.46 3.12 1.35 4.41l3.597 1.171z" fill="#FBBC05"></path>
                            <path d="M12.484 4.143c2.203 0 3.993.754 5.214 1.84L20.27 2.39C18.114.86 15.38 0 12.484 0C6.84 0 2.07 2.1 0 6.043l4.59 3.61c1.085-3.25 4.127-5.61 7.894-5.61z" fill="#EA4335"></path>
                        </svg>
                        <span className="text-slate-700 font-semibold">Đăng nhập với Google</span>
                    </button>

                    <div className="mt-6 text-sm flex justify-between text-slate-500 font-medium">
                        <a href="/ForgotPasswordScreen" className="text-blue-600 hover:text-blue-800 transition">
                            Quên mật khẩu?
                        </a>
                        <a href="/RegisterScreen" className="text-blue-600 hover:text-blue-800 transition">
                            Tạo tài khoản mới
                        </a>
                    </div>

                    <div className="mt-8 text-center text-xs text-slate-400">
                        &copy; {new Date().getFullYear()} Tailadmin. All rights reserved.
                    </div>
                </div>
            </div>
        </div>
    );
}