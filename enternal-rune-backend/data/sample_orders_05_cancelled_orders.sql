-- =====================================================
-- FILE 5A: ĐƠN HÀNG BỊ HỦY (15 đơn) - Order ID 101-115
-- Bao gồm: orders, order_detail, payment_history, shipping_history, cancel_requests
-- Request Status: PENDING, APPROVED, REJECTED
-- =====================================================

-- 15 đơn hàng bị hủy
INSERT INTO orders (order_id, order_date, order_total_amount, address_id, user_id, discount_id) VALUES
-- Hủy do khách đổi ý (5 đơn)
(101, '2025-01-15', 15990000, 21, 2, NULL),
(102, '2025-02-10', 22490000, 25, 6, NULL),
(103, '2025-03-05', 8990000, 30, 11, NULL),
(104, '2025-04-12', 31990000, 35, 16, NULL),
(105, '2025-05-08', 12490000, 40, 21, NULL),

-- Hủy do hết hàng (3 đơn)
(106, '2025-06-15', 18990000, 45, 26, NULL),
(107, '2025-07-20', 25990000, 50, 31, NULL),
(108, '2025-08-10', 9990000, 55, 36, NULL),

-- Hủy do thanh toán thất bại (3 đơn)
(109, '2025-09-05', 14990000, 60, 41, NULL),
(110, '2025-09-25', 27490000, 65, 46, NULL),
(111, '2025-10-10', 35990000, 70, 51, NULL),

-- Yêu cầu hủy đang chờ xử lý PENDING (2 đơn)
(112, '2025-11-15', 19990000, 22, 3, NULL),
(113, '2025-11-28', 24990000, 27, 8, NULL),

-- Yêu cầu hủy bị từ chối REJECTED (2 đơn) - đơn vẫn tiếp tục xử lý
(114, '2025-10-20', 16990000, 32, 13, NULL),
(115, '2025-11-01', 21990000, 37, 18, NULL);

-- Order details cho các đơn hàng bị hủy
INSERT INTO order_detail (od_id, quantity, total_price, product_variant_id, order_id) VALUES
(103, 1, 15990000, 1, 101),
(104, 1, 22490000, 25, 102),
(105, 1, 8990000, 45, 103),
(106, 1, 31990000, 65, 104),
(107, 1, 12490000, 85, 105),
(108, 1, 18990000, 105, 106),
(109, 1, 25990000, 15, 107),
(110, 1, 9990000, 35, 108),
(111, 1, 14990000, 55, 109),
(112, 1, 27490000, 75, 110),
(113, 1, 35990000, 95, 111),
(114, 1, 19990000, 10, 112),
(115, 1, 24990000, 30, 113),
(116, 1, 16990000, 50, 114),
(117, 1, 21990000, 70, 115);

-- Payment history cho đơn hủy
-- Đơn 101-105: PENDING → CANCELLED (khách đổi ý trước khi thanh toán)
-- Đơn 106-108: PENDING → CANCELLED (hết hàng)
-- Đơn 109-111: PENDING → FAILED → CANCELLED (thanh toán thất bại)
-- Đơn 112-113: PENDING (đang chờ xử lý yêu cầu hủy)
-- Đơn 114-115: PENDING → PAID (từ chối hủy, tiếp tục xử lý)

INSERT INTO order_payment_history (history_id, order_id, status_id, created_at, note) VALUES
-- Order 101: Khách đổi ý
(201, 101, 1, '2025-01-15 10:00:00', 'Đơn hàng mới - chờ thanh toán'),
(202, 101, 6, '2025-01-15 14:30:00', 'Đơn hàng bị hủy theo yêu cầu khách hàng'),

-- Order 102: Khách đổi ý
(203, 102, 1, '2025-02-10 09:00:00', 'Đơn hàng mới - chờ thanh toán'),
(204, 102, 6, '2025-02-10 15:00:00', 'Đơn hàng bị hủy theo yêu cầu khách hàng'),

-- Order 103: Khách đổi ý
(205, 103, 1, '2025-03-05 14:00:00', 'Đơn hàng mới - chờ thanh toán'),
(206, 103, 6, '2025-03-05 18:30:00', 'Đơn hàng bị hủy theo yêu cầu khách hàng'),

-- Order 104: Khách đổi ý
(207, 104, 1, '2025-04-12 11:00:00', 'Đơn hàng mới - chờ thanh toán'),
(208, 104, 6, '2025-04-12 16:00:00', 'Đơn hàng bị hủy theo yêu cầu khách hàng'),

-- Order 105: Khách đổi ý
(209, 105, 1, '2025-05-08 10:00:00', 'Đơn hàng mới - chờ thanh toán'),
(210, 105, 6, '2025-05-08 13:45:00', 'Đơn hàng bị hủy theo yêu cầu khách hàng'),

-- Order 106: Hết hàng
(211, 106, 1, '2025-06-15 09:00:00', 'Đơn hàng mới - chờ thanh toán'),
(212, 106, 6, '2025-06-15 11:00:00', 'Đơn hàng bị hủy do hết hàng'),

-- Order 107: Hết hàng
(213, 107, 1, '2025-07-20 14:00:00', 'Đơn hàng mới - chờ thanh toán'),
(214, 107, 6, '2025-07-20 15:30:00', 'Đơn hàng bị hủy do hết hàng'),

-- Order 108: Hết hàng
(215, 108, 1, '2025-08-10 10:00:00', 'Đơn hàng mới - chờ thanh toán'),
(216, 108, 6, '2025-08-10 11:45:00', 'Đơn hàng bị hủy do hết hàng'),

-- Order 109: Thanh toán thất bại
(217, 109, 1, '2025-09-05 09:00:00', 'Đơn hàng mới - chờ thanh toán'),
(218, 109, 3, '2025-09-05 09:15:00', 'Thanh toán thất bại - lỗi ngân hàng'),
(219, 109, 6, '2025-09-05 12:00:00', 'Đơn hàng bị hủy sau 3 lần thanh toán thất bại'),

-- Order 110: Thanh toán thất bại
(220, 110, 1, '2025-09-25 11:00:00', 'Đơn hàng mới - chờ thanh toán'),
(221, 110, 3, '2025-09-25 11:10:00', 'Thanh toán thất bại - số dư không đủ'),
(222, 110, 6, '2025-09-25 14:00:00', 'Đơn hàng bị hủy do không thanh toán'),

