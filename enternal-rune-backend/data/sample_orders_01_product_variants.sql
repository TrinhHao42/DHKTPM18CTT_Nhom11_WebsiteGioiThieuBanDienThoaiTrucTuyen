-- =====================================================
-- FILE 01: PRODUCT VARIANTS - Tạo biến thể sản phẩm từ dữ liệu thực
-- Link với: products, product_price, images có sẵn trong products.sql
-- Cấu trúc: product_variants(product_variant_id, prodv_name, prodv_model, prodv_version, prodv_color, product_id, pp_price, image_id)
-- =====================================================

-- Tạo product variants từ dữ liệu thực trong database
-- Mỗi sản phẩm có nhiều màu (tương ứng với nhiều images), cùng 1 giá

INSERT INTO product_variants (product_variant_id, prodv_name, prodv_model, prodv_version, prodv_color, product_id, pp_price, image_id) VALUES
-- Samsung Galaxy A34 5G 8GB 128GB (product_id=1, pp_price=1, images: 1-Bạc, 2-Xanh, 3-Đen)
(1, 'Samsung Galaxy A34 5G 8GB 128GB', 'samsung-galaxy-a', '8GB 128GB', 'Bạc', 1, 1, 1),
(2, 'Samsung Galaxy A34 5G 8GB 128GB', 'samsung-galaxy-a', '8GB 128GB', 'Xanh', 1, 1, 2),
(3, 'Samsung Galaxy A34 5G 8GB 128GB', 'samsung-galaxy-a', '8GB 128GB', 'Đen', 1, 1, 3),

-- Samsung Galaxy A06 4GB 128GB (product_id=2, pp_price=2, images: 4-Xanh lá, 5-Xanh dương, 6-Đen)
(4, 'Samsung Galaxy A06 4GB 128GB', 'samsung-galaxy-a', '4GB 128GB', 'Xanh lá', 2, 2, 4),
(5, 'Samsung Galaxy A06 4GB 128GB', 'samsung-galaxy-a', '4GB 128GB', 'Xanh dương', 2, 2, 5),
(6, 'Samsung Galaxy A06 4GB 128GB', 'samsung-galaxy-a', '4GB 128GB', 'Đen', 2, 2, 6),

-- Samsung Galaxy A15 LTE 8GB 128GB (product_id=3, pp_price=3, images: 7-Xanh, 8-Đen, 9-Vàng)
(7, 'Samsung Galaxy A15 LTE 8GB 128GB', 'samsung-galaxy-a', '8GB 128GB', 'Xanh', 3, 3, 7),
(8, 'Samsung Galaxy A15 LTE 8GB 128GB', 'samsung-galaxy-a', '8GB 128GB', 'Đen', 3, 3, 8),
(9, 'Samsung Galaxy A15 LTE 8GB 128GB', 'samsung-galaxy-a', '8GB 128GB', 'Vàng', 3, 3, 9),

-- Samsung Galaxy A55 5G 8GB 128GB (product_id=4, pp_price=4, images: 10-Đen, 11-Xanh nhạt, 12-Tím)
(10, 'Samsung Galaxy A55 5G 8GB 128GB', 'samsung-galaxy-a', '8GB 128GB', 'Đen', 4, 4, 10),
(11, 'Samsung Galaxy A55 5G 8GB 128GB', 'samsung-galaxy-a', '8GB 128GB', 'Xanh nhạt', 4, 4, 11),
(12, 'Samsung Galaxy A55 5G 8GB 128GB', 'samsung-galaxy-a', '8GB 128GB', 'Tím', 4, 4, 12),

-- Samsung Galaxy A23 4G (product_id=5, pp_price=5, images: 13-Cam, 14-Xanh dương, 15-Đen)
(13, 'Samsung Galaxy A23 4G', 'samsung-galaxy-a', '4G', 'Cam', 5, 5, 13),
(14, 'Samsung Galaxy A23 4G', 'samsung-galaxy-a', '4G', 'Xanh dương', 5, 5, 14),
(15, 'Samsung Galaxy A23 4G', 'samsung-galaxy-a', '4G', 'Đen', 5, 5, 15),

