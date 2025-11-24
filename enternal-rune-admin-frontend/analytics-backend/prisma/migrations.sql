# Migration SQL

Use this SQL to create the analytics tables in your database.

## PostgreSQL

```sql
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Sessions Table
CREATE TABLE user_sessions (
    session_id VARCHAR(36) PRIMARY KEY,
    website_id VARCHAR(36) NOT NULL,
    browser VARCHAR(20),
    os VARCHAR(20),
    device VARCHAR(20),
    screen VARCHAR(11),
    language VARCHAR(35),
    country CHAR(2),
    region CHAR(20),
    city VARCHAR(50),
    distinct_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Page Views Table
CREATE TABLE page_views (
    page_view_id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(36) NOT NULL,
    website_id VARCHAR(36) NOT NULL,
    url_path VARCHAR(500) NOT NULL,
    url_query VARCHAR(500),
    page_title VARCHAR(500),
    hostname VARCHAR(100),
    referrer_path VARCHAR(500),
    referrer_domain VARCHAR(500),
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    utm_campaign VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES user_sessions(session_id)
);

-- Events Table
CREATE TABLE events (
    event_id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(36) NOT NULL,
    website_id VARCHAR(36) NOT NULL,
    event_name VARCHAR(50) NOT NULL,
    event_data JSONB,
    url_path VARCHAR(500),
    page_title VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES user_sessions(session_id)
);

-- Device Info (Aggregated) Table
CREATE TABLE device_info (
    device_info_id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    website_id VARCHAR(36) NOT NULL,
    browser VARCHAR(20) NOT NULL,
    os VARCHAR(20) NOT NULL,
    device VARCHAR(20) NOT NULL,
    session_count INTEGER DEFAULT 1,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date DATE NOT NULL,
    UNIQUE (website_id, browser, os, device, date)
);

-- Websites Table (Optional)
CREATE TABLE websites (
    website_id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    domain VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Performance
CREATE INDEX idx_user_sessions_created_at ON user_sessions(created_at);
CREATE INDEX idx_user_sessions_website_id ON user_sessions(website_id);
CREATE INDEX idx_user_sessions_website_created ON user_sessions(website_id, created_at);
CREATE INDEX idx_user_sessions_distinct_id ON user_sessions(distinct_id);

CREATE INDEX idx_page_views_created_at ON page_views(created_at);
CREATE INDEX idx_page_views_session_id ON page_views(session_id);
CREATE INDEX idx_page_views_website_id ON page_views(website_id);
CREATE INDEX idx_page_views_website_created ON page_views(website_id, created_at);
CREATE INDEX idx_page_views_url_path ON page_views(url_path);
CREATE INDEX idx_page_views_referrer_domain ON page_views(referrer_domain);

CREATE INDEX idx_events_created_at ON events(created_at);
CREATE INDEX idx_events_session_id ON events(session_id);
CREATE INDEX idx_events_website_id ON events(website_id);
CREATE INDEX idx_events_website_created ON events(website_id, created_at);
CREATE INDEX idx_events_event_name ON events(event_name);

CREATE INDEX idx_device_info_website_id ON device_info(website_id);
CREATE INDEX idx_device_info_date ON device_info(date);
```

## MySQL

```sql
-- User Sessions Table
CREATE TABLE user_sessions (
    session_id VARCHAR(36) PRIMARY KEY,
    website_id VARCHAR(36) NOT NULL,
    browser VARCHAR(20),
    os VARCHAR(20),
    device VARCHAR(20),
    screen VARCHAR(11),
    language VARCHAR(35),
    country CHAR(2),
    region CHAR(20),
    city VARCHAR(50),
    distinct_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Page Views Table
CREATE TABLE page_views (
    page_view_id VARCHAR(36) PRIMARY KEY,
    session_id VARCHAR(36) NOT NULL,
    website_id VARCHAR(36) NOT NULL,
    url_path VARCHAR(500) NOT NULL,
    url_query VARCHAR(500),
    page_title VARCHAR(500),
    hostname VARCHAR(100),
    referrer_path VARCHAR(500),
    referrer_domain VARCHAR(500),
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    utm_campaign VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_session_id (session_id)
);

-- Events Table
CREATE TABLE events (
    event_id VARCHAR(36) PRIMARY KEY,
    session_id VARCHAR(36) NOT NULL,
    website_id VARCHAR(36) NOT NULL,
    event_name VARCHAR(50) NOT NULL,
    event_data JSON,
    url_path VARCHAR(500),
    page_title VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_session_id (session_id)
);

-- Device Info Table
CREATE TABLE device_info (
    device_info_id VARCHAR(36) PRIMARY KEY,
    website_id VARCHAR(36) NOT NULL,
    browser VARCHAR(20) NOT NULL,
    os VARCHAR(20) NOT NULL,
    device VARCHAR(20) NOT NULL,
    session_count INTEGER DEFAULT 1,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date DATE NOT NULL,
    UNIQUE KEY unique_device_day (website_id, browser, os, device, date)
);

-- Websites Table
CREATE TABLE websites (
    website_id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    domain VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_user_sessions_created_at ON user_sessions(created_at);
CREATE INDEX idx_user_sessions_website_id ON user_sessions(website_id);
CREATE INDEX idx_user_sessions_website_created ON user_sessions(website_id, created_at);

CREATE INDEX idx_page_views_created_at ON page_views(created_at);
CREATE INDEX idx_page_views_website_id ON page_views(website_id);
CREATE INDEX idx_page_views_website_created ON page_views(website_id, created_at);
CREATE INDEX idx_page_views_url_path ON page_views(url_path);

CREATE INDEX idx_events_created_at ON events(created_at);
CREATE INDEX idx_events_website_id ON events(website_id);
CREATE INDEX idx_events_event_name ON events(event_name);

CREATE INDEX idx_device_info_website_id ON device_info(website_id);
CREATE INDEX idx_device_info_date ON device_info(date);
```