-- Order 111: Thanh toán thất bại
(223, 111, 1, '2025-10-10 15:00:00', 'Đơn hàng mới - chờ thanh toán'),
(224, 111, 3, '2025-10-10 15:20:00', 'Thanh toán thất bại - thẻ hết hạn'),
(225, 111, 6, '2025-10-10 18:00:00', 'Đơn hàng bị hủy do không thanh toán'),

-- Order 112: Đang chờ xử lý yêu cầu hủy
(226, 112, 1, '2025-11-15 10:00:00', 'Đơn hàng mới - chờ thanh toán'),

-- Order 113: Đang chờ xử lý yêu cầu hủy
(227, 113, 1, '2025-11-28 14:00:00', 'Đơn hàng mới - chờ thanh toán'),

-- Order 114: Từ chối hủy - đã thanh toán và tiếp tục
(228, 114, 1, '2025-10-20 09:00:00', 'Đơn hàng mới - chờ thanh toán'),
(229, 114, 2, '2025-10-20 09:30:00', 'Thanh toán qua SePay thành công'),

-- Order 115: Từ chối hủy - đã thanh toán và tiếp tục
(230, 115, 1, '2025-11-01 11:00:00', 'Đơn hàng mới - chờ thanh toán'),
(231, 115, 2, '2025-11-01 11:25:00', 'Thanh toán qua SePay thành công');

-- Shipping history cho đơn hủy
INSERT INTO order_shipping_history (history_id, order_id, status_id, created_at, note) VALUES
-- Order 101-105: Hủy trước khi xử lý
(398, 101, 7, '2025-01-15 14:30:00', 'Đơn hàng bị hủy trước khi xử lý'),
(399, 102, 7, '2025-02-10 15:00:00', 'Đơn hàng bị hủy trước khi xử lý'),
(400, 103, 7, '2025-03-05 18:30:00', 'Đơn hàng bị hủy trước khi xử lý'),
(401, 104, 7, '2025-04-12 16:00:00', 'Đơn hàng bị hủy trước khi xử lý'),
(402, 105, 7, '2025-05-08 13:45:00', 'Đơn hàng bị hủy trước khi xử lý'),

-- Order 106-108: Hủy do hết hàng
(403, 106, 7, '2025-06-15 11:00:00', 'Đơn hàng bị hủy do hết hàng'),
(404, 107, 7, '2025-07-20 15:30:00', 'Đơn hàng bị hủy do hết hàng'),
(405, 108, 7, '2025-08-10 11:45:00', 'Đơn hàng bị hủy do hết hàng'),

-- Order 109-111: Hủy do thanh toán thất bại
(406, 109, 7, '2025-09-05 12:00:00', 'Đơn hàng bị hủy do thanh toán thất bại'),
(407, 110, 7, '2025-09-25 14:00:00', 'Đơn hàng bị hủy do thanh toán thất bại'),
(408, 111, 7, '2025-10-10 18:00:00', 'Đơn hàng bị hủy do thanh toán thất bại'),

-- Order 112-113: Đang chờ xử lý
(409, 112, 1, '2025-11-15 10:30:00', 'Đang xử lý đơn hàng'),
(410, 113, 1, '2025-11-28 14:30:00', 'Đang xử lý đơn hàng'),

