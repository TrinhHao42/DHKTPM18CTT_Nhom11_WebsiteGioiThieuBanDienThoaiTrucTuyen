#!/bin/bash
set -e

# This script runs when PostgreSQL container starts
echo "Initializing analytics database..."

# The database 'analytics' is already created by POSTGRES_DB
# This is just for any additional setup if needed
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Enable UUID extension if needed
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    
    -- Grant permissions
    GRANT ALL PRIVILEGES ON DATABASE analytics TO analytics_user;
    
    -- Log completion
    SELECT 'Database initialized successfully' AS status;
EOSQL

echo "Analytics database initialization complete."