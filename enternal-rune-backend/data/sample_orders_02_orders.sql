-- =====================================================
-- FILE 2: ORDERS DATA - 100 hóa đơn mua hàng
-- Thời gian: 1 năm trở lại đây (12/2024 - 12/2025)
-- =====================================================

-- 100 đơn hàng từ 50 khách hàng
INSERT INTO orders (order_id, order_date, order_total_amount, address_id, user_id, discount_id) VALUES
-- Tháng 12/2024 (10 đơn)
(1, '2024-12-05', 22990000, 21, 2, NULL),
(2, '2024-12-08', 12090000, 22, 3, NULL),
(3, '2024-12-12', 7090000, 23, 4, NULL),
(4, '2024-12-15', 29990000, 24, 5, NULL),
(5, '2024-12-18', 4290000, 25, 6, NULL),
(6, '2024-12-20', 16690000, 26, 7, NULL),
(7, '2024-12-22', 27990000, 27, 8, NULL),
(8, '2024-12-25', 3090000, 28, 9, NULL),
(9, '2024-12-28', 45490000, 29, 10, NULL),
(10, '2024-12-30', 14990000, 30, 11, NULL),

-- Tháng 1/2025 (10 đơn)
(11, '2025-01-03', 20690000, 31, 12, 4),
(12, '2025-01-06', 9990000, 32, 13, NULL),
(13, '2025-01-10', 31790000, 33, 14, NULL),
(14, '2025-01-14', 6190000, 34, 15, NULL),
(15, '2025-01-18', 25490000, 35, 16, NULL),
(16, '2025-01-21', 2790000, 36, 17, NULL),
(17, '2025-01-25', 19990000, 37, 18, NULL),
(18, '2025-01-28', 42990000, 38, 19, NULL),
(19, '2025-01-30', 7590000, 39, 20, NULL),
(20, '2025-01-31', 34900000, 40, 21, NULL),

-- Tháng 2/2025 (8 đơn)
(21, '2025-02-05', 11990000, 41, 22, NULL),
(22, '2025-02-08', 22700000, 42, 23, NULL),
(23, '2025-02-12', 3600000, 43, 24, NULL),
(24, '2025-02-15', 27480000, 44, 25, NULL),
(25, '2025-02-18', 4690000, 45, 26, NULL),
(26, '2025-02-22', 19490000, 46, 27, NULL),
(27, '2025-02-25', 8890000, 47, 28, NULL),
(28, '2025-02-28', 33990000, 48, 29, NULL),

-- Tháng 3/2025 (10 đơn)
(29, '2025-03-02', 24290000, 49, 30, NULL),
(30, '2025-03-05', 5890000, 50, 31, NULL),
(31, '2025-03-08', 29980000, 51, 32, NULL),
(32, '2025-03-12', 14390000, 52, 33, NULL),
(33, '2025-03-15', 38990000, 53, 34, NULL),
(34, '2025-03-18', 3350000, 54, 35, NULL),
(35, '2025-03-22', 21590000, 55, 36, 1),
(36, '2025-03-25', 9790000, 56, 37, NULL),
(37, '2025-03-28', 44490000, 57, 38, NULL),
(38, '2025-03-30', 7290000, 58, 39, NULL),

-- Tháng 4/2025 (8 đơn)
(39, '2025-04-03', 16990000, 59, 40, NULL),
(40, '2025-04-07', 10290000, 60, 41, NULL),
(41, '2025-04-11', 35490000, 61, 42, NULL),
(42, '2025-04-15', 4490000, 62, 43, NULL),
(43, '2025-04-18', 22990000, 63, 44, NULL),
(44, '2025-04-22', 12990000, 64, 45, NULL),
(45, '2025-04-26', 30990000, 65, 46, NULL),
(46, '2025-04-29', 2890000, 66, 47, NULL),

-- Tháng 5/2025 (10 đơn)
(47, '2025-05-02', 41990000, 67, 48, NULL),
(48, '2025-05-05', 14890000, 68, 49, NULL),
(49, '2025-05-09', 7790000, 69, 50, NULL),
(50, '2025-05-12', 25990000, 70, 51, NULL),
(51, '2025-05-15', 9310000, 71, 2, NULL),
(52, '2025-05-18', 30990000, 72, 3, NULL),
(53, '2025-05-22', 3700000, 73, 4, NULL),
(54, '2025-05-25', 21990000, 74, 5, 1),
(55, '2025-05-28', 11190000, 75, 6, NULL),
(56, '2025-05-30', 27990000, 76, 7, NULL),

