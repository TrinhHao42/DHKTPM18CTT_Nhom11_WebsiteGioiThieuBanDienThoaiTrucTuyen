"use client";

import React, { useEffect, useState, useMemo, useCallback, ReactNode } from "react";
import { User } from "@/types/User";
import { createContext, useContextSelector } from "use-context-selector";

type AuthContextType = {
  token: string | null;
  user: User | null;
  setToken: (t: string | null) => void;
  setUser: (u: User | null) => void;
  login: (token: string, user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUserState] = useState<User | null>(null);

  // Load token and user from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) setTokenState(storedToken);
    if (storedUser) setUserState(JSON.parse(storedUser));
  }, []);

  // ✅ Memoize functions để tránh tạo mới mỗi render
  const setToken = useCallback((t: string | null) => {
    setTokenState(t);
    if (typeof window !== "undefined") {
      t ? localStorage.setItem("token", t) : localStorage.removeItem("token");
    }
  }, []);

  const setUser = useCallback((u: User | null) => {
    setUserState(u);
    if (typeof window !== "undefined") {
      u ? localStorage.setItem("user", JSON.stringify(u)) : localStorage.removeItem("user");
    }
  }, []);

  const login = useCallback((newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
  }, [setToken, setUser]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("cart");
    }
  }, [setToken, setUser]);

  // ✅ Memoize context value để tránh re-render không cần thiết
  const value = useMemo(
    () => ({ token, user, setToken, setUser, login, logout }),
    [token, user, setToken, setUser, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContextSelector(AuthContext, (ctx) => ctx);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