-- Samsung Galaxy A05 4GB 128GB (product_id=6, pp_price=6, images: 16-Xanh, 17-Bạc, 18-Đen)
(16, 'Samsung Galaxy A05 4GB 128GB', 'samsung-galaxy-a', '4GB 128GB', 'Xanh', 6, 6, 16),
(17, 'Samsung Galaxy A05 4GB 128GB', 'samsung-galaxy-a', '4GB 128GB', 'Bạc', 6, 6, 17),
(18, 'Samsung Galaxy A05 4GB 128GB', 'samsung-galaxy-a', '4GB 128GB', 'Đen', 6, 6, 18),

-- Samsung Galaxy A23 5G (product_id=7, pp_price=7, images: 19-Đen, 20-Xanh)
(19, 'Samsung Galaxy A23 5G', 'samsung-galaxy-a', '5G', 'Đen', 7, 7, 19),
(20, 'Samsung Galaxy A23 5G', 'samsung-galaxy-a', '5G', 'Xanh', 7, 7, 20),

-- Samsung Galaxy A56 5G 8GB 128GB (product_id=8, pp_price=8, images: 21-Hồng, 22-Đen, 23-Xám, 24-Xanh)
(21, 'Samsung Galaxy A56 5G 8GB 128GB', 'samsung-galaxy-a', '8GB 128GB', 'Hồng', 8, 8, 21),
(22, 'Samsung Galaxy A56 5G 8GB 128GB', 'samsung-galaxy-a', '8GB 128GB', 'Đen', 8, 8, 22),
(23, 'Samsung Galaxy A56 5G 8GB 128GB', 'samsung-galaxy-a', '8GB 128GB', 'Xám', 8, 8, 23),
(24, 'Samsung Galaxy A56 5G 8GB 128GB', 'samsung-galaxy-a', '8GB 128GB', 'Xanh', 8, 8, 24),

-- Samsung Galaxy A05S 4GB 128GB (product_id=9, pp_price=9, images: 25-Xanh, 26-Đen, 27-Bạc)
(25, 'Samsung Galaxy A05S 4GB 128GB', 'samsung-galaxy-a', '4GB 128GB', 'Xanh', 9, 9, 25),
(26, 'Samsung Galaxy A05S 4GB 128GB', 'samsung-galaxy-a', '4GB 128GB', 'Đen', 9, 9, 26),
(27, 'Samsung Galaxy A05S 4GB 128GB', 'samsung-galaxy-a', '4GB 128GB', 'Bạc', 9, 9, 27),

-- Samsung Galaxy A25 5G 6GB 128GB (product_id=10, pp_price=10, images: 28-Vàng, 29-Đen, 30-Xanh)
(28, 'Samsung Galaxy A25 5G 6GB 128GB', 'samsung-galaxy-a', '6GB 128GB', 'Vàng', 10, 10, 28),
(29, 'Samsung Galaxy A25 5G 6GB 128GB', 'samsung-galaxy-a', '6GB 128GB', 'Đen', 10, 10, 29),
(30, 'Samsung Galaxy A25 5G 6GB 128GB', 'samsung-galaxy-a', '6GB 128GB', 'Xanh', 10, 10, 30),

-- Samsung Galaxy A35 5G 8GB 128GB (product_id=11, pp_price=11, images: 31-Vàng, 32-Đen, 33-Xanh nhạt)
(31, 'Samsung Galaxy A35 5G 8GB 128GB', 'samsung-galaxy-a', '8GB 128GB', 'Vàng', 11, 11, 31),
(32, 'Samsung Galaxy A35 5G 8GB 128GB', 'samsung-galaxy-a', '8GB 128GB', 'Đen', 11, 11, 32),
(33, 'Samsung Galaxy A35 5G 8GB 128GB', 'samsung-galaxy-a', '8GB 128GB', 'Xanh nhạt', 11, 11, 33),

