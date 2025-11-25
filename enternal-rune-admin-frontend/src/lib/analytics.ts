import { prisma } from './prisma';

export interface AnalyticsMetrics {
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  averageSessionDuration: number;
  userGrowth: { month: string; users: number }[];
  deviceBreakdown: { device: string; count: number; percentage: number }[];
  topPages: { path: string; views: number; uniqueUsers: number }[];
  trafficSources: { source: string; count: number; percentage: number }[];
  engagementByHour: { hour: number; sessions: number; pageViews: number }[];
  heatmapData: { weekday: number; hour: number; activeUsers: number }[];
}

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
   * Get overall metrics for dashboard
   */
  async getOverallMetrics(websiteId?: string, startDate?: Date, endDate?: Date) {
    const where: Record<string, unknown> = websiteId ? { websiteId } : {};
    if (startDate && endDate) {
      where.createdAt = { gte: startDate, lte: endDate };
    }

    try {
      console.log('[Analytics] getOverallMetrics called with:', { websiteId, startDate, endDate, where });

      // Get basic counts
      console.log('[Analytics] Fetching basic counts...');
      const [totalPageViews, totalUsers] = await Promise.all([
        prisma.pageView.count({ where }),
        prisma.userSession.count({ where })
      ]);

      console.log('[Analytics] Basic counts:', { totalPageViews, totalUsers });

      const uniqueVisitors = totalUsers;

      // Calculate bounce rate (sessions with only 1 page view)
      console.log('[Analytics] Calculating bounce rate...');
      const sessionsWithPageViews = await prisma.userSession.findMany({
        where,
        include: { pageViews: true }
      });

      const singlePageSessions = sessionsWithPageViews.filter(session => session.pageViews.length === 1).length;
      const bounceRate = totalUsers > 0 ? Number((singlePageSessions / totalUsers).toFixed(2)) : 0;
      console.log('[Analytics] Bounce rate calculated:', { singlePageSessions, totalUsers, bounceRate });

      // Get average session duration
      console.log('[Analytics] Getting average session duration...');
      const averageSessionDuration = await this.getAverageSessionDuration(
        websiteId || '',
        startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate || new Date()
      );
      console.log('[Analytics] Average session duration:', averageSessionDuration);

      // Get top pages
      const topPagesData = await prisma.pageView.groupBy({
        by: ['urlPath'],
        where,
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5
      });

      const topPages = topPagesData.map(page => ({
        url: page.urlPath,
        views: page._count.id
      }));

      // Get top countries
      const topCountriesData = await prisma.userSession.groupBy({
        by: ['country'],
        where: { ...where, country: { not: null } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5
      });

      const countryNames: Record<string, string> = {
        'US': 'United States',
        'GB': 'United Kingdom',
        'DE': 'Germany',
        'FR': 'France',
        'CA': 'Canada',
        'VN': 'Vietnam',
        'JP': 'Japan',
        'KR': 'South Korea',
        'SG': 'Singapore',
        'AU': 'Australia'
      };

      const topCountries = topCountriesData.map(country => ({
        country: countryNames[country.country || ''] || country.country || 'Unknown',
        visitors: country._count.id
      }));

      // Get device types
      const deviceData = await this.getDeviceBreakdown(
        websiteId || '',
        startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate || new Date()
      );

      const result = {
        totalPageViews,
        uniqueVisitors,
        totalUsers,
        bounceRate,
        averageSessionDuration,
        topPages,
        topCountries,
        deviceTypes: deviceData
      };

      console.log('[Analytics] getOverallMetrics completed successfully');
      return result;
    } catch (error) {
      console.error('[Analytics] Error getting overall metrics:', error);
      console.error('[Analytics] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      throw error;
    }
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
    try {
      const sessions = await prisma.$queryRaw<Array<{ month: string; users: bigint }>>`
        SELECT 
          TO_CHAR(created_at, 'YYYY-MM') as month,
          COUNT(DISTINCT session_id) as users
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
    } catch (error) {
      console.error('Error getting user growth by month:', error);
      return [];
    }
  }

  /**
   * Get device breakdown
   */
  async getDeviceBreakdown(websiteId: string, startDate: Date, endDate: Date): Promise<{ device: string; count: number; percentage: number }[]> {
    try {
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
    } catch (error) {
      console.error('Error getting device breakdown:', error);
      return [];
    }
  }

  /**
   * Get top pages
   */
  async getTopPages(websiteId: string, startDate: Date, endDate: Date): Promise<{ path: string; views: number; uniqueUsers: number }[]> {
    try {
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
    } catch (error) {
      console.error('Error getting top pages:', error);
      return [];
    }
  }

  /**
   * Get traffic sources
   */
  async getTrafficSources(websiteId: string, startDate: Date, endDate: Date): Promise<{ source: string; count: number; percentage: number }[]> {
    try {
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
    } catch (error) {
      console.error('Error getting traffic sources:', error);
      return [];
    }
  }

  /**
   * Get engagement by hour
   */
  async getEngagementByHour(websiteId: string, startDate: Date, endDate: Date): Promise<{ hour: number; sessions: number; pageViews: number }[]> {
    try {
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
    } catch (error) {
      console.error('Error getting engagement by hour:', error);
      return [];
    }
  }

  /**
   * Get heatmap data (weekday x hour)
   */
  async getHeatmapData(websiteId: string, startDate: Date, endDate: Date): Promise<{ weekday: number; hour: number; activeUsers: number }[]> {
    try {
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
    } catch (error) {
      console.error('Error getting heatmap data:', error);
      return [];
    }
  }

  /**
   * Get demographics data
   */
  async getDemographics(websiteId?: string, startDate?: Date, endDate?: Date) {
    const where: Record<string, unknown> = websiteId ? { websiteId } : {};
    if (startDate && endDate) {
      where.createdAt = { gte: startDate, lte: endDate };
    }

    try {
      const [countries, languages, totalSessions] = await Promise.all([
        prisma.userSession.groupBy({
          by: ['country'],
          where: { ...where, country: { not: null } },
          _count: { id: true },
          orderBy: { _count: { id: 'desc' } },
          take: 10
        }),
        prisma.userSession.groupBy({
          by: ['language'],
          where: { ...where, language: { not: null } },
          _count: { id: true },
          orderBy: { _count: { id: 'desc' } },
          take: 10
        }),
        prisma.userSession.count({ where })
      ]);

      const countryNames: Record<string, string> = {
        'US': 'United States', 'GB': 'United Kingdom', 'DE': 'Germany',
        'FR': 'France', 'CA': 'Canada', 'VN': 'Vietnam', 'JP': 'Japan',
        'KR': 'South Korea', 'SG': 'Singapore', 'AU': 'Australia'
      };

      return {
        countries: countries.map(c => ({
          country: countryNames[c.country || ''] || c.country || 'Unknown',
          users: c._count.id,
          percentage: totalSessions > 0 ? Math.round((c._count.id / totalSessions) * 100) : 0
        })),
        languages: languages.map(l => ({
          language: l.language || 'Unknown',
          users: l._count.id,
          percentage: totalSessions > 0 ? Math.round((l._count.id / totalSessions) * 100) : 0
        })),
        totalSessions
      };
    } catch (error) {
      console.error('Error getting demographics:', error);
      return { countries: [], languages: [], totalSessions: 0 };
    }
  }

  /**
   * Get engagement metrics by hour
   */
  async getEngagement(websiteId?: string, startDate?: Date, endDate?: Date) {
    const where: Record<string, unknown> = websiteId ? { websiteId } : {};
    if (startDate && endDate) {
      where.createdAt = { gte: startDate, lte: endDate };
    }

    try {
      // Build WHERE conditions
      const pageViewWhereConditions = [];
      const eventWhereConditions = [];
      
      if (websiteId) {
        pageViewWhereConditions.push(`pv.website_id = '${websiteId.replace(/'/g, "''")}'`);
        eventWhereConditions.push(`website_id = '${websiteId.replace(/'/g, "''")}'`);
      }
      
      if (startDate && endDate) {
        pageViewWhereConditions.push(`pv.created_at >= '${startDate.toISOString()}' AND pv.created_at <= '${endDate.toISOString()}'`);
        eventWhereConditions.push(`created_at >= '${startDate.toISOString()}' AND created_at <= '${endDate.toISOString()}'`);
      }

      // Get page views and sessions by hour
      const pageViewQuery = `
        SELECT
          EXTRACT(HOUR FROM pv.created_at) as hour,
          COUNT(pv.page_view_id) as "pageViews",
          COUNT(DISTINCT pv.session_id) as sessions,
          AVG(EXTRACT(EPOCH FROM (pv.created_at - s.created_at))) / 60 as "avgEngagement"
        FROM page_views pv
        LEFT JOIN user_sessions s ON pv.session_id = s.session_id
        ${pageViewWhereConditions.length > 0 ? `WHERE ${pageViewWhereConditions.join(' AND ')}` : ''}
        GROUP BY EXTRACT(HOUR FROM pv.created_at)
        ORDER BY hour
      `;

      const pageViewData = await prisma.$queryRawUnsafe(pageViewQuery);

      // Get events by hour
      const eventQuery = `
        SELECT
          EXTRACT(HOUR FROM created_at) as hour,
          COUNT(*) as events
        FROM events
        ${eventWhereConditions.length > 0 ? `WHERE ${eventWhereConditions.join(' AND ')}` : ''}
        GROUP BY EXTRACT(HOUR FROM created_at)
        ORDER BY hour
      `;

      const eventData = await prisma.$queryRawUnsafe(eventQuery);

      // Combine the data
      const result = [];
      for (let hour = 0; hour < 24; hour++) {
        const pvData = (pageViewData as Array<{
          hour: number;
          pageViews: bigint;
          sessions: bigint;
          avgEngagement: number | null;
        }>).find(d => Number(d.hour) === hour);

        const evData = (eventData as Array<{
          hour: number;
          events: bigint;
        }>).find(d => Number(d.hour) === hour);

        result.push({
          hour: hour.toString().padStart(2, '0') + ':00',
          pageViews: pvData ? Number(pvData.pageViews) : 0,
          events: evData ? Number(evData.events) : 0,
          sessions: pvData ? Number(pvData.sessions) : 0,
          avgEngagement: pvData ? Number(pvData.avgEngagement) || 0 : 0
        });
      }

      return result;
    } catch (error) {
      console.error('Error getting engagement data:', error);
      return [];
    }
  }

  /**
   * Get retention data by month
   */
  async getRetention(websiteId?: string, startDate?: Date, endDate?: Date) {
    const where: Record<string, unknown> = websiteId ? { websiteId } : {};
    if (startDate && endDate) {
      where.createdAt = { gte: startDate, lte: endDate };
    }

    try {
      // Get monthly user data
      const monthlyData = await prisma.$queryRaw<Array<{
        month: string;
        totalUsers: bigint;
        newUsers: bigint;
        returningUsers: bigint;
      }>>`
        WITH monthly_stats AS (
          SELECT 
            TO_CHAR(created_at, 'YYYY-MM') as month,
            COUNT(DISTINCT session_id) as total_users,
            COUNT(DISTINCT CASE WHEN distinct_id IS NULL THEN session_id END) as new_users,
            COUNT(DISTINCT CASE WHEN distinct_id IS NOT NULL THEN distinct_id END) as returning_users
          FROM user_sessions
          ${websiteId ? `WHERE website_id = '${websiteId}'` : ''}
          ${startDate && endDate ? `AND created_at >= '${startDate.toISOString()}' AND created_at <= '${endDate.toISOString()}'` : ''}
          GROUP BY TO_CHAR(created_at, 'YYYY-MM')
        )
        SELECT 
          month,
          total_users as "totalUsers",
          new_users as "newUsers", 
          returning_users as "returningUsers"
        FROM monthly_stats
        ORDER BY month
      `;

      return monthlyData.map(row => ({
        month: row.month,
        totalUsers: Number(row.totalUsers),
        returningUsers: Number(row.returningUsers),
        newUsers: Number(row.newUsers),
        retentionRate: Number(row.totalUsers) > 0 ?
          Math.round((Number(row.returningUsers) / Number(row.totalUsers)) * 100) : 0,
        churnRate: Number(row.totalUsers) > 0 ?
          Math.round((Number(row.newUsers) / Number(row.totalUsers)) * 100) : 0
      }));
    } catch (error) {
      console.error('Error getting retention data:', error);
      return [];
    }
  }

  /**
   * Get user behavior metrics
   */
  async getUserBehavior(websiteId?: string, startDate?: Date, endDate?: Date) {
    const where: Record<string, unknown> = websiteId ? { websiteId } : {};
    if (startDate && endDate) {
      where.createdAt = { gte: startDate, lte: endDate };
    }

    try {
      // Get current month data
      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

      // Get previous month data
      const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

      // Get event counts for current month
      const currentMonthEvents = await prisma.event.groupBy({
        by: ['eventName'],
        where: {
          ...where,
          createdAt: {
            gte: currentMonthStart,
            lte: currentMonthEnd,
          },
        },
        _count: { id: true },
      });

      // Get event counts for previous month
      const previousMonthEvents = await prisma.event.groupBy({
        by: ['eventName'],
        where: {
          ...where,
          createdAt: {
            gte: previousMonthStart,
            lte: previousMonthEnd,
          },
        },
        _count: { id: true },
      });

      // Get page view counts
      const currentMonthPageViews = await prisma.pageView.count({
        where: {
          ...where,
          createdAt: {
            gte: currentMonthStart,
            lte: currentMonthEnd,
          },
        },
      });

      const previousMonthPageViews = await prisma.pageView.count({
        where: {
          ...where,
          createdAt: {
            gte: previousMonthStart,
            lte: previousMonthEnd,
          },
        },
      });

      // Calculate changes and format data
      const userBehavior: Array<{
        action: string;
        currentMonth: number;
        previousMonth: number;
        change: number;
      }> = [];

      // Add page views
      const pageViewChange = previousMonthPageViews > 0 ?
        ((currentMonthPageViews - previousMonthPageViews) / previousMonthPageViews) * 100 : 0;

      userBehavior.push({
        action: 'page_views',
        currentMonth: currentMonthPageViews,
        previousMonth: previousMonthPageViews,
        change: Math.round(pageViewChange * 100) / 100,
      });

      // Add events
      const allEventTypes = new Set([
        ...currentMonthEvents.map(e => e.eventName),
        ...previousMonthEvents.map(e => e.eventName),
      ]);

      for (const eventType of allEventTypes) {
        const currentCount = currentMonthEvents.find(e => e.eventName === eventType)?._count.id || 0;
        const previousCount = previousMonthEvents.find(e => e.eventName === eventType)?._count.id || 0;
        const change = previousCount > 0 ?
          ((currentCount - previousCount) / previousCount) * 100 : 0;

        userBehavior.push({
          action: eventType,
          currentMonth: currentCount,
          previousMonth: previousCount,
          change: Math.round(change * 100) / 100,
        });
      }

      return userBehavior;
    } catch (error) {
      console.error('Error getting user behavior:', error);
      return [];
    }
  }
}