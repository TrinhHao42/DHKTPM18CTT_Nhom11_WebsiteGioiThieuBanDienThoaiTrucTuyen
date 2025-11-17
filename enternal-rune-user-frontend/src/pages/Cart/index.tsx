'use client'
import { useCallback, useState, useMemo } from 'react'
import styles from './Cart.module.scss'
import { useCartState, useCartActions } from '@/context/CartContext'
import { TriangleAlert, Loader2, ArrowBigLeft, Trash2 } from "lucide-react"
import { Cart as CartIcon } from '@/lib/icons'
import { useRouter } from 'next/navigation'
import { CartItem } from '@/types/CartItem'
import CartItemList from './components/CartItemList'
import CartSummary from './components/CartSummary'
import { useToast } from '@/hooks/useToast'

const Cart = () => {
  const router = useRouter();
  
  const { cartItems, loading, error } = useCartState();
  
  const { clearCart } = useCartActions();
  
  const toast = useToast();
  const [choosedItems, setChoosedItems] = useState<CartItem[]>([]);
  const [isClearing, setIsClearing] = useState(false);

  const handleToggleItem = useCallback((item: CartItem) => {
    setChoosedItems((prev) => {
      const isSelected = prev.some(i => i.cartItemId === item.cartItemId);
      if (isSelected) {
        return prev.filter(i => i.cartItemId !== item.cartItemId);
      } else {
        return [...prev, item];
      }
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (choosedItems.length === cartItems.length) {
      setChoosedItems([]);
    } else {
      setChoosedItems([...cartItems]);
    }
  }, [cartItems, choosedItems.length]);

  const isItemSelected = useCallback((item: CartItem) => {
    return choosedItems.some(i => i.cartItemId === item.cartItemId);
  }, [choosedItems]);

  const handleClearCart = useCallback(async () => {
    if (!confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) return;
    
    setIsClearing(true);
    try {
      await clearCart();
      setChoosedItems([]);
      toast.success('Đã xóa toàn bộ giỏ hàng');
    } catch (error) {
      toast.error('Không thể xóa giỏ hàng');
    } finally {
      setIsClearing(false);
    }
  }, [clearCart, toast]);

  const isAllSelected = useMemo(() => 
    choosedItems.length === cartItems.length && cartItems.length > 0,
    [choosedItems.length, cartItems.length]
  );

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <span className={`${styles.loadingDots} text-xl`}>Đang tải giỏ hàng</span>
      </div>
    )

  if (error)
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-4 animate-fadeIn">
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 px-6 py-4 rounded-2xl shadow-sm">
          <TriangleAlert className="w-6 h-6 text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-lg font-medium">
            {error || "Đã xảy ra lỗi, vui lòng thử lại sau."}
          </p>
        </div>
      </div>
    );

  return (
    <>
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 animate-fadeIn">
          <div className="px-8 py-10 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Giỏ hàng của bạn đang trống <CartIcon className="inline-block h-5 w-5" />
            </h2>
            <p className="text-gray-600 mb-6">
              Có vẻ như bạn chưa thêm sản phẩm nào. Hãy khám phá ngay!
            </p>
            <button
              className="inline-flex items-center gap-2 rounded-lg active:scale-95 transition-transform duration-150 cursor-pointer"
              onClick={() => router.push('/')}
            >
              <ArrowBigLeft className="w-5 h-5" />
              <span>Tiếp tục mua sắm</span>
            </button>
          </div>
        </div>
      ) : (
        <div className='flex flex-col lg:flex-row gap-5 max-w-[1400px] w-full px-4 sm:px-6 lg:px-8 py-6 mx-auto'>
          <div className='flex-[2]'>
            <div className="mb-4 flex items-center justify-between">
              <button
                onClick={() => router.push('/')}
                className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 cursor-pointer active:scale-95 transition-all"
              >
                <ArrowBigLeft className="w-4 h-4" />
                <span className="text-xs sm:text-sm">Tiếp tục mua sắm</span>
              </button>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="select-all"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="select-all" className="text-xs sm:text-sm font-medium text-gray-700 cursor-pointer select-none">
                  Chọn tất cả ({choosedItems.length}/{cartItems.length})
                </label>
                
                {/* Clear Cart Button */}
                <button
                  onClick={handleClearCart}
                  disabled={isClearing || cartItems.length === 0}
                  className="ml-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md cursor-pointer active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isClearing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang xóa...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa tất cả</span>
                    </>
                  )}
                </button>
              </div>
            </div>
              {cartItems.map((item) => (
                <CartItemList
                key={item.cartItemId}
                item={item}
                isSelected={isItemSelected(item)}
                onToggle={handleToggleItem}
                />
              ))}
          </div>

          <div className='flex-[1] lg:max-w-[380px]'>
            <CartSummary choosedItems={choosedItems} />
          </div>
        </div>
      )}
    </>
  );
}

export default Cart