-- Samsung Galaxy A21s (product_id=12, pp_price=12, images: 34-Đen, 35-Xanh, 36-Trắng)
(34, 'Samsung Galaxy A21s', 'samsung-galaxy-a', 'A21s', 'Đen', 12, 12, 34),
(35, 'Samsung Galaxy A21s', 'samsung-galaxy-a', 'A21s', 'Xanh', 12, 12, 35),
(36, 'Samsung Galaxy A21s', 'samsung-galaxy-a', 'A21s', 'Trắng', 12, 12, 36),

-- Samsung Galaxy A72 (product_id=13, pp_price=13, images: 37-Tím, 38-Đen, 39-Trắng, 40-Xanh)
(37, 'Samsung Galaxy A72', 'samsung-galaxy-a', 'A72', 'Tím', 13, 13, 37),
(38, 'Samsung Galaxy A72', 'samsung-galaxy-a', 'A72', 'Đen', 13, 13, 38),
(39, 'Samsung Galaxy A72', 'samsung-galaxy-a', 'A72', 'Trắng', 13, 13, 39),
(40, 'Samsung Galaxy A72', 'samsung-galaxy-a', 'A72', 'Xanh', 13, 13, 40),

-- Samsung Galaxy A04 (product_id=14, pp_price=14, images: 41-Đồng, 42-Đen, 43-Xanh)
(41, 'Samsung Galaxy A04', 'samsung-galaxy-a', 'A04', 'Đồng', 14, 14, 41),
(42, 'Samsung Galaxy A04', 'samsung-galaxy-a', 'A04', 'Đen', 14, 14, 42),
(43, 'Samsung Galaxy A04', 'samsung-galaxy-a', 'A04', 'Xanh', 14, 14, 43),

-- Samsung Galaxy A06 5G 4GB 128GB (product_id=15, pp_price=15, images: 44-Xanh, 45-Đen, 46-Xám)
(44, 'Samsung Galaxy A06 5G 4GB 128GB', 'samsung-galaxy-a', '4GB 128GB', 'Xanh', 15, 15, 44),
(45, 'Samsung Galaxy A06 5G 4GB 128GB', 'samsung-galaxy-a', '4GB 128GB', 'Đen', 15, 15, 45),
(46, 'Samsung Galaxy A06 5G 4GB 128GB', 'samsung-galaxy-a', '4GB 128GB', 'Xám', 15, 15, 46),

-- Samsung Galaxy A36 5G 8GB 128GB (product_id=16, pp_price=16, images: 47-Xanh, 48-Tím, 49-Đen)
(47, 'Samsung Galaxy A36 5G 8GB 128GB', 'samsung-galaxy-a', '8GB 128GB', 'Xanh', 16, 16, 47),
(48, 'Samsung Galaxy A36 5G 8GB 128GB', 'samsung-galaxy-a', '8GB 128GB', 'Tím', 16, 16, 48),
(49, 'Samsung Galaxy A36 5G 8GB 128GB', 'samsung-galaxy-a', '8GB 128GB', 'Đen', 16, 16, 49),

-- Samsung Galaxy A14 4G (product_id=17, pp_price=17, images: 50-Đỏ, 51-Đen, 52-Bạc)
(50, 'Samsung Galaxy A14 4G', 'samsung-galaxy-a', '4G', 'Đỏ', 17, 17, 50),
(51, 'Samsung Galaxy A14 4G', 'samsung-galaxy-a', '4G', 'Đen', 17, 17, 51),
(52, 'Samsung Galaxy A14 4G', 'samsung-galaxy-a', '4G', 'Bạc', 17, 17, 52),

