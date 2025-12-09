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
      

      // Get basic counts
      
      const [totalPageViews, totalUsers] = await Promise.all([
        prisma.pageView.count({ where }),
        this.getTotalUsers(websiteId!, startDate!, endDate!)
      ]);

      

      const uniqueVisitors = totalUsers;

      // Calculate bounce rate (sessions with only 1 page view)
      
      const sessionsWithPageViews = await prisma.userSession.findMany({
        where,
        include: { pageViews: true }
      });

      const singlePageSessions = sessionsWithPageViews.filter(session => session.pageViews.length === 1).length;
      const bounceRate = totalUsers > 0 ? Number((singlePageSessions / totalUsers).toFixed(2)) : 0;
      

      // Get average session duration
      
      const averageSessionDuration = await this.getAverageSessionDuration(
        websiteId || '',
        startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate || new Date()
      );
      

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
      },
    });

    const uniqueUsers = new Set(sessions.map(s => s.distinctId)).size;
    
    
    return uniqueUsers;
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
    // Count unique sessions that have either events OR pageviews in the time period
    const result = await prisma.userSession.findMany({
      where: {
        websiteId,
        OR: [
          {
            events: {
              some: {
                createdAt: {
                  gte: startDate,
                  lte: endDate,
                },
              },
            },
          },
          {
            pageViews: {
              some: {
                createdAt: {
                  gte: startDate,
                  lte: endDate,
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
      },
    });

    return result.length;
  }

  /**
   * Get average session duration
   */
  async getAverageSessionDuration(websiteId: string, startDate: Date, endDate: Date): Promise<number> {
    // Get sessions with their page views and events to calculate duration
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
        events: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    let totalDuration = 0;
    let validSessions = 0;

    for (const session of sessions) {
      // Collect all activities (page views + events) and sort by time
      const activities = [
        ...session.pageViews.map(pv => ({ type: 'pageview', createdAt: pv.createdAt })),
        ...session.events.map(ev => ({ type: 'event', createdAt: ev.createdAt }))
      ].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

      if (activities.length > 1) {
        // Calculate duration from first activity to last activity
        const firstActivity = activities[0];
        const lastActivity = activities[activities.length - 1];
        const duration = lastActivity.createdAt.getTime() - firstActivity.createdAt.getTime();

        // Only count sessions with reasonable duration (between 1 second and 30 minutes)
        if (duration > 1000 && duration < 30 * 60 * 1000) {
          totalDuration += duration;
          validSessions++;
        }
      } else if (activities.length === 1) {
        // For single-activity sessions, use a default minimum duration (e.g., 10 seconds)
        totalDuration += 10 * 1000; // 10 seconds in milliseconds
        validSessions++;
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
          COUNT(DISTINCT id) as users
        FROM "UserSession"
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
   * Get user growth with detailed new/churned users calculation
   */
  async getUserGrowthWithDetails(websiteId: string, startDate: Date, endDate: Date): Promise<Array<{ 
    month: string; 
    totalUsers: number; 
    newUsers: number; 
    churnedUsers: number; 
  }>> {
    try {
      // Debug: log total sessions first
      
      
      // Get all sessions grouped by month and user
      const sessions = await prisma.userSession.findMany({
        where: {
          websiteId,
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          id: true,
          distinctId: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      
      if (sessions.length > 0) {
        
      }

      // Group sessions by month and track unique users
      const monthlyUserMap = new Map<string, Set<string>>();
      const allUniqueUsers = new Set<string>();
      
      sessions.forEach(session => {
        const month = session.createdAt.toISOString().slice(0, 7); // YYYY-MM format
        const userId = session.distinctId || session.id;
        
        
        
        if (!monthlyUserMap.has(month)) {
          monthlyUserMap.set(month, new Set());
        }
        monthlyUserMap.get(month)!.add(userId);
        allUniqueUsers.add(userId);
      });

      
      

      // Convert to sorted array and calculate growth metrics
      const sortedMonths = Array.from(monthlyUserMap.keys()).sort();
      const result = [];
      let allPreviousUsers: Set<string> = new Set(); // Cumulative users across all previous months
      let previousMonthUsers: Set<string> = new Set(); // Users from just the previous month

      for (let i = 0; i < sortedMonths.length; i++) {
        const month = sortedMonths[i];
        const currentMonthUsers = monthlyUserMap.get(month)!;
        
        // Calculate new users (users who have NEVER appeared before)
        const newUsers = [...currentMonthUsers].filter(user => !allPreviousUsers.has(user)).length;
        
        // Calculate churned users (users who were in previous month but not current)
        const churnedUsers = previousMonthUsers.size === 0
          ? 0 // First month, no churn
          : [...previousMonthUsers].filter(user => !currentMonthUsers.has(user)).length;

        // Calculate cumulative total users (all users ever seen up to this month)
        const cumulativeUsers = new Set([...allPreviousUsers, ...currentMonthUsers]);

        const monthResult = {
          month: month,
          totalUsers: cumulativeUsers.size, // Cumulative total users
          newUsers: newUsers, // New users this month
          churnedUsers: churnedUsers, // Users who left this month
        };

        
        
        result.push(monthResult);

        // Update for next iteration
        allPreviousUsers = cumulativeUsers; // Add all current users to the cumulative set
        previousMonthUsers = new Set(currentMonthUsers); // Set current as previous for churn calculation
      }

      
      return result;
    } catch (error) {
      console.error('Error getting detailed user growth:', error);
      // Fallback to basic calculation with simple logic
      const basicGrowth = await this.getUserGrowthByMonth(websiteId, startDate, endDate);
      return basicGrowth.map((item, index) => {
        const prevUsers = index > 0 ? basicGrowth[index - 1]?.users || 0 : 0;
        const currentUsers = item.users;
        
        return {
          month: item.month,
          totalUsers: currentUsers,
          newUsers: index === 0 ? currentUsers : Math.max(0, currentUsers - prevUsers),
          churnedUsers: index === 0 ? 0 : Math.max(0, prevUsers - currentUsers),
        };
      });
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
   * Get traffic sources based on unique user sessions
   */
  async getTrafficSources(websiteId: string, startDate: Date, endDate: Date): Promise<{ source: string; count: number; percentage: number }[]> {
    try {
      // Get user sessions with their first page view to determine traffic source
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
            take: 1, // Get the first page view for each session
            select: {
              referrerDomain: true,
              utmSource: true,
            },
          },
        },
      });

      const sourceMap = new Map<string, number>();

      for (const session of sessions) {
        let source = 'Truy cập trực tiếp';

        // Use the first page view of the session to determine traffic source
        const firstPageView = session.pageViews[0];
        if (firstPageView) {
          if (firstPageView.utmSource) {
            // UTM source takes priority
            switch (firstPageView.utmSource.toLowerCase()) {
              case 'google':
              case 'bing':
              case 'yahoo':
              case 'baidu':
                source = 'Tìm kiếm có trả phí';
                break;
              case 'facebook':
              case 'twitter':
              case 'instagram':
              case 'linkedin':
              case 'tiktok':
                source = 'Mạng xã hội';
                break;
              case 'email':
                source = 'Email marketing';
                break;
              default:
                source = firstPageView.utmSource;
            }
          } else if (firstPageView.referrerDomain) {
            const domain = firstPageView.referrerDomain.toLowerCase();
            
            if (domain.includes('google.') || domain.includes('bing.') || 
                domain.includes('yahoo.') || domain.includes('baidu.') ||
                domain.includes('duckduckgo.') || domain.includes('yandex.')) {
              source = 'Tìm kiếm tự nhiên';
            } else if (domain.includes('facebook.') || domain.includes('twitter.') || 
                       domain.includes('instagram.') || domain.includes('linkedin.') ||
                       domain.includes('tiktok.') || domain.includes('youtube.') ||
                       domain.includes('pinterest.')) {
              source = 'Mạng xã hội';
            } else if (domain.includes('gmail.') || domain.includes('outlook.') || 
                       domain.includes('mail.') || domain.includes('email.')) {
              source = 'Email';
            } else {
              source = 'Website khác';
            }
          }
          // If no referrer and no UTM, it remains 'Truy cập trực tiếp'
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
      // Convert to local timezone (Asia/Ho_Chi_Minh = UTC+7)
      const localTimezone = 'Asia/Ho_Chi_Minh';
      const hourlyData = await prisma.$queryRaw<Array<{ hour: number; sessions: bigint; pageviews: bigint }>>`
        WITH local_times AS (
          SELECT 
            created_at AT TIME ZONE 'UTC' AT TIME ZONE ${localTimezone} as local_time,
            session_id
          FROM page_views
          WHERE website_id = ${websiteId}
            AND created_at >= ${startDate}
            AND created_at <= ${endDate}
        )
        SELECT 
          EXTRACT(HOUR FROM local_time) as hour,
          COUNT(DISTINCT session_id) as sessions,
          COUNT(*) as pageviews
        FROM local_times
        GROUP BY EXTRACT(HOUR FROM local_time)
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
      // Convert to local timezone (Asia/Ho_Chi_Minh = UTC+7)
      const localTimezone = 'Asia/Ho_Chi_Minh';
      const heatmapData = await prisma.$queryRaw<Array<{ weekday: number; hour: number; users: bigint }>>`
        WITH local_times AS (
          SELECT 
            created_at AT TIME ZONE 'UTC' AT TIME ZONE ${localTimezone} as local_time,
            session_id
          FROM page_views
          WHERE website_id = ${websiteId}
            AND created_at >= ${startDate}
            AND created_at <= ${endDate}
        )
        SELECT 
          EXTRACT(DOW FROM local_time) as weekday,
          EXTRACT(HOUR FROM local_time) as hour,
          COUNT(DISTINCT session_id) as users
        FROM local_times
        GROUP BY EXTRACT(DOW FROM local_time), EXTRACT(HOUR FROM local_time)
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

      // Get page views and sessions by hour with timezone conversion
      const pageViewQuery = `
        SELECT
          EXTRACT(HOUR FROM (pv.created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Ho_Chi_Minh')) as hour,
          COUNT(pv.page_view_id) as "pageViews",
          COUNT(DISTINCT pv.session_id) as sessions,
          AVG(EXTRACT(EPOCH FROM (pv.created_at - s.created_at))) / 60 as "avgEngagement"
        FROM page_views pv
        LEFT JOIN user_sessions s ON pv.session_id = s.session_id
        ${pageViewWhereConditions.length > 0 ? `WHERE ${pageViewWhereConditions.join(' AND ')}` : ''}
        GROUP BY EXTRACT(HOUR FROM (pv.created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Ho_Chi_Minh'))
        ORDER BY hour
      `;

      const pageViewData = await prisma.$queryRawUnsafe(pageViewQuery);

      // Get events by hour with timezone conversion
      const eventQuery = `
        SELECT
          EXTRACT(HOUR FROM (created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Ho_Chi_Minh')) as hour,
          COUNT(*) as events
        FROM events
        ${eventWhereConditions.length > 0 ? `WHERE ${eventWhereConditions.join(' AND ')}` : ''}
        GROUP BY EXTRACT(HOUR FROM (created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Ho_Chi_Minh'))
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
   * Get user behavior metrics with URL paths
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

      // Get page view counts by URL path for current month
      const currentMonthPageViews = await prisma.pageView.groupBy({
        by: ['urlPath'],
        where: {
          ...where,
          createdAt: {
            gte: currentMonthStart,
            lte: currentMonthEnd,
          },
        },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10
      });

      // Get page view counts by URL path for previous month
      const previousMonthPageViews = await prisma.pageView.groupBy({
        by: ['urlPath'],
        where: {
          ...where,
          createdAt: {
            gte: previousMonthStart,
            lte: previousMonthEnd,
          },
        },
        _count: { id: true },
      });

      // Get regular event counts for current month (excluding e-commerce events)
      const currentMonthEvents = await prisma.event.groupBy({
        by: ['eventName'],
        where: {
          ...where,
          createdAt: {
            gte: currentMonthStart,
            lte: currentMonthEnd,
          },
          eventName: {
            notIn: ['add_to_cart', 'buy_now']
          }
        },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 15
      });

      // Get regular event counts for previous month (excluding e-commerce events)
      const previousMonthEvents = await prisma.event.groupBy({
        by: ['eventName'],
        where: {
          ...where,
          createdAt: {
            gte: previousMonthStart,
            lte: previousMonthEnd,
          },
          eventName: {
            notIn: ['add_to_cart', 'buy_now']
          }
        },
        _count: { id: true },
      });

      // Get e-commerce events grouped by product_id for current month
      const currentMonthEcommerceEvents = await prisma.event.findMany({
        where: {
          ...where,
          createdAt: {
            gte: currentMonthStart,
            lte: currentMonthEnd,
          },
          eventName: {
            in: ['add_to_cart', 'buy_now']
          }
        },
        select: {
          eventName: true,
          eventData: true,
          id: true
        }
      });

      // Get e-commerce events grouped by product_id for previous month
      const previousMonthEcommerceEvents = await prisma.event.findMany({
        where: {
          ...where,
          createdAt: {
            gte: previousMonthStart,
            lte: previousMonthEnd,
          },
          eventName: {
            in: ['add_to_cart', 'buy_now']
          }
        },
        select: {
          eventName: true,
          eventData: true,
          id: true
        }
      });

      // Calculate changes and format data
      const userBehavior: Array<{
        action: string;
        urlPath?: string;
        currentMonth: number;
        previousMonth: number;
        change: number;
        eventData?: Record<string, unknown>;
      }> = [];

      // Add page views by URL path
      for (const pageView of currentMonthPageViews) {
        const previousCount = previousMonthPageViews.find(p => p.urlPath === pageView.urlPath)?._count.id || 0;
        const change = previousCount > 0 ?
          ((pageView._count.id - previousCount) / previousCount) * 100 : 
          (pageView._count.id > 0 ? 100 : 0); // New data = 100% increase

        const roundedChange = Math.round(change * 100) / 100;
                
        userBehavior.push({
          action: pageView.urlPath || 'Unknown Page',
          urlPath: pageView.urlPath || undefined,
          currentMonth: pageView._count.id,
          previousMonth: previousCount,
          change: roundedChange,
          eventData: undefined
        });
      }

      // Add regular events (eventName already contains URL paths like "/path:click")
      for (const event of currentMonthEvents) {
        const previousCount = previousMonthEvents.find(e => e.eventName === event.eventName)?._count.id || 0;
        const change = previousCount > 0 ?
          ((event._count.id - previousCount) / previousCount) * 100 : 
          (event._count.id > 0 ? 100 : 0); // New data = 100% increase

        // Extract URL path from eventName if it contains one
        let urlPath: string | undefined;
        if (event.eventName.startsWith('/') && event.eventName.includes(':')) {
          urlPath = event.eventName.split(':')[0];
        } else if (event.eventName.startsWith('/')) {
          urlPath = event.eventName;
        }

        const roundedChange = Math.round(change * 100) / 100;
        
        
        
        userBehavior.push({
          action: event.eventName,
          urlPath,
          currentMonth: event._count.id,
          previousMonth: previousCount,
          change: roundedChange,
          eventData: undefined
        });
      }

      // Process e-commerce events grouped by product_id
      const processEcommerceEvents = (events: typeof currentMonthEcommerceEvents) => {
        const grouped = new Map<string, { count: number; eventData?: Record<string, unknown>; eventName: string }>();
        
        events.forEach(event => {
          try {
            const eventData = event.eventData as Record<string, unknown> || {};
            const productId = eventData.product_id || eventData.productId || eventData['product-id'] || 'unknown';
            const key = `${event.eventName}_${productId}`;
            
            if (grouped.has(key)) {
              grouped.get(key)!.count++;
            } else {
              grouped.set(key, {
                count: 1,
                eventData: eventData,
                eventName: event.eventName
              });
            }
          } catch (error) {
            console.error('Error processing e-commerce event:', error);
          }
        });
        
        return grouped;
      };

      const currentEcommerceGrouped = processEcommerceEvents(currentMonthEcommerceEvents);
      const previousEcommerceGrouped = processEcommerceEvents(previousMonthEcommerceEvents);

      // Add e-commerce events to userBehavior
      currentEcommerceGrouped.forEach((current, key) => {
        const previous = previousEcommerceGrouped.get(key);
        const previousCount = previous ? previous.count : 0;
        const change = previousCount > 0 ?
          ((current.count - previousCount) / previousCount) * 100 : 
          (current.count > 0 ? 100 : 0);

        const roundedChange = Math.round(change * 100) / 100;
        
        
        
        userBehavior.push({
          action: current.eventName,
          urlPath: undefined,
          currentMonth: current.count,
          previousMonth: previousCount,
          change: roundedChange,
          eventData: current.eventData
        });
      });

      // Sort by current month count (descending)
      return userBehavior
        .sort((a, b) => b.currentMonth - a.currentMonth)
        .slice(0, 20); // Limit to top 20 actions

    } catch (error) {
      console.error('Error getting user behavior:', error);
      return [];
    }
  }

  /**
   * Get recent events for debugging
   */
  async getRecentEvents(websiteId?: string, limit: number = 50) {
    const where: Record<string, unknown> = websiteId ? { websiteId } : {};

    try {
      const events = await prisma.event.findMany({
        where,
        include: {
          session: {
            select: {
              browser: true,
              os: true,
              device: true,
              country: true,
              distinctId: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit
      });

      return events.map(event => ({
        id: event.id,
        eventName: event.eventName,
        eventData: event.eventData,
        urlPath: event.urlPath,
        pageTitle: event.pageTitle,
        createdAt: event.createdAt,
        session: {
          browser: event.session.browser,
          os: event.session.os,
          device: event.session.device,
          country: event.session.country,
          userId: event.session.distinctId
        }
      }));
    } catch (error) {
      console.error('Error getting recent events:', error);
      return [];
    }
  }

  /**
   * Get top events by frequency
   */
  async getTopEvents(websiteId?: string, startDate?: Date, endDate?: Date, limit: number = 10) {
    const where: Record<string, unknown> = websiteId ? { websiteId } : {};
    if (startDate && endDate) {
      where.createdAt = { gte: startDate, lte: endDate };
    }

    try {
      const topEvents = await prisma.event.groupBy({
        by: ['eventName'],
        where,
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: limit
      });

      return topEvents.map(event => ({
        eventName: event.eventName,
        count: event._count.id,
        percentage: 0 // Will be calculated if needed
      }));
    } catch (error) {
      console.error('Error getting top events:', error);
      return [];
    }
  }

  /**
   * Get hourly activity data formatted for heatmap visualization
   */
  async getHourlyActivityData(websiteId: string, startDate: Date, endDate: Date): Promise<Array<{ 
    name: string; 
    [key: string]: number | string; 
  }>> {
    try {
      // Get heatmap data from existing method
      const heatmapData = await this.getHeatmapData(websiteId, startDate, endDate);
      
      // Day names in Vietnamese
      const dayNames = [
        'Chủ nhật', // 0 = Sunday
        'Thứ 2',    // 1 = Monday  
        'Thứ 3',    // 2 = Tuesday
        'Thứ 4',    // 3 = Wednesday
        'Thứ 5',    // 4 = Thursday
        'Thứ 6',    // 5 = Friday
        'Thứ 7'     // 6 = Saturday
      ];

      // Initialize result array
      const result = dayNames.map(name => ({ name }));

      // Fill in the data for each day and hour
      for (let weekday = 0; weekday < 7; weekday++) {
        const dayResult: { name: string; [key: string]: number | string } = { 
          name: dayNames[weekday] 
        };

        // Generate all hour slots (00h, 02h, 04h, 06h, 08h, 10h, 12h, 14h, 16h, 18h, 20h, 22h)
        for (let hour = 0; hour < 24; hour += 2) {
          const hourKey = `${hour.toString().padStart(2, '0')}h`;
          
          // Sum up users from this hour and the next hour (since we group by 2-hour slots)
          const hour1Data = heatmapData.find(d => d.weekday === weekday && d.hour === hour);
          const hour2Data = heatmapData.find(d => d.weekday === weekday && d.hour === (hour + 1));
          
          const totalUsers = (hour1Data ? hour1Data.activeUsers : 0) + 
                           (hour2Data ? hour2Data.activeUsers : 0);
          
          dayResult[hourKey] = totalUsers;
        }

        result[weekday] = dayResult;
      }

      return result;

    } catch (error) {
      console.error('Error getting hourly activity data:', error);
      // Return empty structure if error
      const dayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
      return dayNames.map(name => {
        const dayResult: { name: string; [key: string]: number | string } = { name };
        for (let hour = 0; hour < 24; hour += 2) {
          const hourKey = `${hour.toString().padStart(2, '0')}h`;
          dayResult[hourKey] = 0;
        }
        return dayResult;
      });
    }
  }
}