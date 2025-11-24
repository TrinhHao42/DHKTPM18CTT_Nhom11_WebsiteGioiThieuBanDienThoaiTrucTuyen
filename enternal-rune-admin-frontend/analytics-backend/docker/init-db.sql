-- Initialize Analytics Database
-- This file is automatically executed when PostgreSQL container starts

-- Create additional extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Create analytics database (already created by environment variable)
-- But we can create additional schemas or users here if needed

-- Create schema for analytics data
CREATE SCHEMA IF NOT EXISTS analytics;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE analytics TO analytics_user;
GRANT ALL PRIVILEGES ON SCHEMA analytics TO analytics_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO analytics_user;

-- Set default permissions for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO analytics_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO analytics_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA analytics GRANT ALL ON TABLES TO analytics_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA analytics GRANT ALL ON SEQUENCES TO analytics_user;

-- Log initialization
SELECT 'Analytics database initialized successfully!' as status;