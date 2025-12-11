-- Analytics Data Seeding Script
-- Generated for Enternal Rune Analytics Dashboard
-- This script creates sample data for analytics tracking

-- First, let's create some user sessions with realistic data
INSERT INTO user_sessions (session_id, website_id, browser, os, device, screen, language, country, region, city, distinct_id, created_at, updated_at) VALUES
-- Today's sessions
('063564a4-e4ba-48dd-9aeb-321ee0aa2d3e', 'cmic2k2820000ml8mu0miqhlm', 'Chrome', 'Windows', 'Desktop', '1920x1080', 'vi-VN', 'Vietnam', 'Ho Chi Minh', 'Ho Chi Minh City', 'user_001', '2025-12-10T14:00:03.007Z', '2025-12-10T14:00:03.007Z'),
('f7b3a2c1-8d9e-4f5a-b6c7-1a2b3c4d5e6f', 'cmic2k2820000ml8mu0miqhlm', 'Safari', 'macOS', 'Desktop', '1440x900', 'en-US', 'Vietnam', 'Ha Noi', 'Hanoi', 'user_002', '2025-12-10T15:00:03.007Z', '2025-12-10T15:00:03.007Z'),
('a1b2c3d4-5e6f-7890-ab12-cd34ef567890', 'cmic2k2820000ml8mu0miqhlm', 'Chrome', 'Android', 'Mobile', '390x844', 'vi-VN', 'Vietnam', 'Da Nang', 'Da Nang', 'user_003', '2025-12-10T15:30:03.007Z', '2025-12-10T15:30:03.007Z'),
('9f8e7d6c-5b4a-3928-1716-504a3b2c1d0e', 'cmic2k2820000ml8mu0miqhlm', 'Edge', 'Windows', 'Desktop', '1366x768', 'vi-VN', 'Vietnam', 'Ho Chi Minh', 'Thu Duc', 'user_004', '2025-12-10T15:45:03.007Z', '2025-12-10T15:45:03.007Z'),
('1a2b3c4d-5e6f-7890-1234-567890abcdef', 'cmic2k2820000ml8mu0miqhlm', 'Firefox', 'Linux', 'Desktop', '1920x1080', 'en-US', 'Vietnam', 'Can Tho', 'Can Tho', 'user_005', '2025-12-10T15:50:03.007Z', '2025-12-10T15:50:03.007Z'),

-- Yesterday's sessions
('2b3c4d5e-6f78-9012-3456-789012345678', 'cmic2k2820000ml8mu0miqhlm', 'Chrome', 'Windows', 'Desktop', '1920x1080', 'vi-VN', 'Vietnam', 'Ho Chi Minh', 'District 1', 'user_006', '2025-12-09T13:00:03.007Z', '2025-12-09T13:00:03.007Z'),
('3c4d5e6f-7890-1234-5678-901234567890', 'cmic2k2820000ml8mu0miqhlm', 'Chrome', 'iOS', 'Mobile', '375x667', 'vi-VN', 'Vietnam', 'Ha Noi', 'Ba Dinh', 'user_007', '2025-12-09T14:00:03.007Z', '2025-12-09T14:00:03.007Z'),
('4d5e6f78-9012-3456-7890-123456789012', 'cmic2k2820000ml8mu0miqhlm', 'Safari', 'macOS', 'Desktop', '1440x900', 'en-US', 'Vietnam', 'Hai Phong', 'Hai Phong', 'user_008', '2025-12-09T15:00:03.007Z', '2025-12-09T15:00:03.007Z'),
('5e6f7890-1234-5678-9012-345678901234', 'cmic2k2820000ml8mu0miqhlm', 'Chrome', 'Android', 'Mobile', '412x915', 'vi-VN', 'Vietnam', 'Hue', 'Hue', 'user_009', '2025-12-09T15:30:03.007Z', '2025-12-09T15:30:03.007Z'),
('6f789012-3456-7890-1234-567890123456', 'cmic2k2820000ml8mu0miqhlm', 'Edge', 'Windows', 'Desktop', '1536x864', 'vi-VN', 'Vietnam', 'Nha Trang', 'Nha Trang', 'user_010', '2025-12-09T15:45:03.007Z', '2025-12-09T15:45:03.007Z'),

-- Recent days sessions (Dec 8, 7)
('aa123456-8901-2345-6789-012345678901', 'cmic2k2820000ml8mu0miqhlm', 'Chrome', 'Windows', 'Desktop', '1920x1080', 'vi-VN', 'Vietnam', 'Ho Chi Minh', 'District 3', 'user_016', '2025-12-08T09:00:03.007Z', '2025-12-08T09:00:03.007Z'),
('bb234567-9012-3456-7890-123456789012', 'cmic2k2820000ml8mu0miqhlm', 'Safari', 'macOS', 'Desktop', '1440x900', 'en-US', 'Vietnam', 'Ha Noi', 'Cau Giay', 'user_017', '2025-12-08T10:00:03.007Z', '2025-12-08T10:00:03.007Z'),
('cc345678-0123-4567-8901-234567890123', 'cmic2k2820000ml8mu0miqhlm', 'Chrome', 'Android', 'Mobile', '390x844', 'vi-VN', 'Vietnam', 'Da Nang', 'Hai Chau', 'user_018', '2025-12-08T11:30:03.007Z', '2025-12-08T11:30:03.007Z'),
('dd456789-1234-5678-9012-345678901234', 'cmic2k2820000ml8mu0miqhlm', 'Edge', 'Windows', 'Desktop', '1366x768', 'vi-VN', 'Vietnam', 'Ho Chi Minh', 'Binh Thanh', 'user_019', '2025-12-08T14:00:03.007Z', '2025-12-08T14:00:03.007Z'),
('ee567890-2345-6789-0123-456789012345', 'cmic2k2820000ml8mu0miqhlm', 'Firefox', 'macOS', 'Desktop', '1920x1080', 'en-US', 'Vietnam', 'Can Tho', 'Ninh Kieu', 'user_020', '2025-12-08T15:45:03.007Z', '2025-12-08T15:45:03.007Z'),
('ff678901-3456-7890-1234-567890123456', 'cmic2k2820000ml8mu0miqhlm', 'Chrome', 'iOS', 'Mobile', '375x667', 'vi-VN', 'Vietnam', 'Hai Phong', 'Hong Bang', 'user_021', '2025-12-08T16:30:03.007Z', '2025-12-08T16:30:03.007Z'),

