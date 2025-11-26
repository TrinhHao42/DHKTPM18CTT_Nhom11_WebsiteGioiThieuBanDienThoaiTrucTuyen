import { NextRequest } from 'next/server';
import { AnalyticsService } from '@/lib/analytics';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const websiteId = searchParams.get('websiteId');

  // Create a readable stream for Server-Sent Events
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      
      // Send initial connection established message
      const data = encoder.encode(`data: ${JSON.stringify({ 
        type: 'connected', 
        timestamp: Date.now() 
      })}\n\n`);
      controller.enqueue(data);

      // Setup interval to send realtime updates
      const interval = setInterval(async () => {
        try {
          const analyticsService = new AnalyticsService();
          
          // Use UTC time directly (since database stores UTC timestamps)
          const now = new Date(); // This is UTC time
          const fifteenMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
          
          // Use broader time range for overall metrics (last 24 hours)
          const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          
          console.log('[Realtime API] Time ranges:', {
            now: now.toISOString(),
            fifteenMinutesAgo: fifteenMinutesAgo.toISOString(),
            vietnamNow: now.toLocaleString("vi-VN", {timeZone: "Asia/Ho_Chi_Minh"})
          });

          // Get comprehensive realtime metrics
          const [
            activeUsers,
            overallMetrics,
            recentEvents,
            sourceStats,
            userBehavior,
            engagementData,
            hourlyActivity
          ] = await Promise.all([
            // Active users in last 15 minutes (realtime activity)
            analyticsService.getActiveUsers(websiteId || '', fifteenMinutesAgo, now),
            // Overall metrics from last 24 hours to show meaningful data
            analyticsService.getOverallMetrics(websiteId || undefined, twentyFourHoursAgo, now),
            // Recent events (last 10)
            analyticsService.getRecentEvents(websiteId || undefined, 10),
            // Traffic sources from last 30 days
            analyticsService.getTrafficSources(websiteId || '', thirtyDaysAgo, now),
            // User behavior (usually monthly data)
            analyticsService.getUserBehavior(websiteId || undefined),
            // Engagement by hour from last 24 hours
            analyticsService.getEngagementByHour(websiteId || '', twentyFourHoursAgo, now),
            // Hourly activity from last 7 days  
            analyticsService.getHourlyActivityData(websiteId || '', new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), now)
          ]);

          console.log('[Realtime API] Active users result:', activeUsers);

          const realtimeData = {
            type: 'update',
            timestamp: Date.now(),
            data: {
              activeUsers,
              metrics: {
                totalUsers: overallMetrics.totalUsers,
                totalPageViews: overallMetrics.totalPageViews,
                uniqueVisitors: overallMetrics.uniqueVisitors,
                averageSessionDuration: overallMetrics.averageSessionDuration,
                totalUsersTrend: { value: "0%", isPositive: true }
              },
              sourceStats,
              userBehavior,
              engagementData,
              hourlyActivity,
              recentEvents: recentEvents.map((event) => ({
                id: event.id,
                eventName: event.eventName,
                urlPath: event.urlPath,
                pageTitle: event.pageTitle,
                createdAt: event.createdAt,
                browser: event.session?.browser,
                country: event.session?.country
              }))
            }
          };

          const chunk = encoder.encode(`data: ${JSON.stringify(realtimeData)}\n\n`);
          controller.enqueue(chunk);
        } catch (error) {
          console.error('[Realtime] Error fetching data:', error);
          const errorData = encoder.encode(`data: ${JSON.stringify({ 
            type: 'error', 
            message: 'Failed to fetch realtime data',
            timestamp: Date.now() 
          })}\n\n`);
          controller.enqueue(errorData);
        }
      }, 5000); // Update every 5 seconds

      // Cleanup on connection close
      const cleanup = () => {
        clearInterval(interval);
        controller.close();
      };

      // Handle connection close
      request.signal.addEventListener('abort', cleanup);
    },
    
    cancel() {
      console.log('[Realtime] Connection cancelled');
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    }
  });
}