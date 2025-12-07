INSERT INTO payment_statuses (status_code, status_name, description) VALUES
                                                                         ('PENDING', 'Chờ thanh toán', 'Đơn hàng đang chờ thanh toán'),
                                                                         ('PAID', 'Đã thanh toán', 'Đơn hàng đã được thanh toán thành công'),
                                                                         ('FAILED', 'Thanh toán thất bại', 'Giao dịch thanh toán thất bại'),
                                                                         ('REFUNDED', 'Đã hoàn tiền', 'Đã hoàn tiền cho khách hàng'),
                                                                         ('EXPIRED', 'Hết hạn', 'Đơn hàng đã hết hạn thanh toán'),
                                                                         ('CANCELLED', 'Đã hủy', 'Đơn hàng đã bị người dùng hủy');

    INSERT INTO shipping_statuses (status_code, status_name, description) VALUES
    ('PROCESSING', 'Đang xử lý', 'Đơn hàng đang được chuẩn bị'),
    ('SHIPPED', 'Đã giao cho vận chuyển', 'Đơn hàng đã được giao cho đơn vị vận chuyển'),
    ('DELIVERED', 'Đã giao hàng', 'Đơn hàng đã được giao thành công'),
    ('FAILED_DELIVERY', 'Giao hàng thất bại', 'Không thể giao hàng đến khách hàng'),
    ('RECEIVED', 'Đã nhận hàng', 'Hàng đã được khách hàng nhận'),
    ('RETURNED', 'Đã trả hàng', 'Hàng đã được trả lại'),
    ('CANCELLED', 'Đã hủy', 'Đơn hàng đã bị hủy');