-- Tháng 6/2025 (8 đơn)
(57, '2025-06-03', 17990000, 77, 8, 1),
(58, '2025-06-07', 5990000, 78, 9, NULL),
(59, '2025-06-11', 24490000, 79, 10, NULL),
(60, '2025-06-14', 7990000, 80, 11, NULL),
(61, '2025-06-18', 19290000, 21, 12, NULL),
(62, '2025-06-22', 11490000, 22, 13, NULL),
(63, '2025-06-25', 50000000, 23, 14, NULL),
(64, '2025-06-28', 4200000, 24, 15, NULL),

-- Tháng 7/2025 (8 đơn)
(65, '2025-07-02', 22290000, 25, 16, NULL),
(66, '2025-07-06', 9490000, 26, 17, NULL),
(67, '2025-07-10', 29990000, 27, 18, NULL),
(68, '2025-07-14', 3190000, 28, 19, NULL),
(69, '2025-07-18', 21190000, 29, 20, NULL),
(70, '2025-07-22', 15790000, 30, 21, NULL),
(71, '2025-07-26', 36990000, 31, 22, NULL),
(72, '2025-07-29', 2750000, 32, 23, NULL),

-- Tháng 8/2025 (8 đơn)
(73, '2025-08-02', 18990000, 33, 24, NULL),
(74, '2025-08-06', 9290000, 34, 25, NULL),
(75, '2025-08-10', 25990000, 35, 26, NULL),
(76, '2025-08-14', 4150000, 36, 27, NULL),
(77, '2025-08-18', 23990000, 37, 28, NULL),
(78, '2025-08-22', 10990000, 38, 29, NULL),
(79, '2025-08-26', 28990000, 39, 30, NULL),
(80, '2025-08-29', 1950000, 40, 31, NULL),

-- Tháng 9/2025 (8 đơn)
(81, '2025-09-02', 20990000, 41, 32, NULL),
(82, '2025-09-06', 7540000, 42, 33, NULL),
(83, '2025-09-10', 32990000, 43, 34, NULL),
(84, '2025-09-14', 5900000, 44, 35, NULL),
(85, '2025-09-18', 27590000, 45, 36, NULL),
(86, '2025-09-22', 12690000, 46, 37, NULL),
(87, '2025-09-26', 41790000, 47, 38, NULL),
(88, '2025-09-29', 2990000, 48, 39, NULL),

-- Tháng 10/2025 (6 đơn)
(89, '2025-10-03', 24990000, 49, 40, NULL),
(90, '2025-10-07', 8890000, 50, 41, NULL),
(91, '2025-10-11', 30290000, 51, 42, NULL),
(92, '2025-10-15', 6990000, 52, 43, NULL),
(93, '2025-10-19', 22990000, 53, 44, NULL),
(94, '2025-10-23', 15390000, 54, 45, NULL),

-- Tháng 11/2025 (4 đơn)
(95, '2025-11-05', 27790000, 55, 46, NULL),
(96, '2025-11-12', 9990000, 56, 47, NULL),
(97, '2025-11-19', 34690000, 57, 48, NULL),
(98, '2025-11-26', 5690000, 58, 49, NULL),

-- Tháng 12/2025 (2 đơn)
(99, '2025-12-02', 20550000, 59, 50, NULL),
(100, '2025-12-05', 17590000, 60, 51, NULL);

-- Chi tiết đơn hàng (order_details)
-- Sử dụng product_variant_id từ file sample_orders_01_product_variants.sql
-- Mapping: product_variant_id tương ứng với pp_id (giá sản phẩm)
INSERT INTO order_detail (od_id, quantity, total_price, product_variant_id, order_id) VALUES
-- Order 1: iPhone 16 Pro 256GB - variant 123, giá 25,490,000
(1, 1, 22990000, 123, 1),

-- Order 2: iPhone 13 128GB - variant 116, giá 12,090,000
(2, 1, 12090000, 116, 2),

-- Order 3: Samsung Galaxy A34 - variant 1, giá 7,090,000
(3, 1, 7090000, 1, 3),

-- Order 4: Samsung Galaxy Z Fold5 512GB - variant 87, giá 29,990,000
(4, 1, 29990000, 87, 4),

-- Order 5: Samsung Galaxy A15 LTE - variant 3, giá 4,290,000
(5, 1, 4290000, 3, 5),

-- Order 6: Samsung Galaxy S25 256GB - variant 53, giá 16,690,000
(6, 1, 16690000, 53, 6),