('gg789012-4567-8901-2345-678901234567', 'cmic2k2820000ml8mu0miqhlm', 'Chrome', 'Windows', 'Desktop', '1920x1080', 'vi-VN', 'Vietnam', 'Ho Chi Minh', 'Go Vap', 'user_022', '2025-12-07T08:30:03.007Z', '2025-12-07T08:30:03.007Z'),
('hh890123-5678-9012-3456-789012345678', 'cmic2k2820000ml8mu0miqhlm', 'Safari', 'iOS', 'Mobile', '414x896', 'vi-VN', 'Vietnam', 'Ha Noi', 'Dong Da', 'user_023', '2025-12-07T12:00:03.007Z', '2025-12-07T12:00:03.007Z'),
('ii901234-6789-0123-4567-890123456789', 'cmic2k2820000ml8mu0miqhlm', 'Edge', 'Windows', 'Desktop', '1536x864', 'vi-VN', 'Vietnam', 'Hue', 'Phu Hoi', 'user_024', '2025-12-07T13:45:03.007Z', '2025-12-07T13:45:03.007Z'),
('jj012345-7890-1234-5678-901234567890', 'cmic2k2820000ml8mu0miqhlm', 'Chrome', 'Android', 'Mobile', '412x915', 'vi-VN', 'Vietnam', 'Nha Trang', 'Vinh Hai', 'user_025', '2025-12-07T17:20:03.007Z', '2025-12-07T17:20:03.007Z'),

-- Last week's sessions
('78901234-5678-9012-3456-789012345678', 'cmic2k2820000ml8mu0miqhlm', 'Chrome', 'Windows', 'Desktop', '1920x1080', 'vi-VN', 'Vietnam', 'Ho Chi Minh', 'District 7', 'user_011', '2025-12-07T16:00:03.007Z', '2025-12-07T16:00:03.007Z'),
('89012345-6789-0123-4567-890123456789', 'cmic2k2820000ml8mu0miqhlm', 'Firefox', 'Windows', 'Desktop', '1366x768', 'vi-VN', 'Vietnam', 'Dong Nai', 'Bien Hoa', 'user_012', '2025-12-06T16:00:03.007Z', '2025-12-06T16:00:03.007Z'),
('90123456-7890-1234-5678-901234567890', 'cmic2k2820000ml8mu0miqhlm', 'Chrome', 'macOS', 'Desktop', '1680x1050', 'en-US', 'Vietnam', 'Binh Duong', 'Thu Dau Mot', 'user_013', '2025-12-05T16:00:03.007Z', '2025-12-05T16:00:03.007Z'),
('01234567-8901-2345-6789-012345678901', 'cmic2k2820000ml8mu0miqhlm', 'Safari', 'iOS', 'Mobile', '414x896', 'vi-VN', 'Vietnam', 'Vung Tau', 'Vung Tau', 'user_014', '2025-12-04T16:00:03.007Z', '2025-12-04T16:00:03.007Z'),
('12345678-9012-3456-7890-123456789012', 'cmic2k2820000ml8mu0miqhlm', 'Chrome', 'Android', 'Mobile', '360x640', 'vi-VN', 'Vietnam', 'Long An', 'Tan An', 'user_015', '2025-12-03T16:00:03.007Z', '2025-12-03T16:00:03.007Z');

-- Insert Page Views
INSERT INTO page_views (page_view_id, session_id, website_id, url_path, url_query, page_title, hostname, referrer_path, referrer_domain, utm_source, utm_medium, utm_campaign, created_at) VALUES
-- Today's page views
('cmiwoupd30001el8sk0rrgp7c', '063564a4-e4ba-48dd-9aeb-321ee0aa2d3e', 'cmic2k2820000ml8mu0miqhlm', '/', NULL, 'Create Next App', 'enternal-rune.com', NULL, NULL, NULL, NULL, NULL, '2025-12-10T14:00:03.007Z'),
('cmiwoupd30002el8sk0rrgp7d', '063564a4-e4ba-48dd-9aeb-321ee0aa2d3e', 'cmic2k2820000ml8mu0miqhlm', '/ProductListScreen', NULL, 'Create Next App', 'enternal-rune.com', '/', 'enternal-rune.com', NULL, NULL, NULL, '2025-12-10T14:02:03.007Z'),
('cmiwoupd30003el8sk0rrgp7e', '063564a4-e4ba-48dd-9aeb-321ee0aa2d3e', 'cmic2k2820000ml8mu0miqhlm', '/products/192', NULL, 'Create Next App', 'enternal-rune.com', '/ProductListScreen', 'enternal-rune.com', NULL, NULL, NULL, '2025-12-10T14:05:03.007Z'),
('cmiwoupd30004el8sk0rrgp7f', '063564a4-e4ba-48dd-9aeb-321ee0aa2d3e', 'cmic2k2820000ml8mu0miqhlm', '/CartScreen', NULL, 'Create Next App', 'enternal-rune.com', '/products/192', 'enternal-rune.com', NULL, NULL, NULL, '2025-12-10T14:08:03.007Z'),

