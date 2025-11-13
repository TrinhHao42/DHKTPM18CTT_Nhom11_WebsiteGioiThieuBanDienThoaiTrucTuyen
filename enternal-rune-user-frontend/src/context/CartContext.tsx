'use client'

import React, { useState, useEffect, useMemo } from "react";
import { CartItem } from "@/types/CartItem";
import { createContext, useContextSelector } from "use-context-selector";
import { useDebouncedCallback } from "use-debounce";
import AxiosInstance from "@/configs/AxiosInstance";
import { Product } from "@/types/Product";
import { ProductVariant } from "@/types/ProductVariant";

type CartContextProps = {
  cartItems: CartItem[];
  cartQuantity: number;
  loading: boolean;
  error: string | null;
  addCartItem: (product: Product) => void;
  removeCartItem: (itemId: number) => void;
  updateCartItemQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  // refreshCart: () => void;
};

const CartContext = createContext<CartContextProps | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Tổng số lượng sản phẩm trong giỏ
  const cartQuantity = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.ciQuantity, 0),
    [cartItems]
  );

  // // 🔹 Lấy giỏ hàng từ backend
  // const fetchCart = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await AxiosInstance.get(`/cart`);
  //     setCartItems(res.data);
  //     localStorage.setItem("cart", JSON.stringify(res.data));
  //   } catch {
  //     setError("Không thể tải giỏ hàng");
  //   } finally {
  //     setLoading(false);
  //     setInitialized(true);
  //   }
  // };

  // // 🔹 Hàm cập nhật giỏ hàng (debounce để tránh spam request)
  // const debouncedUpdate = useDebouncedCallback(async (updatedItems: CartItem[]) => {
  //   try {
  //     setSyncing(true);
  //     await AxiosInstance.put(`${process.env.BACK_END_URL}/cart`, updatedItems);
  //     localStorage.setItem("cart", JSON.stringify(updatedItems));
  //   } catch {
  //     setError("Không thể cập nhật giỏ hàng");
  //   } finally {
  //     setSyncing(false);
  //   }
  // }, 500);

  // useEffect(() => {
  //   fetchCart();
  // }, []);

  // // 🔹 Khi cartItems thay đổi, tự động lưu local và gọi API (sau khi init xong)
  // useEffect(() => {
  //   if (!initialized) return;
  //   localStorage.setItem("cart", JSON.stringify(cartItems));
  //   if (cartItems.length > 0) debouncedUpdate(cartItems);
  // }, [cartItems]);

  // 🔹 Thêm sản phẩm vào giỏ
  const addCartItem = (product: Product) => {
    if (!product) return;

    // Giả sử chọn variant đầu tiên
    const variant: ProductVariant = {
      prodvId: Number(product.prodId),
      prodvProduct: Number(product.prodId),
      prodvName: product.prodName,
      prodvImage: product.images?.[0],
      prodvModel: product.prodModel || "",
      prodvVersion: product.prodVersion?.[0] || "",
      prodvColor: product.prodColor?.[0] || "",
      prodvPrice: product.productPrices?.[0]!,
    };

    setCartItems((prev) => {
      const existingItem = prev.find(
        (item) => item.ciProductVariant.prodvId === variant.prodvId
      );

      if (existingItem) {
        // Nếu đã có → tăng số lượng
        return prev.map((item) =>
          item.ciProductVariant.prodvId === variant.prodvId
            ? { ...item, ciQuantity: item.ciQuantity + 1 }
            : item
        );
      } else {
        // Nếu chưa có → thêm mới
        const newItem: CartItem = {
          ciId: Date.now(),
          ciProductVariant: variant,
          ciQuantity: 1,
        };
        return [...prev, newItem];
      }
    });
  };

  // 🔹 Xóa 1 sản phẩm khỏi giỏ
  const removeCartItem = (itemId: number) => {
    setCartItems((prev) => prev.filter((item) => item.ciId !== itemId));
  };

  // 🔹 Cập nhật số lượng
  const updateCartItemQuantity = (itemId: number, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.ciId === itemId
          ? { ...item, ciQuantity: Math.max(1, item.ciQuantity + delta) }
          : item
      )
    );
  };

  // 🔹 Xóa toàn bộ giỏ hàng
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  // 🔹 Làm mới giỏ hàng từ backend
  // const refreshCart = () => fetchCart();

  const value: CartContextProps = {
    cartItems,
    cartQuantity,
    loading: loading || syncing,
    error,
    addCartItem,
    removeCartItem,
    updateCartItemQuantity,
    clearCart,
    // refreshCart,
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
