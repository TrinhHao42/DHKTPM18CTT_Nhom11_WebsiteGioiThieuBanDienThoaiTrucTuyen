'use client'

import React, { useState, useEffect, useMemo } from "react";
import { CartItem } from "@/types/CartItem";
import { createContext, useContextSelector } from "use-context-selector";
import { Product } from "@/types/Product";
import { useAuth } from "./AuthContext";
import { CartService } from "@/services/cartService";

type CartContextProps = {
  cartItems: CartItem[];
  cartQuantity: number;
  loading: boolean;
  error: string | null;
  addCartItem: (
    product: Product, 
    quantity?: number, 
    options?: { color?: string; storage?: string; version?: string }
  ) => Promise<void>;
  removeCartItem: (itemId: number) => Promise<void>;
  updateCartItemQuantity: (itemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: (userId: number) => void;
};

const CartContext = createContext<CartContextProps | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Tổng số lượng sản phẩm trong giỏ
  const cartQuantity = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );

  // 🔹 Lấy giỏ hàng từ backend
  const fetchCart = async (userId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await CartService.getCart(userId);
      
      setCartItems(response.cartItems || []);
    } catch (err: any) {
      console.error("❌ Failed to fetch cart:", err);
      
      const errorMessage = err.response?.data?.message || err.message || "Không thể tải giỏ hàng";
      setError(errorMessage);
      setCartItems([]);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  // 🔹 Load cart khi user đăng nhập
  useEffect(() => {
    if (user && user.userId) {
      fetchCart(user.userId);
    } else {
      setCartItems([]);
      setInitialized(false);
      setError(null);
    }
  }, [user?.userId]);

  /**
   * 🔹 Thêm sản phẩm vào giỏ
   * 
   * @param product
   * @param quantity
   * @param options
   */
  const addCartItem = async (
    product: Product, 
    quantity: number = 1, 
    options?: { color?: string; storage?: string; version?: string }
  ) => {
    console.log('🛒 [NEW] addCartItem called:', { 
      productId: product.prodId, 
      productName: product.prodName,
      userId: user?.userId, 
      quantity,
      options 
    });
    
    // Validate user
    if (!user?.userId) {
      const errorMsg = "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng";
      setError(errorMsg);
      console.error('❌', errorMsg);
      throw new Error(errorMsg);
    }

    // Validate product
    if (!product || !product.prodId) {
      const errorMsg = "Sản phẩm không hợp lệ";
      setError(errorMsg);
      console.error('❌', errorMsg);
      throw new Error(errorMsg);
    }

    try {
      setSyncing(true);
      setError(null);
      
      console.log('➕ Calling CartService.addToCart:', {
        userId: user.userId,
        productId: Number(product.prodId),
        quantity,
        options
      });
      
      // Gọi API với Product ID + options
      const response = await CartService.addToCart(
        user.userId,
        Number(product.prodId),
        quantity,
        options
      );
      
      console.log('✅ Cart updated successfully:', response);
      setCartItems(response.cartItems || []);
    } catch (err: any) {
      console.error("❌ Failed to add to cart:", err);
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      const errorMsg = err.message || "Không thể thêm sản phẩm vào giỏ hàng";
      setError(errorMsg);
      throw err;
    } finally {
      setSyncing(false);
    }
  };

  // 🔹 Xóa 1 sản phẩm khỏi giỏ
  const removeCartItem = async (itemId: number) => {
    if (!user?.userId) return;

    try {
      setSyncing(true);
      const response = await CartService.removeCartItem(user.userId, itemId);
      setCartItems(response.cartItems || []);
      setError(null);
    } catch (err: any) {
      console.error("❌ Failed to remove item:", err);
      setError("Không thể xóa sản phẩm");
    } finally {
      setSyncing(false);
    }
  };

  // 🔹 Cập nhật số lượng
  const updateCartItemQuantity = async (itemId: number, newQuantity: number) => {
    if (!user?.userId || newQuantity < 1) return;

    try {
      setSyncing(true);
      const response = await CartService.updateCartItem(
        user.userId,
        itemId,
        newQuantity
      );
      setCartItems(response.cartItems || []);
      setError(null);
    } catch (err: any) {
      console.error("❌ Failed to update quantity:", err);
      setError("Không thể cập nhật số lượng");
    } finally {
      setSyncing(false);
    }
  };

  // 🔹 Xóa toàn bộ giỏ hàng
  const clearCart = async () => {
    if (!user?.userId) {
      setCartItems([]);
      return;
    }

    try {
      setSyncing(true);
      const response = await CartService.clearCart(user.userId);
      setCartItems(response.cartItems || []);
      setError(null);
    } catch (err: any) {
      console.error("❌ Failed to clear cart:", err);
      setError("Không thể xóa giỏ hàng");
    } finally {
      setSyncing(false);
    }
  };

  // 🔹 Làm mới giỏ hàng từ backend
  const refreshCart = (userId: number) => fetchCart(userId);

  const value: CartContextProps = {
    cartItems,
    cartQuantity,
    loading: loading || syncing,
    error,
    addCartItem,
    removeCartItem,
    updateCartItemQuantity,
    clearCart,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Hook tiện lợi
export const useCart = () => {
  const context = useContextSelector(CartContext, (ctx) => ctx);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

export default CartContext;