-- Samsung Galaxy A04s 4GB 64GB (product_id=18, pp_price=18, images: 53-Đen, 54-Đồng, 55-Xanh)
(53, 'Samsung Galaxy A04s 4GB 64GB', 'samsung-galaxy-a', '4GB 64GB', 'Đen', 18, 18, 53),
(54, 'Samsung Galaxy A04s 4GB 64GB', 'samsung-galaxy-a', '4GB 64GB', 'Đồng', 18, 18, 54),
(55, 'Samsung Galaxy A04s 4GB 64GB', 'samsung-galaxy-a', '4GB 64GB', 'Xanh', 18, 18, 55),

-- Samsung Galaxy A14 5G (product_id=19, pp_price=19, images: 56-Bạc, 57-Đỏ, 58-Đen)
(56, 'Samsung Galaxy A14 5G', 'samsung-galaxy-a', '5G', 'Bạc', 19, 19, 56),
(57, 'Samsung Galaxy A14 5G', 'samsung-galaxy-a', '5G', 'Đỏ', 19, 19, 57),
(58, 'Samsung Galaxy A14 5G', 'samsung-galaxy-a', '5G', 'Đen', 19, 19, 58),

-- Samsung Galaxy A33 5G (product_id=20, pp_price=20, images: 59-Trắng, 60-Cam, 61-Đen, 62-Xanh)
(59, 'Samsung Galaxy A33 5G', 'samsung-galaxy-a', '5G', 'Trắng', 20, 20, 59),
(60, 'Samsung Galaxy A33 5G', 'samsung-galaxy-a', '5G', 'Cam', 20, 20, 60),
(61, 'Samsung Galaxy A33 5G', 'samsung-galaxy-a', '5G', 'Đen', 20, 20, 61),
(62, 'Samsung Galaxy A33 5G', 'samsung-galaxy-a', '5G', 'Xanh', 20, 20, 62),

-- Samsung Galaxy A52 (product_id=21, pp_price=21, images: 63-Đen, 64-Tím, 65-Xanh)
(63, 'Samsung Galaxy A52', 'samsung-galaxy-a', 'A52', 'Đen', 21, 21, 63),
(64, 'Samsung Galaxy A52', 'samsung-galaxy-a', 'A52', 'Tím', 21, 21, 64),
(65, 'Samsung Galaxy A52', 'samsung-galaxy-a', 'A52', 'Xanh', 21, 21, 65),

-- Samsung Galaxy A07 4GB 128GB (product_id=22, pp_price=22, images: 66-Đen, 67-Tím bạc, 68-Xanh)
(66, 'Samsung Galaxy A07 4GB 128GB', 'samsung-galaxy-a', '4GB 128GB', 'Đen huyền', 22, 22, 66),
(67, 'Samsung Galaxy A07 4GB 128GB', 'samsung-galaxy-a', '4GB 128GB', 'Tím bạc', 22, 22, 67),
(68, 'Samsung Galaxy A07 4GB 128GB', 'samsung-galaxy-a', '4GB 128GB', 'Xanh lục bảo', 22, 22, 68),

-- Samsung Galaxy A17 5G 8GB 128GB (product_id=23, pp_price=23, images: 69-Xanh navy, 70-Đen titan, 71-Xám khói)
(69, 'Samsung Galaxy A17 5G 8GB 128GB', 'samsung-galaxy-a', '8GB 128GB', 'Xanh navy', 23, 23, 69),
(70, 'Samsung Galaxy A17 5G 8GB 128GB', 'samsung-galaxy-a', '8GB 128GB', 'Đen titan', 23, 23, 70),
(71, 'Samsung Galaxy A17 5G 8GB 128GB', 'samsung-galaxy-a', '8GB 128GB', 'Xám khói', 23, 23, 71),

