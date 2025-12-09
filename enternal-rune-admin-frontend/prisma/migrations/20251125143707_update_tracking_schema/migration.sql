-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_session_id_fkey";

-- DropForeignKey
ALTER TABLE "page_views" DROP CONSTRAINT "page_views_session_id_fkey";

-- AlterTable
ALTER TABLE "events" ALTER COLUMN "event_name" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "user_sessions" ALTER COLUMN "browser" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "os" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "screen" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "country" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "region" SET DATA TYPE VARCHAR(50);

-- CreateIndex
CREATE INDEX "events_website_id_event_name_idx" ON "events"("website_id", "event_name");

-- CreateIndex
CREATE INDEX "page_views_website_id_url_path_idx" ON "page_views"("website_id", "url_path");

-- AddForeignKey
ALTER TABLE "page_views" ADD CONSTRAINT "page_views_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "user_sessions"("session_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "user_sessions"("session_id") ON DELETE CASCADE ON UPDATE CASCADE;
