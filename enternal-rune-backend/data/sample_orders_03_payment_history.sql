-- =====================================================
-- FILE 3A: PAYMENT HISTORY - Lịch sử thanh toán
-- Mỗi đơn hàng có nhiều status theo flow thực tế
-- Payment Status IDs: 1=PENDING, 2=PAID, 3=FAILED, 4=REFUNDED, 5=EXPIRED, 6=CANCELLED
-- Flow thành công: PENDING (1) → PAID (2)
-- =====================================================

INSERT INTO order_payment_history (history_id, order_id, status_id, created_at, note) VALUES
-- Order 1-10 (Tháng 12/2024): Flow PENDING → PAID
(1, 1, 1, '2024-12-05 10:00:00', 'Đơn hàng mới - chờ thanh toán'),
(2, 1, 2, '2024-12-05 10:15:00', 'Thanh toán qua SePay thành công'),

(3, 2, 1, '2024-12-08 14:00:00', 'Đơn hàng mới - chờ thanh toán'),
(4, 2, 2, '2024-12-08 14:20:00', 'Thanh toán qua SePay thành công'),

(5, 3, 1, '2024-12-12 09:30:00', 'Đơn hàng mới - chờ thanh toán'),
(6, 3, 2, '2024-12-12 09:45:00', 'Thanh toán qua SePay thành công'),

(7, 4, 1, '2024-12-15 11:00:00', 'Đơn hàng mới - chờ thanh toán'),
(8, 4, 2, '2024-12-15 11:10:00', 'Thanh toán qua SePay thành công'),

(9, 5, 1, '2024-12-18 16:00:00', 'Đơn hàng mới - chờ thanh toán'),
(10, 5, 2, '2024-12-18 16:25:00', 'Thanh toán qua SePay thành công'),

(11, 6, 1, '2024-12-20 10:00:00', 'Đơn hàng mới - chờ thanh toán'),
(12, 6, 2, '2024-12-20 10:15:00', 'Thanh toán qua SePay thành công'),

(13, 7, 1, '2024-12-22 13:00:00', 'Đơn hàng mới - chờ thanh toán'),
(14, 7, 2, '2024-12-22 13:20:00', 'Thanh toán qua SePay thành công'),

(15, 8, 1, '2024-12-25 15:00:00', 'Đơn hàng mới - chờ thanh toán'),
(16, 8, 2, '2024-12-25 15:30:00', 'Thanh toán qua SePay thành công'),

(17, 9, 1, '2024-12-28 11:00:00', 'Đơn hàng mới - chờ thanh toán'),
(18, 9, 2, '2024-12-28 11:45:00', 'Thanh toán qua SePay thành công'),

(19, 10, 1, '2024-12-30 09:00:00', 'Đơn hàng mới - chờ thanh toán'),
(20, 10, 2, '2024-12-30 09:20:00', 'Thanh toán qua SePay thành công'),

-- Order 11-20 (Tháng 1/2025)
(21, 11, 1, '2025-01-03 10:00:00', 'Đơn hàng mới - chờ thanh toán'),
(22, 11, 2, '2025-01-03 10:30:00', 'Thanh toán qua SePay thành công'),

(23, 12, 1, '2025-01-06 14:00:00', 'Đơn hàng mới - chờ thanh toán'),
(24, 12, 2, '2025-01-06 14:15:00', 'Thanh toán qua SePay thành công'),

(25, 13, 1, '2025-01-10 09:00:00', 'Đơn hàng mới - chờ thanh toán'),
(26, 13, 2, '2025-01-10 09:25:00', 'Thanh toán qua SePay thành công'),

(27, 14, 1, '2025-01-14 11:00:00', 'Đơn hàng mới - chờ thanh toán'),
(28, 14, 2, '2025-01-14 11:20:00', 'Thanh toán qua SePay thành công'),

(29, 15, 1, '2025-01-18 15:00:00', 'Đơn hàng mới - chờ thanh toán'),
(30, 15, 2, '2025-01-18 15:30:00', 'Thanh toán qua SePay thành công'),

(31, 16, 1, '2025-01-21 10:00:00', 'Đơn hàng mới - chờ thanh toán'),
(32, 16, 2, '2025-01-21 10:10:00', 'Thanh toán qua SePay thành công'),

(33, 17, 1, '2025-01-25 13:00:00', 'Đơn hàng mới - chờ thanh toán'),
(34, 17, 2, '2025-01-25 13:45:00', 'Thanh toán qua SePay thành công'),

(35, 18, 1, '2025-01-28 09:00:00', 'Đơn hàng mới - chờ thanh toán'),
(36, 18, 2, '2025-01-28 09:30:00', 'Thanh toán qua SePay thành công'),

(37, 19, 1, '2025-01-30 16:00:00', 'Đơn hàng mới - chờ thanh toán'),
(38, 19, 2, '2025-01-30 16:20:00', 'Thanh toán qua SePay thành công'),

(39, 20, 1, '2025-01-31 14:00:00', 'Đơn hàng mới - chờ thanh toán'),
(40, 20, 2, '2025-01-31 14:25:00', 'Thanh toán qua SePay thành công'),

-- Order 21-30 (Tháng 2-3/2025)
(41, 21, 1, '2025-02-05 10:00:00', 'Đơn hàng mới - chờ thanh toán'),
(42, 21, 2, '2025-02-05 10:15:00', 'Thanh toán qua SePay thành công'),

(43, 22, 1, '2025-02-08 11:00:00', 'Đơn hàng mới - chờ thanh toán'),
(44, 22, 2, '2025-02-08 11:30:00', 'Thanh toán qua SePay thành công'),

(45, 23, 1, '2025-02-12 14:00:00', 'Đơn hàng mới - chờ thanh toán'),
(46, 23, 2, '2025-02-12 14:20:00', 'Thanh toán qua SePay thành công'),

(47, 24, 1, '2025-02-15 09:00:00', 'Đơn hàng mới - chờ thanh toán'),
(48, 24, 2, '2025-02-15 09:40:00', 'Thanh toán qua SePay thành công'),

(49, 25, 1, '2025-02-18 15:00:00', 'Đơn hàng mới - chờ thanh toán'),
(50, 25, 2, '2025-02-18 15:25:00', 'Thanh toán qua SePay thành công'),

(51, 26, 1, '2025-02-22 10:00:00', 'Đơn hàng mới - chờ thanh toán'),
(52, 26, 2, '2025-02-22 10:35:00', 'Thanh toán qua SePay thành công'),

(53, 27, 1, '2025-02-25 13:00:00', 'Đơn hàng mới - chờ thanh toán'),
(54, 27, 2, '2025-02-25 13:20:00', 'Thanh toán qua SePay thành công'),

(55, 28, 1, '2025-02-28 16:00:00', 'Đơn hàng mới - chờ thanh toán'),
(56, 28, 2, '2025-02-28 16:30:00', 'Thanh toán qua SePay thành công'),

(57, 29, 1, '2025-03-02 09:00:00', 'Đơn hàng mới - chờ thanh toán'),
(58, 29, 2, '2025-03-02 09:25:00', 'Thanh toán qua SePay thành công'),

(59, 30, 1, '2025-03-05 11:00:00', 'Đơn hàng mới - chờ thanh toán'),
(60, 30, 2, '2025-03-05 11:15:00', 'Thanh toán qua SePay thành công'),

-- Order 31-40 (Tháng 3-4/2025)
(61, 31, 1, '2025-03-08 14:00:00', 'Đơn hàng mới - chờ thanh toán'),
(62, 31, 2, '2025-03-08 14:40:00', 'Thanh toán qua SePay thành công'),

(63, 32, 1, '2025-03-12 10:00:00', 'Đơn hàng mới - chờ thanh toán'),
(64, 32, 2, '2025-03-12 10:20:00', 'Thanh toán qua SePay thành công'),

(65, 33, 1, '2025-03-15 15:00:00', 'Đơn hàng mới - chờ thanh toán'),
(66, 33, 2, '2025-03-15 15:35:00', 'Thanh toán qua SePay thành công'),

(67, 34, 1, '2025-03-18 09:00:00', 'Đơn hàng mới - chờ thanh toán'),
(68, 34, 2, '2025-03-18 09:15:00', 'Thanh toán qua SePay thành công'),

