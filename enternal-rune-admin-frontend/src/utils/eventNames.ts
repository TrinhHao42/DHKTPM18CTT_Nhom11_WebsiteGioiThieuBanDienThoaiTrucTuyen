// Event display name mappings for user-friendly Vietnamese labels
export const EVENT_DISPLAY_NAMES: Record<string, string> = {
  // Page events
  'pageview': 'Xem trang',
  'page_unload': 'Rời khỏi trang',
  'page_engagement': 'Tương tác với trang',
  'page_hidden': 'Ẩn trang',
  'page_visible': 'Hiển thị trang',
  'title_change': 'Đổi tiêu đề',

  // Click events
  'click': 'Nhấp chuột',
  'button': 'Nhấp nút',
  'external_link': 'Link ngoài',
  'internal_link': 'Link nội bộ',
  'email_link': 'Link email',
  'phone_link': 'Link điện thoại',

  // Form events
  'form_submit': 'Gửi form',

  // User events
  'user_identify': 'Nhận dạng người dùng',

  // Interaction events
  'interaction_click': 'Tương tác nhấp',
  'interaction_hover': 'Tương tác hover',
  'interaction_focus': 'Tương tác focus',

  // E-commerce events
  'add_to_cart': 'Thêm vào giỏ hàng',
  'buy_now': 'Mua ngay',
  'purchase_completed': 'Hoàn thành mua hàng',
  'checkout_started': 'Bắt đầu thanh toán',
  'product_view': 'Xem sản phẩm',
  
  // Other custom events
  'search': 'Tìm kiếm',
  'download': 'Tải xuống',
  'video_play': 'Phát video',
  'video_pause': 'Tạm dừng video'
};

// Helper function to get user-friendly event names
export function getEventDisplayName(eventName: string): string {
  return EVENT_DISPLAY_NAMES[eventName] || eventName;
}