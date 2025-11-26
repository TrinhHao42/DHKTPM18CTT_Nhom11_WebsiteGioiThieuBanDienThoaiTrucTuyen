-- CreateTable
CREATE TABLE "user_sessions" (
    "session_id" VARCHAR(36) NOT NULL,
    "website_id" VARCHAR(36) NOT NULL,
    "browser" VARCHAR(20),
    "os" VARCHAR(20),
    "device" VARCHAR(20),
    "screen" VARCHAR(11),
    "language" VARCHAR(35),
    "country" CHAR(2),
    "region" CHAR(20),
    "city" VARCHAR(50),
    "distinct_id" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("session_id")
);

-- CreateTable
CREATE TABLE "page_views" (
    "page_view_id" VARCHAR(36) NOT NULL,
    "session_id" VARCHAR(36) NOT NULL,
    "website_id" VARCHAR(36) NOT NULL,
    "url_path" VARCHAR(500) NOT NULL,
    "url_query" VARCHAR(500),
    "page_title" VARCHAR(500),
    "hostname" VARCHAR(100),
    "referrer_path" VARCHAR(500),
    "referrer_domain" VARCHAR(500),
    "utm_source" VARCHAR(255),
    "utm_medium" VARCHAR(255),
    "utm_campaign" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "page_views_pkey" PRIMARY KEY ("page_view_id")
);

-- CreateTable
CREATE TABLE "events" (
    "event_id" VARCHAR(36) NOT NULL,
    "session_id" VARCHAR(36) NOT NULL,
    "website_id" VARCHAR(36) NOT NULL,
    "event_name" VARCHAR(50) NOT NULL,
    "event_data" JSONB,
    "url_path" VARCHAR(500) NOT NULL,
    "page_title" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "device_info" (
    "device_info_id" VARCHAR(36) NOT NULL,
    "website_id" VARCHAR(36) NOT NULL,
    "browser" VARCHAR(20) NOT NULL,
    "os" VARCHAR(20) NOT NULL,
    "device" VARCHAR(20) NOT NULL,
    "session_count" INTEGER NOT NULL DEFAULT 1,
    "last_seen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date" DATE NOT NULL,

    CONSTRAINT "device_info_pkey" PRIMARY KEY ("device_info_id")
);

-- CreateTable
CREATE TABLE "websites" (
    "website_id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "domain" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "websites_pkey" PRIMARY KEY ("website_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_session_id_key" ON "user_sessions"("session_id");

-- CreateIndex
CREATE INDEX "user_sessions_created_at_idx" ON "user_sessions"("created_at");

-- CreateIndex
CREATE INDEX "user_sessions_website_id_idx" ON "user_sessions"("website_id");

-- CreateIndex
CREATE INDEX "user_sessions_website_id_created_at_idx" ON "user_sessions"("website_id", "created_at");

-- CreateIndex
CREATE INDEX "user_sessions_distinct_id_idx" ON "user_sessions"("distinct_id");

-- CreateIndex
CREATE UNIQUE INDEX "page_views_page_view_id_key" ON "page_views"("page_view_id");

-- CreateIndex
CREATE INDEX "page_views_created_at_idx" ON "page_views"("created_at");

-- CreateIndex
CREATE INDEX "page_views_session_id_idx" ON "page_views"("session_id");

-- CreateIndex
CREATE INDEX "page_views_website_id_idx" ON "page_views"("website_id");

-- CreateIndex
CREATE INDEX "page_views_website_id_created_at_idx" ON "page_views"("website_id", "created_at");

-- CreateIndex
CREATE INDEX "page_views_url_path_idx" ON "page_views"("url_path");

-- CreateIndex
CREATE INDEX "page_views_referrer_domain_idx" ON "page_views"("referrer_domain");

-- CreateIndex
CREATE UNIQUE INDEX "events_event_id_key" ON "events"("event_id");

-- CreateIndex
CREATE INDEX "events_created_at_idx" ON "events"("created_at");

-- CreateIndex
CREATE INDEX "events_session_id_idx" ON "events"("session_id");

-- CreateIndex
CREATE INDEX "events_website_id_idx" ON "events"("website_id");

-- CreateIndex
CREATE INDEX "events_website_id_created_at_idx" ON "events"("website_id", "created_at");

-- CreateIndex
CREATE INDEX "events_event_name_idx" ON "events"("event_name");

-- CreateIndex
CREATE UNIQUE INDEX "device_info_device_info_id_key" ON "device_info"("device_info_id");

-- CreateIndex
CREATE INDEX "device_info_website_id_idx" ON "device_info"("website_id");

-- CreateIndex
CREATE INDEX "device_info_date_idx" ON "device_info"("date");

-- CreateIndex
CREATE UNIQUE INDEX "device_info_website_id_browser_os_device_date_key" ON "device_info"("website_id", "browser", "os", "device", "date");

-- CreateIndex
CREATE UNIQUE INDEX "websites_website_id_key" ON "websites"("website_id");

-- AddForeignKey
ALTER TABLE "page_views" ADD CONSTRAINT "page_views_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "user_sessions"("session_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "user_sessions"("session_id") ON DELETE RESTRICT ON UPDATE CASCADE;
