import { Request, Response } from 'express';
import { TrackingService } from '../services/tracking';
import { TrackingData, EventData } from '../lib/types';
import { prisma } from '../lib/prisma';

const trackingService = new TrackingService();

export class TrackingController {
  
  /**
   * Handle tracking requests (page views and events)
   */
  async track(req: Request, res: Response) {
    try {
      const { type, payload } = req.body;
      
      if (!type || !payload || !payload.website) {
        return res.status(400).json({ error: 'Invalid tracking data' });
      }
      
      // Validate website exists
      const website = await prisma.website.findUnique({
        where: { id: payload.website }
      });
      
      if (!website) {
        return res.status(404).json({ 
          error: 'Website not found',
          message: `Website with ID '${payload.website}' does not exist. Please create it first using POST /api/websites`
        });
      }
      
      // Create or get session
      const session = await trackingService.createSession(payload as TrackingData, req as any);
      
      // Update device info aggregation
      await trackingService.updateDeviceInfo(session);
      
      if (type === 'event') {
        // Track page view
        await trackingService.trackPageView(session, payload as TrackingData);
        
        // Track custom event if event name is provided
        if (payload.name) {
          await trackingService.trackEvent(session, payload as EventData);
        }
      }
      
      res.json({ 
        success: true, 
        sessionId: session.id,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Tracking error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  /**
   * Health check endpoint
   */
  async health(req: Request, res: Response) {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  }
}