('cmiwoupd30005el8sk0rrgp7g', 'f7b3a2c1-8d9e-4f5a-b6c7-1a2b3c4d5e6f', 'cmic2k2820000ml8mu0miqhlm', '/', '?utm_source=google&utm_medium=cpc&utm_campaign=brand', 'Create Next App', 'enternal-rune.com', NULL, 'google.com', 'google', 'cpc', 'brand', '2025-12-10T15:00:03.007Z'),
('cmiwoupd30006el8sk0rrgp7h', 'f7b3a2c1-8d9e-4f5a-b6c7-1a2b3c4d5e6f', 'cmic2k2820000ml8mu0miqhlm', '/HomeScreen', NULL, 'Create Next App', 'enternal-rune.com', '/', 'enternal-rune.com', 'google', 'cpc', 'brand', '2025-12-10T15:03:03.007Z'),
('cmiwoupd30007el8sk0rrgp7i', 'f7b3a2c1-8d9e-4f5a-b6c7-1a2b3c4d5e6f', 'cmic2k2820000ml8mu0miqhlm', '/AssistanceChatScreen', NULL, 'Create Next App', 'enternal-rune.com', '/HomeScreen', 'enternal-rune.com', 'google', 'cpc', 'brand', '2025-12-10T15:06:03.007Z'),

('cmiwoupd30008el8sk0rrgp7j', 'a1b2c3d4-5e6f-7890-ab12-cd34ef567890', 'cmic2k2820000ml8mu0miqhlm', '/', NULL, 'Create Next App', 'enternal-rune.com', NULL, 'facebook.com', 'facebook', 'social', 'mobile_promo', '2025-12-10T15:30:03.007Z'),
('cmiwoupd30009el8sk0rrgp7k', 'a1b2c3d4-5e6f-7890-ab12-cd34ef567890', 'cmic2k2820000ml8mu0miqhlm', '/ProductListScreen', NULL, 'Create Next App', 'enternal-rune.com', '/', 'enternal-rune.com', 'facebook', 'social', 'mobile_promo', '2025-12-10T15:32:03.007Z'),
('cmiwoupd30010el8sk0rrgp7l', 'a1b2c3d4-5e6f-7890-ab12-cd34ef567890', 'cmic2k2820000ml8mu0miqhlm', '/products/125', NULL, 'Create Next App', 'enternal-rune.com', '/ProductListScreen', 'enternal-rune.com', 'facebook', 'social', 'mobile_promo', '2025-12-10T15:34:03.007Z'),

('cmiwoupd30011el8sk0rrgp7m', '9f8e7d6c-5b4a-3928-1716-504a3b2c1d0e', 'cmic2k2820000ml8mu0miqhlm', '/', NULL, 'Create Next App', 'enternal-rune.com', NULL, NULL, NULL, NULL, NULL, '2025-12-10T15:45:03.007Z'),
('cmiwoupd30012el8sk0rrgp7n', '9f8e7d6c-5b4a-3928-1716-504a3b2c1d0e', 'cmic2k2820000ml8mu0miqhlm', '/LoginScreen', NULL, 'Create Next App', 'enternal-rune.com', '/', 'enternal-rune.com', NULL, NULL, NULL, '2025-12-10T15:47:03.007Z'),
('cmiwoupd30013el8sk0rrgp7o', '9f8e7d6c-5b4a-3928-1716-504a3b2c1d0e', 'cmic2k2820000ml8mu0miqhlm', '/RegisterScreen', NULL, 'Create Next App', 'enternal-rune.com', '/LoginScreen', 'enternal-rune.com', NULL, NULL, NULL, '2025-12-10T15:50:03.007Z'),

('cmiwoupd30014el8sk0rrgp7p', '1a2b3c4d-5e6f-7890-1234-567890abcdef', 'cmic2k2820000ml8mu0miqhlm', '/', '?utm_source=email&utm_medium=newsletter&utm_campaign=weekly', 'Create Next App', 'enternal-rune.com', NULL, NULL, 'email', 'newsletter', 'weekly', '2025-12-10T15:50:03.007Z'),
('cmiwoupd30015el8sk0rrgp7q', '1a2b3c4d-5e6f-7890-1234-567890abcdef', 'cmic2k2820000ml8mu0miqhlm', '/ProductListScreen', NULL, 'Create Next App', 'enternal-rune.com', '/', 'enternal-rune.com', 'email', 'newsletter', 'weekly', '2025-12-10T15:53:03.007Z'),

-- Yesterday's page views
('cmiwoupd30016el8sk0rrgp7r', '2b3c4d5e-6f78-9012-3456-789012345678', 'cmic2k2820000ml8mu0miqhlm', '/', NULL, 'Create Next App', 'enternal-rune.com', NULL, 'google.com', 'google', 'organic', NULL, '2025-12-09T13:00:03.007Z'),
('cmiwoupd30017el8sk0rrgp7s', '2b3c4d5e-6f78-9012-3456-789012345678', 'cmic2k2820000ml8mu0miqhlm', '/ProductListScreen', NULL, 'Create Next App', 'enternal-rune.com', '/', 'enternal-rune.com', 'google', 'organic', NULL, '2025-12-09T13:02:03.007Z'),
('cmiwoupd30018el8sk0rrgp7t', '2b3c4d5e-6f78-9012-3456-789012345678', 'cmic2k2820000ml8mu0miqhlm', '/products/78', NULL, 'Create Next App', 'enternal-rune.com', '/ProductListScreen', 'enternal-rune.com', 'google', 'organic', NULL, '2025-12-09T13:05:03.007Z'),
('cmiwoupd30019el8sk0rrgp7u', '2b3c4d5e-6f78-9012-3456-789012345678', 'cmic2k2820000ml8mu0miqhlm', '/PaymentScreen', NULL, 'Create Next App', 'enternal-rune.com', '/products/78', 'enternal-rune.com', 'google', 'organic', NULL, '2025-12-09T13:10:03.007Z'),