-- Samsung Galaxy A54 5G 8GB 128GB (product_id=24, pp_price=24, images: 72-Xanh lá, 73-Đen, 74-Tím)
(72, 'Samsung Galaxy A54 5G 8GB 128GB', 'samsung-galaxy-a', '8GB 128GB', 'Xanh lá', 24, 24, 72),
(73, 'Samsung Galaxy A54 5G 8GB 128GB', 'samsung-galaxy-a', '8GB 128GB', 'Đen', 24, 24, 73),
(74, 'Samsung Galaxy A54 5G 8GB 128GB', 'samsung-galaxy-a', '8GB 128GB', 'Tím', 24, 24, 74),

-- Samsung Galaxy A73 128GB (product_id=25, pp_price=25, images: 75-Xám, 76-Trắng, 77-Xanh)
(75, 'Samsung Galaxy A73 128GB', 'samsung-galaxy-a', '128GB', 'Xám', 25, 25, 75),
(76, 'Samsung Galaxy A73 128GB', 'samsung-galaxy-a', '128GB', 'Trắng', 25, 25, 76),
(77, 'Samsung Galaxy A73 128GB', 'samsung-galaxy-a', '128GB', 'Xanh', 25, 25, 77),

-- Samsung Galaxy A73 5G 256GB (product_id=26, pp_price=26, images: 78-Xanh, 79-Xám, 80-Trắng)
(78, 'Samsung Galaxy A73 5G 256GB', 'samsung-galaxy-a', '256GB', 'Xanh', 26, 26, 78),
(79, 'Samsung Galaxy A73 5G 256GB', 'samsung-galaxy-a', '256GB', 'Xám', 26, 26, 79),
(80, 'Samsung Galaxy A73 5G 256GB', 'samsung-galaxy-a', '256GB', 'Trắng', 26, 26, 80),

-- Samsung Galaxy S23 Ultra 256GB (product_id=27, pp_price=27, images: 81-Tím, 82-Trắng, 83-Đen, 84-Xanh)
(81, 'Samsung Galaxy S23 Ultra 256GB', 'samsung-galaxy-s', '256GB', 'Tím', 27, 27, 81),
(82, 'Samsung Galaxy S23 Ultra 256GB', 'samsung-galaxy-s', '256GB', 'Trắng', 27, 27, 82),
(83, 'Samsung Galaxy S23 Ultra 256GB', 'samsung-galaxy-s', '256GB', 'Đen', 27, 27, 83),
(84, 'Samsung Galaxy S23 Ultra 256GB', 'samsung-galaxy-s', '256GB', 'Xanh', 27, 27, 84),

-- Samsung Galaxy S22 Ultra 8GB 128GB (product_id=28, pp_price=28, images: 85-Xanh, 86-Đen, 87-Trắng, 88-Đỏ)
(85, 'Samsung Galaxy S22 Ultra 8GB 128GB', 'samsung-galaxy-s', '8GB 128GB', 'Xanh', 28, 28, 85),
(86, 'Samsung Galaxy S22 Ultra 8GB 128GB', 'samsung-galaxy-s', '8GB 128GB', 'Đen', 28, 28, 86),
(87, 'Samsung Galaxy S22 Ultra 8GB 128GB', 'samsung-galaxy-s', '8GB 128GB', 'Trắng', 28, 28, 87),
(88, 'Samsung Galaxy S22 Ultra 8GB 128GB', 'samsung-galaxy-s', '8GB 128GB', 'Đỏ', 28, 28, 88),

-- Samsung Galaxy S21 FE 5G 6GB 128GB (product_id=29, pp_price=29, images: 89-Xanh lá, 90-Tím, 91-Xám, 92-Trắng)
(89, 'Samsung Galaxy S21 FE 5G 6GB 128GB', 'samsung-galaxy-s', '6GB 128GB', 'Xanh lá', 29, 29, 89),
(90, 'Samsung Galaxy S21 FE 5G 6GB 128GB', 'samsung-galaxy-s', '6GB 128GB', 'Tím', 29, 29, 90),
(91, 'Samsung Galaxy S21 FE 5G 6GB 128GB', 'samsung-galaxy-s', '6GB 128GB', 'Xám', 29, 29, 91),
(92, 'Samsung Galaxy S21 FE 5G 6GB 128GB', 'samsung-galaxy-s', '6GB 128GB', 'Trắng', 29, 29, 92),

