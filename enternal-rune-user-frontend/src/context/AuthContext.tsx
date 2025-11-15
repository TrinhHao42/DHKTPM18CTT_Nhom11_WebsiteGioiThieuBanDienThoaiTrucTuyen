"use client";

import React, { useEffect, useState, useMemo, useCallback, ReactNode } from "react";
import { User } from "@/types/User";
import { Address } from "@/types/Address";
import { createContext, useContextSelector } from "use-context-selector";

type AuthContextType = {
  token: string | null;
  user: User | null;
  setToken: (t: string | null) => void;
  setUser: (u: User | null) => void;
  login: (token: string, user: User) => void;
  logout: () => void;
  addUserAddress: (address: Omit<Address, 'addressId'>) => Promise<Address>;
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

  // ✅ Thêm địa chỉ mới cho user
  const addUserAddress = useCallback(async (address: Omit<Address, 'addressId'>) => {
    if (!user || !token) {
      throw new Error("Vui lòng đăng nhập để thêm địa chỉ");
    }

    const API_URL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080';

    try {
      const response = await fetch(`${API_URL}/api/users/${user.userId}/address`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(address),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Không thể thêm địa chỉ';
        
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorMessage;
        } catch {
          errorMessage = `Lỗi ${response.status}: ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      const addedAddress = await response.json();
      setUser({ ...user, userAddress: [addedAddress, ...user.userAddress] });
      return addedAddress;
    } catch (error: any) {
      console.error('Failed to add address:', error);
      throw error;
    }
  }, [user, token, setUser]);

  // ✅ Memoize context value để tránh re-render không cần thiết
  const value = useMemo(
    () => ({ token, user, setToken, setUser, login, logout, addUserAddress }),
    [token, user, setToken, setUser, login, logout, addUserAddress]
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
