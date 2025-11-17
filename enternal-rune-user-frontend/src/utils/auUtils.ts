import { User } from "@/types/User";

export type UserSession = {
    isLoggedIn: boolean;
    user: User | null;
    role: string | null;
};
export const getUserSession = (): UserSession => {
    if (typeof window === "undefined") {
        return { isLoggedIn: false, user: null, role: null };
    }

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const role = localStorage.getItem("userRole");

    return {
        isLoggedIn: !!token && !!user,
        user: user ? JSON.parse(user) : null,
        role,
    };
};

export const saveUserSession = (token: string, user: User, role: string) => {
    if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userRole", role);
        window.dispatchEvent(new Event("userSessionChanged"));
    }
};

export const handleLogout = () => {
    if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user"); // ✅ Fix: remove "user" not "username"
        localStorage.removeItem("userRole");
        localStorage.removeItem("cart"); // ✅ Clear cart on logout
        window.dispatchEvent(new Event("userSessionChanged"));
        window.location.href = '/';
    }
};