-- Order 114-115: Từ chối hủy, tiếp tục xử lý
(411, 114, 1, '2025-10-20 10:00:00', 'Đang xử lý đơn hàng'),
(412, 114, 2, '2025-10-21 08:00:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(413, 114, 3, '2025-10-23 14:00:00', 'Đã giao hàng thành công'),
(414, 114, 5, '2025-10-23 14:30:00', 'Khách hàng đã nhận hàng'),

(415, 115, 1, '2025-11-01 12:00:00', 'Đang xử lý đơn hàng'),
(416, 115, 2, '2025-11-02 08:30:00', 'Đã giao cho đơn vị vận chuyển GHTK'),
(417, 115, 3, '2025-11-04 15:00:00', 'Đã giao hàng thành công'),
(418, 115, 5, '2025-11-04 15:30:00', 'Khách hàng đã nhận hàng');

-- CANCEL REQUESTS - Yêu cầu hủy đơn
-- Status: PENDING, APPROVED, REJECTED
INSERT INTO cancel_requests (cancel_request_id, order_id, user_id, reason, status, admin_note, created_at, updated_at, processed_by) VALUES
-- Yêu cầu đã được duyệt (APPROVED) - Order 101-105
(1, 101, 2, 'Tôi đổi ý muốn mua sản phẩm khác', 'APPROVED', 'Đã duyệt yêu cầu hủy đơn - đơn chưa thanh toán', '2025-01-15 12:00:00', '2025-01-15 14:30:00', 1),
(2, 102, 6, 'Tôi tìm được nơi bán giá tốt hơn', 'APPROVED', 'Đã duyệt yêu cầu hủy đơn theo yêu cầu khách hàng', '2025-02-10 13:00:00', '2025-02-10 15:00:00', 1),
(3, 103, 11, 'Tôi không cần sản phẩm này nữa', 'APPROVED', 'Đã xác nhận hủy đơn', '2025-03-05 16:00:00', '2025-03-05 18:30:00', 1),
(4, 104, 16, 'Muốn chờ phiên bản mới ra mắt', 'APPROVED', 'Khách hàng VIP - ưu tiên xử lý nhanh', '2025-04-12 13:00:00', '2025-04-12 16:00:00', 1),
(5, 105, 21, 'Nhầm địa chỉ giao hàng, muốn đặt lại', 'APPROVED', 'Đã hướng dẫn khách đặt đơn mới với địa chỉ đúng', '2025-05-08 11:30:00', '2025-05-08 13:45:00', 1),

-- Yêu cầu đang chờ xử lý (PENDING) - Order 112-113
(6, 112, 3, 'Tôi muốn đổi sang màu khác', 'PENDING', NULL, '2025-11-15 16:00:00', NULL, NULL),
(7, 113, 8, 'Tài chính không cho phép lúc này', 'PENDING', NULL, '2025-11-28 18:00:00', NULL, NULL),

-- Yêu cầu bị từ chối (REJECTED) - Order 114-115
(8, 114, 13, 'Tôi muốn hủy đơn hàng', 'REJECTED', 'Không thể hủy - đơn hàng đã được xử lý và giao cho vận chuyển. Vui lòng nhận hàng và tạo yêu cầu trả hàng nếu cần.', '2025-10-20 14:00:00', '2025-10-20 16:00:00', 1),
(9, 115, 18, 'Muốn hủy do đổi ý', 'REJECTED', 'Không thể hủy - đơn hàng đã thanh toán và đang được vận chuyển. Khách hàng có thể từ chối nhận hàng hoặc yêu cầu trả hàng sau khi nhận.', '2025-11-02 09:00:00', '2025-11-02 11:00:00', 1);

-- =====================================================
-- FILE 5B: ĐƠN HÀNG TRẢ HÀNG (20 đơn) - Order ID 116-135
-- Bao gồm: orders, order_detail, payment_history, shipping_history, return_requests
-- Đơn trả hàng = đơn đã giao thành công → khách yêu cầu trả
-- Request Status: PENDING, APPROVED, REJECTED
-- =====================================================

-- 20 đơn hàng trả hàng
INSERT INTO orders (order_id, order_date, order_total_amount, address_id, user_id, discount_id) VALUES
-- Trả hàng do lỗi sản phẩm - APPROVED (5 đơn)
(116, '2025-01-20', 19990000, 23, 4, NULL),
(117, '2025-02-15', 28990000, 28, 9, NULL),
(118, '2025-03-10', 11990000, 33, 14, NULL),
(119, '2025-04-05', 35990000, 38, 19, NULL),
(120, '2025-05-01', 16490000, 43, 24, NULL),

-- Trả hàng do không đúng mô tả - APPROVED (5 đơn)
(121, '2025-05-25', 23990000, 48, 29, NULL),
(122, '2025-06-20', 13490000, 53, 34, NULL),
(123, '2025-07-15', 29990000, 58, 39, NULL),
(124, '2025-08-05', 17990000, 63, 44, NULL),
(125, '2025-08-28', 24490000, 68, 49, NULL),

-- Trả hàng do khách đổi ý - APPROVED (3 đơn)
(126, '2025-09-15', 12990000, 73, 2, NULL),
(127, '2025-10-01', 31990000, 78, 7, NULL),
(128, '2025-10-18', 9990000, 21, 12, NULL),

-- Yêu cầu trả hàng đang chờ xử lý - PENDING (4 đơn)
(129, '2025-11-05', 22990000, 26, 17, NULL),
(130, '2025-11-12', 18490000, 31, 22, NULL),
(131, '2025-11-20', 27990000, 36, 27, NULL),
(132, '2025-11-25', 14990000, 41, 32, NULL),

-- Yêu cầu trả hàng bị từ chối - REJECTED (3 đơn)
(133, '2025-09-20', 21990000, 46, 37, NULL),
(134, '2025-10-10', 16990000, 51, 42, NULL),
(135, '2025-10-28', 25990000, 56, 47, NULL);

-- Order details cho các đơn hàng trả hàng
INSERT INTO order_detail (od_id, quantity, total_price, product_variant_id, order_id) VALUES
                                                                                          (118, 1, 19990000, 5, 116),
                                                                                          (119, 1, 28990000, 20, 117),
                                                                                          (120, 1, 11990000, 40, 118),
                                                                                          (121, 1, 35990000, 60, 119),
                                                                                          (122, 1, 16490000, 80, 120),
                                                                                          (123, 1, 23990000, 100, 121),
                                                                                          (124, 1, 13490000, 12, 122),
                                                                                          (125, 1, 29990000, 32, 123),
                                                                                          (126, 1, 17990000, 52, 124),
                                                                                          (127, 1, 24490000, 72, 125),
                                                                                          (128, 1, 12990000, 92, 126),
                                                                                          (129, 1, 31990000, 112, 127),
                                                                                          (130, 1, 9990000, 8, 128),
                                                                                          (131, 1, 22990000, 28, 129),
                                                                                          (132, 1, 18490000, 48, 130),
                                                                                          (133, 1, 27990000, 68, 131),
                                                                                          (134, 1, 14990000, 88, 132),
                                                                                          (135, 1, 21990000, 108, 133),
                                                                                          (136, 1, 16990000, 18, 134),
                                                                                          (137, 1, 25990000, 38, 135);

-- Payment history cho đơn trả hàng
-- Flow: PENDING → PAID → REFUNDED (nếu approved)
-- Flow: PENDING → PAID (nếu rejected hoặc pending)

INSERT INTO order_payment_history (history_id, order_id, status_id, created_at, note) VALUES
-- Order 116-120: Trả hàng do lỗi - REFUNDED
(232, 116, 1, '2025-01-20 09:00:00', 'Đơn hàng mới - chờ thanh toán'),
(233, 116, 2, '2025-01-20 09:30:00', 'Thanh toán qua SePay thành công'),
(234, 116, 4, '2025-02-05 14:00:00', 'Hoàn tiền do trả hàng - sản phẩm lỗi màn hình'),

(235, 117, 1, '2025-02-15 10:00:00', 'Đơn hàng mới - chờ thanh toán'),
(236, 117, 2, '2025-02-15 10:25:00', 'Thanh toán qua SePay thành công'),
(237, 117, 4, '2025-03-02 15:00:00', 'Hoàn tiền do trả hàng - pin bị phồng'),

(238, 118, 1, '2025-03-10 14:00:00', 'Đơn hàng mới - chờ thanh toán'),
(239, 118, 2, '2025-03-10 14:20:00', 'Thanh toán qua SePay thành công'),
(240, 118, 4, '2025-03-25 11:00:00', 'Hoàn tiền do trả hàng - camera không hoạt động'),

(241, 119, 1, '2025-04-05 11:00:00', 'Đơn hàng mới - chờ thanh toán'),
(242, 119, 2, '2025-04-05 11:35:00', 'Thanh toán qua SePay thành công'),
(243, 119, 4, '2025-04-20 16:00:00', 'Hoàn tiền do trả hàng - loa bị rè'),

(244, 120, 1, '2025-05-01 09:00:00', 'Đơn hàng mới - chờ thanh toán'),
(245, 120, 2, '2025-05-01 09:25:00', 'Thanh toán qua SePay thành công'),
(246, 120, 4, '2025-05-15 10:00:00', 'Hoàn tiền do trả hàng - màn hình bị sọc'),

-- Order 121-125: Trả hàng do không đúng mô tả - REFUNDED
(247, 121, 1, '2025-05-25 15:00:00', 'Đơn hàng mới - chờ thanh toán'),
(248, 121, 2, '2025-05-25 15:30:00', 'Thanh toán qua SePay thành công'),
(249, 121, 4, '2025-06-10 14:00:00', 'Hoàn tiền do trả hàng - màu không đúng mô tả'),

(250, 122, 1, '2025-06-20 10:00:00', 'Đơn hàng mới - chờ thanh toán'),
(251, 122, 2, '2025-06-20 10:20:00', 'Thanh toán qua SePay thành công'),
(252, 122, 4, '2025-07-05 11:30:00', 'Hoàn tiền do trả hàng - dung lượng không đúng'),

(253, 123, 1, '2025-07-15 13:00:00', 'Đơn hàng mới - chờ thanh toán'),
(254, 123, 2, '2025-07-15 13:40:00', 'Thanh toán qua SePay thành công'),
(255, 123, 4, '2025-07-30 15:00:00', 'Hoàn tiền do trả hàng - phiên bản không đúng'),

(256, 124, 1, '2025-08-05 09:00:00', 'Đơn hàng mới - chờ thanh toán'),
(257, 124, 2, '2025-08-05 09:30:00', 'Thanh toán qua SePay thành công'),
(258, 124, 4, '2025-08-20 14:00:00', 'Hoàn tiền do trả hàng - thiếu phụ kiện'),

(259, 125, 1, '2025-08-28 14:00:00', 'Đơn hàng mới - chờ thanh toán'),
(260, 125, 2, '2025-08-28 14:25:00', 'Thanh toán qua SePay thành công'),
(261, 125, 4, '2025-09-12 16:00:00', 'Hoàn tiền do trả hàng - hàng không nguyên seal'),

-- Order 126-128: Trả hàng do khách đổi ý - REFUNDED (trừ phí)
(262, 126, 1, '2025-09-15 11:00:00', 'Đơn hàng mới - chờ thanh toán'),
(263, 126, 2, '2025-09-15 11:30:00', 'Thanh toán qua SePay thành công'),
(264, 126, 4, '2025-09-30 10:00:00', 'Hoàn tiền 90% do khách đổi ý (trừ 10% phí)'),

(265, 127, 1, '2025-10-01 15:00:00', 'Đơn hàng mới - chờ thanh toán'),
(266, 127, 2, '2025-10-01 15:35:00', 'Thanh toán qua SePay thành công'),
(267, 127, 4, '2025-10-15 14:00:00', 'Hoàn tiền 90% do khách đổi ý (trừ 10% phí)'),

(268, 128, 1, '2025-10-18 10:00:00', 'Đơn hàng mới - chờ thanh toán'),
(269, 128, 2, '2025-10-18 10:20:00', 'Thanh toán qua SePay thành công'),
(270, 128, 4, '2025-11-02 11:00:00', 'Hoàn tiền 90% do khách đổi ý (trừ 10% phí)'),

-- Order 129-132: Đang chờ xử lý yêu cầu trả hàng - PAID
(271, 129, 1, '2025-11-05 09:00:00', 'Đơn hàng mới - chờ thanh toán'),
(272, 129, 2, '2025-11-05 09:30:00', 'Thanh toán qua SePay thành công'),

(273, 130, 1, '2025-11-12 14:00:00', 'Đơn hàng mới - chờ thanh toán'),
(274, 130, 2, '2025-11-12 14:25:00', 'Thanh toán qua SePay thành công'),

(275, 131, 1, '2025-11-20 11:00:00', 'Đơn hàng mới - chờ thanh toán'),
(276, 131, 2, '2025-11-20 11:35:00', 'Thanh toán qua SePay thành công'),

(277, 132, 1, '2025-11-25 15:00:00', 'Đơn hàng mới - chờ thanh toán'),
(278, 132, 2, '2025-11-25 15:20:00', 'Thanh toán qua SePay thành công'),

-- Order 133-135: Từ chối trả hàng - PAID (không hoàn tiền)
(279, 133, 1, '2025-09-20 10:00:00', 'Đơn hàng mới - chờ thanh toán'),
(280, 133, 2, '2025-09-20 10:30:00', 'Thanh toán qua SePay thành công'),

(281, 134, 1, '2025-10-10 13:00:00', 'Đơn hàng mới - chờ thanh toán'),
(282, 134, 2, '2025-10-10 13:25:00', 'Thanh toán qua SePay thành công'),

(283, 135, 1, '2025-10-28 09:00:00', 'Đơn hàng mới - chờ thanh toán'),
(284, 135, 2, '2025-10-28 09:35:00', 'Thanh toán qua SePay thành công');

-- =====================================================
-- FILE 5C: SHIPPING HISTORY VÀ RETURN REQUESTS
-- Cho các đơn trả hàng (Order 116-135)
-- =====================================================

-- Shipping history cho đơn trả hàng
-- Flow hoàn chỉnh: PROCESSING → SHIPPED → DELIVERED → RECEIVED → RETURNED (nếu approved)

INSERT INTO order_shipping_history (history_id, order_id, status_id, created_at, note) VALUES
-- Order 116: Trả hàng thành công
(419, 116, 1, '2025-01-20 10:00:00', 'Đang xử lý đơn hàng'),
(420, 116, 2, '2025-01-21 08:00:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(421, 116, 3, '2025-01-23 14:00:00', 'Đã giao hàng thành công'),
(422, 116, 5, '2025-01-23 14:30:00', 'Khách hàng đã nhận hàng'),
(423, 116, 6, '2025-02-05 14:00:00', 'Đã nhận hàng trả lại - sản phẩm lỗi'),

-- Order 117: Trả hàng thành công
(424, 117, 1, '2025-02-15 11:00:00', 'Đang xử lý đơn hàng'),
(425, 117, 2, '2025-02-16 08:30:00', 'Đã giao cho đơn vị vận chuyển GHTK'),
(426, 117, 3, '2025-02-18 15:00:00', 'Đã giao hàng thành công'),
(427, 117, 5, '2025-02-18 15:30:00', 'Khách hàng đã nhận hàng'),
(428, 117, 6, '2025-03-02 15:00:00', 'Đã nhận hàng trả lại - pin bị phồng'),

-- Order 118: Trả hàng thành công
(429, 118, 1, '2025-03-10 15:00:00', 'Đang xử lý đơn hàng'),
(430, 118, 2, '2025-03-11 08:00:00', 'Đã giao cho đơn vị vận chuyển J&T Express'),
(431, 118, 3, '2025-03-13 13:00:00', 'Đã giao hàng thành công'),
(432, 118, 5, '2025-03-13 13:30:00', 'Khách hàng đã nhận hàng'),
(433, 118, 6, '2025-03-25 11:00:00', 'Đã nhận hàng trả lại - camera không hoạt động'),

-- Order 119: Trả hàng thành công
(434, 119, 1, '2025-04-05 12:00:00', 'Đang xử lý đơn hàng'),
(435, 119, 2, '2025-04-06 08:30:00', 'Đã giao cho đơn vị vận chuyển Viettel Post'),
(436, 119, 3, '2025-04-08 16:00:00', 'Đã giao hàng thành công'),
(437, 119, 5, '2025-04-08 16:30:00', 'Khách hàng đã nhận hàng'),
(438, 119, 6, '2025-04-20 16:00:00', 'Đã nhận hàng trả lại - loa bị rè'),

-- Order 120: Trả hàng thành công
(439, 120, 1, '2025-05-01 10:00:00', 'Đang xử lý đơn hàng'),
(440, 120, 2, '2025-05-02 08:00:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(441, 120, 3, '2025-05-04 14:30:00', 'Đã giao hàng thành công'),
(442, 120, 5, '2025-05-04 15:00:00', 'Khách hàng đã nhận hàng'),
(443, 120, 6, '2025-05-15 10:00:00', 'Đã nhận hàng trả lại - màn hình bị sọc'),

-- Order 121-125: Trả hàng do không đúng mô tả
(444, 121, 1, '2025-05-25 16:00:00', 'Đang xử lý đơn hàng'),
(445, 121, 2, '2025-05-26 08:30:00', 'Đã giao cho đơn vị vận chuyển GHTK'),
(446, 121, 3, '2025-05-28 15:00:00', 'Đã giao hàng thành công'),
(447, 121, 5, '2025-05-28 15:30:00', 'Khách hàng đã nhận hàng'),
(448, 121, 6, '2025-06-10 14:00:00', 'Đã nhận hàng trả lại - màu không đúng'),

(449, 122, 1, '2025-06-20 11:00:00', 'Đang xử lý đơn hàng'),
(450, 122, 2, '2025-06-21 08:00:00', 'Đã giao cho đơn vị vận chuyển Ninja Van'),
(451, 122, 3, '2025-06-23 14:00:00', 'Đã giao hàng thành công'),
(452, 122, 5, '2025-06-23 14:30:00', 'Khách hàng đã nhận hàng'),
(453, 122, 6, '2025-07-05 11:30:00', 'Đã nhận hàng trả lại - dung lượng sai'),

(454, 123, 1, '2025-07-15 14:00:00', 'Đang xử lý đơn hàng'),
(455, 123, 2, '2025-07-16 08:30:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(456, 123, 3, '2025-07-18 15:30:00', 'Đã giao hàng thành công'),
(457, 123, 5, '2025-07-18 16:00:00', 'Khách hàng đã nhận hàng'),
(458, 123, 6, '2025-07-30 15:00:00', 'Đã nhận hàng trả lại - phiên bản sai'),

(459, 124, 1, '2025-08-05 10:00:00', 'Đang xử lý đơn hàng'),
(460, 124, 2, '2025-08-06 08:00:00', 'Đã giao cho đơn vị vận chuyển Viettel Post'),
(461, 124, 3, '2025-08-08 14:00:00', 'Đã giao hàng thành công'),
(462, 124, 5, '2025-08-08 14:30:00', 'Khách hàng đã nhận hàng'),
(463, 124, 6, '2025-08-20 14:00:00', 'Đã nhận hàng trả lại - thiếu phụ kiện'),

(464, 125, 1, '2025-08-28 15:00:00', 'Đang xử lý đơn hàng'),
(465, 125, 2, '2025-08-29 08:30:00', 'Đã giao cho đơn vị vận chuyển J&T Express'),
(466, 125, 3, '2025-08-31 13:00:00', 'Đã giao hàng thành công'),
(467, 125, 5, '2025-08-31 13:30:00', 'Khách hàng đã nhận hàng'),
(468, 125, 6, '2025-09-12 16:00:00', 'Đã nhận hàng trả lại - không nguyên seal'),

-- Order 126-128: Trả hàng do khách đổi ý
(469, 126, 1, '2025-09-15 12:00:00', 'Đang xử lý đơn hàng'),
(470, 126, 2, '2025-09-16 08:00:00', 'Đã giao cho đơn vị vận chuyển GHTK'),
(471, 126, 3, '2025-09-18 15:00:00', 'Đã giao hàng thành công'),
(472, 126, 5, '2025-09-18 15:30:00', 'Khách hàng đã nhận hàng'),
(473, 126, 6, '2025-09-30 10:00:00', 'Đã nhận hàng trả lại - khách đổi ý'),

(474, 127, 1, '2025-10-01 16:00:00', 'Đang xử lý đơn hàng'),
(475, 127, 2, '2025-10-02 08:30:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(476, 127, 3, '2025-10-04 14:30:00', 'Đã giao hàng thành công'),
(477, 127, 5, '2025-10-04 15:00:00', 'Khách hàng đã nhận hàng'),
(478, 127, 6, '2025-10-15 14:00:00', 'Đã nhận hàng trả lại - khách đổi ý'),

(479, 128, 1, '2025-10-18 11:00:00', 'Đang xử lý đơn hàng'),
(480, 128, 2, '2025-10-19 08:00:00', 'Đã giao cho đơn vị vận chuyển Ninja Van'),
(481, 128, 3, '2025-10-21 15:00:00', 'Đã giao hàng thành công'),
(482, 128, 5, '2025-10-21 15:30:00', 'Khách hàng đã nhận hàng'),
(483, 128, 6, '2025-11-02 11:00:00', 'Đã nhận hàng trả lại - khách đổi ý'),

-- Order 129-132: Đang chờ xử lý yêu cầu trả hàng (chưa có RETURNED)
(484, 129, 1, '2025-11-05 10:00:00', 'Đang xử lý đơn hàng'),
(485, 129, 2, '2025-11-06 08:30:00', 'Đã giao cho đơn vị vận chuyển Viettel Post'),
(486, 129, 3, '2025-11-08 14:00:00', 'Đã giao hàng thành công'),
(487, 129, 5, '2025-11-08 14:30:00', 'Khách hàng đã nhận hàng'),

(488, 130, 1, '2025-11-12 15:00:00', 'Đang xử lý đơn hàng'),
(489, 130, 2, '2025-11-13 08:00:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(490, 130, 3, '2025-11-15 15:30:00', 'Đã giao hàng thành công'),
(491, 130, 5, '2025-11-15 16:00:00', 'Khách hàng đã nhận hàng'),

(492, 131, 1, '2025-11-20 12:00:00', 'Đang xử lý đơn hàng'),
(493, 131, 2, '2025-11-21 08:30:00', 'Đã giao cho đơn vị vận chuyển GHTK'),
(494, 131, 3, '2025-11-23 14:00:00', 'Đã giao hàng thành công'),
(495, 131, 5, '2025-11-23 14:30:00', 'Khách hàng đã nhận hàng'),

(496, 132, 1, '2025-11-25 16:00:00', 'Đang xử lý đơn hàng'),
(497, 132, 2, '2025-11-26 08:00:00', 'Đã giao cho đơn vị vận chuyển J&T Express'),
(498, 132, 3, '2025-11-28 15:00:00', 'Đã giao hàng thành công'),
(499, 132, 5, '2025-11-28 15:30:00', 'Khách hàng đã nhận hàng'),

-- Order 133-135: Từ chối trả hàng (không có RETURNED)
(500, 133, 1, '2025-09-20 11:00:00', 'Đang xử lý đơn hàng'),
(501, 133, 2, '2025-09-21 08:30:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(502, 133, 3, '2025-09-23 14:30:00', 'Đã giao hàng thành công'),
(503, 133, 5, '2025-09-23 15:00:00', 'Khách hàng đã nhận hàng'),

(504, 134, 1, '2025-10-10 14:00:00', 'Đang xử lý đơn hàng'),
(505, 134, 2, '2025-10-11 08:00:00', 'Đã giao cho đơn vị vận chuyển Viettel Post'),
(506, 134, 3, '2025-10-13 15:00:00', 'Đã giao hàng thành công'),
(507, 134, 5, '2025-10-13 15:30:00', 'Khách hàng đã nhận hàng'),

(508, 135, 1, '2025-10-28 10:00:00', 'Đang xử lý đơn hàng'),
(509, 135, 2, '2025-10-29 08:30:00', 'Đã giao cho đơn vị vận chuyển GHTK'),
(510, 135, 3, '2025-10-31 14:00:00', 'Đã giao hàng thành công'),
(511, 135, 5, '2025-10-31 14:30:00', 'Khách hàng đã nhận hàng');

-- RETURN REQUESTS - Yêu cầu trả hàng
INSERT INTO return_requests (return_request_id, order_id, user_id, reason, image_url, status, admin_note, created_at, updated_at, processed_by) VALUES
-- Yêu cầu đã được duyệt - Lỗi sản phẩm (Order 116-120)
(1, 116, 4, 'Màn hình điện thoại bị lỗi, xuất hiện điểm chết sau 1 tuần sử dụng', 'https://example.com/return/116_screen_defect.jpg', 'APPROVED', 'Đã kiểm tra và xác nhận lỗi màn hình - chấp nhận trả hàng và hoàn tiền 100%', '2025-01-28 10:00:00', '2025-02-05 14:00:00', 1),
(2, 117, 9, 'Pin điện thoại bị phồng, rất nguy hiểm khi sử dụng', 'https://example.com/return/117_battery_swollen.jpg', 'APPROVED', 'Xác nhận pin bị phồng - lỗi sản xuất. Hoàn tiền 100% và gửi xin lỗi khách hàng', '2025-02-25 14:00:00', '2025-03-02 15:00:00', 1),
(3, 118, 14, 'Camera sau không hoạt động, chỉ hiện màn hình đen', 'https://example.com/return/118_camera_broken.jpg', 'APPROVED', 'Đã test và xác nhận camera không hoạt động - chấp nhận trả hàng', '2025-03-18 09:00:00', '2025-03-25 11:00:00', 1),
(4, 119, 19, 'Loa ngoài bị rè, không thể nghe nhạc hay gọi điện', 'https://example.com/return/119_speaker_issue.jpg', 'APPROVED', 'Xác nhận loa bị rè - lỗi phần cứng. Hoàn tiền đầy đủ', '2025-04-12 15:00:00', '2025-04-20 16:00:00', 1),
(5, 120, 24, 'Màn hình có vệt sọc ngang xuất hiện sau 3 ngày', 'https://example.com/return/120_screen_lines.jpg', 'APPROVED', 'Đã kiểm tra - màn hình bị lỗi. Chấp nhận trả hàng và hoàn tiền', '2025-05-08 11:00:00', '2025-05-15 10:00:00', 1),

-- Yêu cầu đã được duyệt - Không đúng mô tả (Order 121-125)
(6, 121, 29, 'Màu sản phẩm nhận được khác với hình trên website (đặt xanh nhận đen)', 'https://example.com/return/121_wrong_color.jpg', 'APPROVED', 'Xác nhận giao sai màu - lỗi từ kho. Chấp nhận trả hàng và hoàn tiền 100%', '2025-06-02 10:00:00', '2025-06-10 14:00:00', 1),
(7, 122, 34, 'Đặt bản 256GB nhưng nhận được bản 128GB', 'https://example.com/return/122_wrong_storage.jpg', 'APPROVED', 'Xác nhận giao sai dung lượng. Hoàn tiền và gửi voucher xin lỗi', '2025-06-28 14:00:00', '2025-07-05 11:30:00', 1),
(8, 123, 39, 'Đặt phiên bản 5G nhưng nhận được bản 4G', 'https://example.com/return/123_wrong_version.jpg', 'APPROVED', 'Xác nhận giao sai phiên bản - lỗi hệ thống. Hoàn tiền đầy đủ', '2025-07-22 16:00:00', '2025-07-30 15:00:00', 1),
(9, 124, 44, 'Hộp sản phẩm thiếu củ sạc và cáp như mô tả', 'https://example.com/return/124_missing_accessories.jpg', 'APPROVED', 'Xác nhận thiếu phụ kiện so với mô tả. Chấp nhận trả hàng', '2025-08-12 09:30:00', '2025-08-20 14:00:00', 1),
(10, 125, 49, 'Sản phẩm không nguyên seal, có dấu hiệu đã khui hộp', 'https://example.com/return/125_not_sealed.jpg', 'APPROVED', 'Xác nhận sản phẩm không nguyên seal - có thể hàng trưng bày. Hoàn tiền 100%', '2025-09-05 11:00:00', '2025-09-12 16:00:00', 1),

-- Yêu cầu đã được duyệt - Khách đổi ý (Order 126-128)
(11, 126, 2, 'Tôi đổi ý muốn mua model khác có camera tốt hơn', NULL, 'APPROVED', 'Chấp nhận trả hàng do đổi ý. Hoàn 90% giá trị (trừ 10% phí xử lý theo chính sách)', '2025-09-22 14:00:00', '2025-09-30 10:00:00', 1),
(12, 127, 7, 'Sản phẩm không phù hợp với nhu cầu sử dụng của tôi', NULL, 'APPROVED', 'Chấp nhận trả hàng do đổi ý trong 7 ngày. Hoàn 90% (trừ 10% phí)', '2025-10-08 10:00:00', '2025-10-15 14:00:00', 1),
(13, 128, 12, 'Muốn đổi sang màu khác', NULL, 'APPROVED', 'Chấp nhận đổi ý. Hoàn tiền 90% theo chính sách đổi trả', '2025-10-25 15:30:00', '2025-11-02 11:00:00', 1),

-- Yêu cầu đang chờ xử lý - PENDING (Order 129-132)
(14, 129, 17, 'Điện thoại hay bị giật lag khi sử dụng', 'https://example.com/return/129_lag_issue.jpg', 'PENDING', NULL, '2025-11-15 09:00:00', NULL, NULL),
(15, 130, 22, 'Cảm ứng không nhạy ở góc màn hình', 'https://example.com/return/130_touch_issue.jpg', 'PENDING', NULL, '2025-11-20 14:30:00', NULL, NULL),
(16, 131, 27, 'Pin tụt nhanh bất thường, chỉ dùng được 3-4 tiếng', 'https://example.com/return/131_battery_drain.jpg', 'PENDING', NULL, '2025-11-28 10:00:00', NULL, NULL),
(17, 132, 32, 'Máy nóng bất thường khi sạc', 'https://example.com/return/132_overheating.jpg', 'PENDING', NULL, '2025-12-02 16:00:00', NULL, NULL),

-- Yêu cầu bị từ chối - REJECTED (Order 133-135)
(18, 133, 37, 'Tôi không thích màu này nữa', NULL, 'REJECTED', 'Từ chối trả hàng: Đã quá thời hạn 7 ngày đổi trả do đổi ý (yêu cầu sau 15 ngày nhận hàng)', '2025-10-08 11:00:00', '2025-10-10 09:00:00', 1),
(19, 134, 42, 'Muốn trả hàng để mua điện thoại hãng khác', NULL, 'REJECTED', 'Từ chối: Lý do đổi ý không hợp lệ sau 14 ngày. Sản phẩm hoạt động bình thường', '2025-10-25 14:00:00', '2025-10-27 10:00:00', 1),
(20, 135, 47, 'Tôi nghĩ sản phẩm này đắt quá so với giá trị', NULL, 'REJECTED', 'Từ chối: Không phải lỗi sản phẩm hoặc dịch vụ. Khách đã xác nhận nhận hàng tốt', '2025-11-10 09:30:00', '2025-11-12 11:00:00', 1);

-- =====================================================
-- FILE 5D: CẬP NHẬT TRANSACTIONS CHO ĐƠN TRẢ HÀNG
-- =====================================================

-- Transactions cho các đơn hàng trả hàng (đã thanh toán trước khi trả)
INSERT INTO transactions (
    trans_id, webhook_id, payment_method, transaction_id, transaction_type, 
    transaction_date, transaction_status, transaction_amount, transaction_currency,
    authentication_status, timestamp, notification_type, order_status, 
    order_invoice_number, card_number, card_holder_name, card_expiry, 
    card_funding_method, card_brand, created_at, user_id, order_id
) VALUES
-- Transactions cho đơn trả hàng (Order 116-135)
(96, 'wh_096', 'BANK_TRANSFER', 'SP20250120093000096', 'PAYMENT', '2025-01-20 09:30:00', 'SUCCESS', 19990000, 'VND', 'AUTHENTICATED', 1737357000, 'PAYMENT_SUCCESS', 'COMPLETED', 'INV-20250120-096', NULL, NULL, NULL, NULL, NULL, '2025-01-20 09:30:00', 4, 116),
(97, 'wh_097', 'BANK_TRANSFER', 'SP20250215102500097', 'PAYMENT', '2025-02-15 10:25:00', 'SUCCESS', 28990000, 'VND', 'AUTHENTICATED', 1739611500, 'PAYMENT_SUCCESS', 'COMPLETED', 'INV-20250215-097', NULL, NULL, NULL, NULL, NULL, '2025-02-15 10:25:00', 9, 117),
(98, 'wh_098', 'BANK_TRANSFER', 'SP20250310142000098', 'PAYMENT', '2025-03-10 14:20:00', 'SUCCESS', 11990000, 'VND', 'AUTHENTICATED', 1741613200, 'PAYMENT_SUCCESS', 'COMPLETED', 'INV-20250310-098', NULL, NULL, NULL, NULL, NULL, '2025-03-10 14:20:00', 14, 118),
(99, 'wh_099', 'BANK_TRANSFER', 'SP20250405113500099', 'PAYMENT', '2025-04-05 11:35:00', 'SUCCESS', 35990000, 'VND', 'AUTHENTICATED', 1743849300, 'PAYMENT_SUCCESS', 'COMPLETED', 'INV-20250405-099', NULL, NULL, NULL, NULL, NULL, '2025-04-05 11:35:00', 19, 119),
(100, 'wh_100', 'BANK_TRANSFER', 'SP20250501092500100', 'PAYMENT', '2025-05-01 09:25:00', 'SUCCESS', 16490000, 'VND', 'AUTHENTICATED', 1746089100, 'PAYMENT_SUCCESS', 'COMPLETED', 'INV-20250501-100', NULL, NULL, NULL, NULL, NULL, '2025-05-01 09:25:00', 24, 120),
(101, 'wh_101', 'BANK_TRANSFER', 'SP20250525153000101', 'PAYMENT', '2025-05-25 15:30:00', 'SUCCESS', 23990000, 'VND', 'AUTHENTICATED', 1748185800, 'PAYMENT_SUCCESS', 'COMPLETED', 'INV-20250525-101', NULL, NULL, NULL, NULL, NULL, '2025-05-25 15:30:00', 29, 121),
(102, 'wh_102', 'BANK_TRANSFER', 'SP20250620102000102', 'PAYMENT', '2025-06-20 10:20:00', 'SUCCESS', 13490000, 'VND', 'AUTHENTICATED', 1750422000, 'PAYMENT_SUCCESS', 'COMPLETED', 'INV-20250620-102', NULL, NULL, NULL, NULL, NULL, '2025-06-20 10:20:00', 34, 122),
(103, 'wh_103', 'BANK_TRANSFER', 'SP20250715134000103', 'PAYMENT', '2025-07-15 13:40:00', 'SUCCESS', 29990000, 'VND', 'AUTHENTICATED', 1752587200, 'PAYMENT_SUCCESS', 'COMPLETED', 'INV-20250715-103', NULL, NULL, NULL, NULL, NULL, '2025-07-15 13:40:00', 39, 123),
(104, 'wh_104', 'BANK_TRANSFER', 'SP20250805093000104', 'PAYMENT', '2025-08-05 09:30:00', 'SUCCESS', 17990000, 'VND', 'AUTHENTICATED', 1754380200, 'PAYMENT_SUCCESS', 'COMPLETED', 'INV-20250805-104', NULL, NULL, NULL, NULL, NULL, '2025-08-05 09:30:00', 44, 124),
(105, 'wh_105', 'BANK_TRANSFER', 'SP20250828142500105', 'PAYMENT', '2025-08-28 14:25:00', 'SUCCESS', 24490000, 'VND', 'AUTHENTICATED', 1756383900, 'PAYMENT_SUCCESS', 'COMPLETED', 'INV-20250828-105', NULL, NULL, NULL, NULL, NULL, '2025-08-28 14:25:00', 49, 125),
(106, 'wh_106', 'BANK_TRANSFER', 'SP20250915113000106', 'PAYMENT', '2025-09-15 11:30:00', 'SUCCESS', 12990000, 'VND', 'AUTHENTICATED', 1757937000, 'PAYMENT_SUCCESS', 'COMPLETED', 'INV-20250915-106', NULL, NULL, NULL, NULL, NULL, '2025-09-15 11:30:00', 2, 126),
(107, 'wh_107', 'BANK_TRANSFER', 'SP20251001153500107', 'PAYMENT', '2025-10-01 15:35:00', 'SUCCESS', 31990000, 'VND', 'AUTHENTICATED', 1759325700, 'PAYMENT_SUCCESS', 'COMPLETED', 'INV-20251001-107', NULL, NULL, NULL, NULL, NULL, '2025-10-01 15:35:00', 7, 127),
(108, 'wh_108', 'BANK_TRANSFER', 'SP20251018102000108', 'PAYMENT', '2025-10-18 10:20:00', 'SUCCESS', 9990000, 'VND', 'AUTHENTICATED', 1760779200, 'PAYMENT_SUCCESS', 'COMPLETED', 'INV-20251018-108', NULL, NULL, NULL, NULL, NULL, '2025-10-18 10:20:00', 12, 128),
(109, 'wh_109', 'BANK_TRANSFER', 'SP20251105093000109', 'PAYMENT', '2025-11-05 09:30:00', 'SUCCESS', 22990000, 'VND', 'AUTHENTICATED', 1762329000, 'PAYMENT_SUCCESS', 'COMPLETED', 'INV-20251105-109', NULL, NULL, NULL, NULL, NULL, '2025-11-05 09:30:00', 17, 129),
(110, 'wh_110', 'BANK_TRANSFER', 'SP20251112142500110', 'PAYMENT', '2025-11-12 14:25:00', 'SUCCESS', 18490000, 'VND', 'AUTHENTICATED', 1762951500, 'PAYMENT_SUCCESS', 'COMPLETED', 'INV-20251112-110', NULL, NULL, NULL, NULL, NULL, '2025-11-12 14:25:00', 22, 130),
(111, 'wh_111', 'BANK_TRANSFER', 'SP20251120113500111', 'PAYMENT', '2025-11-20 11:35:00', 'SUCCESS', 27990000, 'VND', 'AUTHENTICATED', 1763631300, 'PAYMENT_SUCCESS', 'COMPLETED', 'INV-20251120-111', NULL, NULL, NULL, NULL, NULL, '2025-11-20 11:35:00', 27, 131),
(112, 'wh_112', 'BANK_TRANSFER', 'SP20251125152000112', 'PAYMENT', '2025-11-25 15:20:00', 'SUCCESS', 14990000, 'VND', 'AUTHENTICATED', 1764073200, 'PAYMENT_SUCCESS', 'COMPLETED', 'INV-20251125-112', NULL, NULL, NULL, NULL, NULL, '2025-11-25 15:20:00', 32, 132),
(113, 'wh_113', 'BANK_TRANSFER', 'SP20250920103000113', 'PAYMENT', '2025-09-20 10:30:00', 'SUCCESS', 21990000, 'VND', 'AUTHENTICATED', 1758360600, 'PAYMENT_SUCCESS', 'COMPLETED', 'INV-20250920-113', NULL, NULL, NULL, NULL, NULL, '2025-09-20 10:30:00', 37, 133),
(114, 'wh_114', 'BANK_TRANSFER', 'SP20251010132500114', 'PAYMENT', '2025-10-10 13:25:00', 'SUCCESS', 16990000, 'VND', 'AUTHENTICATED', 1760106300, 'PAYMENT_SUCCESS', 'COMPLETED', 'INV-20251010-114', NULL, NULL, NULL, NULL, NULL, '2025-10-10 13:25:00', 42, 134),
(115, 'wh_115', 'BANK_TRANSFER', 'SP20251028093500115', 'PAYMENT', '2025-10-28 09:35:00', 'SUCCESS', 25990000, 'VND', 'AUTHENTICATED', 1761623700, 'PAYMENT_SUCCESS', 'COMPLETED', 'INV-20251028-115', NULL, NULL, NULL, NULL, NULL, '2025-10-28 09:35:00', 47, 135),

-- Transactions cho đơn hủy bị từ chối (Order 114-115 đã thanh toán)
(116, 'wh_116', 'BANK_TRANSFER', 'SP20251020093000116', 'PAYMENT', '2025-10-20 09:30:00', 'SUCCESS', 16990000, 'VND', 'AUTHENTICATED', 1760962200, 'PAYMENT_SUCCESS', 'COMPLETED', 'INV-20251020-116', NULL, NULL, NULL, NULL, NULL, '2025-10-20 09:30:00', 13, 114),
(117, 'wh_117', 'BANK_TRANSFER', 'SP20251101112500117', 'PAYMENT', '2025-11-01 11:25:00', 'SUCCESS', 21990000, 'VND', 'AUTHENTICATED', 1761989100, 'PAYMENT_SUCCESS', 'COMPLETED', 'INV-20251101-117', NULL, NULL, NULL, NULL, NULL, '2025-11-01 11:25:00', 18, 115);

-- Cập nhật tất cả sequences
SELECT setval('orders_order_id_seq', 135, true);
SELECT setval('order_detail_od_id_seq', 137, true);
SELECT setval('order_payment_history_history_id_seq', 284, true);
SELECT setval('order_shipping_history_history_id_seq', 511, true);
SELECT setval('cancel_requests_cancel_request_id_seq', 9, true);
SELECT setval('return_requests_return_request_id_seq', 20, true);
SELECT setval('transactions_trans_id_seq', 117, true);