-- Samsung Galaxy S21 Ultra 5G 256GB (product_id=30, pp_price=30, images: 93-Bạc, 94-Đen)
(93, 'Samsung Galaxy S21 Ultra 5G 256GB', 'samsung-galaxy-s', '256GB', 'Bạc', 30, 30, 93),
(94, 'Samsung Galaxy S21 Ultra 5G 256GB', 'samsung-galaxy-s', '256GB', 'Đen', 30, 30, 94),

-- Samsung Galaxy S21 Ultra 5G (product_id=31, pp_price=31, images: 95-Đen, 96-Bạc)
(95, 'Samsung Galaxy S21 Ultra 5G', 'samsung-galaxy-s', '5G', 'Đen', 31, 31, 95),
(96, 'Samsung Galaxy S21 Ultra 5G', 'samsung-galaxy-s', '5G', 'Bạc', 31, 31, 96),

-- Samsung Galaxy S24 Ultra 12GB 1TB (product_id=32, pp_price=32, images: 97-Vàng, 98-Tím, 99-Xám, 100-Đen)
(97, 'Samsung Galaxy S24 Ultra 12GB 1TB', 'samsung-galaxy-s', '12GB 1TB', 'Vàng', 32, 32, 97),
(98, 'Samsung Galaxy S24 Ultra 12GB 1TB', 'samsung-galaxy-s', '12GB 1TB', 'Tím', 32, 32, 98),
(99, 'Samsung Galaxy S24 Ultra 12GB 1TB', 'samsung-galaxy-s', '12GB 1TB', 'Xám', 32, 32, 99),
(100, 'Samsung Galaxy S24 Ultra 12GB 1TB', 'samsung-galaxy-s', '12GB 1TB', 'Đen', 32, 32, 100),

-- Samsung Galaxy S24 Ultra 12GB 512GB (product_id=33, pp_price=33, images: 101-Xám, 102-Vàng, 103-Đen, 104-Tím)
(101, 'Samsung Galaxy S24 Ultra 12GB 512GB', 'samsung-galaxy-s', '12GB 512GB', 'Xám', 33, 33, 101),
(102, 'Samsung Galaxy S24 Ultra 12GB 512GB', 'samsung-galaxy-s', '12GB 512GB', 'Vàng', 33, 33, 102),
(103, 'Samsung Galaxy S24 Ultra 12GB 512GB', 'samsung-galaxy-s', '12GB 512GB', 'Đen', 33, 33, 103),
(104, 'Samsung Galaxy S24 Ultra 12GB 512GB', 'samsung-galaxy-s', '12GB 512GB', 'Tím', 33, 33, 104),

-- Samsung Galaxy S24 Ultra 12GB 256GB (product_id=34, pp_price=34, images: 105-Vàng, 106-Xám)
(105, 'Samsung Galaxy S24 Ultra 12GB 256GB', 'samsung-galaxy-s', '12GB 256GB', 'Vàng', 34, 34, 105),
(106, 'Samsung Galaxy S24 Ultra 12GB 256GB', 'samsung-galaxy-s', '12GB 256GB', 'Xám', 34, 34, 106),

-- Samsung Galaxy S24+ 12GB 256GB (product_id=35, pp_price=35) - cần check image_id
(107, 'Samsung Galaxy S24+ 12GB 256GB', 'samsung-galaxy-s', '12GB 256GB', 'Đen', 35, 35, NULL),

-- Samsung Galaxy S24 8GB 256GB (product_id=36, pp_price=36)
(108, 'Samsung Galaxy S24 8GB 256GB', 'samsung-galaxy-s', '8GB 256GB', 'Đen', 36, 36, NULL),

-- Samsung Galaxy S23 FE 8GB 128GB (product_id=37, pp_price=37)
(109, 'Samsung Galaxy S23 FE 8GB 128GB', 'samsung-galaxy-s', '8GB 128GB', 'Đen', 37, 37, NULL),

-- Samsung Galaxy S23 8GB 128GB (product_id=38, pp_price=38)
(110, 'Samsung Galaxy S23 8GB 128GB', 'samsung-galaxy-s', '8GB 128GB', 'Đen', 38, 38, NULL),

-- Samsung Galaxy S23+ 8GB 256GB (product_id=39, pp_price=39)
(111, 'Samsung Galaxy S23+ 8GB 256GB', 'samsung-galaxy-s', '8GB 256GB', 'Đen', 39, 39, NULL),

-- Samsung Galaxy S23 Ultra 8GB 256GB (product_id=40, pp_price=40)
(112, 'Samsung Galaxy S23 Ultra 8GB 256GB', 'samsung-galaxy-s', '8GB 256GB', 'Đen', 40, 40, NULL),

-- Samsung Galaxy S22 5G 8GB 128GB (product_id=41, pp_price=41)
(113, 'Samsung Galaxy S22 5G 8GB 128GB', 'samsung-galaxy-s', '8GB 128GB', 'Đen', 41, 41, NULL),

-- Samsung Galaxy S25 Ultra 12GB 256GB (product_id=42, pp_price=42)
(114, 'Samsung Galaxy S25 Ultra 12GB 256GB', 'samsung-galaxy-s', '12GB 256GB', 'Đen', 42, 42, NULL),

-- Samsung Galaxy S25+ 12GB 256GB (product_id=43, pp_price=43)
(115, 'Samsung Galaxy S25+ 12GB 256GB', 'samsung-galaxy-s', '12GB 256GB', 'Đen', 43, 43, NULL),

-- Samsung Galaxy S25 Ultra 12GB 512GB (product_id=44, pp_price=44)
(116, 'Samsung Galaxy S25 Ultra 12GB 512GB', 'samsung-galaxy-s', '12GB 512GB', 'Đen', 44, 44, NULL),

-- Samsung Galaxy S25 Ultra 12GB 1TB (product_id=45, pp_price=45)
(117, 'Samsung Galaxy S25 Ultra 12GB 1TB', 'samsung-galaxy-s', '12GB 1TB', 'Đen', 45, 45, NULL),

-- Samsung Galaxy Z Fold 6 12GB 256GB (product_id=46, pp_price=46)
(118, 'Samsung Galaxy Z Fold 6 12GB 256GB', 'samsung-galaxy-z', '12GB 256GB', 'Đen', 46, 46, NULL),

-- Samsung Galaxy Z Fold 5 12GB 256GB (product_id=47, pp_price=47)
(119, 'Samsung Galaxy Z Fold 5 12GB 256GB', 'samsung-galaxy-z', '12GB 256GB', 'Đen', 47, 47, NULL),

-- Samsung Galaxy Z Fold 5 12GB 512GB (product_id=48, pp_price=48)
(120, 'Samsung Galaxy Z Fold 5 12GB 512GB', 'samsung-galaxy-z', '12GB 512GB', 'Đen', 48, 48, NULL),

-- Samsung Galaxy Z Flip 6 12GB 256GB (product_id=49, pp_price=49)
(121, 'Samsung Galaxy Z Flip 6 12GB 256GB', 'samsung-galaxy-z', '12GB 256GB', 'Đen', 49, 49, NULL),

-- Samsung Galaxy Z Flip 5 8GB 256GB (product_id=50, pp_price=50)
(122, 'Samsung Galaxy Z Flip 5 8GB 256GB', 'samsung-galaxy-z', '8GB 256GB', 'Đen', 50, 50, NULL),

