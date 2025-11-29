'use client'

import React, { useState, useEffect, useMemo, useCallback, useContext, createContext } from "react";
import { useDebouncedCallback } from "use-debounce";
import { CartItem } from "@/types/CartItem";
import { Product } from "@/types/Product";
import { useAuth } from "./AuthContext";
import { CartService } from "@/services/cartService";

// 🎯 Context types
type CartStateType = {
  cartItems: CartItem[];
  cartQuantity: number;
  loading: boolean;
  error: string | null;
};

type CartActionsType = {
  addCartItem: (
    product: Product,
    quantity?: number,
    options?: { color?: string; storage?: string; version?: string; imageId?: number }
  ) => Promise<void>;
  removeCartItem: (itemId: number) => Promise<void>;
  updateCartItemQuantity: (itemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: (userId: number) => void;
};

const CartStateContext = createContext<CartStateType | null>(null);
const CartActionsContext = createContext<CartActionsType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Tổng số lượng
  const cartQuantity = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );

  // 🔹 Fetch cart
  const fetchCart = useCallback(async (userId: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await CartService.getCart(userId);
      setCartItems(response.cartItems || []);
    } catch (err: any) {
      console.error("❌ Failed to fetch cart:", err);
      setError(err.response?.data?.message || err.message || "Không thể tải giỏ hàng");
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load cart khi user login
  useEffect(() => {
    if (user?.userId) {
      fetchCart(user.userId);
    } else {
      setCartItems([]);
      setError(null);
    }
  }, [user?.userId, fetchCart]);

  // 🔹 Thêm vào giỏ
  const addCartItem = async (
    product: Product,
    quantity: number = 1,
    options?: { color?: string; storage?: string; version?: string; imageId?: number }
  ) => {
    if (!user?.userId) {
      const msg = "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng";
      setError(msg);
      throw new Error(msg);
    }

    if (!product?.prodId) {
      const msg = "Sản phẩm không hợp lệ";
      setError(msg);
      throw new Error(msg);
    }

    try {
      setError(null);
      const response = await CartService.addToCart(
        user.userId,
        Number(product.prodId),
        quantity,
        options
      );

      setCartItems(response.cartItems || []);
    } catch (err: any) {
      console.error("❌ Failed to add to cart:", err);
      const msg = err.message || "Không thể thêm sản phẩm vào giỏ hàng";
      setError(msg);
      throw err;
    }
  };

  // 🔹 Xóa item (Optimistic)
  const removeCartItem = async (itemId: number) => {
    if (!user?.userId) return;

    let previous = [...cartItems];
    setCartItems(prev => prev.filter(c => c.cartItemId !== itemId));

    try {
      await CartService.removeCartItem(user.userId, itemId);
      setError(null);
    } catch (err) {
      console.error("❌ Failed to remove:", err);
      setCartItems(previous);
      setError("Không thể xóa sản phẩm");
      throw err;
    }
  };

  // Hàm thực thi API thật
  const updateQuantityAPI = useCallback(async (userId: number, itemId: number, quantity: number) => {
    return await CartService.updateCartItem(userId, itemId, quantity);
  }, []);

  // Hàm debounce 300ms
  const debouncedUpdateQuantity = useDebouncedCallback(
    async (userId: number, itemId: number, quantity: number) => {
      try {
        await updateQuantityAPI(userId, itemId, quantity);
        setError(null);
      } catch (err) {
        console.error("❌ Debounced update failed:", err);
        setError("Không thể cập nhật số lượng");
      }
    }, 500);

  // 🔹 Update số lượng với optimistic update + debounce API
  const updateCartItemQuantity = async (itemId: number, newQuantity: number) => {
    if (!user?.userId || newQuantity < 1) return;

    let previous = [...cartItems];

    // 🔥 Optimistic update UI ngay lập tức
    setCartItems(prev =>
      prev.map(item =>
        item.cartItemId === itemId ? { ...item, quantity: newQuantity } : item
      )
    );

    // ⏳ Chỉ gọi API khi user ngừng thao tác 300ms
    debouncedUpdateQuantity(user.userId, itemId, newQuantity);
  };

  // 🔹 Xóa toàn bộ giỏ hàng
  const clearCart = async () => {
    if (!user?.userId) {
      setCartItems([]);
      return;
    }

    try {
      const response = await CartService.clearCart(user.userId);
      setCartItems(response.cartItems || []);
    } catch (err) {
      setError("Không thể xóa giỏ hàng");
      throw err;
    }
  };

  // 🔹 Refresh từ backend
  const refreshCart = (userId: number) => {
    fetchCart(userId);
  };

  // Value cho state
  const stateValue: CartStateType = {
    cartItems,
    cartQuantity,
    loading,
    error,
  };

  // Value cho actions
  const actionsValue: CartActionsType = {
    addCartItem,
    removeCartItem,
    updateCartItemQuantity,
    clearCart,
    refreshCart,
  };

  return (
    <CartStateContext.Provider value={stateValue}>
      <CartActionsContext.Provider value={actionsValue}>
        {children}
      </CartActionsContext.Provider>
    </CartStateContext.Provider>
  );
};

// Hooks
export const useCartState = () => {
  const ctx = useContext(CartStateContext);
  if (!ctx) throw new Error("useCartState must be used within CartProvider");
  return ctx;
};

export const useCartActions = () => {
  const ctx = useContext(CartActionsContext);
  if (!ctx) throw new Error("useCartActions must be used within CartProvider");
  return ctx;
};

export const useCart = () => {
  return { ...useCartState(), ...useCartActions() };
};

export default CartStateContext;