(69, 35, 1, '2025-03-22 13:00:00', 'Đơn hàng mới - chờ thanh toán'),
(70, 35, 2, '2025-03-22 13:30:00', 'Thanh toán qua SePay thành công'),

(71, 36, 1, '2025-03-25 11:00:00', 'Đơn hàng mới - chờ thanh toán'),
(72, 36, 2, '2025-03-25 11:20:00', 'Thanh toán qua SePay thành công'),

(73, 37, 1, '2025-03-28 16:00:00', 'Đơn hàng mới - chờ thanh toán'),
(74, 37, 2, '2025-03-28 16:45:00', 'Thanh toán qua SePay thành công'),

(75, 38, 1, '2025-03-30 10:00:00', 'Đơn hàng mới - chờ thanh toán'),
(76, 38, 2, '2025-03-30 10:25:00', 'Thanh toán qua SePay thành công'),

(77, 39, 1, '2025-04-03 14:00:00', 'Đơn hàng mới - chờ thanh toán'),
(78, 39, 2, '2025-04-03 14:30:00', 'Thanh toán qua SePay thành công'),

(79, 40, 1, '2025-04-07 09:00:00', 'Đơn hàng mới - chờ thanh toán'),
(80, 40, 2, '2025-04-07 09:20:00', 'Thanh toán qua SePay thành công'),

-- Order 41-50 (Tháng 4-5/2025)
(81, 41, 1, '2025-04-11 11:00:00', 'Đơn hàng mới - chờ thanh toán'),
(82, 41, 2, '2025-04-11 11:35:00', 'Thanh toán qua SePay thành công'),

(83, 42, 1, '2025-04-15 15:00:00', 'Đơn hàng mới - chờ thanh toán'),
(84, 42, 2, '2025-04-15 15:15:00', 'Thanh toán qua SePay thành công'),

(85, 43, 1, '2025-04-18 10:00:00', 'Đơn hàng mới - chờ thanh toán'),
(86, 43, 2, '2025-04-18 10:30:00', 'Thanh toán qua SePay thành công'),

(87, 44, 1, '2025-04-22 13:00:00', 'Đơn hàng mới - chờ thanh toán'),
(88, 44, 2, '2025-04-22 13:25:00', 'Thanh toán qua SePay thành công'),

(89, 45, 1, '2025-04-26 16:00:00', 'Đơn hàng mới - chờ thanh toán'),
(90, 45, 2, '2025-04-26 16:40:00', 'Thanh toán qua SePay thành công'),

(91, 46, 1, '2025-04-29 09:00:00', 'Đơn hàng mới - chờ thanh toán'),
(92, 46, 2, '2025-04-29 09:10:00', 'Thanh toán qua SePay thành công'),

(93, 47, 1, '2025-05-02 14:00:00', 'Đơn hàng mới - chờ thanh toán'),
(94, 47, 2, '2025-05-02 14:45:00', 'Thanh toán qua SePay thành công'),

(95, 48, 1, '2025-05-05 11:00:00', 'Đơn hàng mới - chờ thanh toán'),
(96, 48, 2, '2025-05-05 11:20:00', 'Thanh toán qua SePay thành công'),

(97, 49, 1, '2025-05-09 15:00:00', 'Đơn hàng mới - chờ thanh toán'),
(98, 49, 2, '2025-05-09 15:30:00', 'Thanh toán qua SePay thành công'),

(99, 50, 1, '2025-05-12 10:00:00', 'Đơn hàng mới - chờ thanh toán'),
(100, 50, 2, '2025-05-12 10:25:00', 'Thanh toán qua SePay thành công'),

-- Order 51-60 (Tháng 5-6/2025)
(101, 51, 1, '2025-05-15 13:00:00', 'Đơn hàng mới - chờ thanh toán'),
(102, 51, 2, '2025-05-15 13:35:00', 'Thanh toán qua SePay thành công'),

(103, 52, 1, '2025-05-18 09:00:00', 'Đơn hàng mới - chờ thanh toán'),
(104, 52, 2, '2025-05-18 09:40:00', 'Thanh toán qua SePay thành công'),

(105, 53, 1, '2025-05-22 16:00:00', 'Đơn hàng mới - chờ thanh toán'),
(106, 53, 2, '2025-05-22 16:15:00', 'Thanh toán qua SePay thành công'),

(107, 54, 1, '2025-05-25 11:00:00', 'Đơn hàng mới - chờ thanh toán'),
(108, 54, 2, '2025-05-25 11:30:00', 'Thanh toán qua SePay thành công'),

(109, 55, 1, '2025-05-28 14:00:00', 'Đơn hàng mới - chờ thanh toán'),
(110, 55, 2, '2025-05-28 14:20:00', 'Thanh toán qua SePay thành công'),

(111, 56, 1, '2025-05-30 10:00:00', 'Đơn hàng mới - chờ thanh toán'),
(112, 56, 2, '2025-05-30 10:45:00', 'Thanh toán qua SePay thành công'),

(113, 57, 1, '2025-06-03 15:00:00', 'Đơn hàng mới - chờ thanh toán'),
(114, 57, 2, '2025-06-03 15:25:00', 'Thanh toán qua SePay thành công'),

(115, 58, 1, '2025-06-07 09:00:00', 'Đơn hàng mới - chờ thanh toán'),
(116, 58, 2, '2025-06-07 09:15:00', 'Thanh toán qua SePay thành công'),

(117, 59, 1, '2025-06-11 13:00:00', 'Đơn hàng mới - chờ thanh toán'),
(118, 59, 2, '2025-06-11 13:40:00', 'Thanh toán qua SePay thành công'),

(119, 60, 1, '2025-06-14 11:00:00', 'Đơn hàng mới - chờ thanh toán'),
(120, 60, 2, '2025-06-14 11:20:00', 'Thanh toán qua SePay thành công'),

-- Order 61-70 (Tháng 6-7/2025)
(121, 61, 1, '2025-06-18 16:00:00', 'Đơn hàng mới - chờ thanh toán'),
(122, 61, 2, '2025-06-18 16:30:00', 'Thanh toán qua SePay thành công'),

(123, 62, 1, '2025-06-22 10:00:00', 'Đơn hàng mới - chờ thanh toán'),
(124, 62, 2, '2025-06-22 10:35:00', 'Thanh toán qua SePay thành công'),

(125, 63, 1, '2025-06-25 14:00:00', 'Đơn hàng mới - chờ thanh toán'),
(126, 63, 2, '2025-06-25 14:50:00', 'Thanh toán qua SePay thành công'),

(127, 64, 1, '2025-06-28 09:00:00', 'Đơn hàng mới - chờ thanh toán'),
(128, 64, 2, '2025-06-28 09:15:00', 'Thanh toán qua SePay thành công'),

(129, 65, 1, '2025-07-02 11:00:00', 'Đơn hàng mới - chờ thanh toán'),
(130, 65, 2, '2025-07-02 11:30:00', 'Thanh toán qua SePay thành công'),

(131, 66, 1, '2025-07-06 15:00:00', 'Đơn hàng mới - chờ thanh toán'),
(132, 66, 2, '2025-07-06 15:20:00', 'Thanh toán qua SePay thành công'),

(133, 67, 1, '2025-07-10 10:00:00', 'Đơn hàng mới - chờ thanh toán'),
(134, 67, 2, '2025-07-10 10:40:00', 'Thanh toán qua SePay thành công'),

(135, 68, 1, '2025-07-14 13:00:00', 'Đơn hàng mới - chờ thanh toán'),
(136, 68, 2, '2025-07-14 13:15:00', 'Thanh toán qua SePay thành công'),

(137, 69, 1, '2025-07-18 16:00:00', 'Đơn hàng mới - chờ thanh toán'),
(138, 69, 2, '2025-07-18 16:35:00', 'Thanh toán qua SePay thành công'),

(139, 70, 1, '2025-07-22 09:00:00', 'Đơn hàng mới - chờ thanh toán'),
(140, 70, 2, '2025-07-22 09:25:00', 'Thanh toán qua SePay thành công'),

-- Order 71-80 (Tháng 7-8/2025)
(141, 71, 1, '2025-07-26 14:00:00', 'Đơn hàng mới - chờ thanh toán'),
(142, 71, 2, '2025-07-26 14:45:00', 'Thanh toán qua SePay thành công'),