INSERT INTO brands (brand_id, brand_name, brand_description, brand_status) VALUES
(1, 'iPhone', 'iPhone là dòng smartphone cao cấp do Apple phát triển, được ra mắt lần đầu vào năm 2007 với tuyên ngôn ''reinvent the phone'' (tái định nghĩa điện thoại). Kể từ đó, iPhone đã trở thành biểu tượng của sự đổi mới trong thiết kế, trải nghiệm người dùng và hệ sinh thái khép kín. Với iOS là hệ điều hành riêng, iPhone mang lại trải nghiệm mượt mà, đồng bộ cao với các thiết bị Apple khác và hệ sinh thái App Store mạnh mẽ.', true),
(2, 'ZTE', 'ZTE là tập đoàn công nghệ đa quốc gia Trung Quốc, hoạt động mạnh trong lĩnh vực thiết bị viễn thông và thiết bị thông minh. ZTE có lợi thế về khả năng tích hợp phần cứng, mạng và giải pháp công nghệ, đặc biệt trong các sản phẩm hỗ trợ 5G và IoT.', true),
(3, 'Oppo', 'OPPO được thành lập vào năm 2004, hướng đến người dùng trẻ trung yêu thích thiết kế đẹp mắt và camera ấn tượng. OPPO chú trọng vào đổi mới sáng tạo trong nhiếp ảnh và giao diện người dùng. Tầm nhìn của OPPO là kết hợp giữa nghệ thuật và công nghệ.', true),
(4, 'OnePlus', 'OnePlus ra đời với khẩu hiệu ''Never Settle'' (Không bao giờ hài lòng), thể hiện tinh thần cải tiến không ngừng. Hãng nổi tiếng với các thiết bị hiệu năng mạnh, mượt và trải nghiệm gần gũi người dùng.', true),
(5, 'Itel', 'itel là thương hiệu smartphone phổ thông với phương châm ''công nghệ cho mọi người''. itel tập trung vào thiết bị dễ dùng, pin dung lượng cao và giá rẻ, hướng tới thị trường đang phát triển.', true),
(10, 'Xiaomi', 'Xiaomi thành lập năm 2010, được biết đến với mô hình ''giá trị cao - chi phí thấp''. Với khẩu hiệu ''Innovation for Everyone'', Xiaomi hướng đến việc phổ cập công nghệ tiên tiến cho mọi tầng lớp người dùng.', true),
(9, 'Samsung', 'Samsung là tập đoàn công nghệ Hàn Quốc hàng đầu thế giới, nổi tiếng với dòng Galaxy. Samsung định vị là thương hiệu tiên phong trong công nghệ màn hình, chip và camera.', true),
(12, 'Vivo', 'Vivo là thương hiệu Trung Quốc chú trọng vào thiết kế thời trang, âm thanh và camera. Với triết lý ''Hi-Fi & Smart'', Vivo nhấn mạnh trải nghiệm nghe nhìn cao cấp.', true),
(13, 'Realme', 'Realme được tách ra từ Oppo năm 2018, tập trung vào giới trẻ với khẩu hiệu ''Dare to Leap''. Hãng nổi bật với hiệu năng mạnh trong tầm giá rẻ.', true),
(16, 'Nokia', 'Nokia – biểu tượng một thời của ngành di động, nay tập trung vào điện thoại thông minh bền bỉ, pin trâu, và trải nghiệm gần gũi Android gốc. Slogan: ''Love it, Trust it, Keep it''.', true),
(11, 'Huawei', 'Huawei là tập đoàn công nghệ lớn của Trung Quốc, nổi tiếng với công nghệ mạng 5G và smartphone camera mạnh. Dù gặp hạn chế quốc tế, Huawei vẫn phát triển hệ điều hành HarmonyOS riêng.', true),
(8, 'Asus', 'Asus là thương hiệu Đài Loan nổi tiếng trong lĩnh vực PC và gaming. Dòng điện thoại ROG Phone của hãng được yêu thích bởi game thủ nhờ hiệu năng khủng và tản nhiệt tốt.', true),
(19, 'Tecno', 'Tecno là thương hiệu hướng tới thị trường châu Phi và châu Á, tập trung vào smartphone giá rẻ với camera tốt và pin lớn.', true),
(17, 'Infinix', 'Infinix là thương hiệu con của Transsion Holdings (cùng tập đoàn với Tecno, itel). Hãng nhấn mạnh thiết kế trẻ trung và hiệu năng ổn định ở tầm trung.', true),
(14, 'Honor', 'Honor từng là thương hiệu con của Huawei, nay hoạt động độc lập. Honor hướng tới người dùng trẻ với thiết kế bắt mắt và công nghệ hiện đại.', true),
(6, 'Google Pixel', 'Google Pixel là dòng điện thoại do chính Google phát triển, nổi tiếng với khả năng xử lý ảnh bằng phần mềm và trải nghiệm Android gốc mượt mà, nhanh chóng nhận cập nhật.', true),
(15, 'Sony', 'Sony nổi tiếng với dòng Xperia – tập trung vào chất lượng âm thanh, hình ảnh và độ bền. Với di sản từ mảng máy ảnh và TV Bravia, Sony hướng đến người dùng yêu thích công nghệ tinh tế.', true),
(18, 'Nubia', 'Nubia là thương hiệu con của hãng sản xuất điện thoại thông minh Trung Quốc ZTE. Đây là dòng điện thoại chuyên dành cho các game thủ khi được trang bị cấu hình mạnh mẽ cùng thiết kế hầm hố.Nubia là một trong những thương hiệu một tập đoàn chuyên sản xuất điện thoại thông minh tại Trung Quốc – Tập đoàn ZTE. Nubia được biết đến với nhiều dòng sản phẩm như Nubia Z20, Nubia Watch, Nubia Alpha, Red Magic. Đặc điểm nổi bật của thương hiệu Nubia là dòng điện thoại chuyên dành cho game thủ với thiết kế hầm hố., cấu hình mãnh mẽ, giá cả thấp hơn so với các đối thủ cạnh tranh khác.', true),
(7, 'Lenovo', 'Lenovo là tập đoàn công nghệ toàn cầu nổi tiếng trong lĩnh vực PC, đồng thời phát triển smartphone dưới thương hiệu Lenovo và Motorola. Triết lý của hãng là ''Smarter technology for all''.', true);
/*=========ADDRESS========================================================================================================================================================================================================================================================*/;
INSERT INTO addresses (address_id, street_name, ward_name, city_name, country_name) VALUES
                                                                                        (1, '86 Lê Thánh Tôn', 'Bến Nghé', 'Thành phố Hồ Chí Minh', 'Việt Nam'),
                                                                                        (2, 'Phạm Ngũ Lão', 'Phạm Ngũ Lão', 'Thành phố Hồ Chí Minh', 'Việt Nam'),
                                                                                        (3, 'Nguyễn Cư Trinh', 'Nguyễn Cư Trinh', 'Thành phố Hồ Chí Minh', 'Việt Nam'),
                                                                                        (4, '92 Nguyễn Trãi', 'Bến Thành', 'Thành phố Hồ Chí Minh', 'Việt Nam'),
                                                                                        (5, '45-47 Lê Duẩn', 'Bến Nghé', 'Thành phố Hồ Chí Minh', 'Việt Nam'),
                                                                                        (6, '65 Nguyễn Thái Học', 'Văn Miếu – Quốc Tử Giám', 'Hà Nội', 'Việt Nam'),
                                                                                        (7, 'Nam Kỳ Khởi Nghĩa', 'Phường 7', 'Thành phố Hồ Chí Minh', 'Việt Nam'),
                                                                                        (8, 'Đặng Văn Ngữ', 'Phường 14', 'Thành phố Hồ Chí Minh', 'Việt Nam'),
                                                                                        (9, 'Tôn Thất Thuyết', 'Phường 4', 'Thành phố Hồ Chí Minh', 'Việt Nam'),
                                                                                        (10, 'Hoàng Diệu', 'Phường 4', 'Thành phố Hồ Chí Minh', 'Việt Nam'),
                                                                                        (11, 'Cầu Kênh Tẻ', 'Phường 4', 'Thành phố Hồ Chí Minh', 'Việt Nam'),
                                                                                        (12, '30 Tháng 4', 'Đồng Hải', 'Đồng Hới', 'Việt Nam'),
                                                                                        (13, '23/5 Nguyễn Trãi', 'Phường 5', 'Thành phố Hồ Chí Minh', 'Việt Nam'),
                                                                                        (14, '123 Lê Lợi', 'Bến Nghé', 'Thành phố Hồ Chí Minh', 'Việt Nam'),
                                                                                        (15, '19 Phan Chu Trinh', 'Hàng Bài', 'Hà Nội', 'Việt Nam'),
                                                                                        (16, '5 Trần Hưng Đạo', 'Trần Hưng Đạo', 'Hà Nội', 'Việt Nam'),
                                                                                        (17, '10 Nguyễn Văn Cừ', 'Nguyễn Cư Trinh', 'Thành phố Hồ Chí Minh', 'Việt Nam'),
                                                                                        (18, '243/46 Hoàng Diệu', 'Phường 4', 'Thành phố Hồ Chí Minh', 'Việt Nam'),
                                                                                        (19, '368 Tôn Đản', 'Phường 4', 'Thành phố Hồ Chí Minh', 'Việt Nam'),
                                                                                        (20, '56 Khánh Hội', 'Phường 4', 'Thành phố Hồ Chí Minh', 'Việt Nam');