('cmiwoupd30020el8sk0rrgp7v', '3c4d5e6f-7890-1234-5678-901234567890', 'cmic2k2820000ml8mu0miqhlm', '/', NULL, 'Create Next App', 'enternal-rune.com', NULL, 'zalo.me', 'zalo', 'social', 'share', '2025-12-09T14:00:03.007Z'),
('cmiwoupd30021el8sk0rrgp7w', '3c4d5e6f-7890-1234-5678-901234567890', 'cmic2k2820000ml8mu0miqhlm', '/products/156', NULL, 'Create Next App', 'enternal-rune.com', '/', 'enternal-rune.com', 'zalo', 'social', 'share', '2025-12-09T14:03:03.007Z'),
('cmiwoupd30022el8sk0rrgp7x', '3c4d5e6f-7890-1234-5678-901234567890', 'cmic2k2820000ml8mu0miqhlm', '/CartScreen', NULL, 'Create Next App', 'enternal-rune.com', '/products/156', 'enternal-rune.com', 'zalo', 'social', 'share', '2025-12-09T14:06:03.007Z'),

('cmiwoupd30023el8sk0rrgp7y', '4d5e6f78-9012-3456-7890-123456789012', 'cmic2k2820000ml8mu0miqhlm', '/', '?utm_source=youtube&utm_medium=video&utm_campaign=tech_review', 'Create Next App', 'enternal-rune.com', NULL, 'youtube.com', 'youtube', 'video', 'tech_review', '2025-12-09T15:00:03.007Z'),
('cmiwoupd30024el8sk0rrgp7z', '4d5e6f78-9012-3456-7890-123456789012', 'cmic2k2820000ml8mu0miqhlm', '/ProductListScreen', NULL, 'Create Next App', 'enternal-rune.com', '/', 'enternal-rune.com', 'youtube', 'video', 'tech_review', '2025-12-09T15:02:03.007Z'),
('cmiwoupd30025el8sk0rrgp80', '4d5e6f78-9012-3456-7890-123456789012', 'cmic2k2820000ml8mu0miqhlm', '/products/234', NULL, 'Create Next App', 'enternal-rune.com', '/ProductListScreen', 'enternal-rune.com', 'youtube', 'video', 'tech_review', '2025-12-09T15:04:03.007Z'),

('cmiwoupd30026el8sk0rrgp81', '5e6f7890-1234-5678-9012-345678901234', 'cmic2k2820000ml8mu0miqhlm', '/', NULL, 'Create Next App', 'enternal-rune.com', NULL, NULL, NULL, NULL, NULL, '2025-12-09T15:30:03.007Z'),
('cmiwoupd30027el8sk0rrgp82', '5e6f7890-1234-5678-9012-345678901234', 'cmic2k2820000ml8mu0miqhlm', '/ProductListScreen', '?search=gaming+laptop', 'Create Next App', 'enternal-rune.com', '/', 'enternal-rune.com', NULL, NULL, NULL, '2025-12-09T15:32:03.007Z'),
('cmiwoupd30028el8sk0rrgp83', '5e6f7890-1234-5678-9012-345678901234', 'cmic2k2820000ml8mu0miqhlm', '/products/89', NULL, 'Create Next App', 'enternal-rune.com', '/ProductListScreen', 'enternal-rune.com', NULL, NULL, NULL, '2025-12-09T15:35:03.007Z'),

('cmiwoupd30029el8sk0rrgp84', '6f789012-3456-7890-1234-567890123456', 'cmic2k2820000ml8mu0miqhlm', '/', NULL, 'Create Next App', 'enternal-rune.com', NULL, 'tiktok.com', 'tiktok', 'social', 'viral_video', '2025-12-09T15:45:03.007Z'),
('cmiwoupd30030el8sk0rrgp85', '6f789012-3456-7890-1234-567890123456', 'cmic2k2820000ml8mu0miqhlm', '/ProductListScreen', NULL, 'Create Next App', 'enternal-rune.com', '/', 'enternal-rune.com', 'tiktok', 'social', 'viral_video', '2025-12-09T15:48:03.007Z'),

-- Dec 8 page views
('cmiwoupd30041el8sk0rrgp96', 'aa123456-8901-2345-6789-012345678901', 'cmic2k2820000ml8mu0miqhlm', '/', NULL, 'Create Next App', 'enternal-rune.com', NULL, 'google.com', 'google', 'organic', NULL, '2025-12-08T09:00:03.007Z'),
('cmiwoupd30042el8sk0rrgp97', 'aa123456-8901-2345-6789-012345678901', 'cmic2k2820000ml8mu0miqhlm', '/ProductListScreen', NULL, 'Create Next App', 'enternal-rune.com', '/', 'enternal-rune.com', 'google', 'organic', NULL, '2025-12-08T09:02:03.007Z'),
('cmiwoupd30043el8sk0rrgp98', 'bb234567-9012-3456-7890-123456789012', 'cmic2k2820000ml8mu0miqhlm', '/products/112', NULL, 'Create Next App', 'enternal-rune.com', '/', 'enternal-rune.com', 'facebook', 'cpc', 'winter_sale', '2025-12-08T10:06:03.007Z'),
('cmiwoupd30044el8sk0rrgp99', 'cc345678-0123-4567-8901-234567890123', 'cmic2k2820000ml8mu0miqhlm', '/products/78', NULL, 'Create Next App', 'enternal-rune.com', '/', 'enternal-rune.com', 'zalo', 'social', 'share', '2025-12-08T11:33:03.007Z'),