-- Order 7: iPhone 15 Pro Max 256GB - variant 107, giá 27,990,000
(7, 1, 27990000, 107, 7),

-- Order 8: Samsung Galaxy A06 - variant 2, giá 3,090,000
(8, 1, 3090000, 2, 8),

-- Order 9: Samsung Galaxy Z Fold6 1TB - variant 88, giá 45,490,000
(9, 1, 45490000, 88, 9),

-- Order 10: Samsung Galaxy Tab S9 WIFI - variant 61, giá 14,990,000
(10, 1, 14990000, 61, 10),

-- Order 11: Samsung Galaxy S25 512GB - variant 52, giá 20,690,000
(11, 1, 20690000, 52, 11),

-- Order 12: iPhone SE 2022 128GB - variant 106, giá 9,990,000
(12, 1, 9990000, 106, 12),

-- Order 13: Samsung Galaxy Z Fold6 256GB - variant 90, giá 31,790,000
(13, 1, 31790000, 90, 13),

-- Order 14: Samsung Galaxy A35 - variant 11, giá 6,190,000
(14, 1, 6190000, 11, 14),

-- Order 15: iPhone 16 Pro 256GB - variant 123, giá 25,490,000
(15, 1, 25490000, 123, 15),

-- Order 16: Samsung Galaxy A05 - variant 6, giá 2,790,000
(16, 1, 2790000, 6, 16),

-- Order 17: Samsung Galaxy Tab S9 Plus WIFI 256GB - variant 68, giá 19,290,000
(17, 1, 19990000, 68, 17),

-- Order 18: Samsung Galaxy Z Fold7 256GB - variant 97, giá 42,990,000
(18, 1, 42990000, 97, 18),

-- Order 19: Samsung Galaxy A55 - variant 4, giá 7,590,000
(19, 1, 7590000, 4, 19),

-- Order 20: Samsung Galaxy Z Fold6 512GB - variant 89, giá 34,900,000
(20, 1, 34900000, 89, 20),

-- Order 21: Samsung Galaxy A73 - variant 25, giá 11,990,000
(21, 1, 11990000, 25, 21),

-- Order 22: Samsung Galaxy S25 Plus 256GB - variant 55, giá 22,700,000
(22, 1, 22700000, 55, 22),

-- Order 23: Samsung Galaxy A23 4G - variant 5, giá 3,600,000
(23, 1, 3600000, 5, 23),

-- Order 24: Samsung Galaxy S25 Ultra 256GB - variant 48, giá 27,480,000
(24, 1, 27480000, 48, 24),

-- Order 25: Samsung Galaxy A21s - variant 12, giá 4,690,000
(25, 1, 4690000, 12, 25),

-- Order 26: Samsung Galaxy S23 Ultra 256GB - variant 27, giá 19,490,000
(26, 1, 19490000, 27, 26),

-- Order 27: Samsung Galaxy M34 - variant 82, giá 5,890,000 + phụ kiện
(27, 1, 5890000, 82, 27),
(28, 1, 3000000, 81, 27),

-- Order 28: Samsung Galaxy S21 Ultra 256GB - variant 30, giá 33,990,000
(29, 1, 33990000, 30, 28),

-- Order 29: Samsung Galaxy S24 Ultra 512GB - variant 33, giá 24,290,000
(30, 1, 24290000, 33, 29),

-- Order 30: Samsung Galaxy M34 - variant 82, giá 5,890,000
(31, 1, 5890000, 82, 30),

-- Order 31: Samsung Galaxy S25 Ultra 512GB - variant 47, giá 29,980,000
(32, 1, 29980000, 47, 31),

-- Order 32: Samsung Galaxy S23 FE 512GB - variant 50, giá 14,390,000
(33, 1, 14390000, 50, 32),

-- Order 33: Samsung Galaxy Z Fold5 1TB - variant 85, giá 38,990,000
(34, 1, 38990000, 85, 33),

-- Order 34: Samsung Galaxy A05S - variant 9, giá 3,350,000
(35, 1, 3350000, 9, 34),

-- Order 35: Samsung Galaxy Z Flip6 256GB - variant 96, giá 21,590,000
(36, 1, 21590000, 96, 35),

-- Order 36: Samsung Galaxy Tab S7 FE 4G - variant 70, giá 9,790,000
(37, 1, 9790000, 70, 36),

-- Order 37: Samsung Galaxy S24 Ultra 1TB - variant 32, giá 44,490,000
(38, 1, 44490000, 32, 37),