(143, 72, 1, '2025-07-29 11:00:00', 'Đơn hàng mới - chờ thanh toán'),
(144, 72, 2, '2025-07-29 11:10:00', 'Thanh toán qua SePay thành công'),

(145, 73, 1, '2025-08-02 15:00:00', 'Đơn hàng mới - chờ thanh toán'),
(146, 73, 2, '2025-08-02 15:30:00', 'Thanh toán qua SePay thành công'),

(147, 74, 1, '2025-08-06 10:00:00', 'Đơn hàng mới - chờ thanh toán'),
(148, 74, 2, '2025-08-06 10:20:00', 'Thanh toán qua SePay thành công'),

(149, 75, 1, '2025-08-10 13:00:00', 'Đơn hàng mới - chờ thanh toán'),
(150, 75, 2, '2025-08-10 13:40:00', 'Thanh toán qua SePay thành công'),

(151, 76, 1, '2025-08-14 09:00:00', 'Đơn hàng mới - chờ thanh toán'),
(152, 76, 2, '2025-08-14 09:15:00', 'Thanh toán qua SePay thành công'),

(153, 77, 1, '2025-08-18 16:00:00', 'Đơn hàng mới - chờ thanh toán'),
(154, 77, 2, '2025-08-18 16:30:00', 'Thanh toán qua SePay thành công'),

(155, 78, 1, '2025-08-22 11:00:00', 'Đơn hàng mới - chờ thanh toán'),
(156, 78, 2, '2025-08-22 11:25:00', 'Thanh toán qua SePay thành công'),

(157, 79, 1, '2025-08-26 14:00:00', 'Đơn hàng mới - chờ thanh toán'),
(158, 79, 2, '2025-08-26 14:40:00', 'Thanh toán qua SePay thành công'),

(159, 80, 1, '2025-08-29 10:00:00', 'Đơn hàng mới - chờ thanh toán'),
(160, 80, 2, '2025-08-29 10:10:00', 'Thanh toán qua SePay thành công'),

-- Order 81-90 (Tháng 9-10/2025)
(161, 81, 1, '2025-09-02 15:00:00', 'Đơn hàng mới - chờ thanh toán'),
(162, 81, 2, '2025-09-02 15:30:00', 'Thanh toán qua SePay thành công'),

(163, 82, 1, '2025-09-06 09:00:00', 'Đơn hàng mới - chờ thanh toán'),
(164, 82, 2, '2025-09-06 09:20:00', 'Thanh toán qua SePay thành công'),

(165, 83, 1, '2025-09-10 13:00:00', 'Đơn hàng mới - chờ thanh toán'),
(166, 83, 2, '2025-09-10 13:45:00', 'Thanh toán qua SePay thành công'),

(167, 84, 1, '2025-09-14 11:00:00', 'Đơn hàng mới - chờ thanh toán'),
(168, 84, 2, '2025-09-14 11:15:00', 'Thanh toán qua SePay thành công'),

(169, 85, 1, '2025-09-18 16:00:00', 'Đơn hàng mới - chờ thanh toán'),
(170, 85, 2, '2025-09-18 16:35:00', 'Thanh toán qua SePay thành công'),

(171, 86, 1, '2025-09-22 10:00:00', 'Đơn hàng mới - chờ thanh toán'),
(172, 86, 2, '2025-09-22 10:25:00', 'Thanh toán qua SePay thành công'),

(173, 87, 1, '2025-09-26 14:00:00', 'Đơn hàng mới - chờ thanh toán'),
(174, 87, 2, '2025-09-26 14:50:00', 'Thanh toán qua SePay thành công'),

(175, 88, 1, '2025-09-29 09:00:00', 'Đơn hàng mới - chờ thanh toán'),
(176, 88, 2, '2025-09-29 09:10:00', 'Thanh toán qua SePay thành công'),

(177, 89, 1, '2025-10-03 15:00:00', 'Đơn hàng mới - chờ thanh toán'),
(178, 89, 2, '2025-10-03 15:30:00', 'Thanh toán qua SePay thành công'),

(179, 90, 1, '2025-10-07 11:00:00', 'Đơn hàng mới - chờ thanh toán'),
(180, 90, 2, '2025-10-07 11:20:00', 'Thanh toán qua SePay thành công'),

-- Order 91-100 (Tháng 10-12/2025)
(181, 91, 1, '2025-10-11 13:00:00', 'Đơn hàng mới - chờ thanh toán'),
(182, 91, 2, '2025-10-11 13:40:00', 'Thanh toán qua SePay thành công'),

(183, 92, 1, '2025-10-15 10:00:00', 'Đơn hàng mới - chờ thanh toán'),
(184, 92, 2, '2025-10-15 10:15:00', 'Thanh toán qua SePay thành công'),

(185, 93, 1, '2025-10-19 16:00:00', 'Đơn hàng mới - chờ thanh toán'),
(186, 93, 2, '2025-10-19 16:30:00', 'Thanh toán qua SePay thành công'),

(187, 94, 1, '2025-10-23 09:00:00', 'Đơn hàng mới - chờ thanh toán'),
(188, 94, 2, '2025-10-23 09:25:00', 'Thanh toán qua SePay thành công'),

(189, 95, 1, '2025-11-05 14:00:00', 'Đơn hàng mới - chờ thanh toán'),
(190, 95, 2, '2025-11-05 14:45:00', 'Thanh toán qua SePay thành công'),

(191, 96, 1, '2025-11-12 11:00:00', 'Đơn hàng mới - chờ thanh toán'),
(192, 96, 2, '2025-11-12 11:20:00', 'Thanh toán qua SePay thành công'),

(193, 97, 1, '2025-11-19 15:00:00', 'Đơn hàng mới - chờ thanh toán'),
(194, 97, 2, '2025-11-19 15:40:00', 'Thanh toán qua SePay thành công'),

(195, 98, 1, '2025-11-26 10:00:00', 'Đơn hàng mới - chờ thanh toán'),
(196, 98, 2, '2025-11-26 10:15:00', 'Thanh toán qua SePay thành công'),

(197, 99, 1, '2025-12-02 13:00:00', 'Đơn hàng mới - chờ thanh toán'),
(198, 99, 2, '2025-12-02 13:30:00', 'Thanh toán qua SePay thành công'),

(199, 100, 1, '2025-12-05 09:00:00', 'Đơn hàng mới - chờ thanh toán'),
(200, 100, 2, '2025-12-05 09:25:00', 'Thanh toán qua SePay thành công');

-- Cập nhật sequence
SELECT setval('order_payment_history_history_id_seq', 200, true);

-- =====================================================
-- FILE 3B: SHIPPING HISTORY - Lịch sử vận chuyển
-- Mỗi đơn hàng có nhiều status theo flow thực tế
-- Shipping Status IDs: 1=PROCESSING, 2=SHIPPED, 3=DELIVERED, 4=FAILED_DELIVERY, 5=RECEIVED, 6=RETURNED, 7=CANCELLED
-- Flow thành công: PROCESSING (1) → SHIPPED (2) → DELIVERED (3) → RECEIVED (5)
-- =====================================================