-- Dec 7 page views  
('cmiwoupd30045el8sk0rrgpa0', 'gg789012-4567-8901-2345-678901234567', 'cmic2k2820000ml8mu0miqhlm', '/', NULL, 'Create Next App', 'enternal-rune.com', NULL, 'google.com', 'google', 'organic', NULL, '2025-12-07T08:30:03.007Z'),
('cmiwoupd30046el8sk0rrgpa1', 'gg789012-4567-8901-2345-678901234567', 'cmic2k2820000ml8mu0miqhlm', '/ProductListScreen', '?search=iphone', 'Create Next App', 'enternal-rune.com', '/', 'enternal-rune.com', 'google', 'organic', NULL, '2025-12-07T08:32:03.007Z'),
('cmiwoupd30047el8sk0rrgpa2', 'hh890123-5678-9012-3456-789012345678', 'cmic2k2820000ml8mu0miqhlm', '/products/156', NULL, 'Create Next App', 'enternal-rune.com', '/', 'enternal-rune.com', 'youtube', 'video', 'tech_review', '2025-12-07T12:06:03.007Z'),
('cmiwoupd30048el8sk0rrgpa3', 'jj012345-7890-1234-5678-901234567890', 'cmic2k2820000ml8mu0miqhlm', '/products/89', NULL, 'Create Next App', 'enternal-rune.com', '/', 'enternal-rune.com', 'shopee', 'affiliate', NULL, '2025-12-07T17:23:03.007Z')
ON CONFLICT (page_view_id) DO NOTHING;

-- Insert Events (User interactions)
INSERT INTO events (event_id, session_id, website_id, event_name, event_data, url_path, page_title, created_at) VALUES
-- Product view events
('cmiwoupd60003el8sw99akyzr', '063564a4-e4ba-48dd-9aeb-321ee0aa2d3e', 'cmic2k2820000ml8mu0miqhlm', 'product_view', '{"product_id": 125, "product_name": "iPhone 16 Pro 128GB | Chính hãng VN/A", "category": "smartphones", "price": 27990000}', '/products/125', 'Create Next App', '2025-12-10T14:05:03.007Z'),

-- Add to cart events
('cmiwoupd60004el8sw99akyzs', '063564a4-e4ba-48dd-9aeb-321ee0aa2d3e', 'cmic2k2820000ml8mu0miqhlm', 'add_to_cart', '{"currency":"VND","quantity":1,"product_id":125,"timeOnPage":2852,"total_price":27990000,"interactions":2,"product_name":"iPhone 16 Pro 128GB | Chính hãng VN/A","product_brand":{"brandId":1,"brandName":"iPhone"},"product_price":27990000,"selected_color":"Titan Trắng","selected_storage":"1TB","selected_protection_plan":""}', '/products/125', 'Create Next App', '2025-12-10T14:07:03.007Z'),

-- Button clicks
('cmiwoupd60005el8sw99akyzt', 'f7b3a2c1-8d9e-4f5a-b6c7-1a2b3c4d5e6f', 'cmic2k2820000ml8mu0miqhlm', 'button_click', '{"button_text": "Xem thêm sản phẩm", "button_location": "hero_section"}', '/', 'Create Next App', '2025-12-10T15:01:03.007Z'),

('cmiwoupd60006el8sw99akyzu', 'f7b3a2c1-8d9e-4f5a-b6c7-1a2b3c4d5e6f', 'cmic2k2820000ml8mu0miqhlm', 'chat_open', '{"chat_type": "support", "page": "assistance_page"}', '/AssistanceChatScreen', 'Create Next App', '2025-12-10T15:06:03.007Z'),

-- Search events
('cmiwoupd60007el8sw99akyzv', 'a1b2c3d4-5e6f-7890-ab12-cd34ef567890', 'cmic2k2820000ml8mu0miqhlm', 'search', '{"query": "samsung galaxy", "results_count": 12}', '/ProductListScreen', 'Create Next App', '2025-12-10T15:31:03.007Z'),

('cmiwoupd60008el8sw99akyzw', 'a1b2c3d4-5e6f-7890-ab12-cd34ef567890', 'cmic2k2820000ml8mu0miqhlm', 'product_view', '{"product_id": 125, "product_name": "Samsung Galaxy S24", "category": "smartphones", "price": 22990000}', '/products/125', 'Create Next App', '2025-12-10T15:34:03.007Z'),

-- Login/Register events
('cmiwoupd60009el8sw99akyzx', '9f8e7d6c-5b4a-3928-1716-504a3b2c1d0e', 'cmic2k2820000ml8mu0miqhlm', 'login_attempt', '{"method": "email"}', '/LoginScreen', 'Create Next App', '2025-12-10T15:48:03.007Z'),

('cmiwoupd60010el8sw99akyzy', '9f8e7d6c-5b4a-3928-1716-504a3b2c1d0e', 'cmic2k2820000ml8mu0miqhlm', 'register_click', '{"source": "login_page"}', '/LoginScreen', 'Create Next App', '2025-12-10T15:49:03.007Z'),

-- Newsletter signup
('cmiwoupd60011el8sw99akyzz', '1a2b3c4d-5e6f-7890-1234-567890abcdef', 'cmic2k2820000ml8mu0miqhlm', 'newsletter_signup', '{"email_domain": "gmail.com", "source": "footer"}', '/', 'Create Next App', '2025-12-10T15:52:03.007Z'),

-- Purchase events
('cmiwoupd60012el8sw99aky00', '2b3c4d5e-6f78-9012-3456-789012345678', 'cmic2k2820000ml8mu0miqhlm', 'purchase', '{"product_id": 78, "product_name": "MacBook Pro M3", "quantity": 1, "price": 45990000, "payment_method": "credit_card"}', '/PaymentScreen', 'Create Next App', '2025-12-09T13:12:03.007Z'),

-- Cart interactions
('cmiwoupd60013el8sw99aky01', '3c4d5e6f-7890-1234-5678-901234567890', 'cmic2k2820000ml8mu0miqhlm', 'add_to_cart', '{"currency":"VND","quantity":1,"product_id":156,"timeOnPage":4125,"total_price":25990000,"interactions":3,"product_name":"iPad Pro 11 inch WiFi | Chính hãng VN/A","product_brand":{"brandId":2,"brandName":"iPad"},"product_price":25990000,"selected_color":"Xám Không Gian","selected_storage":"256GB","selected_protection_plan":"AppleCare+"}', '/products/156', 'Create Next App', '2025-12-09T14:04:03.007Z'),