-- Samsung Galaxy Tab S7 FE 4G (product_id=70, pp_price=70)
(123, 'Samsung Galaxy Tab S7 FE 4G', 'samsung-galaxy-tab', '4G', 'Đen', 70, 70, NULL),

-- Samsung Galaxy Tab S9 FE+ 5G (product_id=71, pp_price=71)
(124, 'Samsung Galaxy Tab S9 FE+ 5G', 'samsung-galaxy-tab', '5G', 'Đen', 71, 71, NULL),

-- Samsung Galaxy Tab S10+ 5G (product_id=72, pp_price=72)
(125, 'Samsung Galaxy Tab S10+ 5G', 'samsung-galaxy-tab', '5G', 'Đen', 72, 72, NULL),

-- Samsung Galaxy Tab S10 Ultra 5G (product_id=73, pp_price=73)
(126, 'Samsung Galaxy Tab S10 Ultra 5G', 'samsung-galaxy-tab', '5G', 'Đen', 73, 73, NULL),

-- Samsung Galaxy Tab A9+ 5G (product_id=74, pp_price=74)
(127, 'Samsung Galaxy Tab A9+ 5G', 'samsung-galaxy-tab', '5G', 'Đen', 74, 74, NULL),

-- Samsung Galaxy Tab S9 Ultra 5G (product_id=75, pp_price=75)
(128, 'Samsung Galaxy Tab S9 Ultra 5G', 'samsung-galaxy-tab', '5G', 'Đen', 75, 75, NULL),

-- Samsung Galaxy Tab S9+ 5G (product_id=76, pp_price=76)
(129, 'Samsung Galaxy Tab S9+ 5G', 'samsung-galaxy-tab', '5G', 'Đen', 76, 76, NULL),

-- Samsung Galaxy Tab S6 Lite 2024 (product_id=77, pp_price=77)
(130, 'Samsung Galaxy Tab S6 Lite 2024', 'samsung-galaxy-tab', '2024', 'Đen', 77, 77, NULL),

-- Thêm các variants cho các sản phẩm iPhone, Xiaomi... (tùy theo products có trong db)
-- iPhone 16 Pro Max (product_id cần check)
(131, 'iPhone 16 Pro Max 256GB', 'iphone', '256GB', 'Titan sa mạc', 85, 85, NULL),
(132, 'iPhone 16 Pro Max 256GB', 'iphone', '256GB', 'Titan đen', 85, 85, NULL),
(133, 'iPhone 16 Pro Max 512GB', 'iphone', '512GB', 'Titan tự nhiên', 86, 86, NULL),
(134, 'iPhone 16 Pro 256GB', 'iphone', '256GB', 'Titan đen', 87, 87, NULL),
(135, 'iPhone 16 128GB', 'iphone', '128GB', 'Hồng', 88, 88, NULL),
(136, 'iPhone 15 Pro Max 256GB', 'iphone', '256GB', 'Titan tự nhiên', 89, 89, NULL),
(137, 'iPhone 15 Pro 256GB', 'iphone', '256GB', 'Titan đen', 90, 90, NULL),
(138, 'iPhone 15 128GB', 'iphone', '128GB', 'Hồng', 91, 91, NULL),
(139, 'iPhone 14 Pro Max 256GB', 'iphone', '256GB', 'Tím đậm', 92, 92, NULL),
(140, 'iPhone 14 128GB', 'iphone', '128GB', 'Xanh dương', 93, 93, NULL),
(141, 'iPhone 13 128GB', 'iphone', '128GB', 'Midnight', 94, 94, NULL),
(142, 'iPhone SE 2022 64GB', 'iphone', '64GB', 'Midnight', 95, 95, NULL);

-- Cập nhật sequence
SELECT setval('product_variants_product_variant_id_seq', 142, true);
