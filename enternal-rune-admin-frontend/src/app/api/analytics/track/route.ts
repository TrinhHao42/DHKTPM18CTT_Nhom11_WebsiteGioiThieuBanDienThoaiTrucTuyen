import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Define interfaces for type safety
interface TrackingPayload {
  type: 'pageview' | 'event' | 'page_unload';
  sessionId: string;
  userId: string;
  websiteId: string;
  timestamp: number;
  url: string;
  path: string;
  title: string;
  deviceInfo: {
    userAgent: string;
    language: string;
    platform: string;
    screenResolution: string;
    viewportSize: string;
    timezone: string;
    referrer: string;
    browser: string;
    os: string;
    device: string;
  };
  locationInfo: {
    country: string | null;
    region: string | null;
    city: string | null;
  };
  eventName?: string;
  eventData?: Record<string, never>;
  timeOnPage?: number;
  interactions?: number;
  maxScrollDepth?: number;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  utmContent?: string | null;
}

// Simple userAgent parser for fallback
function parseUserAgent(userAgent: string) {
  const ua = userAgent.toLowerCase();
  
  // Browser detection
  let browser = 'Unknown';
  if (ua.includes('chrome') && !ua.includes('edg')) browser = 'Chrome';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
  else if (ua.includes('edg')) browser = 'Edge';
  else if (ua.includes('opera')) browser = 'Opera';
  
  // OS detection
  let os = 'Unknown';
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('macintosh') || ua.includes('mac os')) os = 'macOS';
  else if (ua.includes('linux')) os = 'Linux';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';
  
  // Device detection
  let device = 'Desktop';
  if (ua.includes('mobile')) device = 'Mobile';
  else if (ua.includes('tablet') || ua.includes('ipad')) device = 'Tablet';
  
  return { browser, os, device };
}

export async function POST(request: NextRequest) {
  try {
    const rawData = await request.json();
    
    // Handle both new format (with deviceInfo) and simple format (with userAgent)
    let data: TrackingPayload;
    
    if (rawData.deviceInfo) {
      // New format - use as is
      data = rawData as TrackingPayload;
    } else {
      // Legacy/simple format - convert to new format
      const userAgentInfo = parseUserAgent(rawData.userAgent || '');
      
      data = {
        ...rawData,
        path: rawData.path || new URL(rawData.url || 'http://localhost').pathname,
        deviceInfo: {
          userAgent: rawData.userAgent || 'Unknown',
          language: rawData.language || 'en-US',
          platform: rawData.platform || 'Unknown',
          screenResolution: rawData.screen || 'Unknown',
          viewportSize: rawData.viewport || 'Unknown',
          timezone: rawData.timezone || 'UTC',
          referrer: rawData.referrer || '',
          browser: userAgentInfo.browser,
          os: userAgentInfo.os,
          device: userAgentInfo.device
        },
        locationInfo: {
          country: rawData.country || null,
          region: rawData.region || null,
          city: rawData.city || null
        }
      };
    }
    
    // Validate required fields
    const {
      type,
      sessionId,
      userId,
      websiteId,
      timestamp,
      url,
      path,
      title,
      deviceInfo,
      locationInfo,
      eventName,
      eventData,
      timeOnPage,
      interactions,
      maxScrollDepth,
      utmSource,
      utmMedium,
      utmCampaign
    } = data;
    
    if (!websiteId || !sessionId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: websiteId and sessionId are required' },
        { status: 400 }
      );
    }
    
    // Validate website exists
    const website = await prisma.website.findUnique({
      where: { id: websiteId }
    });
    
    if (!website) {
      // Create website if it doesn't exist (for development)
      if (process.env.NODE_ENV === 'development') {
        await prisma.website.create({
          data: {
            id: websiteId,
            name: new URL(url).hostname,
            domain: new URL(url).hostname
          }
        });
        console.log(`[Analytics] Created new website: ${websiteId}`);
      } else {
        return NextResponse.json(
          { success: false, error: 'Website not found' },
          { status: 404 }
        );
      }
    }
    
    const eventTimestamp = new Date(timestamp);
    
    // Handle different event types
    switch (type) {
      case 'pageview':
      case 'page_unload':
        await handlePageViewEvent({
          sessionId,
          userId,
          websiteId,
          url,
          path,
          title,
          deviceInfo,
          locationInfo,
          eventTimestamp,
          timeOnPage,
          interactions,
          maxScrollDepth,
          utmSource,
          utmMedium,
          utmCampaign,
          isUnload: type === 'page_unload'
        });
        break;
        
      case 'event':
        if (!eventName) {
          return NextResponse.json(
            { success: false, error: 'Event name is required for event type' },
            { status: 400 }
          );
        }
        
        await handleCustomEvent({
          sessionId,
          websiteId,
          eventName,
          eventData,
          path,
          title,
          eventTimestamp
        });
        break;
        
      default:
        return NextResponse.json(
          { success: false, error: `Unknown event type: ${type}` },
          { status: 400 }
        );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Tracking data recorded successfully',
      timestamp: eventTimestamp.toISOString()
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
    
  } catch (error) {
    console.error('[Analytics API] Error:', error);
    
    // Return detailed error in development
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? (error instanceof Error ? error.message : 'Unknown error')
      : 'Internal server error';
      
    return NextResponse.json(
      { success: false, error: errorMessage },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );
  }
}

