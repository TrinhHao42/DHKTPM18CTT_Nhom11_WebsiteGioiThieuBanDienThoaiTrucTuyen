-- =====================================================
-- FILE 5: CANCELLED & RETURNED ORDERS
-- Đơn hàng bị hủy và trả hàng
-- Cấu trúc đúng: orders(order_id, order_date, order_total_amount, address_id, user_id, discount_id)
-- Cấu trúc đúng: order_detail(od_id, quantity, total_price, product_variant_id, order_id)
-- =====================================================

-- PHẦN 1: TẠO 10 ĐƠN HÀNG BỊ HỦY (order_id 101-110)
-- =====================================================

-- Orders bị hủy (dùng user_id từ 2-51 và address_id từ 21-80 đã có trong file 01)
INSERT INTO orders (order_id, order_date, order_total_amount, address_id, user_id, discount_id) VALUES
-- 5 đơn hủy do khách hàng (trước khi giao hàng)
(101, '2025-03-10', 15990000, 23, 4, NULL),
(102, '2025-04-15', 22490000, 28, 9, NULL),
(103, '2025-05-20', 8990000, 35, 16, NULL),
(104, '2025-06-08', 31990000, 42, 23, NULL),
(105, '2025-07-12', 12490000, 49, 30, NULL),
-- 5 đơn hủy do hệ thống/hết hàng
(106, '2025-08-05', 18990000, 55, 36, NULL),
(107, '2025-09-18', 25990000, 61, 42, NULL),
(108, '2025-10-22', 9990000, 25, 6, NULL),
(109, '2025-11-05', 14990000, 32, 13, NULL),
(110, '2025-11-25', 27490000, 38, 19, NULL);

-- Order details cho các đơn hàng bị hủy
-- Cấu trúc: od_id, quantity, total_price, product_variant_id, order_id
INSERT INTO order_detail (od_id, quantity, total_price, product_variant_id, order_id) VALUES
-- Order 101: iPhone 15 Pro Max
(103, 1, 15990000, 1, 101),
-- Order 102: Samsung Galaxy S24 Ultra
(104, 1, 22490000, 31, 102),
-- Order 103: Xiaomi 14
(105, 1, 8990000, 61, 103),
-- Order 104: iPhone 16 Pro
(106, 1, 31990000, 11, 104),
-- Order 105: OPPO Find X6 Pro
(107, 1, 12490000, 91, 105),
-- Order 106: Google Pixel 8 Pro
(108, 1, 18990000, 121, 106),
-- Order 107: Samsung Galaxy Z Fold 5
(109, 1, 25990000, 41, 107),
-- Order 108: Realme GT5 Pro
(110, 1, 9990000, 101, 108),
-- Order 109: Vivo X100 Pro
(111, 1, 14990000, 111, 109),
-- Order 110: OnePlus 12
(112, 1, 27490000, 81, 110);

-- Payment history cho đơn hủy (status_id = 6 là CANCELLED)
INSERT INTO order_payment_history (history_id, order_id, status_id, created_at, note) VALUES
-- Đơn đã thanh toán rồi bị hủy -> cần hoàn tiền
(101, 101, 6, '2025-03-10 14:00:00', 'Khách hàng yêu cầu hủy đơn - đã hoàn tiền'),
(102, 102, 6, '2025-04-15 11:30:00', 'Khách hàng yêu cầu hủy đơn - đã hoàn tiền'),
(103, 103, 6, '2025-05-20 16:00:00', 'Khách hàng yêu cầu hủy đơn - đã hoàn tiền'),
(104, 104, 6, '2025-06-08 15:30:00', 'Khách hàng yêu cầu hủy đơn - đã hoàn tiền'),
(105, 105, 6, '2025-07-12 10:00:00', 'Khách hàng yêu cầu hủy đơn - đã hoàn tiền'),
-- Đơn chưa thanh toán bị hủy
(106, 106, 6, '2025-08-06 09:00:00', 'Hệ thống hủy đơn - hết hàng'),
(107, 107, 6, '2025-09-18 14:00:00', 'Hệ thống hủy đơn - không xác nhận thanh toán'),
(108, 108, 6, '2025-10-22 16:45:00', 'Khách hàng yêu cầu hủy đơn'),
(109, 109, 6, '2025-11-05 11:30:00', 'Khách hàng đổi ý không mua nữa'),
(110, 110, 6, '2025-11-25 17:00:00', 'Khách hàng hủy do tìm được giá tốt hơn');

