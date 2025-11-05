'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Cart } from "@/lib/icons";
import { getUserSession, handleLogout } from "@/utils/auUtils";

export const Navbar = () => {
    const [open, setOpen] = useState(false);
    const { cartQuantity } = useCart();
    const [user, setUser] = useState(getUserSession());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Cập nhật user khi nhận event "userSessionChanged"
        const handleUserSessionChange = () => {
            setUser(getUserSession());
        };

        // Lắng nghe 2 loại event
        window.addEventListener("userSessionChanged", handleUserSessionChange);
        window.addEventListener("storage", handleUserSessionChange);

        // Cleanup khi component unmount
        return () => {
            window.removeEventListener("userSessionChanged", handleUserSessionChange);
            window.removeEventListener("storage", handleUserSessionChange);
        };
    }, []);


    if (!mounted) return null;

    return (
        <header className="flex items-center justify-between px-6 md:px-16 py-5 border-b border-gray-200 bg-white">
            <Link href="/">
                <Image
                    src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/dummyLogo/prebuiltuiDummyLogo.svg"
                    alt="Logo"
                    width={100}
                    height={100}
                />
            </Link>

            <nav
                className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:h-full items-center justify-center ${open ? "max-md:w-full" : "max-md:w-0"
                    } transition-[width] max-md:bg-white/50 backdrop-blur flex-col md:flex-row flex gap-8 text-gray-900 text-sm font-semibold`}
            >
                <Link href="#" className="hover:text-blue-600">
                    Sản phẩm
                </Link>
                <Link href="#" className="hover:text-blue-600">
                    Câu chuyện khách hàng
                </Link>
                <Link href="#" className="hover:text-blue-600">
                    Bảng giá
                </Link>
                <Link href="#" className="hover:text-blue-600">
                    Tài liệu
                </Link>
                <button
                    id="closeMenu"
                    className="md:hidden text-gray-600"
                    onClick={() => setOpen(false)}
                >
                    <X className="w-6 h-6" />
                </button>
            </nav>

            <div className="hidden md:flex space-x-4 items-center">
                {/* Giỏ hàng */}
                <Link href="/CartScreen" className="relative px-5 py-2">
                    <Cart style={{ color: "gray", width: "24px", height: "24px" }} />
                    {cartQuantity > 0 && (
                        <span className="absolute top-0 right-1 px-2 py-1 text-xs font-bold text-white bg-amber-500 rounded-full">
                            {cartQuantity}
                        </span>
                    )}
                </Link>

                {user.isLoggedIn ? (
                    <>
                        <span className="text-sm text-gray-700">
                            Hi,{" "}
                            <strong className="text-blue-600">
                                {user.username?.split("@")[0] ?? user.username}
                            </strong>
                        </span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-5 py-2 rounded-full text-sm hover:bg-red-600 transition"
                        >
                            Đăng xuất
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            href="/LoginScreen"
                            className="text-blue-600 bg-blue-100 px-5 py-2 rounded-full text-sm hover:bg-blue-200"
                        >
                            Đăng nhập
                        </Link>
                        <Link
                            href="/RegisterScreen"
                            className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm hover:bg-blue-700"
                        >
                            Đăng ký
                        </Link>
                    </>
                )}

            </div>
            <button
                id="openMenu"
                className="md:hidden text-gray-600"
                onClick={() => setOpen(true)}
            >
                <Menu className="w-6 h-6" />
            </button>
        </header>
    );
};
