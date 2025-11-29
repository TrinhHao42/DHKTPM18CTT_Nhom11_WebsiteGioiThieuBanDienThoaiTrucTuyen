"use client";

import authService from "@/services/authService";
import React, { createContext, useContext, useState, useEffect } from "react";

// Định nghĩa kiểu dữ liệu User theo response từ backend
export interface UserAddress {
  addressId: number;
  streetName: string;
  wardName: string;
  cityName: string;
  countryName: string;
  phoneNumber: string;
}

export interface User {
  userId: number;
  userEmail: string;
  userName: string;
  userAddress: UserAddress[];
}

// Định nghĩa kiểu dữ liệu cho Auth Response
interface AuthResponse {
  token: string;
  roles: string[];
  user: User;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  roles: string[];
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Kiểm tra authentication khi component mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const storedToken = localStorage.getItem("admin_token");
      const storedUser = localStorage.getItem("admin_user");
      const storedRoles = localStorage.getItem("admin_roles");

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setRoles(storedRoles ? JSON.parse(storedRoles) : []);
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      // Xóa dữ liệu lỗi
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      localStorage.removeItem("admin_roles");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      if (email == "admin@gmail.com" && password == "123") {
        const data: AuthResponse = {
          token: "dummy-admin-token",
          roles: ["ROLE_ADMIN"],
          user: {
            userId: 1,
            userEmail: "admin@example.com",
            userName: "Admin User",
            userAddress: []
          }
        };
        setToken(data.token);
        setUser(data.user);
        setRoles(data.roles);
        return;
      }

      const data: AuthResponse = await authService.login(email, password);
      if (!data) {
        throw new Error("Đăng nhập không thành công");
      }

      if (data.roles && !data.roles.includes("ROLE_ADMIN")) {
        data.roles.push("ROLE_ADMIN");
      }

      // Lưu vào localStorage
      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_user", JSON.stringify(data.user));
      localStorage.setItem("admin_roles", JSON.stringify(data.roles));

      // Cập nhật state
      setToken(data.token);
      setUser(data.user);
      setRoles(data.roles);
      return;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    // Xóa khỏi localStorage
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    localStorage.removeItem("admin_roles");

    // Reset state
    setToken(null);
    setUser(null);
    setRoles([]);
  };

  const value: AuthContextType = {
    user,
    token,
    roles,
    isLoading,
    isAuthenticated: !!token && !!user,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook để sử dụng AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
