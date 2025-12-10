'use client'
import { useState } from "react";
import { apiVerifyResetCode, apiResetPassword } from "@/services/authService";
import { useToast } from "@/hooks/useToast";
import { useRouter, useSearchParams } from "next/navigation";
export default function ResetPassword() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialEmail = searchParams.get("email") || "";
    const [email, setEmail] = useState(initialEmail);
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isCodeVerified, setIsCodeVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useToast()
    // -----------------------------
    // 🔥 VALIDATION MẬT KHẨU MẠNH
    // -----------------------------
    const validatePassword = (pwd: string) => {
        const rules = [
            { regex: /.{8,}/, message: "Mật khẩu phải có ít nhất 8 ký tự" },
            { regex: /[A-Z]/, message: "Mật khẩu phải chứa ít nhất 1 chữ hoa" },
            { regex: /[a-z]/, message: "Mật khẩu phải chứa ít nhất 1 chữ thường" },
            { regex: /[0-9]/, message: "Mật khẩu phải chứa ít nhất 1 số" },
            { regex: /[^A-Za-z0-9]/, message: "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt" },
        ];

        for (let rule of rules) {
            if (!rule.regex.test(pwd)) return rule.message;
        }
        return null;
    };

    // -------------------------------------
    // 🔥 Xử lý xác minh mã code
    // -------------------------------------
    const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            await apiVerifyResetCode(email, code);
            setIsCodeVerified(true);
            toast.success("Mã hợp lệ. Vui lòng nhập mật khẩu mới.");
        } catch (err: any) {
            toast.warning(err.message || "Mã không hợp lệ. Vui lòng kiểm tra lại.");
        } finally {
            setLoading(false);
        }
    };

    // -------------------------------------
    // 🔥 Xử lý đặt lại mật khẩu
    // -------------------------------------
    const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const pwdError = validatePassword(newPassword);
        if (pwdError) {
            toast.error(pwdError);
            return;
        }

        setLoading(true);
        try {
            await apiResetPassword(email, code, newPassword);
            toast.success("Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay.");
            router.push("/LoginScreen");
        } catch (err: any) {
            toast.error(err.message || "Không thể đặt lại mật khẩu. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-50 px-4 py-10">
            <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-2xl border border-slate-100">

                <h2 className="text-3xl font-bold text-slate-800 text-center mb-2">
                    Đặt Lại Mật Khẩu
                </h2>

                <p className="text-center text-slate-500 mb-8 text-base">
                    {isCodeVerified
                        ? "Bước 2: Tạo mật khẩu mới an toàn."
                        : "Bước 1: Nhập mã xác minh đã gửi đến email của bạn."
                    }
                </p>

                {/* FORM NHẬP MÃ */}
                {!isCodeVerified && (
                    <form onSubmit={handleVerify} className="space-y-5">
                        <input
                            className="w-full p-4 rounded-xl border border-slate-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none transition duration-150 text-slate-700 placeholder:text-slate-400 text-lg"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={initialEmail.length > 0}
                            type="email"
                            required
                        />

                        <input
                            className="w-full p-4 rounded-xl border border-slate-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none transition duration-150 text-slate-700 placeholder:text-slate-400 text-lg text-center tracking-widest"
                            placeholder="Mã xác minh (6 chữ số)"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            maxLength={6}
                            required
                        />

                        <button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-4 rounded-xl shadow-lg shadow-blue-500/30 transition duration-300 disabled:bg-blue-400"
                            disabled={loading || code.length < 6}
                        >
                            {loading ? "Đang xác minh..." : "Xác Minh Mã"}
                        </button>
                    </form>
                )}

                {/* FORM NHẬP MẬT KHẨU */}
                {isCodeVerified && (
                    <form onSubmit={handleReset} className="space-y-5">
                        <input
                            className="w-full p-4 rounded-xl border border-slate-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none transition duration-150 text-slate-700 placeholder:text-slate-400 text-lg"
                            placeholder="Mật khẩu mới (tối thiểu 8 ký tự)"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            minLength={8}
                            required
                        />

                        <button
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold p-4 rounded-xl shadow-lg shadow-green-500/30 transition duration-300 disabled:bg-green-400"
                            disabled={loading || newPassword.length < 8}
                        >
                            {loading ? "Đang đặt lại..." : "Đặt Lại Mật Khẩu"}
                        </button>
                    </form>
                )}

                {/* LINK QUAY LẠI */}
                <div className="mt-8 text-center text-sm">
                    <p className="text-slate-500">
                        <a
                            href={'/LoginScreen'}
                            className="text-blue-600 font-semibold hover:text-blue-800 transition"
                        >
                            Quay lại Đăng nhập
                        </a>
                    </p>
                </div>

            </div>
        </div>
    );
}