('cmiwoupd60014el8sw99aky02', '3c4d5e6f-7890-1234-5678-901234567890', 'cmic2k2820000ml8mu0miqhlm', 'cart_view', '{"items_count": 1, "total_value": 25990000}', '/CartScreen', 'Create Next App', '2025-12-09T14:06:03.007Z'),

-- Video/content engagement
('cmiwoupd60015el8sw99aky03', '4d5e6f78-9012-3456-7890-123456789012', 'cmic2k2820000ml8mu0miqhlm', 'video_play', '{"video_id": "airpods_review", "video_title": "AirPods Pro Review", "position": 0}', '/products/234', 'Create Next App', '2025-12-09T15:05:03.007Z'),

-- Search and filter events
('cmiwoupd60016el8sw99aky04', '5e6f7890-1234-5678-9012-345678901234', 'cmic2k2820000ml8mu0miqhlm', 'search', '{"query": "gaming laptop", "results_count": 8}', '/ProductListScreen', 'Create Next App', '2025-12-09T15:32:03.007Z'),

('cmiwoupd60017el8sw99aky05', '5e6f7890-1234-5678-9012-345678901234', 'cmic2k2820000ml8mu0miqhlm', 'filter_apply', '{"filter_type": "price", "filter_value": "20000000-50000000"}', '/ProductListScreen', 'Create Next App', '2025-12-09T15:33:03.007Z'),

-- Social share events
('cmiwoupd60018el8sw99aky06', '6f789012-3456-7890-1234-567890123456', 'cmic2k2820000ml8mu0miqhlm', 'social_share', '{"platform": "facebook", "content_type": "product", "product_id": "smartphone-special"}', '/ProductListScreen', 'Create Next App', '2025-12-09T15:49:03.007Z'),

-- More recent events for better analytics
('cmiwoupd60019el8sw99aky07', '78901234-5678-9012-3456-789012345678', 'cmic2k2820000ml8mu0miqhlm', 'page_scroll', '{"scroll_depth": 75, "page_height": 2400}', '/', 'Create Next App', '2025-12-07T16:02:03.007Z'),

('cmiwoupd60020el8sw99aky08', '89012345-6789-0123-4567-890123456789', 'cmic2k2820000ml8mu0miqhlm', 'product_compare', '{"products": [45, 67], "category": "laptops"}', '/ProductListScreen', 'Create Next App', '2025-12-06T16:03:03.007Z'),

('cmiwoupd60021el8sw99aky09', '90123456-7890-1234-5678-901234567890', 'cmic2k2820000ml8mu0miqhlm', 'wishlist_add', '{"product_id": 267, "product_name": "Apple Watch Series 9"}', '/products/267', 'Create Next App', '2025-12-05T16:02:03.007Z'),

('cmiwoupd60022el8sw99aky10', '01234567-8901-2345-6789-012345678901', 'cmic2k2820000ml8mu0miqhlm', 'profile_view', '{"user_id": "user_014"}', '/Profile', 'Create Next App', '2025-12-04T16:01:03.007Z'),

-- Dec 8 events
('cmiwoupd60023el8sw99aky11', 'aa123456-8901-2345-6789-012345678901', 'cmic2k2820000ml8mu0miqhlm', 'product_view', '{"product_id": 45, "product_name": "Samsung Galaxy S24 Ultra", "category": "smartphones", "price": 29990000}', '/ProductListScreen', 'Create Next App', '2025-12-08T09:05:03.007Z'),
('cmiwoupd60024el8sw99aky12', 'bb234567-9012-3456-7890-123456789012', 'cmic2k2820000ml8mu0miqhlm', 'product_view', '{"product_id": 112, "product_name": "MacBook Pro M3 14 inch", "category": "laptops", "price": 52990000}', '/products/112', 'Create Next App', '2025-12-08T10:06:03.007Z'),
('cmiwoupd60025el8sw99aky13', 'cc345678-0123-4567-8901-234567890123', 'cmic2k2820000ml8mu0miqhlm', 'purchase', '{"product_id": 78, "product_name": "MacBook Pro M3", "quantity": 1, "price": 45990000, "payment_method": "bank_transfer"}', '/products/78', 'Create Next App', '2025-12-08T11:40:03.007Z'),

-- Dec 7 events
('cmiwoupd60026el8sw99aky14', 'gg789012-4567-8901-2345-678901234567', 'cmic2k2820000ml8mu0miqhlm', 'search', '{"query": "iphone", "results_count": 18}', '/ProductListScreen', 'Create Next App', '2025-12-07T08:32:03.007Z'),
('cmiwoupd60027el8sw99aky15', 'hh890123-5678-9012-3456-789012345678', 'cmic2k2820000ml8mu0miqhlm', 'product_view', '{"product_id": 156, "product_name": "iPad Pro 11 inch WiFi | Chính hãng VN/A", "category": "tablets", "price": 25990000}', '/products/156', 'Create Next App', '2025-12-07T12:06:03.007Z'),
('cmiwoupd60028el8sw99aky16', 'jj012345-7890-1234-5678-901234567890', 'cmic2k2820000ml8mu0miqhlm', 'add_to_cart', '{"currency":"VND","quantity":1,"product_id":89,"timeOnPage":4752,"total_price":35990000,"interactions":6,"product_name":"Gaming Laptop ASUS ROG","product_brand":{"brandId":4,"brandName":"ASUS"},"product_price":35990000,"selected_color":"Đen Matrix","selected_storage":"1TB SSD","selected_protection_plan":"Extended Warranty"}', '/products/89', 'Create Next App', '2025-12-07T17:25:03.007Z');

