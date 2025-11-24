import { AnalyticsService } from '../services/analytics';

const analyticsService = new AnalyticsService();

export class AnalyticsController {
  
  /**
   * Get comprehensive analytics dashboard data
   */
  async getDashboard(req: any, res: any) {
    try {
      const { websiteId } = req.params;
      const { startDate, endDate } = req.query;
      
      if (!websiteId) {
        return res.status(400).json({ error: 'Website ID is required' });
      }
      
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
      const end = endDate ? new Date(endDate) : new Date();
      
      const analytics = await analyticsService.getAnalytics(websiteId, start, end);
      
      res.json({
        success: true,
        data: analytics,
        period: {
          startDate: start.toISOString(),
          endDate: end.toISOString(),
        },
      });
    } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  /**
   * Get unique users count
   */
  async getUniqueUsers(req: any, res: any) {
    try {
      const { websiteId } = req.params;
      const { startDate, endDate } = req.query;
      
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate) : new Date();
      
      const totalUsers = await analyticsService.getTotalUsers(websiteId, start, end);
      const newUsers = await analyticsService.getNewUsers(websiteId, start, end);
      const activeUsers = await analyticsService.getActiveUsers(websiteId, start, end);
      
      res.json({
        success: true,
        data: {
          totalUsers,
          newUsers,
          activeUsers,
          returningUsers: totalUsers - newUsers,
        },
      });
    } catch (error) {
      console.error('Users analytics error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  /**
   * Get device breakdown
   */
  async getDeviceBreakdown(req: any, res: any) {
    try {
      const { websiteId } = req.params;
      const { startDate, endDate } = req.query;
      
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate) : new Date();
      
      const deviceBreakdown = await analyticsService.getDeviceBreakdown(websiteId, start, end);
      
      res.json({
        success: true,
        data: deviceBreakdown,
      });
    } catch (error) {
      console.error('Device breakdown error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  /**
   * Get top pages
   */
  async getTopPages(req: any, res: any) {
    try {
      const { websiteId } = req.params;
      const { startDate, endDate } = req.query;
      
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate) : new Date();
      
      const topPages = await analyticsService.getTopPages(websiteId, start, end);
      
      res.json({
        success: true,
        data: topPages,
      });
    } catch (error) {
      console.error('Top pages error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  /**
   * Get traffic sources
   */
  async getTrafficSources(req: any, res: any) {
    try {
      const { websiteId } = req.params;
      const { startDate, endDate } = req.query;
      
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate) : new Date();
      
      const trafficSources = await analyticsService.getTrafficSources(websiteId, start, end);
      
      res.json({
        success: true,
        data: trafficSources,
      });
    } catch (error) {
      console.error('Traffic sources error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  /**
   * Get engagement by hour
   */
  async getEngagementByHour(req: any, res: any) {
    try {
      const { websiteId } = req.params;
      const { startDate, endDate } = req.query;
      
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days
      const end = endDate ? new Date(endDate) : new Date();
      
      const engagementByHour = await analyticsService.getEngagementByHour(websiteId, start, end);
      
      res.json({
        success: true,
        data: engagementByHour,
      });
    } catch (error) {
      console.error('Engagement by hour error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  /**
   * Get heatmap data (weekday x hour)
   */
  async getHeatmapData(req: any, res: any) {
    try {
      const { websiteId } = req.params;
      const { startDate, endDate } = req.query;
      
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate) : new Date();
      
      const heatmapData = await analyticsService.getHeatmapData(websiteId, start, end);
      
      res.json({
        success: true,
        data: heatmapData,
      });
    } catch (error) {
      console.error('Heatmap data error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}