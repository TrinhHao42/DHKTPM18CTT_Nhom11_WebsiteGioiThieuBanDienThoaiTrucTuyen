-- =====================================================
-- FILE 99: FIX ALL SEQUENCES
-- Chạy file này CUỐI CÙNG sau khi đã import tất cả dữ liệu
-- để đảm bảo các sequence (auto increment) hoạt động đúng
-- =====================================================

-- Fix sequence cho bảng users
SELECT setval('users_user_id_seq', COALESCE((SELECT MAX(user_id) FROM users), 0) + 1, false);

-- Fix sequence cho bảng addresses
SELECT setval('addresses_address_id_seq', COALESCE((SELECT MAX(address_id) FROM addresses), 0) + 1, false);

-- Fix sequence cho bảng user_addresses
SELECT setval('user_addresses_user_address_id_seq', COALESCE((SELECT MAX(user_address_id) FROM user_addresses), 0) + 1, false);

-- Fix sequence cho bảng orders
SELECT setval('orders_order_id_seq', COALESCE((SELECT MAX(order_id) FROM orders), 0) + 1, false);

-- Fix sequence cho bảng order_detail (tên bảng là order_detail, không phải order_details)
SELECT setval('order_detail_od_id_seq', COALESCE((SELECT MAX(od_id) FROM order_detail), 0) + 1, false);

-- Fix sequence cho bảng order_payment_history
SELECT setval('order_payment_history_history_id_seq', COALESCE((SELECT MAX(history_id) FROM order_payment_history), 0) + 1, false);

-- Fix sequence cho bảng order_shipping_history
SELECT setval('order_shipping_history_history_id_seq', COALESCE((SELECT MAX(history_id) FROM order_shipping_history), 0) + 1, false);

-- Fix sequence cho bảng transactions (primary key là trans_id, không phải transaction_id)
SELECT setval('transactions_trans_id_seq', COALESCE((SELECT MAX(trans_id) FROM transactions), 0) + 1, false);

-- Fix sequence cho bảng cancel_requests
SELECT setval('cancel_requests_cancel_request_id_seq', COALESCE((SELECT MAX(cancel_request_id) FROM cancel_requests), 0) + 1, false);

-- Fix sequence cho bảng return_requests
SELECT setval('return_requests_return_request_id_seq', COALESCE((SELECT MAX(return_request_id) FROM return_requests), 0) + 1, false);

-- Fix sequence cho bảng products
SELECT setval('products_product_id_seq', COALESCE((SELECT MAX(product_id) FROM products), 0) + 1, false);

-- Fix sequence cho bảng product_variants
SELECT setval('product_variants_product_variant_id_seq', COALESCE((SELECT MAX(product_variant_id) FROM product_variants), 0) + 1, false);

-- Fix sequence cho bảng product_prices
SELECT setval('product_prices_product_price_id_seq', COALESCE((SELECT MAX(product_price_id) FROM product_prices), 0) + 1, false);

-- Fix sequence cho bảng product_images
SELECT setval('product_images_product_image_id_seq', COALESCE((SELECT MAX(product_image_id) FROM product_images), 0) + 1, false);

-- Fix sequence cho bảng brands
SELECT setval('brands_brand_id_seq', COALESCE((SELECT MAX(brand_id) FROM brands), 0) + 1, false);

-- Fix sequence cho bảng categories
SELECT setval('categories_category_id_seq', COALESCE((SELECT MAX(category_id) FROM categories), 0) + 1, false);

-- Fix sequence cho bảng reviews
SELECT setval('reviews_review_id_seq', COALESCE((SELECT MAX(review_id) FROM reviews), 0) + 1, false);

-- Fix sequence cho bảng coupons
SELECT setval('coupons_coupon_id_seq', COALESCE((SELECT MAX(coupon_id) FROM coupons), 0) + 1, false);

-- Fix sequence cho bảng notifications
SELECT setval('notifications_notification_id_seq', COALESCE((SELECT MAX(notification_id) FROM notifications), 0) + 1, false);

-- Fix sequence cho bảng roles
SELECT setval('roles_role_id_seq', COALESCE((SELECT MAX(role_id) FROM roles), 0) + 1, false);

-- Fix sequence cho bảng payment_statuses
SELECT setval('payment_statuses_status_id_seq', COALESCE((SELECT MAX(status_id) FROM payment_statuses), 0) + 1, false);

-- Fix sequence cho bảng shipping_statuses
SELECT setval('shipping_statuses_status_id_seq', COALESCE((SELECT MAX(status_id) FROM shipping_statuses), 0) + 1, false);

-- Thông báo hoàn tất
SELECT 'All sequences have been fixed successfully!' AS status;

-- Hiển thị tổng quan dữ liệu
SELECT 'SUMMARY' AS info;
SELECT 'Total Users: ' || COUNT(*) FROM users;
SELECT 'Total Orders: ' || COUNT(*) FROM orders;
SELECT 'Total Order Details: ' || COUNT(*) FROM order_detail;
SELECT 'Total Payment History: ' || COUNT(*) FROM order_payment_history;
SELECT 'Total Shipping History: ' || COUNT(*) FROM order_shipping_history;
SELECT 'Total Transactions: ' || COUNT(*) FROM transactions;
SELECT 'Total Cancel Requests: ' || COUNT(*) FROM cancel_requests;
SELECT 'Total Return Requests: ' || COUNT(*) FROM return_requests;
