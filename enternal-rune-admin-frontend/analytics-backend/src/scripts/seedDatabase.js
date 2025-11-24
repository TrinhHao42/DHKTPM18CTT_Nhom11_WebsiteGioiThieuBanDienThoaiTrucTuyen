const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Helper functions
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateRandomString(length) {
  return Math.random().toString(36).substring(2, length + 2);
}

// Sample data arrays
const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'];
const operatingSystems = ['Windows', 'macOS', 'Linux', 'iOS', 'Android'];
const devices = ['Desktop', 'Mobile', 'Tablet'];
const screens = ['1920x1080', '1366x768', '1440x900', '375x667', '414x896'];
const languages = ['vi-VN', 'en-US', 'ja-JP', 'ko-KR', 'zh-CN'];
const countries = ['VN', 'US', 'JP', 'KR', 'CN', 'GB', 'DE', 'FR', 'CA', 'AU'];
const regions = ['HCM', 'HN', 'DN', 'CA', 'NY', 'TX', 'TK', 'OS', 'SE', 'BC'];
const cities = ['Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Los Angeles', 'New York', 'Tokyo', 'Seoul', 'London'];

const urlPaths = [
  '/', '/about', '/contact', '/products', '/services', '/blog', '/pricing', 
  '/features', '/support', '/login', '/register', '/dashboard', '/profile',
  '/blog/article-1', '/blog/article-2', '/products/product-1', '/products/product-2'
];

const pageTitles = [
  'Home Page', 'About Us', 'Contact', 'Our Products', 'Services', 'Blog', 
  'Pricing Plans', 'Features', 'Support Center', 'Login', 'Register', 
  'Dashboard', 'User Profile', 'How to Guide', 'Product Reviews'
];

const referrerDomains = [
  'google.com', 'facebook.com', 'twitter.com', 'linkedin.com', 'instagram.com',
  'youtube.com', 'github.com', 'stackoverflow.com', 'medium.com', 'reddit.com'
];

const utmSources = ['google', 'facebook', 'twitter', 'email', 'direct', 'organic'];
const utmMediums = ['cpc', 'social', 'email', 'organic', 'referral'];
const utmCampaigns = ['summer-sale', 'winter-promo', 'newsletter', 'social-campaign', 'brand-awareness'];

const eventNames = [
  'click', 'scroll', 'form_submit', 'download', 'video_play', 'purchase',
  'signup', 'login', 'logout', 'search', 'share', 'like', 'comment'
];

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // Create a sample website
    const website = await prisma.website.upsert({
      where: { id: 'website-1' },
      update: {},
      create: {
        id: 'website-1',
        name: 'Enternal Rune Admin',
        domain: 'admin.enternalrune.com',
      }
    });

    console.log('✅ Website created:', website.name);

    // Generate data for the last 30 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const sessionsToCreate = [];
    const pageViewsToCreate = [];
    const eventsToCreate = [];
    const deviceInfoToCreate = [];

    // Generate 5000 user sessions over 30 days
    for (let i = 0; i < 5000; i++) {
      const sessionId = `session-${i + 1}`;
      const createdAt = getRandomDate(startDate, endDate);
      const browser = getRandomElement(browsers);
      const os = getRandomElement(operatingSystems);
      const device = getRandomElement(devices);

      const session = {
        id: sessionId,
        websiteId: website.id,
        browser,
        os,
        device,
        screen: getRandomElement(screens),
        language: getRandomElement(languages),
        country: getRandomElement(countries),
        region: getRandomElement(regions),
        city: getRandomElement(cities),
        distinctId: `user-${Math.floor(Math.random() * 2000) + 1}`, // 2000 unique users
        createdAt,
        updatedAt: createdAt,
      };

      sessionsToCreate.push(session);

      // Generate 1-5 page views per session
      const pageViewCount = Math.floor(Math.random() * 5) + 1;
      for (let j = 0; j < pageViewCount; j++) {
        const pageViewCreatedAt = new Date(createdAt.getTime() + j * 30000); // 30 seconds apart

        const pageView = {
          id: `pageview-${i}-${j}`,
          sessionId,
          websiteId: website.id,
          urlPath: getRandomElement(urlPaths),
          urlQuery: Math.random() > 0.7 ? '?utm_source=google&utm_medium=cpc' : null,
          pageTitle: getRandomElement(pageTitles),
          hostname: 'admin.enternalrune.com',
          referrerPath: Math.random() > 0.5 ? getRandomElement(urlPaths) : null,
          referrerDomain: Math.random() > 0.6 ? getRandomElement(referrerDomains) : null,
          utmSource: Math.random() > 0.7 ? getRandomElement(utmSources) : null,
          utmMedium: Math.random() > 0.7 ? getRandomElement(utmMediums) : null,
          utmCampaign: Math.random() > 0.8 ? getRandomElement(utmCampaigns) : null,
          createdAt: pageViewCreatedAt,
        };

        pageViewsToCreate.push(pageView);

        // Generate 0-3 events per page view
        const eventCount = Math.floor(Math.random() * 4);
        for (let k = 0; k < eventCount; k++) {
          const eventCreatedAt = new Date(pageViewCreatedAt.getTime() + k * 10000); // 10 seconds apart

          const event = {
            id: `event-${i}-${j}-${k}`,
            sessionId,
            websiteId: website.id,
            eventName: getRandomElement(eventNames),
            eventData: JSON.stringify({
              value: Math.floor(Math.random() * 100),
              category: getRandomElement(['navigation', 'engagement', 'conversion']),
            }),
            urlPath: pageView.urlPath,
            pageTitle: pageView.pageTitle,
            createdAt: eventCreatedAt,
          };

          eventsToCreate.push(event);
        }
      }

      // Track device info for aggregation
      const dateKey = createdAt.toISOString().split('T')[0];
      const deviceKey = `${website.id}-${browser}-${os}-${device}-${dateKey}`;
      
      const existingDeviceInfo = deviceInfoToCreate.find(d => 
        d.websiteId === website.id && 
        d.browser === browser && 
        d.os === os && 
        d.device === device && 
        d.date.toISOString().split('T')[0] === dateKey
      );

      if (existingDeviceInfo) {
        existingDeviceInfo.sessionCount++;
        existingDeviceInfo.lastSeen = createdAt;
      } else {
        deviceInfoToCreate.push({
          id: `device-${deviceInfoToCreate.length + 1}`,
          websiteId: website.id,
          browser,
          os,
          device,
          sessionCount: 1,
          lastSeen: createdAt,
          date: new Date(dateKey),
        });
      }
    }

    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await prisma.event.deleteMany({ where: { websiteId: website.id } });
    await prisma.pageView.deleteMany({ where: { websiteId: website.id } });
    await prisma.userSession.deleteMany({ where: { websiteId: website.id } });
    await prisma.deviceInfo.deleteMany({ where: { websiteId: website.id } });

    // Insert data in batches
    console.log('📝 Inserting sessions...');
    for (let i = 0; i < sessionsToCreate.length; i += 100) {
      const batch = sessionsToCreate.slice(i, i + 100);
      await prisma.userSession.createMany({ data: batch });
    }

    console.log('📝 Inserting page views...');
    for (let i = 0; i < pageViewsToCreate.length; i += 100) {
      const batch = pageViewsToCreate.slice(i, i + 100);
      await prisma.pageView.createMany({ data: batch });
    }

    console.log('📝 Inserting events...');
    for (let i = 0; i < eventsToCreate.length; i += 100) {
      const batch = eventsToCreate.slice(i, i + 100);
      await prisma.event.createMany({ data: batch });
    }

    console.log('📝 Inserting device info...');
    for (let i = 0; i < deviceInfoToCreate.length; i += 100) {
      const batch = deviceInfoToCreate.slice(i, i + 100);
      await prisma.deviceInfo.createMany({ data: batch });
    }

    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Generated:`);
    console.log(`   - ${sessionsToCreate.length} user sessions`);
    console.log(`   - ${pageViewsToCreate.length} page views`);
    console.log(`   - ${eventsToCreate.length} events`);
    console.log(`   - ${deviceInfoToCreate.length} device info records`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('🎉 Seeding process finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding process failed:', error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };