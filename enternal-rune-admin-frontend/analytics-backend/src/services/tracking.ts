import { prisma } from '../lib/prisma';
import { detectDevice, getClientIP } from '../lib/detect';
import { uuid } from '../lib/crypto';
import { TrackingData, EventData, SessionInfo } from '../lib/types';

export class TrackingService {
  
  /**
   * Create or update a user session
   */
  async createSession(data: TrackingData, request: Request): Promise<SessionInfo> {
    const userAgent = data.userAgent || request.headers.get('user-agent') || '';
    const ip = getClientIP(request);
    const { browser, os, device } = detectDevice(userAgent);
    
    // Create session ID based on website, IP, and user agent
    const sessionId = uuid(data.website, ip, userAgent);
    
    // Check if session exists (within last 30 minutes)
    const existingSession = await prisma.userSession.findFirst({
      where: {
        id: sessionId,
        websiteId: data.website,
        createdAt: {
          gte: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        },
      },
    });
    
    if (existingSession) {
      return existingSession as any;
    }
    
    // Create new session
    const session = await prisma.userSession.create({
      data: {
        id: sessionId,
        websiteId: data.website,
        browser,
        os,
        device,
        screen: data.screen,
        language: data.language,
        // Note: You would need to add GeoIP service for country/region/city
        country: null,
        region: null,
        city: null,
      },
    });
    
    return session as any;
  }
  
  /**
   * Track a page view
   */
  async trackPageView(session: SessionInfo, data: TrackingData): Promise<void> {
    const url = new URL(data.url || '/', 'https://localhost');
    
    await prisma.pageView.create({
      data: {
        sessionId: session.id,
        websiteId: data.website,
        urlPath: url.pathname,
        urlQuery: url.search.substring(1),
        pageTitle: data.title,
        hostname: data.hostname,
        referrerPath: data.referrer ? new URL(data.referrer, 'https://localhost').pathname : null,
        referrerDomain: data.referrer ? new URL(data.referrer, 'https://localhost').hostname : null,
        utmSource: url.searchParams.get('utm_source'),
        utmMedium: url.searchParams.get('utm_medium'),
        utmCampaign: url.searchParams.get('utm_campaign'),
      },
    });
  }
  
  /**
   * Track a custom event
   */
  async trackEvent(session: SessionInfo, data: EventData): Promise<void> {
    const url = new URL(data.url || '/', 'https://localhost');
    
    await prisma.event.create({
      data: {
        sessionId: session.id,
        websiteId: data.website,
        eventName: data.name,
        eventData: data.data || undefined,
        urlPath: url.pathname,
        pageTitle: data.title,
      },
    });
  }
  
  /**
   * Update device info aggregation table
   */
  async updateDeviceInfo(session: SessionInfo): Promise<void> {
    if (!session.browser || !session.os || !session.device) return;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    await prisma.deviceInfo.upsert({
      where: {
        websiteId_browser_os_device_date: {
          websiteId: session.websiteId,
          browser: session.browser,
          os: session.os,
          device: session.device,
          date: today,
        },
      },
      update: {
        sessionCount: {
          increment: 1,
        },
        lastSeen: new Date(),
      },
      create: {
        websiteId: session.websiteId,
        browser: session.browser,
        os: session.os,
        device: session.device,
        date: today,
        sessionCount: 1,
      },
    });
  }
}