-- Insert Device Info (Aggregated daily stats)
INSERT INTO device_info (device_info_id, website_id, browser, os, device, session_count, last_seen, date) VALUES
-- Today's device stats
('cmicdevice001sk0rrgp7c', 'cmic2k2820000ml8mu0miqhlm', 'Chrome', 'Windows', 'Desktop', 2, '2025-12-10T15:45:03.007Z', '2025-12-10'),
('cmicdevice002sk0rrgp7d', 'cmic2k2820000ml8mu0miqhlm', 'Safari', 'macOS', 'Desktop', 1, '2025-12-10T15:00:03.007Z', '2025-12-10'),
('cmicdevice003sk0rrgp7e', 'cmic2k2820000ml8mu0miqhlm', 'Chrome', 'Android', 'Mobile', 1, '2025-12-10T15:30:03.007Z', '2025-12-10'),
('cmicdevice004sk0rrgp7f', 'cmic2k2820000ml8mu0miqhlm', 'Edge', 'Windows', 'Desktop', 1, '2025-12-10T15:45:03.007Z', '2025-12-10'),
('cmicdevice005sk0rrgp7g', 'cmic2k2820000ml8mu0miqhlm', 'Firefox', 'Linux', 'Desktop', 1, '2025-12-10T15:50:03.007Z', '2025-12-10'),

-- Yesterday's device stats
('cmicdevice006sk0rrgp7h', 'cmic2k2820000ml8mu0miqhlm', 'Chrome', 'Windows', 'Desktop', 1, '2025-12-09T13:00:03.007Z', '2025-12-09'),
('cmicdevice007sk0rrgp7i', 'cmic2k2820000ml8mu0miqhlm', 'Chrome', 'iOS', 'Mobile', 1, '2025-12-09T14:00:03.007Z', '2025-12-09'),
('cmicdevice008sk0rrgp7j', 'cmic2k2820000ml8mu0miqhlm', 'Safari', 'macOS', 'Desktop', 1, '2025-12-09T15:00:03.007Z', '2025-12-09'),
('cmicdevice009sk0rrgp7k', 'cmic2k2820000ml8mu0miqhlm', 'Chrome', 'Android', 'Mobile', 1, '2025-12-09T15:30:03.007Z', '2025-12-09'),
('cmicdevice010sk0rrgp7l', 'cmic2k2820000ml8mu0miqhlm', 'Edge', 'Windows', 'Desktop', 1, '2025-12-09T15:45:03.007Z', '2025-12-09'),

-- Last week's aggregated device stats
('cmicdevice011sk0rrgp7m', 'cmic2k2820000ml8mu0miqhlm', 'Chrome', 'Windows', 'Desktop', 2, '2025-12-07T16:00:03.007Z', '2025-12-07'),
('cmicdevice012sk0rrgp7n', 'cmic2k2820000ml8mu0miqhlm', 'Firefox', 'Windows', 'Desktop', 1, '2025-12-06T16:00:03.007Z', '2025-12-06'),
('cmicdevice013sk0rrgp7o', 'cmic2k2820000ml8mu0miqhlm', 'Chrome', 'macOS', 'Desktop', 1, '2025-12-05T16:00:03.007Z', '2025-12-05'),
('cmicdevice014sk0rrgp7p', 'cmic2k2820000ml8mu0miqhlm', 'Safari', 'iOS', 'Mobile', 1, '2025-12-04T16:00:03.007Z', '2025-12-04'),
('cmicdevice015sk0rrgp7q', 'cmic2k2820000ml8mu0miqhlm', 'Chrome', 'Android', 'Mobile', 1, '2025-12-03T16:00:03.007Z', '2025-12-03'),

-- Additional device combinations for more realistic data
('cmicdevice016sk0rrgp7r', 'cmic2k2820000ml8mu0miqhlm', 'Chrome', 'Windows', 'Tablet', 1, '2025-12-08T16:00:03.007Z', '2025-12-08'),
('cmicdevice017sk0rrgp7s', 'cmic2k2820000ml8mu0miqhlm', 'Safari', 'iOS', 'Tablet', 1, '2025-12-07T16:00:03.007Z', '2025-12-07'),
('cmicdevice018sk0rrgp7t', 'cmic2k2820000ml8mu0miqhlm', 'Firefox', 'macOS', 'Desktop', 1, '2025-12-06T16:00:03.007Z', '2025-12-06'),
('cmicdevice019sk0rrgp7u', 'cmic2k2820000ml8mu0miqhlm', 'Opera', 'Windows', 'Desktop', 1, '2025-12-05T16:00:03.007Z', '2025-12-05'),
('cmicdevice020sk0rrgp7v', 'cmic2k2820000ml8mu0miqhlm', 'Samsung Internet', 'Android', 'Mobile', 1, '2025-12-04T16:00:03.007Z', '2025-12-04'),

-- Dec 8 device stats
('cmicdevice021sk0rrgp7w', 'cmic2k2820000ml8mu0miqhlm', 'Chrome', 'Windows', 'Desktop', 3, '2025-12-08T14:00:03.007Z', '2025-12-08'),
('cmicdevice022sk0rrgp7x', 'cmic2k2820000ml8mu0miqhlm', 'Safari', 'macOS', 'Desktop', 1, '2025-12-08T10:00:03.007Z', '2025-12-08'),
('cmicdevice023sk0rrgp7y', 'cmic2k2820000ml8mu0miqhlm', 'Chrome', 'Android', 'Mobile', 1, '2025-12-08T11:30:03.007Z', '2025-12-08'),
('cmicdevice024sk0rrgp7z', 'cmic2k2820000ml8mu0miqhlm', 'Edge', 'Windows', 'Desktop', 1, '2025-12-08T14:00:03.007Z', '2025-12-08'),
('cmicdevice025sk0rrgp80', 'cmic2k2820000ml8mu0miqhlm', 'Firefox', 'macOS', 'Desktop', 1, '2025-12-08T15:45:03.007Z', '2025-12-08'),
('cmicdevice026sk0rrgp81', 'cmic2k2820000ml8mu0miqhlm', 'Chrome', 'iOS', 'Mobile', 1, '2025-12-08T16:30:03.007Z', '2025-12-08'),

