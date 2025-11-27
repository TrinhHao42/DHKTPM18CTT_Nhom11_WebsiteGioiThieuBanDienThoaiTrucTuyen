-- AlterTable
ALTER TABLE "user_sessions" ADD COLUMN     "referrer_domain" VARCHAR(500),
ADD COLUMN     "traffic_source" VARCHAR(100),
ADD COLUMN     "utm_source" VARCHAR(255);

-- CreateIndex
CREATE INDEX "user_sessions_traffic_source_idx" ON "user_sessions"("traffic_source");

-- CreateIndex
CREATE INDEX "user_sessions_website_id_traffic_source_idx" ON "user_sessions"("website_id", "traffic_source");