-- Shipping history cho đơn hủy (status_id = 7 là CANCELLED)
INSERT INTO order_shipping_history (history_id, order_id, status_id, created_at, note) VALUES
(101, 101, 7, '2025-03-10 14:00:00', 'Đơn hàng bị hủy bởi khách hàng'),
(102, 102, 7, '2025-04-15 11:30:00', 'Đơn hàng bị hủy bởi khách hàng'),
(103, 103, 7, '2025-05-20 16:00:00', 'Đơn hàng bị hủy bởi khách hàng'),
(104, 104, 7, '2025-06-08 15:30:00', 'Đơn hàng bị hủy bởi khách hàng'),
(105, 105, 7, '2025-07-12 10:00:00', 'Đơn hàng bị hủy bởi khách hàng'),
(106, 106, 7, '2025-08-06 09:00:00', 'Đơn hàng bị hủy - hết hàng'),
(107, 107, 7, '2025-09-18 14:00:00', 'Đơn hàng bị hủy - quá thời hạn thanh toán'),
(108, 108, 7, '2025-10-22 16:45:00', 'Đơn hàng bị hủy bởi khách hàng'),
(109, 109, 7, '2025-11-05 11:30:00', 'Đơn hàng bị hủy bởi khách hàng'),
(110, 110, 7, '2025-11-25 17:00:00', 'Đơn hàng bị hủy bởi khách hàng');

-- Cancel requests (yêu cầu hủy đơn)
INSERT INTO cancel_requests (cancel_request_id, order_id, user_id, reason, status, admin_note, created_at, updated_at, processed_by) VALUES
(1, 101, 4, 'Tôi đổi ý muốn mua màu khác', 'APPROVED', 'Đã duyệt yêu cầu hủy đơn và hoàn tiền', '2025-03-10 12:00:00', '2025-03-10 14:00:00', 1),
(2, 102, 9, 'Tôi tìm được nơi bán giá tốt hơn', 'APPROVED', 'Đã xử lý hoàn tiền qua ví điện tử', '2025-04-15 10:00:00', '2025-04-15 11:30:00', 1),
(3, 103, 16, 'Tôi không cần nữa vì đã mua máy khác', 'APPROVED', 'Đã hoàn tiền về tài khoản ngân hàng', '2025-05-20 15:00:00', '2025-05-20 16:00:00', 1),
(4, 104, 23, 'Muốn chờ phiên bản mới hơn ra mắt', 'APPROVED', 'Khách VIP - ưu tiên xử lý nhanh', '2025-06-08 13:00:00', '2025-06-08 15:30:00', 1),
(5, 105, 30, 'Sai địa chỉ giao hàng, muốn đặt lại', 'APPROVED', 'Đã hướng dẫn khách đặt đơn mới', '2025-07-12 09:00:00', '2025-07-12 10:00:00', 1),
(6, 108, 6, 'Tài chính không cho phép lúc này', 'APPROVED', 'Đã hủy đơn theo yêu cầu', '2025-10-22 14:30:00', '2025-10-22 16:45:00', 1),
(7, 109, 13, 'Đổi ý không mua nữa', 'APPROVED', 'Khách hàng thường xuyên - đã xử lý', '2025-11-05 10:00:00', '2025-11-05 11:30:00', 1),
(8, 110, 19, 'Tìm được deal tốt hơn ở nơi khác', 'APPROVED', 'Đã hoàn tiền thành công', '2025-11-25 15:30:00', '2025-11-25 17:00:00', 1);

-- PHẦN 2: TẠO 8 ĐƠN HÀNG TRẢ HÀNG (order_id 111-118)
-- =====================================================

-- Orders đã giao thành công nhưng bị trả hàng
INSERT INTO orders (order_id, order_date, order_total_amount, address_id, user_id, discount_id) VALUES
(111, '2025-02-15', 19990000, 27, 8, NULL),
(112, '2025-03-20', 28990000, 34, 15, NULL),
(113, '2025-04-10', 11990000, 41, 22, NULL),
(114, '2025-05-05', 35990000, 48, 29, NULL),
(115, '2025-06-12', 16490000, 53, 34, NULL),
(116, '2025-07-08', 23990000, 59, 40, NULL),
(117, '2025-08-15', 13490000, 64, 45, NULL),
(118, '2025-09-22', 29990000, 69, 50, NULL);

-- Order details cho các đơn hàng trả hàng
INSERT INTO order_detail (od_id, quantity, total_price, product_variant_id, order_id) VALUES
-- Order 111: iPhone 15
(113, 1, 19990000, 21, 111),
-- Order 112: Samsung Galaxy S24+
(114, 1, 28990000, 36, 112),
-- Order 113: Xiaomi 14 Ultra
(115, 1, 11990000, 66, 113),
-- Order 114: iPhone 16 Pro Max
(116, 1, 35990000, 6, 114),
-- Order 115: OPPO Find X7 Ultra
(117, 1, 16490000, 96, 115),
-- Order 116: Google Pixel 8
(118, 1, 23990000, 126, 116),
-- Order 117: Vivo X100
(119, 1, 13490000, 116, 117),
-- Order 118: OnePlus 12R
(120, 1, 29990000, 86, 118);

-- Payment history cho đơn trả hàng
-- Ban đầu PAID (status_id = 2), sau đó REFUNDED (status_id = 4)
INSERT INTO order_payment_history (history_id, order_id, status_id, created_at, note) VALUES
-- Trạng thái ban đầu: Đã thanh toán
(111, 111, 2, '2025-02-15 09:30:00', 'Thanh toán qua SePay thành công'),
(112, 112, 2, '2025-03-20 12:00:00', 'Thanh toán qua SePay thành công'),
(113, 113, 2, '2025-04-10 09:00:00', 'Thanh toán qua SePay thành công'),
(114, 114, 2, '2025-05-05 14:30:00', 'Thanh toán qua SePay thành công'),
(115, 115, 2, '2025-06-12 11:00:00', 'Thanh toán qua SePay thành công'),
(116, 116, 2, '2025-07-08 15:30:00', 'Thanh toán qua SePay thành công'),
(117, 117, 2, '2025-08-15 10:00:00', 'Thanh toán qua SePay thành công'),
(118, 118, 2, '2025-09-22 13:30:00', 'Thanh toán qua SePay thành công'),
-- Trạng thái sau: Đã hoàn tiền
(119, 111, 4, '2025-02-25 10:00:00', 'Hoàn tiền do trả hàng - sản phẩm lỗi'),
(120, 112, 4, '2025-04-01 14:00:00', 'Hoàn tiền do trả hàng - không đúng mô tả'),
(121, 113, 4, '2025-04-20 16:30:00', 'Hoàn tiền do trả hàng - sản phẩm lỗi màn hình'),
(122, 114, 4, '2025-05-18 09:00:00', 'Hoàn tiền do trả hàng - pin chai'),
(123, 115, 4, '2025-06-25 11:00:00', 'Hoàn tiền do trả hàng - camera lỗi'),
(124, 116, 4, '2025-07-20 10:30:00', 'Hoàn tiền do trả hàng - không hài lòng'),
(125, 117, 4, '2025-08-28 14:00:00', 'Hoàn tiền do trả hàng - màu không đúng'),
(126, 118, 4, '2025-10-05 16:00:00', 'Hoàn tiền do trả hàng - lỗi phần mềm');

-- Shipping history cho đơn trả hàng
-- DELIVERED (status_id = 3) -> RETURNED (status_id = 6)
INSERT INTO order_shipping_history (history_id, order_id, status_id, created_at, note) VALUES
-- Trạng thái ban đầu: Đã giao hàng
(111, 111, 3, '2025-02-18 14:00:00', 'Đã giao hàng thành công'),
(112, 112, 3, '2025-03-24 10:30:00', 'Đã giao hàng thành công'),
(113, 113, 3, '2025-04-13 16:00:00', 'Đã giao hàng thành công'),
(114, 114, 3, '2025-05-09 11:00:00', 'Đã giao hàng thành công'),
(115, 115, 3, '2025-06-16 09:30:00', 'Đã giao hàng thành công'),
(116, 116, 3, '2025-07-12 15:00:00', 'Đã giao hàng thành công'),
(117, 117, 3, '2025-08-19 10:00:00', 'Đã giao hàng thành công'),
(118, 118, 3, '2025-09-26 14:30:00', 'Đã giao hàng thành công'),
-- Trạng thái sau: Đã trả hàng
(119, 111, 6, '2025-02-25 10:00:00', 'Khách hàng trả hàng - sản phẩm lỗi'),
(120, 112, 6, '2025-04-01 14:00:00', 'Khách hàng trả hàng - không đúng mô tả'),
(121, 113, 6, '2025-04-20 16:30:00', 'Khách hàng trả hàng - lỗi màn hình'),
(122, 114, 6, '2025-05-18 09:00:00', 'Khách hàng trả hàng - pin chai'),
(123, 115, 6, '2025-06-25 11:00:00', 'Khách hàng trả hàng - camera lỗi'),
(124, 116, 6, '2025-07-20 10:30:00', 'Khách hàng trả hàng - không hài lòng'),
(125, 117, 6, '2025-08-28 14:00:00', 'Khách hàng trả hàng - sai màu'),
(126, 118, 6, '2025-10-05 16:00:00', 'Khách hàng trả hàng - lỗi phần mềm');

-- Return requests (yêu cầu trả hàng)
INSERT INTO return_requests (return_request_id, order_id, user_id, reason, image_url, status, admin_note, created_at, updated_at, processed_by) VALUES
(1, 111, 8, 'Sản phẩm bị lỗi camera trước, không chụp được hình', 'https://storage.example.com/returns/111_camera_error.jpg', 'APPROVED', 'Xác nhận lỗi từ nhà sản xuất - đã hoàn tiền', '2025-02-22 09:00:00', '2025-02-25 10:00:00', 1),
(2, 112, 15, 'Màu sắc không giống như hình trên website', 'https://storage.example.com/returns/112_color_mismatch.jpg', 'APPROVED', 'Đã xác minh và chấp nhận trả hàng', '2025-03-28 14:30:00', '2025-04-01 14:00:00', 1),
(3, 113, 22, 'Màn hình bị đốm sáng và chảy mực', 'https://storage.example.com/returns/113_screen_defect.jpg', 'APPROVED', 'Lỗi từ nhà sản xuất - bảo hành toàn phần', '2025-04-17 10:00:00', '2025-04-20 16:30:00', 1),
(4, 114, 29, 'Pin chai nhanh, chỉ dùng được 3 tiếng', 'https://storage.example.com/returns/114_battery_issue.jpg', 'APPROVED', 'Kiểm tra xác nhận pin lỗi - đã đổi máy mới', '2025-05-14 08:30:00', '2025-05-18 09:00:00', 1),
(5, 115, 34, 'Camera chính không lấy nét được, ảnh mờ', 'https://storage.example.com/returns/115_camera_focus.jpg', 'APPROVED', 'Lỗi phần cứng camera - hoàn tiền 100%', '2025-06-22 13:00:00', '2025-06-25 11:00:00', 1),
(6, 116, 40, 'Không hài lòng với hiệu năng, máy chậm', 'https://storage.example.com/returns/116_performance.jpg', 'APPROVED', 'Chấp nhận trả hàng trong thời gian đổi trả', '2025-07-17 11:30:00', '2025-07-20 10:30:00', 1),
(7, 117, 45, 'Nhận sai màu - đặt đen nhận trắng', 'https://storage.example.com/returns/117_wrong_color.jpg', 'APPROVED', 'Lỗi từ kho - đã gửi đúng màu và hoàn tiền', '2025-08-24 09:00:00', '2025-08-28 14:00:00', 1),
(8, 118, 50, 'Máy liên tục bị reset, không ổn định', 'https://storage.example.com/returns/118_software_bug.jpg', 'APPROVED', 'Lỗi phần mềm nghiêm trọng - hoàn tiền', '2025-10-01 15:00:00', '2025-10-05 16:00:00', 1);

-- PHẦN 3: THÊM MỘT SỐ YÊU CẦU HỦY/TRẢ HÀNG ĐANG CHỜ XỬ LÝ (PENDING)
-- =====================================================

-- Thêm yêu cầu hủy đơn đang chờ
INSERT INTO cancel_requests (cancel_request_id, order_id, user_id, reason, status, admin_note, created_at, updated_at, processed_by) VALUES
(9, 99, 50, 'Tôi muốn hủy đơn vì chưa cần dùng ngay', 'PENDING', NULL, '2025-12-03 10:00:00', NULL, NULL),
(10, 100, 51, 'Đổi ý muốn mua model khác', 'PENDING', NULL, '2025-12-06 09:30:00', NULL, NULL);

-- Thêm yêu cầu trả hàng đang chờ (cho các đơn đã giao - order 65-70)
INSERT INTO return_requests (return_request_id, order_id, user_id, reason, image_url, status, admin_note, created_at, updated_at, processed_by) VALUES
(9, 68, 19, 'Màn hình bị vệt xanh sau 1 tuần sử dụng', 'https://storage.example.com/returns/68_screen_line.jpg', 'PENDING', NULL, '2025-12-01 14:00:00', NULL, NULL),
(10, 69, 20, 'Loa ngoài bị rè, âm thanh không rõ', 'https://storage.example.com/returns/69_speaker_issue.jpg', 'PENDING', NULL, '2025-12-04 11:30:00', NULL, NULL),
(11, 70, 21, 'Touch ID không nhận vân tay', 'https://storage.example.com/returns/70_fingerprint.jpg', 'PENDING', NULL, '2025-12-07 08:45:00', NULL, NULL);

-- PHẦN 4: THÊM YÊU CẦU BỊ TỪ CHỐI (REJECTED)
-- =====================================================

INSERT INTO cancel_requests (cancel_request_id, order_id, user_id, reason, status, admin_note, created_at, updated_at, processed_by) VALUES
(11, 65, 16, 'Tôi muốn hủy đơn', 'REJECTED', 'Đơn hàng đã được giao thành công, không thể hủy. Vui lòng tạo yêu cầu trả hàng nếu cần.', '2025-07-10 10:00:00', '2025-07-10 14:00:00', 1),
(12, 66, 17, 'Muốn đổi sang màu khác', 'REJECTED', 'Đơn hàng đã giao, không thể hủy. Khách hàng có thể tạo yêu cầu đổi hàng.', '2025-07-15 09:00:00', '2025-07-15 11:00:00', 1);

INSERT INTO return_requests (return_request_id, order_id, user_id, reason, image_url, status, admin_note, created_at, updated_at, processed_by) VALUES
(12, 50, 31, 'Không thích màu này nữa', NULL, 'REJECTED', 'Lý do không hợp lệ - sản phẩm hoạt động bình thường, không có lỗi. Từ chối yêu cầu trả hàng.', '2025-06-01 10:00:00', '2025-06-01 15:00:00', 1),
(13, 55, 36, 'Muốn đổi sang model mới hơn', NULL, 'REJECTED', 'Đã quá thời hạn đổi trả 7 ngày. Từ chối yêu cầu.', '2025-06-15 14:00:00', '2025-06-15 16:30:00', 1);
