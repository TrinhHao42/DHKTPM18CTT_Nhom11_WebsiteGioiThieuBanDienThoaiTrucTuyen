
"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
    token: string | null;
    setToken: (t: string | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setTokenState] = useState<string | null>(null);

    useEffect(() => {
        const t = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (t) setTokenState(t);
    }, []);

    const setToken = (t: string | null) => {
        setTokenState(t);
        if (t) localStorage.setItem("token", t);
        else localStorage.removeItem("token");
    };

    return <AuthContext.Provider value={{ token, setToken }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