// Handle page view and page unload events
async function handlePageViewEvent({
  sessionId,
  userId,
  websiteId,
  url,
  path,
  title,
  deviceInfo,
  locationInfo,
  eventTimestamp,
  timeOnPage,
  interactions,
  maxScrollDepth,
  utmSource,
  utmMedium,
  utmCampaign,
  isUnload = false
}: {
  sessionId: string;
  userId: string;
  websiteId: string;
  url: string;
  path: string;
  title: string;
  deviceInfo: TrackingPayload['deviceInfo'];
  locationInfo: TrackingPayload['locationInfo'];
  eventTimestamp: Date;
  timeOnPage?: number;
  interactions?: number;
  maxScrollDepth?: number;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  isUnload?: boolean;
}) {
  try {
    // Create or update user session
    const session = await prisma.userSession.upsert({
      where: { id: sessionId },
      update: {
        updatedAt: eventTimestamp,
      },
      create: {
        id: sessionId,
        websiteId,
        distinctId: userId,
        browser: deviceInfo.browser || 'Unknown',
        os: deviceInfo.os || 'Unknown',
        device: deviceInfo.device || 'Unknown',
        screen: deviceInfo.screenResolution || 'Unknown',
        language: deviceInfo.language || 'Unknown',
        country: locationInfo.country || 'Unknown',
        region: locationInfo.region || 'Unknown',
        city: locationInfo.city || 'Unknown',
        createdAt: eventTimestamp,
        updatedAt: eventTimestamp,
      }
    });
    
    // Don't create page view for page unload events
    if (!isUnload) {
      // Extract domain from referrer
      let referrerDomain: string | null = null;
      let referrerPath: string | null = null;
      
      if (deviceInfo.referrer && deviceInfo.referrer !== url) {
        try {
          const referrerUrl = new URL(deviceInfo.referrer);
          referrerDomain = referrerUrl.hostname;
          referrerPath = referrerUrl.pathname;
        } catch (e) {
          // Invalid referrer URL
        }
      }
      
      // Create page view record
      await prisma.pageView.create({
        data: {
          sessionId,
          websiteId,
          urlPath: path || '/',
          urlQuery: new URL(url).search || null,
          pageTitle: title || 'Unknown',
          hostname: new URL(url).hostname,
          referrerPath,
          referrerDomain,
          utmSource,
          utmMedium,
          utmCampaign,
          createdAt: eventTimestamp
        }
      });
    }
    
    // Create engagement metrics if available
    if (timeOnPage !== undefined || interactions !== undefined || maxScrollDepth !== undefined) {
      await prisma.event.create({
        data: {
          sessionId,
          websiteId,
          eventName: isUnload ? 'page_unload' : 'page_engagement',
          eventData: {
            timeOnPage: timeOnPage || 0,
            interactions: interactions || 0,
            maxScrollDepth: maxScrollDepth || 0,
            url,
            timestamp: eventTimestamp.toISOString()
          },
          urlPath: path || '/',
          pageTitle: title || 'Unknown',
          createdAt: eventTimestamp
        }
      });
    }
    
    console.log(`[Analytics] ${isUnload ? 'Page unload' : 'Page view'} recorded:`, {
      sessionId: sessionId.substring(0, 8) + '...',
      websiteId,
      path,
      timeOnPage,
      interactions
    });
    
  } catch (error) {
    console.error('[Analytics] Error handling page view event:', error);
    throw error;
  }
}

// Handle custom events
async function handleCustomEvent({
  sessionId,
  websiteId,
  eventName,
  eventData,
  path,
  title,
  eventTimestamp
}: {
  sessionId: string;
  websiteId: string;
  eventName: string;
  eventData?: Record<string, never>;
  path: string;
  title: string;
  eventTimestamp: Date;
}) {
  try {
    // Create event record
    await prisma.event.create({
      data: {
        sessionId,
        websiteId,
        eventName,
        eventData: eventData || {},
        urlPath: path || '/',
        pageTitle: title || 'Unknown',
        createdAt: eventTimestamp
      }
    });
    
    console.log('[Analytics] Custom event recorded:', {
      sessionId: sessionId.substring(0, 8) + '...',
      websiteId,
      eventName,
      path
    });
    
  } catch (error) {
    console.error('[Analytics] Error handling custom event:', error);
    throw error;
  }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}