-- Order 38: Samsung Galaxy A33 - variant 20, giá 7,290,000
(39, 1, 7290000, 20, 38),

-- Order 39: Samsung Galaxy S22 Plus 256GB - variant 37, giá 16,990,000
(40, 1, 16990000, 37, 39),

-- Order 40: Samsung Galaxy Tab S9 FE Plus WIFI - variant 60, giá 10,290,000
(41, 1, 10290000, 60, 40),

-- Order 41: Samsung Galaxy S25 Ultra 1TB - variant 46, giá 35,490,000
(42, 1, 35490000, 46, 41),

-- Order 42: Samsung Galaxy M14 - variant 81, giá 4,490,000
(43, 1, 4490000, 81, 42),

-- Order 43: Samsung Galaxy S22 256GB - variant 39, giá 21,990,000
(44, 1, 22990000, 39, 43),

-- Order 44: Samsung Galaxy Tab S7 FE WiFi - variant 66, giá 12,990,000
(45, 1, 12990000, 66, 44),

-- Order 45: Samsung Galaxy S21 Ultra 128GB - variant 31, giá 30,990,000
(46, 1, 30990000, 31, 45),

-- Order 46: Samsung Galaxy Tab A9 WIFI - variant 78, giá 2,890,000
(47, 1, 2890000, 78, 46),

-- Order 47: Samsung Galaxy Z Fold3 256GB - variant 92, giá 41,990,000
(48, 1, 41990000, 92, 47),

-- Order 48: Samsung Galaxy S23 FE 128GB - variant 51, giá 14,890,000
(49, 1, 14890000, 51, 48),

-- Order 49: Samsung Galaxy M55 - variant 83, giá 7,790,000
(50, 1, 7790000, 83, 49),

-- Order 50: Samsung Galaxy Z Flip5 256GB - variant 93, giá 25,990,000
(51, 1, 25990000, 93, 50),

-- Order 51: Samsung Galaxy A56 - variant 8, giá 9,310,000
(52, 1, 9310000, 8, 51),

-- Order 52: Samsung Galaxy S21 Ultra 128GB - variant 31, giá 30,990,000
(53, 1, 30990000, 31, 52),

-- Order 53: Samsung Galaxy Tab A9+ WIFI - variant 63, giá 3,700,000
(54, 1, 3700000, 63, 53),

-- Order 54: Samsung Galaxy Z Flip6 512GB - variant 95, giá 21,990,000
(55, 1, 21990000, 95, 54),

-- Order 55: Samsung Galaxy Z Flip4 128GB - variant 84, giá 11,190,000
(56, 1, 11190000, 84, 55),

-- Order 56: Samsung Galaxy Z Fold5 256GB - variant 86, giá 27,990,000
(57, 1, 27990000, 86, 56),

-- Order 57: Samsung Galaxy Tab S9 5G 128GB - variant 59, giá 17,990,000
(58, 1, 17990000, 59, 57),

-- Order 58: Samsung Galaxy A17 5G - variant 23, giá 5,990,000
(59, 1, 5990000, 23, 58),

-- Order 59: Samsung Galaxy Z Fold4 512GB - variant 94, giá 24,490,000
(60, 1, 24490000, 94, 59),

-- Order 60: Samsung Galaxy Tab A7 - variant 71, giá 7,990,000
(61, 1, 7990000, 71, 60),

-- Order 61: Samsung Galaxy Tab S9 Plus WIFI 256GB - variant 68, giá 19,290,000
(62, 1, 19290000, 68, 61),

-- Order 62: Samsung Galaxy S21 FE - variant 29, giá 11,490,000
(63, 1, 11490000, 29, 62),

-- Order 63: Samsung Galaxy Z Fold2 Mùa hè - variant 99, giá 50,000,000
(64, 1, 50000000, 99, 63),

-- Order 64: Samsung Galaxy A14 5G - variant 19, giá 4,200,000
(65, 1, 4200000, 19, 64),

-- Order 65: Samsung Galaxy S24 Ultra 256GB - variant 34, giá 22,290,000
(66, 1, 22290000, 34, 65),

-- Order 66: Samsung Galaxy Tab S9 FE WIFI - variant 65, giá 9,490,000
(67, 1, 9490000, 65, 66),

-- Order 67: Samsung Galaxy Z Fold5 512GB - variant 87, giá 29,990,000
(68, 1, 29990000, 87, 67),

-- Order 68: Samsung Galaxy A07 - variant 22, giá 3,190,000
(69, 1, 3190000, 22, 68),

