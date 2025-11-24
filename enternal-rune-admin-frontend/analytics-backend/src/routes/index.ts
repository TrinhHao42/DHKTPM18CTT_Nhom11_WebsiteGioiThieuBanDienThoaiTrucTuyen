import { TrackingController } from '../controllers/tracking';
import { AnalyticsController } from '../controllers/analytics';
import analyticsRoutes from './analytics';

const trackingController = new TrackingController();
const analyticsController = new AnalyticsController();

export function setupRoutes(app: any) {

  // Tracking endpoints
  app.post('/api/track', trackingController.track.bind(trackingController));
  app.get('/api/health', trackingController.health.bind(trackingController));


  // New dashboard analytics endpoints
  app.use('/api', analyticsRoutes);

  // Legacy Analytics endpoints (keep for backward compatibility)
  app.get('/api/analytics/:websiteId/dashboard', analyticsController.getDashboard.bind(analyticsController));
  app.get('/api/analytics/:websiteId/users', analyticsController.getUniqueUsers.bind(analyticsController));
  app.get('/api/analytics/:websiteId/devices', analyticsController.getDeviceBreakdown.bind(analyticsController));
  app.get('/api/analytics/:websiteId/pages', analyticsController.getTopPages.bind(analyticsController));
  app.get('/api/analytics/:websiteId/sources', analyticsController.getTrafficSources.bind(analyticsController));
  app.get('/api/analytics/:websiteId/engagement', analyticsController.getEngagementByHour.bind(analyticsController));
  app.get('/api/analytics/:websiteId/heatmap', analyticsController.getHeatmapData.bind(analyticsController));

  // CORS preflight
  app.options('*', (req: any, res: any) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
  });
}