INSERT INTO order_shipping_history (history_id, order_id, status_id, created_at, note) VALUES
-- Order 1-10 (Tháng 12/2024): Đã hoàn thành - Flow đầy đủ
-- Order 1: PROCESSING → SHIPPED → DELIVERED → RECEIVED
(1, 1, 1, '2024-12-05 10:30:00', 'Đang xử lý đơn hàng'),
(2, 1, 2, '2024-12-06 08:00:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(3, 1, 3, '2024-12-08 14:30:00', 'Đã giao hàng thành công'),
(4, 1, 5, '2024-12-08 15:00:00', 'Khách hàng đã nhận hàng và xác nhận'),

-- Order 2
(5, 2, 1, '2024-12-08 14:30:00', 'Đang xử lý đơn hàng'),
(6, 2, 2, '2024-12-09 09:00:00', 'Đã giao cho đơn vị vận chuyển GHTK'),
(7, 2, 3, '2024-12-11 16:00:00', 'Đã giao hàng thành công'),
(8, 2, 5, '2024-12-11 16:30:00', 'Khách hàng đã nhận hàng'),

-- Order 3
(9, 3, 1, '2024-12-12 10:00:00', 'Đang xử lý đơn hàng'),
(10, 3, 2, '2024-12-13 08:30:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(11, 3, 3, '2024-12-15 11:00:00', 'Đã giao hàng thành công'),
(12, 3, 5, '2024-12-15 11:30:00', 'Khách hàng đã nhận hàng'),

-- Order 4
(13, 4, 1, '2024-12-15 11:30:00', 'Đang xử lý đơn hàng'),
(14, 4, 2, '2024-12-16 09:00:00', 'Đã giao cho đơn vị vận chuyển Viettel Post'),
(15, 4, 3, '2024-12-18 15:00:00', 'Đã giao hàng thành công'),
(16, 4, 5, '2024-12-18 15:30:00', 'Khách hàng đã nhận hàng'),

-- Order 5
(17, 5, 1, '2024-12-18 16:45:00', 'Đang xử lý đơn hàng'),
(18, 5, 2, '2024-12-19 08:00:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(19, 5, 3, '2024-12-21 13:00:00', 'Đã giao hàng thành công'),
(20, 5, 5, '2024-12-21 13:30:00', 'Khách hàng đã nhận hàng'),

-- Order 6
(21, 6, 1, '2024-12-20 10:30:00', 'Đang xử lý đơn hàng'),
(22, 6, 2, '2024-12-21 08:30:00', 'Đã giao cho đơn vị vận chuyển GHTK'),
(23, 6, 3, '2024-12-23 14:00:00', 'Đã giao hàng thành công'),
(24, 6, 5, '2024-12-23 14:30:00', 'Khách hàng đã nhận hàng'),

-- Order 7
(25, 7, 1, '2024-12-22 13:30:00', 'Đang xử lý đơn hàng'),
(26, 7, 2, '2024-12-23 09:00:00', 'Đã giao cho đơn vị vận chuyển J&T Express'),
(27, 7, 3, '2024-12-25 10:00:00', 'Đã giao hàng thành công'),
(28, 7, 5, '2024-12-25 10:30:00', 'Khách hàng đã nhận hàng'),

-- Order 8
(29, 8, 1, '2024-12-25 16:00:00', 'Đang xử lý đơn hàng'),
(30, 8, 2, '2024-12-26 08:00:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(31, 8, 3, '2024-12-28 11:30:00', 'Đã giao hàng thành công'),
(32, 8, 5, '2024-12-28 12:00:00', 'Khách hàng đã nhận hàng'),

-- Order 9
(33, 9, 1, '2024-12-28 12:00:00', 'Đang xử lý đơn hàng'),
(34, 9, 2, '2024-12-29 08:30:00', 'Đã giao cho đơn vị vận chuyển Ninja Van'),
(35, 9, 3, '2024-12-31 15:00:00', 'Đã giao hàng thành công'),
(36, 9, 5, '2024-12-31 15:30:00', 'Khách hàng đã nhận hàng'),

-- Order 10
(37, 10, 1, '2024-12-30 09:30:00', 'Đang xử lý đơn hàng'),
(38, 10, 2, '2024-12-31 08:00:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(39, 10, 3, '2025-01-02 14:00:00', 'Đã giao hàng thành công'),
(40, 10, 5, '2025-01-02 14:30:00', 'Khách hàng đã nhận hàng'),

-- Order 11-20 (Tháng 1/2025): Đã hoàn thành
(41, 11, 1, '2025-01-03 11:00:00', 'Đang xử lý đơn hàng'),
(42, 11, 2, '2025-01-04 08:00:00', 'Đã giao cho đơn vị vận chuyển GHTK'),
(43, 11, 3, '2025-01-06 15:00:00', 'Đã giao hàng thành công'),
(44, 11, 5, '2025-01-06 15:30:00', 'Khách hàng đã nhận hàng'),

(45, 12, 1, '2025-01-06 14:30:00', 'Đang xử lý đơn hàng'),
(46, 12, 2, '2025-01-07 09:00:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(47, 12, 3, '2025-01-09 11:00:00', 'Đã giao hàng thành công'),
(48, 12, 5, '2025-01-09 11:30:00', 'Khách hàng đã nhận hàng'),

(49, 13, 1, '2025-01-10 09:45:00', 'Đang xử lý đơn hàng'),
(50, 13, 2, '2025-01-11 08:30:00', 'Đã giao cho đơn vị vận chuyển Viettel Post'),
(51, 13, 3, '2025-01-13 14:30:00', 'Đã giao hàng thành công'),
(52, 13, 5, '2025-01-13 15:00:00', 'Khách hàng đã nhận hàng'),

(53, 14, 1, '2025-01-14 11:30:00', 'Đang xử lý đơn hàng'),
(54, 14, 2, '2025-01-15 08:00:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(55, 14, 3, '2025-01-17 13:00:00', 'Đã giao hàng thành công'),
(56, 14, 5, '2025-01-17 13:30:00', 'Khách hàng đã nhận hàng'),

(57, 15, 1, '2025-01-18 16:00:00', 'Đang xử lý đơn hàng'),
(58, 15, 2, '2025-01-19 09:00:00', 'Đã giao cho đơn vị vận chuyển J&T Express'),
(59, 15, 3, '2025-01-21 16:00:00', 'Đã giao hàng thành công'),
(60, 15, 5, '2025-01-21 16:30:00', 'Khách hàng đã nhận hàng'),

(61, 16, 1, '2025-01-21 10:20:00', 'Đang xử lý đơn hàng'),
(62, 16, 2, '2025-01-22 08:30:00', 'Đã giao cho đơn vị vận chuyển GHTK'),
(63, 16, 3, '2025-01-24 12:00:00', 'Đã giao hàng thành công'),
(64, 16, 5, '2025-01-24 12:30:00', 'Khách hàng đã nhận hàng'),

(65, 17, 1, '2025-01-25 14:00:00', 'Đang xử lý đơn hàng'),
(66, 17, 2, '2025-01-26 08:00:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(67, 17, 3, '2025-01-28 15:30:00', 'Đã giao hàng thành công'),
(68, 17, 5, '2025-01-28 16:00:00', 'Khách hàng đã nhận hàng'),

(69, 18, 1, '2025-01-28 10:00:00', 'Đang xử lý đơn hàng'),
(70, 18, 2, '2025-01-29 08:30:00', 'Đã giao cho đơn vị vận chuyển Ninja Van'),
(71, 18, 3, '2025-01-31 14:00:00', 'Đã giao hàng thành công'),
(72, 18, 5, '2025-01-31 14:30:00', 'Khách hàng đã nhận hàng'),

(73, 19, 1, '2025-01-30 16:30:00', 'Đang xử lý đơn hàng'),
(74, 19, 2, '2025-01-31 09:00:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(75, 19, 3, '2025-02-02 11:00:00', 'Đã giao hàng thành công'),
(76, 19, 5, '2025-02-02 11:30:00', 'Khách hàng đã nhận hàng'),

(77, 20, 1, '2025-01-31 14:45:00', 'Đang xử lý đơn hàng'),
(78, 20, 2, '2025-02-01 08:00:00', 'Đã giao cho đơn vị vận chuyển Viettel Post'),
(79, 20, 3, '2025-02-03 15:00:00', 'Đã giao hàng thành công'),
(80, 20, 5, '2025-02-03 15:30:00', 'Khách hàng đã nhận hàng'),

-- Order 21-40 (Tháng 2-4/2025): Đã hoàn thành
(81, 21, 1, '2025-02-05 10:30:00', 'Đang xử lý đơn hàng'),
(82, 21, 2, '2025-02-06 08:00:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(83, 21, 3, '2025-02-08 14:00:00', 'Đã giao hàng thành công'),
(84, 21, 5, '2025-02-08 14:30:00', 'Khách hàng đã nhận hàng'),

(85, 22, 1, '2025-02-08 12:00:00', 'Đang xử lý đơn hàng'),
(86, 22, 2, '2025-02-09 08:30:00', 'Đã giao cho đơn vị vận chuyển GHTK'),
(87, 22, 3, '2025-02-11 13:00:00', 'Đã giao hàng thành công'),
(88, 22, 5, '2025-02-11 13:30:00', 'Khách hàng đã nhận hàng'),

(89, 23, 1, '2025-02-12 14:30:00', 'Đang xử lý đơn hàng'),
(90, 23, 2, '2025-02-13 08:00:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(91, 23, 3, '2025-02-15 15:00:00', 'Đã giao hàng thành công'),
(92, 23, 5, '2025-02-15 15:30:00', 'Khách hàng đã nhận hàng'),

(93, 24, 1, '2025-02-15 10:00:00', 'Đang xử lý đơn hàng'),
(94, 24, 2, '2025-02-16 08:30:00', 'Đã giao cho đơn vị vận chuyển J&T Express'),
(95, 24, 3, '2025-02-18 14:30:00', 'Đã giao hàng thành công'),
(96, 24, 5, '2025-02-18 15:00:00', 'Khách hàng đã nhận hàng'),

(97, 25, 1, '2025-02-18 15:45:00', 'Đang xử lý đơn hàng'),
(98, 25, 2, '2025-02-19 09:00:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(99, 25, 3, '2025-02-21 11:30:00', 'Đã giao hàng thành công'),
(100, 25, 5, '2025-02-21 12:00:00', 'Khách hàng đã nhận hàng'),

(101, 26, 1, '2025-02-22 11:00:00', 'Đang xử lý đơn hàng'),
(102, 26, 2, '2025-02-23 08:00:00', 'Đã giao cho đơn vị vận chuyển Viettel Post'),
(103, 26, 3, '2025-02-25 13:00:00', 'Đã giao hàng thành công'),
(104, 26, 5, '2025-02-25 13:30:00', 'Khách hàng đã nhận hàng'),

(105, 27, 1, '2025-02-25 13:30:00', 'Đang xử lý đơn hàng'),
(106, 27, 2, '2025-02-26 08:30:00', 'Đã giao cho đơn vị vận chuyển GHTK'),
(107, 27, 3, '2025-02-28 14:30:00', 'Đã giao hàng thành công'),
(108, 27, 5, '2025-02-28 15:00:00', 'Khách hàng đã nhận hàng'),

(109, 28, 1, '2025-02-28 17:00:00', 'Đang xử lý đơn hàng'),
(110, 28, 2, '2025-03-01 08:00:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(111, 28, 3, '2025-03-03 16:00:00', 'Đã giao hàng thành công'),
(112, 28, 5, '2025-03-03 16:30:00', 'Khách hàng đã nhận hàng'),

(113, 29, 1, '2025-03-02 09:45:00', 'Đang xử lý đơn hàng'),
(114, 29, 2, '2025-03-03 08:30:00', 'Đã giao cho đơn vị vận chuyển Ninja Van'),
(115, 29, 3, '2025-03-05 12:00:00', 'Đã giao hàng thành công'),
(116, 29, 5, '2025-03-05 12:30:00', 'Khách hàng đã nhận hàng'),

(117, 30, 1, '2025-03-05 11:30:00', 'Đang xử lý đơn hàng'),
(118, 30, 2, '2025-03-06 08:00:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(119, 30, 3, '2025-03-08 15:00:00', 'Đã giao hàng thành công'),
(120, 30, 5, '2025-03-08 15:30:00', 'Khách hàng đã nhận hàng'),

(121, 31, 1, '2025-03-08 15:00:00', 'Đang xử lý đơn hàng'),
(122, 31, 2, '2025-03-09 09:00:00', 'Đã giao cho đơn vị vận chuyển GHTK'),
(123, 31, 3, '2025-03-11 14:00:00', 'Đã giao hàng thành công'),
(124, 31, 5, '2025-03-11 14:30:00', 'Khách hàng đã nhận hàng'),

(125, 32, 1, '2025-03-12 10:30:00', 'Đang xử lý đơn hàng'),
(126, 32, 2, '2025-03-13 08:30:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(127, 32, 3, '2025-03-15 13:30:00', 'Đã giao hàng thành công'),
(128, 32, 5, '2025-03-15 14:00:00', 'Khách hàng đã nhận hàng'),

(129, 33, 1, '2025-03-15 16:00:00', 'Đang xử lý đơn hàng'),
(130, 33, 2, '2025-03-16 08:00:00', 'Đã giao cho đơn vị vận chuyển Viettel Post'),
(131, 33, 3, '2025-03-18 15:00:00', 'Đã giao hàng thành công'),
(132, 33, 5, '2025-03-18 15:30:00', 'Khách hàng đã nhận hàng'),

(133, 34, 1, '2025-03-18 09:30:00', 'Đang xử lý đơn hàng'),
(134, 34, 2, '2025-03-19 08:30:00', 'Đã giao cho đơn vị vận chuyển J&T Express'),
(135, 34, 3, '2025-03-21 11:00:00', 'Đã giao hàng thành công'),
(136, 34, 5, '2025-03-21 11:30:00', 'Khách hàng đã nhận hàng'),

(137, 35, 1, '2025-03-22 14:00:00', 'Đang xử lý đơn hàng'),
(138, 35, 2, '2025-03-23 08:00:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(139, 35, 3, '2025-03-25 14:30:00', 'Đã giao hàng thành công'),
(140, 35, 5, '2025-03-25 15:00:00', 'Khách hàng đã nhận hàng'),

(141, 36, 1, '2025-03-25 11:30:00', 'Đang xử lý đơn hàng'),
(142, 36, 2, '2025-03-26 08:30:00', 'Đã giao cho đơn vị vận chuyển GHTK'),
(143, 36, 3, '2025-03-28 12:00:00', 'Đã giao hàng thành công'),
(144, 36, 5, '2025-03-28 12:30:00', 'Khách hàng đã nhận hàng'),

(145, 37, 1, '2025-03-28 17:00:00', 'Đang xử lý đơn hàng'),
(146, 37, 2, '2025-03-29 09:00:00', 'Đã giao cho đơn vị vận chuyển Ninja Van'),
(147, 37, 3, '2025-03-31 15:30:00', 'Đã giao hàng thành công'),
(148, 37, 5, '2025-03-31 16:00:00', 'Khách hàng đã nhận hàng'),

(149, 38, 1, '2025-03-30 10:45:00', 'Đang xử lý đơn hàng'),
(150, 38, 2, '2025-03-31 08:00:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(151, 38, 3, '2025-04-02 14:00:00', 'Đã giao hàng thành công'),
(152, 38, 5, '2025-04-02 14:30:00', 'Khách hàng đã nhận hàng'),

(153, 39, 1, '2025-04-03 15:00:00', 'Đang xử lý đơn hàng'),
(154, 39, 2, '2025-04-04 08:30:00', 'Đã giao cho đơn vị vận chuyển Viettel Post'),
(155, 39, 3, '2025-04-06 13:00:00', 'Đã giao hàng thành công'),
(156, 39, 5, '2025-04-06 13:30:00', 'Khách hàng đã nhận hàng'),

(157, 40, 1, '2025-04-07 09:30:00', 'Đang xử lý đơn hàng'),
(158, 40, 2, '2025-04-08 08:00:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(159, 40, 3, '2025-04-10 15:30:00', 'Đã giao hàng thành công'),
(160, 40, 5, '2025-04-10 16:00:00', 'Khách hàng đã nhận hàng');

-- Cập nhật sequence tạm (sẽ cập nhật tiếp trong file 03c)

-- =====================================================
-- FILE 3C: SHIPPING HISTORY (tiếp) - Order 41-100
-- Shipping Status IDs: 1=PROCESSING, 2=SHIPPED, 3=DELIVERED, 4=FAILED_DELIVERY, 5=RECEIVED, 6=RETURNED, 7=CANCELLED
-- =====================================================

INSERT INTO order_shipping_history (history_id, order_id, status_id, created_at, note) VALUES
-- Order 41-60 (Tháng 4-6/2025): Đã hoàn thành
(161, 41, 1, '2025-04-11 12:00:00', 'Đang xử lý đơn hàng'),
(162, 41, 2, '2025-04-12 08:00:00', 'Đã giao cho đơn vị vận chuyển GHTK'),
(163, 41, 3, '2025-04-14 14:00:00', 'Đã giao hàng thành công'),
(164, 41, 5, '2025-04-14 14:30:00', 'Khách hàng đã nhận hàng'),

(165, 42, 1, '2025-04-15 15:30:00', 'Đang xử lý đơn hàng'),
(166, 42, 2, '2025-04-16 08:30:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(167, 42, 3, '2025-04-18 11:00:00', 'Đã giao hàng thành công'),
(168, 42, 5, '2025-04-18 11:30:00', 'Khách hàng đã nhận hàng'),

(169, 43, 1, '2025-04-18 11:00:00', 'Đang xử lý đơn hàng'),
(170, 43, 2, '2025-04-19 08:00:00', 'Đã giao cho đơn vị vận chuyển J&T Express'),
(171, 43, 3, '2025-04-21 15:30:00', 'Đã giao hàng thành công'),
(172, 43, 5, '2025-04-21 16:00:00', 'Khách hàng đã nhận hàng'),

(173, 44, 1, '2025-04-22 13:45:00', 'Đang xử lý đơn hàng'),
(174, 44, 2, '2025-04-23 08:30:00', 'Đã giao cho đơn vị vận chuyển Ninja Van'),
(175, 44, 3, '2025-04-25 14:00:00', 'Đã giao hàng thành công'),
(176, 44, 5, '2025-04-25 14:30:00', 'Khách hàng đã nhận hàng'),

(177, 45, 1, '2025-04-26 17:00:00', 'Đang xử lý đơn hàng'),
(178, 45, 2, '2025-04-27 08:00:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(179, 45, 3, '2025-04-29 13:00:00', 'Đã giao hàng thành công'),
(180, 45, 5, '2025-04-29 13:30:00', 'Khách hàng đã nhận hàng'),

(181, 46, 1, '2025-04-29 09:20:00', 'Đang xử lý đơn hàng'),
(182, 46, 2, '2025-04-30 08:30:00', 'Đã giao cho đơn vị vận chuyển GHTK'),
(183, 46, 3, '2025-05-02 12:00:00', 'Đã giao hàng thành công'),
(184, 46, 5, '2025-05-02 12:30:00', 'Khách hàng đã nhận hàng'),

(185, 47, 1, '2025-05-02 15:00:00', 'Đang xử lý đơn hàng'),
(186, 47, 2, '2025-05-03 08:00:00', 'Đã giao cho đơn vị vận chuyển Viettel Post'),
(187, 47, 3, '2025-05-05 15:00:00', 'Đã giao hàng thành công'),
(188, 47, 5, '2025-05-05 15:30:00', 'Khách hàng đã nhận hàng'),

(189, 48, 1, '2025-05-05 11:40:00', 'Đang xử lý đơn hàng'),
(190, 48, 2, '2025-05-06 08:30:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(191, 48, 3, '2025-05-08 14:30:00', 'Đã giao hàng thành công'),
(192, 48, 5, '2025-05-08 15:00:00', 'Khách hàng đã nhận hàng'),

(193, 49, 1, '2025-05-09 16:00:00', 'Đang xử lý đơn hàng'),
(194, 49, 2, '2025-05-10 08:00:00', 'Đã giao cho đơn vị vận chuyển J&T Express'),
(195, 49, 3, '2025-05-12 11:00:00', 'Đã giao hàng thành công'),
(196, 49, 5, '2025-05-12 11:30:00', 'Khách hàng đã nhận hàng'),

(197, 50, 1, '2025-05-12 10:45:00', 'Đang xử lý đơn hàng'),
(198, 50, 2, '2025-05-13 08:30:00', 'Đã giao cho đơn vị vận chuyển GHTK'),
(199, 50, 3, '2025-05-15 15:00:00', 'Đã giao hàng thành công'),
(200, 50, 5, '2025-05-15 15:30:00', 'Khách hàng đã nhận hàng'),

(201, 51, 1, '2025-05-15 14:00:00', 'Đang xử lý đơn hàng'),
(202, 51, 2, '2025-05-16 08:00:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(203, 51, 3, '2025-05-18 14:30:00', 'Đã giao hàng thành công'),
(204, 51, 5, '2025-05-18 15:00:00', 'Khách hàng đã nhận hàng'),

(205, 52, 1, '2025-05-18 10:00:00', 'Đang xử lý đơn hàng'),
(206, 52, 2, '2025-05-19 08:30:00', 'Đã giao cho đơn vị vận chuyển Ninja Van'),
(207, 52, 3, '2025-05-21 13:00:00', 'Đã giao hàng thành công'),
(208, 52, 5, '2025-05-21 13:30:00', 'Khách hàng đã nhận hàng'),

(209, 53, 1, '2025-05-22 16:30:00', 'Đang xử lý đơn hàng'),
(210, 53, 2, '2025-05-23 08:00:00', 'Đã giao cho đơn vị vận chuyển Viettel Post'),
(211, 53, 3, '2025-05-25 12:00:00', 'Đã giao hàng thành công'),
(212, 53, 5, '2025-05-25 12:30:00', 'Khách hàng đã nhận hàng'),

(213, 54, 1, '2025-05-25 12:00:00', 'Đang xử lý đơn hàng'),
(214, 54, 2, '2025-05-26 08:30:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(215, 54, 3, '2025-05-28 15:30:00', 'Đã giao hàng thành công'),
(216, 54, 5, '2025-05-28 16:00:00', 'Khách hàng đã nhận hàng'),

(217, 55, 1, '2025-05-28 14:30:00', 'Đang xử lý đơn hàng'),
(218, 55, 2, '2025-05-29 08:00:00', 'Đã giao cho đơn vị vận chuyển GHTK'),
(219, 55, 3, '2025-05-31 14:00:00', 'Đã giao hàng thành công'),
(220, 55, 5, '2025-05-31 14:30:00', 'Khách hàng đã nhận hàng'),

(221, 56, 1, '2025-05-30 11:00:00', 'Đang xử lý đơn hàng'),
(222, 56, 2, '2025-05-31 08:30:00', 'Đã giao cho đơn vị vận chuyển J&T Express'),
(223, 56, 3, '2025-06-02 13:00:00', 'Đã giao hàng thành công'),
(224, 56, 5, '2025-06-02 13:30:00', 'Khách hàng đã nhận hàng'),

(225, 57, 1, '2025-06-03 15:45:00', 'Đang xử lý đơn hàng'),
(226, 57, 2, '2025-06-04 08:00:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(227, 57, 3, '2025-06-06 15:00:00', 'Đã giao hàng thành công'),
(228, 57, 5, '2025-06-06 15:30:00', 'Khách hàng đã nhận hàng'),

(229, 58, 1, '2025-06-07 09:30:00', 'Đang xử lý đơn hàng'),
(230, 58, 2, '2025-06-08 08:30:00', 'Đã giao cho đơn vị vận chuyển Ninja Van'),
(231, 58, 3, '2025-06-10 12:30:00', 'Đã giao hàng thành công'),
(232, 58, 5, '2025-06-10 13:00:00', 'Khách hàng đã nhận hàng'),

(233, 59, 1, '2025-06-11 14:00:00', 'Đang xử lý đơn hàng'),
(234, 59, 2, '2025-06-12 08:00:00', 'Đã giao cho đơn vị vận chuyển Viettel Post'),
(235, 59, 3, '2025-06-14 14:30:00', 'Đã giao hàng thành công'),
(236, 59, 5, '2025-06-14 15:00:00', 'Khách hàng đã nhận hàng'),

(237, 60, 1, '2025-06-14 11:40:00', 'Đang xử lý đơn hàng'),
(238, 60, 2, '2025-06-15 08:30:00', 'Đã giao cho đơn vị vận chuyển GHTK'),
(239, 60, 3, '2025-06-17 13:00:00', 'Đã giao hàng thành công'),
(240, 60, 5, '2025-06-17 13:30:00', 'Khách hàng đã nhận hàng'),

-- Order 61-80 (Tháng 6-8/2025): Đã hoàn thành
(241, 61, 1, '2025-06-18 17:00:00', 'Đang xử lý đơn hàng'),
(242, 61, 2, '2025-06-19 08:00:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(243, 61, 3, '2025-06-21 15:00:00', 'Đã giao hàng thành công'),
(244, 61, 5, '2025-06-21 15:30:00', 'Khách hàng đã nhận hàng'),

(245, 62, 1, '2025-06-22 11:00:00', 'Đang xử lý đơn hàng'),
(246, 62, 2, '2025-06-23 08:30:00', 'Đã giao cho đơn vị vận chuyển J&T Express'),
(247, 62, 3, '2025-06-25 14:00:00', 'Đã giao hàng thành công'),
(248, 62, 5, '2025-06-25 14:30:00', 'Khách hàng đã nhận hàng'),

(249, 63, 1, '2025-06-25 15:00:00', 'Đang xử lý đơn hàng'),
(250, 63, 2, '2025-06-26 08:00:00', 'Đã giao cho đơn vị vận chuyển Ninja Van'),
(251, 63, 3, '2025-06-28 12:00:00', 'Đã giao hàng thành công'),
(252, 63, 5, '2025-06-28 12:30:00', 'Khách hàng đã nhận hàng'),

(253, 64, 1, '2025-06-28 09:30:00', 'Đang xử lý đơn hàng'),
(254, 64, 2, '2025-06-29 08:30:00', 'Đã giao cho đơn vị vận chuyển GHTK'),
(255, 64, 3, '2025-07-01 15:30:00', 'Đã giao hàng thành công'),
(256, 64, 5, '2025-07-01 16:00:00', 'Khách hàng đã nhận hàng'),

(257, 65, 1, '2025-07-02 12:00:00', 'Đang xử lý đơn hàng'),
(258, 65, 2, '2025-07-03 08:00:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(259, 65, 3, '2025-07-05 14:00:00', 'Đã giao hàng thành công'),
(260, 65, 5, '2025-07-05 14:30:00', 'Khách hàng đã nhận hàng'),

(261, 66, 1, '2025-07-06 15:40:00', 'Đang xử lý đơn hàng'),
(262, 66, 2, '2025-07-07 08:30:00', 'Đã giao cho đơn vị vận chuyển Viettel Post'),
(263, 66, 3, '2025-07-09 13:00:00', 'Đã giao hàng thành công'),
(264, 66, 5, '2025-07-09 13:30:00', 'Khách hàng đã nhận hàng'),

(265, 67, 1, '2025-07-10 11:00:00', 'Đang xử lý đơn hàng'),
(266, 67, 2, '2025-07-11 08:00:00', 'Đã giao cho đơn vị vận chuyển J&T Express'),
(267, 67, 3, '2025-07-13 15:00:00', 'Đã giao hàng thành công'),
(268, 67, 5, '2025-07-13 15:30:00', 'Khách hàng đã nhận hàng'),

(269, 68, 1, '2025-07-14 13:30:00', 'Đang xử lý đơn hàng'),
(270, 68, 2, '2025-07-15 08:30:00', 'Đã giao cho đơn vị vận chuyển GHTK'),
(271, 68, 3, '2025-07-17 12:00:00', 'Đã giao hàng thành công'),
(272, 68, 5, '2025-07-17 12:30:00', 'Khách hàng đã nhận hàng'),

(273, 69, 1, '2025-07-18 17:00:00', 'Đang xử lý đơn hàng'),
(274, 69, 2, '2025-07-19 08:00:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(275, 69, 3, '2025-07-21 14:30:00', 'Đã giao hàng thành công'),
(276, 69, 5, '2025-07-21 15:00:00', 'Khách hàng đã nhận hàng'),

(277, 70, 1, '2025-07-22 09:45:00', 'Đang xử lý đơn hàng'),
(278, 70, 2, '2025-07-23 08:30:00', 'Đã giao cho đơn vị vận chuyển Ninja Van'),
(279, 70, 3, '2025-07-25 13:30:00', 'Đã giao hàng thành công'),
(280, 70, 5, '2025-07-25 14:00:00', 'Khách hàng đã nhận hàng'),

(281, 71, 1, '2025-07-26 15:00:00', 'Đang xử lý đơn hàng'),
(282, 71, 2, '2025-07-27 08:00:00', 'Đã giao cho đơn vị vận chuyển Viettel Post'),
(283, 71, 3, '2025-07-29 15:00:00', 'Đã giao hàng thành công'),
(284, 71, 5, '2025-07-29 15:30:00', 'Khách hàng đã nhận hàng'),

(285, 72, 1, '2025-07-29 11:20:00', 'Đang xử lý đơn hàng'),
(286, 72, 2, '2025-07-30 08:30:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(287, 72, 3, '2025-08-01 14:00:00', 'Đã giao hàng thành công'),
(288, 72, 5, '2025-08-01 14:30:00', 'Khách hàng đã nhận hàng'),

(289, 73, 1, '2025-08-02 16:00:00', 'Đang xử lý đơn hàng'),
(290, 73, 2, '2025-08-03 08:00:00', 'Đã giao cho đơn vị vận chuyển GHTK'),
(291, 73, 3, '2025-08-05 13:00:00', 'Đã giao hàng thành công'),
(292, 73, 5, '2025-08-05 13:30:00', 'Khách hàng đã nhận hàng'),

(293, 74, 1, '2025-08-06 10:40:00', 'Đang xử lý đơn hàng'),
(294, 74, 2, '2025-08-07 08:30:00', 'Đã giao cho đơn vị vận chuyển J&T Express'),
(295, 74, 3, '2025-08-09 15:00:00', 'Đã giao hàng thành công'),
(296, 74, 5, '2025-08-09 15:30:00', 'Khách hàng đã nhận hàng'),

(297, 75, 1, '2025-08-10 14:00:00', 'Đang xử lý đơn hàng'),
(298, 75, 2, '2025-08-11 08:00:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(299, 75, 3, '2025-08-13 12:30:00', 'Đã giao hàng thành công'),
(300, 75, 5, '2025-08-13 13:00:00', 'Khách hàng đã nhận hàng'),

(301, 76, 1, '2025-08-14 09:30:00', 'Đang xử lý đơn hàng'),
(302, 76, 2, '2025-08-15 08:30:00', 'Đã giao cho đơn vị vận chuyển Ninja Van'),
(303, 76, 3, '2025-08-17 14:30:00', 'Đã giao hàng thành công'),
(304, 76, 5, '2025-08-17 15:00:00', 'Khách hàng đã nhận hàng'),

(305, 77, 1, '2025-08-18 17:00:00', 'Đang xử lý đơn hàng'),
(306, 77, 2, '2025-08-19 08:00:00', 'Đã giao cho đơn vị vận chuyển Viettel Post'),
(307, 77, 3, '2025-08-21 15:00:00', 'Đã giao hàng thành công'),
(308, 77, 5, '2025-08-21 15:30:00', 'Khách hàng đã nhận hàng'),

(309, 78, 1, '2025-08-22 11:45:00', 'Đang xử lý đơn hàng'),
(310, 78, 2, '2025-08-23 08:30:00', 'Đã giao cho đơn vị vận chuyển GHTK'),
(311, 78, 3, '2025-08-25 13:00:00', 'Đã giao hàng thành công'),
(312, 78, 5, '2025-08-25 13:30:00', 'Khách hàng đã nhận hàng'),

(313, 79, 1, '2025-08-26 15:00:00', 'Đang xử lý đơn hàng'),
(314, 79, 2, '2025-08-27 08:00:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(315, 79, 3, '2025-08-29 14:00:00', 'Đã giao hàng thành công'),
(316, 79, 5, '2025-08-29 14:30:00', 'Khách hàng đã nhận hàng'),

(317, 80, 1, '2025-08-29 10:20:00', 'Đang xử lý đơn hàng'),
(318, 80, 2, '2025-08-30 08:30:00', 'Đã giao cho đơn vị vận chuyển J&T Express'),
(319, 80, 3, '2025-09-01 12:00:00', 'Đã giao hàng thành công'),
(320, 80, 5, '2025-09-01 12:30:00', 'Khách hàng đã nhận hàng');


-- =====================================================
-- FILE 3D: SHIPPING HISTORY (tiếp) - Order 81-100
-- Bao gồm các trạng thái đa dạng hơn (đang xử lý, đang ship, etc.)
-- =====================================================

INSERT INTO order_shipping_history (history_id, order_id, status_id, created_at, note) VALUES
-- Order 81-90 (Tháng 9-10/2025): Đa dạng trạng thái

-- Order 81: Đã hoàn thành
(321, 81, 1, '2025-09-02 16:00:00', 'Đang xử lý đơn hàng'),
(322, 81, 2, '2025-09-03 08:00:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(323, 81, 3, '2025-09-05 14:30:00', 'Đã giao hàng thành công'),
(324, 81, 5, '2025-09-05 15:00:00', 'Khách hàng đã nhận hàng'),

-- Order 82: Đã hoàn thành
(325, 82, 1, '2025-09-06 09:40:00', 'Đang xử lý đơn hàng'),
(326, 82, 2, '2025-09-07 08:30:00', 'Đã giao cho đơn vị vận chuyển GHTK'),
(327, 82, 3, '2025-09-09 13:00:00', 'Đã giao hàng thành công'),
(328, 82, 5, '2025-09-09 13:30:00', 'Khách hàng đã nhận hàng'),

-- Order 83: Đã hoàn thành
(329, 83, 1, '2025-09-10 14:00:00', 'Đang xử lý đơn hàng'),
(330, 83, 2, '2025-09-11 08:00:00', 'Đã giao cho đơn vị vận chuyển Ninja Van'),
(331, 83, 3, '2025-09-13 15:00:00', 'Đã giao hàng thành công'),
(332, 83, 5, '2025-09-13 15:30:00', 'Khách hàng đã nhận hàng'),

-- Order 84: Đã hoàn thành
(333, 84, 1, '2025-09-14 11:30:00', 'Đang xử lý đơn hàng'),
(334, 84, 2, '2025-09-15 08:30:00', 'Đã giao cho đơn vị vận chuyển Viettel Post'),
(335, 84, 3, '2025-09-17 12:00:00', 'Đã giao hàng thành công'),
(336, 84, 5, '2025-09-17 12:30:00', 'Khách hàng đã nhận hàng'),

-- Order 85: Đã hoàn thành
(337, 85, 1, '2025-09-18 17:00:00', 'Đang xử lý đơn hàng'),
(338, 85, 2, '2025-09-19 08:00:00', 'Đã giao cho đơn vị vận chuyển J&T Express'),
(339, 85, 3, '2025-09-21 14:30:00', 'Đã giao hàng thành công'),
(340, 85, 5, '2025-09-21 15:00:00', 'Khách hàng đã nhận hàng'),

-- Order 86: Đã hoàn thành
(341, 86, 1, '2025-09-22 10:45:00', 'Đang xử lý đơn hàng'),
(342, 86, 2, '2025-09-23 08:30:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(343, 86, 3, '2025-09-25 13:00:00', 'Đã giao hàng thành công'),
(344, 86, 5, '2025-09-25 13:30:00', 'Khách hàng đã nhận hàng'),

-- Order 87: Đã hoàn thành
(345, 87, 1, '2025-09-26 15:00:00', 'Đang xử lý đơn hàng'),
(346, 87, 2, '2025-09-27 08:00:00', 'Đã giao cho đơn vị vận chuyển GHTK'),
(347, 87, 3, '2025-09-29 15:30:00', 'Đã giao hàng thành công'),
(348, 87, 5, '2025-09-29 16:00:00', 'Khách hàng đã nhận hàng'),

-- Order 88: Đã hoàn thành
(349, 88, 1, '2025-09-29 09:20:00', 'Đang xử lý đơn hàng'),
(350, 88, 2, '2025-09-30 08:30:00', 'Đã giao cho đơn vị vận chuyển Ninja Van'),
(351, 88, 3, '2025-10-02 12:00:00', 'Đã giao hàng thành công'),
(352, 88, 5, '2025-10-02 12:30:00', 'Khách hàng đã nhận hàng'),

-- Order 89: Đã hoàn thành
(353, 89, 1, '2025-10-03 16:00:00', 'Đang xử lý đơn hàng'),
(354, 89, 2, '2025-10-04 08:00:00', 'Đã giao cho đơn vị vận chuyển Viettel Post'),
(355, 89, 3, '2025-10-06 14:00:00', 'Đã giao hàng thành công'),
(356, 89, 5, '2025-10-06 14:30:00', 'Khách hàng đã nhận hàng'),

-- Order 90: Đã hoàn thành
(357, 90, 1, '2025-10-07 11:40:00', 'Đang xử lý đơn hàng'),
(358, 90, 2, '2025-10-08 08:30:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(359, 90, 3, '2025-10-10 13:30:00', 'Đã giao hàng thành công'),
(360, 90, 5, '2025-10-10 14:00:00', 'Khách hàng đã nhận hàng'),

-- Order 91-95: Đã hoàn thành
(361, 91, 1, '2025-10-11 14:00:00', 'Đang xử lý đơn hàng'),
(362, 91, 2, '2025-10-12 08:00:00', 'Đã giao cho đơn vị vận chuyển J&T Express'),
(363, 91, 3, '2025-10-14 15:00:00', 'Đã giao hàng thành công'),
(364, 91, 5, '2025-10-14 15:30:00', 'Khách hàng đã nhận hàng'),

(365, 92, 1, '2025-10-15 10:30:00', 'Đang xử lý đơn hàng'),
(366, 92, 2, '2025-10-16 08:30:00', 'Đã giao cho đơn vị vận chuyển GHTK'),
(367, 92, 3, '2025-10-18 12:00:00', 'Đã giao hàng thành công'),
(368, 92, 5, '2025-10-18 12:30:00', 'Khách hàng đã nhận hàng'),

(369, 93, 1, '2025-10-19 17:00:00', 'Đang xử lý đơn hàng'),
(370, 93, 2, '2025-10-20 08:00:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(371, 93, 3, '2025-10-22 14:30:00', 'Đã giao hàng thành công'),
(372, 93, 5, '2025-10-22 15:00:00', 'Khách hàng đã nhận hàng'),

(373, 94, 1, '2025-10-23 09:45:00', 'Đang xử lý đơn hàng'),
(374, 94, 2, '2025-10-24 08:30:00', 'Đã giao cho đơn vị vận chuyển Ninja Van'),
(375, 94, 3, '2025-10-26 13:00:00', 'Đã giao hàng thành công'),
(376, 94, 5, '2025-10-26 13:30:00', 'Khách hàng đã nhận hàng'),

(377, 95, 1, '2025-11-05 15:00:00', 'Đang xử lý đơn hàng'),
(378, 95, 2, '2025-11-06 08:00:00', 'Đã giao cho đơn vị vận chuyển Viettel Post'),
(379, 95, 3, '2025-11-08 15:30:00', 'Đã giao hàng thành công'),
(380, 95, 5, '2025-11-08 16:00:00', 'Khách hàng đã nhận hàng'),

-- Order 96-97: Đã giao hàng, chờ xác nhận
(381, 96, 1, '2025-11-12 11:40:00', 'Đang xử lý đơn hàng'),
(382, 96, 2, '2025-11-13 08:30:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(383, 96, 3, '2025-11-15 14:00:00', 'Đã giao hàng thành công'),
(384, 96, 5, '2025-11-15 14:30:00', 'Khách hàng đã nhận hàng'),

(385, 97, 1, '2025-11-19 16:00:00', 'Đang xử lý đơn hàng'),
(386, 97, 2, '2025-11-20 08:00:00', 'Đã giao cho đơn vị vận chuyển GHTK'),
(387, 97, 3, '2025-11-22 13:00:00', 'Đã giao hàng thành công'),
(388, 97, 5, '2025-11-22 13:30:00', 'Khách hàng đã nhận hàng'),

-- Order 98: Đang vận chuyển
(389, 98, 1, '2025-11-26 10:30:00', 'Đang xử lý đơn hàng'),
(390, 98, 2, '2025-11-27 08:30:00', 'Đã giao cho đơn vị vận chuyển J&T Express'),
(391, 98, 3, '2025-11-29 15:00:00', 'Đã giao hàng thành công'),
(392, 98, 5, '2025-11-29 15:30:00', 'Khách hàng đã nhận hàng'),

-- Order 99: Đang xử lý (mới đặt)
(393, 99, 1, '2025-12-02 13:45:00', 'Đang xử lý đơn hàng'),
(394, 99, 2, '2025-12-03 08:00:00', 'Đã giao cho đơn vị vận chuyển GHN'),
(395, 99, 3, '2025-12-05 14:00:00', 'Đã giao hàng thành công'),

-- Order 100: Đang xử lý (mới nhất)
(396, 100, 1, '2025-12-05 09:30:00', 'Đang xử lý đơn hàng'),
(397, 100, 2, '2025-12-06 08:30:00', 'Đã giao cho đơn vị vận chuyển GHTK');

-- Cập nhật sequence
SELECT setval('order_shipping_history_history_id_seq', 397, true);