-- Order 69: Samsung Galaxy S24 Plus 512GB - variant 44, giá 21,190,000
(70, 1, 21190000, 44, 69),

-- Order 70: Samsung Galaxy S24 Plus 256GB - variant 45, giá 15,790,000
(71, 1, 15790000, 45, 70),

-- Order 71: iPhone 16 128GB - variant 128, giá 36,990,000
(72, 1, 36990000, 128, 71),

-- Order 72: Samsung Galaxy A04s - variant 18, giá 2,750,000
(73, 1, 2750000, 18, 72),

-- Order 73: Samsung Galaxy Tab S7 - variant 69, giá 18,990,000
(74, 1, 18990000, 69, 73),

-- Order 74: Samsung Galaxy A52 - variant 21, giá 9,290,000
(75, 1, 9290000, 21, 74),

-- Order 75: Samsung Galaxy Z Flip5 256GB - variant 93, giá 25,990,000
(76, 1, 25990000, 93, 75),

-- Order 76: Samsung Galaxy A23 5G - variant 7, giá 4,150,000
(77, 1, 4150000, 7, 76),

-- Order 77: Samsung Galaxy S23 256GB - variant 43, giá 24,990,000
(78, 1, 23990000, 43, 77),

-- Order 78: iPhone 16e 128GB - variant 137, giá 10,990,000
(79, 1, 10990000, 137, 78),

-- Order 79: Samsung Galaxy S21 256GB - variant 35, giá 28,990,000
(80, 1, 28990000, 35, 79),

-- Order 80: Samsung Galaxy A04 - variant 14, giá 1,950,000
(81, 1, 1950000, 14, 80),

-- Order 81: Samsung Galaxy Tab S8 5G - variant 73, giá 20,990,000
(82, 1, 20990000, 73, 81),

-- Order 82: Samsung Galaxy A36 - variant 16, giá 7,540,000
(83, 1, 7540000, 16, 82),

-- Order 83: Samsung Galaxy Note 20 Ultra 5G - variant 104, giá 32,990,000
(84, 1, 32990000, 104, 83),

-- Order 84: iPhone 6 32GB - variant 105, giá 5,900,000
(85, 1, 5900000, 105, 84),

-- Order 85: iPhone 12 mini 256GB - variant 139, giá 27,590,000
(86, 1, 27590000, 139, 85),

-- Order 86: iPhone 12 Pro Max 512GB - variant 142, giá 12,690,000
(87, 1, 12690000, 142, 86),

-- Order 87: iPhone 12 Pro Max 128GB - variant 141, giá 41,790,000
(88, 1, 41790000, 141, 87),

-- Order 88: Samsung Galaxy A14 4G - variant 17, giá 2,990,000
(89, 1, 2990000, 17, 88),

-- Order 89: Samsung Galaxy S23 256GB - variant 43, giá 24,990,000
(90, 1, 24990000, 43, 89),

-- Order 90: Samsung Galaxy M34 + M14
(91, 1, 5890000, 82, 90),
(92, 1, 3000000, 81, 90),

-- Order 91: iPhone 16 Pro Max 256GB - variant 129, giá 30,290,000
(93, 1, 30290000, 129, 91),

-- Order 92: Samsung Galaxy Tab S6 Trầy xước - variant 80, giá 6,990,000
(94, 1, 6990000, 80, 92),

-- Order 93: Samsung Galaxy S22 Plus 256GB - variant 37, giá 16,990,000
(95, 1, 22990000, 37, 93),

-- Order 94: iPhone 16e 256GB - variant 135, giá 15,390,000
(96, 1, 15390000, 135, 94),

-- Order 95: iPhone 16 Pro Max 512GB - variant 130, giá 27,790,000
(97, 1, 27790000, 130, 95),

-- Order 96: iPhone SE 2022 128GB - variant 106, giá 9,990,000
(98, 1, 9990000, 106, 96),

-- Order 97: iPhone 16 Pro 1TB - variant 122, giá 34,690,000
(99, 1, 34690000, 122, 97),

-- Order 98: Samsung Galaxy Tab S6 Trầy - variant 79, giá 5,690,000
(100, 1, 5690000, 79, 98),

-- Order 99: iPhone 16 256GB - variant 126, giá 20,550,000
(101, 1, 20550000, 126, 99),

-- Order 100: iPhone 14 Plus 128GB - variant 133, giá 17,590,000
(102, 1, 17590000, 133, 100);

-- Cập nhật sequence
SELECT setval('orders_order_id_seq', 100, true);
SELECT setval('order_detail_od_id_seq', 102, true);
