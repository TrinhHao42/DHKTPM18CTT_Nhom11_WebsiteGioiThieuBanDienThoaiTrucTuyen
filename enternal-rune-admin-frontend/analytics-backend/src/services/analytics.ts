import { prisma } from '../lib/prisma';
import { AnalyticsMetrics } from '../lib/types';

export class AnalyticsService {
  
  /**
   * Get comprehensive analytics for a website
   */
  async getAnalytics(websiteId: string, startDate: Date, endDate: Date): Promise<AnalyticsMetrics> {
    const [
      totalUsers,
      newUsers,
      activeUsers,
      avgSessionDuration,
      userGrowth,
      deviceBreakdown,
      topPages,
      trafficSources,
      engagementByHour,
      heatmapData,
    ] = await Promise.all([
      this.getTotalUsers(websiteId, startDate, endDate),
      this.getNewUsers(websiteId, startDate, endDate),
      this.getActiveUsers(websiteId, startDate, endDate),
      this.getAverageSessionDuration(websiteId, startDate, endDate),
      this.getUserGrowthByMonth(websiteId, startDate, endDate),
      this.getDeviceBreakdown(websiteId, startDate, endDate),
      this.getTopPages(websiteId, startDate, endDate),
      this.getTrafficSources(websiteId, startDate, endDate),
      this.getEngagementByHour(websiteId, startDate, endDate),
      this.getHeatmapData(websiteId, startDate, endDate),
    ]);
    
    return {
      totalUsers,
      newUsers,
      activeUsers,
      averageSessionDuration: avgSessionDuration,
      userGrowth,
      deviceBreakdown,
      topPages,
      trafficSources,
      engagementByHour,
      heatmapData,
    };
  }
  
