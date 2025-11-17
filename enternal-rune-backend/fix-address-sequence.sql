
-- BƯỚC 5: Reset SEQUENCE cho addresses (PostgreSQL)
-- ===================================================
DO $$
DECLARE
    max_id INT;
    seq_name TEXT;
BEGIN
    RAISE NOTICE '=== Resetting addresses sequence ===';

    -- Lấy max address_id
    SELECT COALESCE(MAX(address_id), 0) INTO max_id FROM addresses;

    -- Tìm tên sequence
    SELECT pg_get_serial_sequence('addresses', 'address_id') INTO seq_name;

    IF seq_name IS NOT NULL THEN
        -- Reset sequence
        EXECUTE format('SELECT setval(%L, %s, true)', seq_name, max_id);
        RAISE NOTICE 'Sequence % reset to %', seq_name, max_id;
    ELSE
        RAISE NOTICE 'No sequence found for addresses.address_id';
    END IF;
END $$;

