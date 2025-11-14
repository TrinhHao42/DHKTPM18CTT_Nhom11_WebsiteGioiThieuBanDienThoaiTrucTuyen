-- Fix sequence cho bảng addresses
-- Chạy script này trong PostgreSQL để reset sequence

-- Kiểm tra sequence hiện tại
SELECT currval('addresses_address_id_seq');

-- Reset sequence về giá trị max hiện tại + 1
SELECT setval('addresses_address_id_seq', (SELECT COALESCE(MAX(address_id), 0) + 1 FROM addresses), false);

-- Hoặc dùng lệnh này (tự động tính max)
SELECT setval('addresses_address_id_seq', COALESCE((SELECT MAX(address_id) FROM addresses), 0) + 1);

-- Kiểm tra lại
SELECT currval('addresses_address_id_seq');
