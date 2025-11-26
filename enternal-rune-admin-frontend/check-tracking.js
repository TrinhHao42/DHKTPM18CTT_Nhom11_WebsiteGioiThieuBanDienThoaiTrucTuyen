import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTrackingData() {
  try {
    console.log('📊 Kiểm tra dữ liệu tracking hiện tại...\n');
    
    // Kiểm tra websites
    const websites = await prisma.website.findMany({
      select: {
        id: true,
        name: true,
        domain: true,
        createdAt: true
      }
    });
    
    console.log(`🌐 Websites (${websites.length}):`);
    websites.forEach(w => {
      console.log(`   - ${w.name} (${w.domain}) - ${w.id.substring(0, 8)}...`);
    });
    
    // Kiểm tra sessions
    const sessions = await prisma.userSession.findMany({
      select: {
        id: true,
        distinctId: true,
        browser: true,
        os: true,
        device: true,
        country: true,
        createdAt: true,
        websiteId: true
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    
    console.log(`\n👥 User Sessions (${sessions.length} total, showing latest 10):`);
    sessions.forEach(s => {
      console.log(`   - ${s.id.substring(0, 8)}... | ${s.browser}/${s.os}/${s.device} | ${s.country} | ${s.createdAt.toLocaleString()}`);
    });
    
    // Kiểm tra page views
    const pageViews = await prisma.pageView.findMany({
      select: {
        id: true,
        urlPath: true,
        pageTitle: true,
        hostname: true,
        referrerDomain: true,
        createdAt: true,
        sessionId: true
      },
      orderBy: { createdAt: 'desc' },
      take: 15
    });
    
    console.log(`\n📄 Page Views (${pageViews.length} total, showing latest 15):`);
    pageViews.forEach(pv => {
      console.log(`   - ${pv.urlPath} | "${pv.pageTitle}" | ${pv.hostname} | ${pv.createdAt.toLocaleString()}`);
    });
    
    // Kiểm tra events
    const events = await prisma.event.findMany({
      select: {
        id: true,
        eventName: true,
        eventData: true,
        urlPath: true,
        pageTitle: true,
        createdAt: true,
        sessionId: true
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    
    console.log(`\n🎯 Events (${events.length} total, showing latest 20):`);
    events.forEach(e => {
      const data = typeof e.eventData === 'object' ? JSON.stringify(e.eventData) : e.eventData;
      const dataPreview = data && data.length > 50 ? data.substring(0, 50) + '...' : data;
      console.log(`   - ${e.eventName} | ${e.urlPath} | ${e.createdAt.toLocaleString()}`);
      if (dataPreview && dataPreview !== '{}') {
        console.log(`     Data: ${dataPreview}`);
      }
    });
    
    // Thống kê tổng quan
    const totalEvents = await prisma.event.count();
    const totalPageViews = await prisma.pageView.count();
    const totalSessions = await prisma.userSession.count();
    const totalWebsites = await prisma.website.count();
    
    console.log(`\n📈 Tổng quan:`);
    console.log(`   - Total Websites: ${totalWebsites}`);
    console.log(`   - Total Sessions: ${totalSessions}`);
    console.log(`   - Total Page Views: ${totalPageViews}`);
    console.log(`   - Total Events: ${totalEvents}`);
    
    // Event types breakdown
    const eventTypes = await prisma.event.groupBy({
      by: ['eventName'],
      _count: {
        eventName: true
      },
      orderBy: {
        _count: {
          eventName: 'desc'
        }
      }
    });
    
    console.log(`\n🎪 Event Types:`);
    eventTypes.forEach(et => {
      console.log(`   - ${et.eventName}: ${et._count.eventName} times`);
    });
    
  } catch (error) {
    console.error('❌ Lỗi khi kiểm tra dữ liệu:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTrackingData();