'use client'
import { useState } from "react";
import { useRouter } from 'next/navigation'
import { apiRegister } from "@/services/authService";
import { useToast } from "@/hooks/useToast";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPasswordRules, setShowPasswordRules] = useState(false); // 🔥 NEW: State để ẩn/hiện luật mật khẩu
    const toast = useToast()

    // Danh sách các quy tắc mật khẩu
    const passwordRules = [
        { regex: /.{8,}/, message: "Mật khẩu phải có ít nhất 8 ký tự" },
        { regex: /[A-Z]/, message: "Mật khẩu phải chứa ít nhất 1 chữ hoa" },
        { regex: /[a-z]/, message: "Mật khẩu phải chứa ít nhất 1 chữ thường" },
        { regex: /[0-9]/, message: "Mật khẩu phải chứa ít nhất 1 số" },
        { regex: /[^A-Za-z0-9]/, message: "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt" },
    ];

    // -----------------------------
    // 🔥 VALIDATION HÀM MẠNH
    // -----------------------------
    const validatePassword = (pwd: string) => {
        for (let rule of passwordRules) {
            if (!rule.regex.test(pwd)) return rule.message;
        }
        return null;
    };
    
    // Hàm kiểm tra và trả về trạng thái của từng quy tắc (dùng cho UX)
    const checkPasswordRule = (pwd: string) => {
        return passwordRules.map(rule => ({
            ...rule,
            isValid: rule.regex.test(pwd),
        }));
    };

    // -----------------------------
    // 🔥 SUBMIT FORM
    // -----------------------------
    const handle = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate email
        if (!/\S+@\S+\.\S+/.test(email)) {
            toast.error("Email không hợp lệ");
            return;
        }

        // Validate password
        const pwdError = validatePassword(password);
        if (pwdError) {
            toast.error(pwdError);
            return;
        }

        setLoading(true);

        try {
            await apiRegister({ name, email, password });
            toast.success("Đăng ký thành công! Kiểm tra email để kích hoạt tài khoản trước khi đăng nhập.");
            // Đảm bảo router push đến đường dẫn chính xác (đã sửa từ /LoginScreen thành /login nếu dùng Next.js convention)
            router.push("/LoginScreen"); 
        } catch (err: any) {
            const msg = err?.response?.data?.message || err?.message || "Đăng ký thất bại";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        // Container chính: Đã responsive tốt, giữ nguyên
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 sm:py-20">

            {/* Form Container */}
            <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg bg-white p-6 sm:p-8 lg:p-10 rounded-2xl shadow-xl border border-slate-100">

                <h2 className="text-3xl font-extrabold text-slate-800 text-center mb-2">
                    Tạo Tài Khoản Mới 📝
                </h2>
                <p className="text-center text-slate-500 mb-8">
                    Tham gia Tailadmin để nhận các ưu đãi độc quyền.
                </p>

                <form onSubmit={handle} className="space-y-5">

                    {/* Input Họ và tên */}
                    <input
                        className="w-full p-4 rounded-xl border border-slate-300 bg-slate-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition duration-150 text-slate-700 placeholder:text-slate-400"
                        placeholder="Họ và tên"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    {/* Input Email */}
                    <input
                        className="w-full p-4 rounded-xl border border-slate-300 bg-slate-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition duration-150 text-slate-700 placeholder:text-slate-400"
                        type="email"
                        placeholder="Địa chỉ Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    {/* Input Mật khẩu */}
                    <div>
                        <input
                            className="w-full p-4 rounded-xl border border-slate-300 bg-slate-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition duration-150 text-slate-700 placeholder:text-slate-400"
                            placeholder="Mật khẩu"
                            type="password"
                            value={password}
                            minLength={8}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setShowPasswordRules(true)} // Hiện luật khi focus
                            onBlur={() => setShowPasswordRules(false)} // Ẩn luật khi blur
                            required
                        />
                        {/* 🔥 NEW: Component hiển thị trạng thái Mật khẩu mạnh */}
                        {showPasswordRules && (
                            <div className="mt-2 p-3 bg-white border border-slate-200 rounded-lg shadow-inner text-sm space-y-1 transition-opacity duration-300">
                                <p className="text-slate-700 font-semibold mb-1">Yêu cầu Mật khẩu Mạnh:</p>
                                {checkPasswordRule(password).map((rule, index) => (
                                    <div key={index} className="flex items-center">
                                        <span className={`w-3 h-3 flex items-center justify-center mr-2 rounded-full ${rule.isValid ? 'bg-green-500' : 'bg-red-400'}`}>
                                            {rule.isValid ? 
                                                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg> 
                                                : 
                                                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                                            }
                                        </span>
                                        <span className={rule.isValid ? 'text-green-700' : 'text-slate-500'}>{rule.message}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Button Submit */}
                    <button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-4 rounded-xl shadow-lg shadow-blue-500/30 transition duration-300 ease-in-out transform hover:scale-[1.005] active:scale-100 disabled:bg-blue-400"
                        disabled={loading}
                    >
                        {loading ? "Đang xử lý..." : "Đăng ký tài khoản"}
                    </button>

                </form>

                {/* Chuyển hướng đăng nhập */}
                <div className="mt-8 text-center text-sm">
                    <p className="text-slate-500">
                        Bạn đã có tài khoản?
                        <a
                            // Đã sửa đường dẫn thành /LoginScreen
                            href={'/LoginScreen'} 
                            className="text-blue-600 font-semibold hover:text-blue-700 ml-1 transition"
                        >
                            Đăng nhập ngay
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}