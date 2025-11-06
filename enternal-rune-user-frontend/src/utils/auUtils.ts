// src/utils/authUtils.ts
export type UserSession = {
    isLoggedIn: boolean;
    username: string | null;
    role: string | null;
};

export const getUserSession = (): UserSession => {
    if (typeof window === "undefined") {
        return { isLoggedIn: false, username: null, role: null };
    }

    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("userRole");

    return {
        isLoggedIn: !!token && !!username,
        username,
        role,
    };
};

export const saveUserSession = (token: string, username: string, role: string) => {
    if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        localStorage.setItem("userRole", role);
        window.dispatchEvent(new Event("userSessionChanged"));
    }
};

export const handleLogout = () => {
    if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("userRole");
        window.dispatchEvent(new Event("userSessionChanged")); // thông báo logout
        window.location.href = '/';
    }
};