INSERT INTO discounts (discount_active, discount_code, discount_end_date, discount_max_amount, discount_name, discount_quantity_limit, discount_start_date, discount_target_type, discount_value_type, discount_value) VALUES
(TRUE, 'SUMMER20', '2025-08-31', 50000.00, 'Khuyến mãi Hè', 1000, '2025-06-01', 'ORDER', 'PERCENT', 20.00),
(TRUE, 'FREE_SHIP', '2025-12-31', 0.00, 'Miễn phí vận chuyển', 500, '2025-05-15', 'ORDER', 'FIXED', 0.00),
(FALSE, 'WINTER10', '2024-12-31', 30000.00, 'Giảm giá mùa Đông', 200, '2024-10-01', 'ORDER', 'PERCENT', 10.00),
(TRUE, 'NEWUSER50', '2025-12-31', 100000.00, 'Ưu đãi Người dùng mới', 5000, '2025-01-01', 'ORDER', 'FIXED', 50000.00),
(TRUE, 'PROD_SALE', '2025-07-30', 25000.00, 'Giảm giá Sản phẩm A', 300, '2025-07-01', 'PRODUCT', 'PERCENT', 15.00),
(TRUE, 'FLASH_24H', '2025-06-05', 75000.00, 'Flash Sale 24h', 50, '2025-06-04', 'ORDER', 'FIXED', 20000.00),
(FALSE, 'HOLIDAY23', '2023-12-25', 40000.00, 'Giảm giá Lễ hội 2023', 100, '2023-11-01', 'ORDER', 'PERCENT', 25.00),
(TRUE, 'VIP_EXTRA', '2025-12-31', 999999.00, 'Ưu đãi Thành viên VIP', 500, '2025-01-01', 'ORDER', 'PERCENT', 5.00),
(TRUE, 'APPONLY', '2025-09-30', 60000.00, 'Chỉ áp dụng trên App', 800, '2025-03-01', 'ORDER', 'FIXED', 30000.00),
(TRUE, 'BOOKS2025', '2025-11-30', 20000.00, 'Sách giảm giá', 400, '2025-01-01', 'ORDER', 'PERCENT', 10.00);
INSERT INTO roles (role_id,role_name) VALUES
(1,'ROLE_ADMIN'),
(2,'ROLE_USER'),
(3,'ROLE_STAFF');
INSERT INTO users (user_id, name, email, password, auth_provider, activate_id, user_active)
VALUES
(1, 'Admin', 'admin@gmail.com','$2a$10$/4Qgqo2DnrPiOroG4OK6beG1QN/zGN6fMp8RdTya9c6m/heUeBzIO','LOCAL', NULL, FALSE);

INSERT INTO user_role(user_id,role_id) VALUES
(1,1)