  /**
   * Get total unique users (visitors)
   */
  async getTotalUsers(websiteId: string, startDate: Date, endDate: Date): Promise<number> {
    const result = await prisma.userSession.count({
      where: {
        websiteId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
    
    return result;
  }
  
  /**
   * Get new users (first-time visitors)
   */
  async getNewUsers(websiteId: string, startDate: Date, endDate: Date): Promise<number> {
    // Users who had their first session in this period
    const sessions = await prisma.userSession.findMany({
      where: {
        websiteId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        distinctId: true,
        createdAt: true,
      },
    });
    
    const userFirstSessions = new Map<string, Date>();
    
    for (const session of sessions) {
      const userId = session.distinctId || 'anonymous';
      if (!userFirstSessions.has(userId) || session.createdAt < userFirstSessions.get(userId)!) {
        userFirstSessions.set(userId, session.createdAt);
      }
    }
    
    // Count users whose first session was in this period
    let newUsers = 0;
    for (const [, firstSessionDate] of userFirstSessions) {
      if (firstSessionDate >= startDate && firstSessionDate <= endDate) {
        newUsers++;
      }
    }
    
    return newUsers;
  }
  
  /**
   * Get active users (users with activity in period)
   */
  async getActiveUsers(websiteId: string, startDate: Date, endDate: Date): Promise<number> {
    const result = await prisma.userSession.findMany({
      where: {
        websiteId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        distinctId: true,
      },
      distinct: ['distinctId'],
    });
    
    return result.length;
  }
  
  /**
   * Get average session duration
   */
  async getAverageSessionDuration(websiteId: string, startDate: Date, endDate: Date): Promise<number> {
    // Get sessions with their page views to calculate duration
    const sessions = await prisma.userSession.findMany({
      where: {
        websiteId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        pageViews: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
    
    let totalDuration = 0;
    let validSessions = 0;
    
    for (const session of sessions) {
      if (session.pageViews.length > 1) {
        const firstPageView = session.pageViews[0];
        const lastPageView = session.pageViews[session.pageViews.length - 1];
        const duration = lastPageView.createdAt.getTime() - firstPageView.createdAt.getTime();
        
        if (duration > 0 && duration < 30 * 60 * 1000) { // Max 30 minutes
          totalDuration += duration;
          validSessions++;
        }
      }
    }
    
    return validSessions > 0 ? Math.round(totalDuration / validSessions / 1000) : 0; // in seconds
  }
  
  /**
   * Get user growth by month
   */
  async getUserGrowthByMonth(websiteId: string, startDate: Date, endDate: Date): Promise<{ month: string; users: number }[]> {
    const sessions = await prisma.$queryRaw<Array<{ month: string; users: bigint }>>`
      SELECT 
        TO_CHAR(created_at, 'YYYY-MM') as month,
        COUNT(DISTINCT id) as users
      FROM user_sessions
      WHERE website_id = ${websiteId}
        AND created_at >= ${startDate}
        AND created_at <= ${endDate}
      GROUP BY TO_CHAR(created_at, 'YYYY-MM')
      ORDER BY month
    `;
    
    return sessions.map(row => ({
      month: row.month,
      users: Number(row.users),
    }));
  }
  
  /**
   * Get device breakdown
   */
  async getDeviceBreakdown(websiteId: string, startDate: Date, endDate: Date): Promise<{ device: string; count: number; percentage: number }[]> {
    const devices = await prisma.userSession.groupBy({
      by: ['device'],
      where: {
        websiteId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        device: {
          not: null,
        },
      },
      _count: {
        device: true,
      },
    });
    
    const total = devices.reduce((sum, device) => sum + device._count.device, 0);
    
    return devices
      .filter(device => device.device)
      .map(device => ({
        device: device.device!,
        count: device._count.device,
        percentage: total > 0 ? Math.round((device._count.device / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }
  
  /**
   * Get top pages
   */
  async getTopPages(websiteId: string, startDate: Date, endDate: Date): Promise<{ path: string; views: number; uniqueUsers: number }[]> {
    const pages = await prisma.pageView.groupBy({
      by: ['urlPath'],
      where: {
        websiteId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10,
    });
    
    // Get unique users for each page
    const pagesWithUsers = await Promise.all(
      pages.map(async (page) => {
        const uniqueUsers = await prisma.pageView.findMany({
          where: {
            websiteId,
            urlPath: page.urlPath,
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
          select: {
            sessionId: true,
          },
          distinct: ['sessionId'],
        });
        
        return {
          path: page.urlPath,
          views: page._count.id,
          uniqueUsers: uniqueUsers.length,
        };
      })
    );
    
    return pagesWithUsers;
  }
  
  /**
   * Get traffic sources
   */
  async getTrafficSources(websiteId: string, startDate: Date, endDate: Date): Promise<{ source: string; count: number; percentage: number }[]> {
    // Get referrer domains and UTM sources
    const referrers = await prisma.pageView.findMany({
      where: {
        websiteId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        referrerDomain: true,
        utmSource: true,
      },
    });
    
    const sourceMap = new Map<string, number>();
    
    for (const pageView of referrers) {
      let source = 'direct';
      
      if (pageView.utmSource) {
        source = pageView.utmSource;
      } else if (pageView.referrerDomain) {
        if (pageView.referrerDomain.includes('google')) {
          source = 'search';
        } else if (['facebook.com', 'twitter.com', 'linkedin.com', 'instagram.com'].some(s => pageView.referrerDomain!.includes(s))) {
          source = 'social';
        } else {
          source = 'external';
        }
      }
      
      sourceMap.set(source, (sourceMap.get(source) || 0) + 1);
    }
    
    const total = Array.from(sourceMap.values()).reduce((sum, count) => sum + count, 0);
    
    return Array.from(sourceMap.entries())
      .map(([source, count]) => ({
        source,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }
  
  /**
   * Get engagement by hour
   */
  async getEngagementByHour(websiteId: string, startDate: Date, endDate: Date): Promise<{ hour: number; sessions: number; pageViews: number }[]> {
    const hourlyData = await prisma.$queryRaw<Array<{ hour: number; sessions: bigint; pageviews: bigint }>>`
      SELECT 
        EXTRACT(HOUR FROM created_at) as hour,
        COUNT(DISTINCT session_id) as sessions,
        COUNT(*) as pageviews
      FROM page_views
      WHERE website_id = ${websiteId}
        AND created_at >= ${startDate}
        AND created_at <= ${endDate}
      GROUP BY EXTRACT(HOUR FROM created_at)
      ORDER BY hour
    `;
    
    // Fill in missing hours with zeros
    const result: { hour: number; sessions: number; pageViews: number }[] = [];
    for (let hour = 0; hour < 24; hour++) {
      const data = hourlyData.find(d => Number(d.hour) === hour);
      result.push({
        hour,
        sessions: data ? Number(data.sessions) : 0,
        pageViews: data ? Number(data.pageviews) : 0,
      });
    }
    
    return result;
  }
  
  /**
   * Get heatmap data (weekday x hour)
   */
  async getHeatmapData(websiteId: string, startDate: Date, endDate: Date): Promise<{ weekday: number; hour: number; activeUsers: number }[]> {
    const heatmapData = await prisma.$queryRaw<Array<{ weekday: number; hour: number; users: bigint }>>`
      SELECT 
        EXTRACT(DOW FROM created_at) as weekday,
        EXTRACT(HOUR FROM created_at) as hour,
        COUNT(DISTINCT session_id) as users
      FROM page_views
      WHERE website_id = ${websiteId}
        AND created_at >= ${startDate}
        AND created_at <= ${endDate}
      GROUP BY EXTRACT(DOW FROM created_at), EXTRACT(HOUR FROM created_at)
      ORDER BY weekday, hour
    `;
    
    return heatmapData.map(row => ({
      weekday: Number(row.weekday),
      hour: Number(row.hour),
      activeUsers: Number(row.users),
    }));
  }
}