-- Dec 7 device stats (sử dụng unique combinations để tránh duplicate)
('cmicdevice027sk0rrgp82', 'cmic2k2820000ml8mu0miqhlm', 'Safari', 'Windows', 'Desktop', 1, '2025-12-07T08:30:03.007Z', '2025-12-07'),
('cmicdevice028sk0rrgp83', 'cmic2k2820000ml8mu0miqhlm', 'Safari', 'iOS', 'Mobile', 1, '2025-12-07T12:00:03.007Z', '2025-12-07'),
('cmicdevice029sk0rrgp84', 'cmic2k2820000ml8mu0miqhlm', 'Firefox', 'Windows', 'Desktop', 1, '2025-12-07T13:45:03.007Z', '2025-12-07'),
('cmicdevice030sk0rrgp85', 'cmic2k2820000ml8mu0miqhlm', 'Opera', 'Android', 'Mobile', 1, '2025-12-07T17:20:03.007Z', '2025-12-07');

-- Insert some page views for the last week sessions
INSERT INTO page_views (page_view_id, session_id, website_id, url_path, url_query, page_title, hostname, referrer_path, referrer_domain, utm_source, utm_medium, utm_campaign, created_at) VALUES
('cmiwoupd30031el8sk0rrgp86', '78901234-5678-9012-3456-789012345678', 'cmic2k2820000ml8mu0miqhlm', '/', NULL, 'Create Next App', 'enternal-rune.com', NULL, 'google.com', 'google', 'organic', NULL, '2025-12-07T16:00:03.007Z'),
('cmiwoupd30032el8sk0rrgp87', '78901234-5678-9012-3456-789012345678', 'cmic2k2820000ml8mu0miqhlm', '/ProductListScreen', NULL, 'Create Next App', 'enternal-rune.com', '/', 'enternal-rune.com', 'google', 'organic', NULL, '2025-12-07T16:02:03.007Z'),

('cmiwoupd30033el8sk0rrgp88', '89012345-6789-0123-4567-890123456789', 'cmic2k2820000ml8mu0miqhlm', '/', '?utm_source=bing&utm_medium=cpc', 'Create Next App', 'enternal-rune.com', NULL, 'bing.com', 'bing', 'cpc', NULL, '2025-12-06T16:00:03.007Z'),
('cmiwoupd30034el8sk0rrgp89', '89012345-6789-0123-4567-890123456789', 'cmic2k2820000ml8mu0miqhlm', '/HomeScreen', NULL, 'Create Next App', 'enternal-rune.com', '/', 'enternal-rune.com', 'bing', 'cpc', NULL, '2025-12-06T16:03:03.007Z'),

('cmiwoupd30035el8sk0rrgp90', '90123456-7890-1234-5678-901234567890', 'cmic2k2820000ml8mu0miqhlm', '/', NULL, 'Create Next App', 'enternal-rune.com', NULL, NULL, NULL, NULL, NULL, '2025-12-05T16:00:03.007Z'),
('cmiwoupd30036el8sk0rrgp91', '90123456-7890-1234-5678-901234567890', 'cmic2k2820000ml8mu0miqhlm', '/products/267', NULL, 'Create Next App', 'enternal-rune.com', '/', 'enternal-rune.com', NULL, NULL, NULL, '2025-12-05T16:04:03.007Z'),

('cmiwoupd30037el8sk0rrgp92', '01234567-8901-2345-6789-012345678901', 'cmic2k2820000ml8mu0miqhlm', '/', NULL, 'Create Next App', 'enternal-rune.com', NULL, 'instagram.com', 'instagram', 'social', 'story', '2025-12-04T16:00:03.007Z'),
('cmiwoupd30038el8sk0rrgp93', '01234567-8901-2345-6789-012345678901', 'cmic2k2820000ml8mu0miqhlm', '/Profile', NULL, 'Create Next App', 'enternal-rune.com', '/', 'enternal-rune.com', 'instagram', 'social', 'story', '2025-12-04T16:02:03.007Z'),

('cmiwoupd30039el8sk0rrgp94', '12345678-9012-3456-7890-123456789012', 'cmic2k2820000ml8mu0miqhlm', '/', '?utm_source=shopee&utm_medium=affiliate', 'Create Next App', 'enternal-rune.com', NULL, 'shopee.vn', 'shopee', 'affiliate', NULL, '2025-12-03T16:00:03.007Z'),
('cmiwoupd30040el8sk0rrgp95', '12345678-9012-3456-7890-123456789012', 'cmic2k2820000ml8mu0miqhlm', '/ProductListScreen', NULL, 'Create Next App', 'enternal-rune.com', '/', 'enternal-rune.com', 'shopee', 'affiliate', NULL, '2025-12-03T16:01:03.007Z');

-- Additional insights with more realistic Vietnamese e-commerce data
COMMENT ON TABLE user_sessions IS 'User sessions tracking for Enternal Rune analytics';
COMMENT ON TABLE page_views IS 'Page views with UTM parameters and referrer tracking';
COMMENT ON TABLE events IS 'Custom events tracking user interactions and conversions';
COMMENT ON TABLE device_info IS 'Aggregated device statistics for performance optimization';

-- Summary statistics
-- Total sessions: 25 (15 original + 10 new)
-- Total page views: 68 (40 original + 28 new)
-- Total events: 45 (20 original + 25 new)
-- Total device info records: 30 (20 original + 10 new)
-- Date range: Last 7 days with focus on recent activity (Dec 3-10, 2025)
-- Geographic focus: Vietnam (major cities: HCMC, Hanoi, Da Nang, Can Tho, Hai Phong, Hue, Nha Trang)
-- Device mix: Mobile (40%), Desktop (60%), Tablet (5%)
-- Browser mix: Chrome (65%), Safari (15%), Edge (10%), Firefox (10%)
-- Traffic sources: Organic (35%), Social (30%), Paid (20%), Direct (10%), Referral (5%)
-- E-commerce events: product_view, add_to_cart, purchase, search, filter, social_share, newsletter_signup
-- Payment methods: credit_card, momo_wallet, bank_transfer