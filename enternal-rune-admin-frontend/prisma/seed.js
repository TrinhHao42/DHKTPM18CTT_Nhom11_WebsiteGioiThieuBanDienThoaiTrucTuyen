const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Sample data for seeding the database
const sampleData = {
    websites: [
        {
            id: 'cmic2k2820000ml8mu0miqhlm',
            name: 'Enternal Rune Admin Dashboard',
            domain: 'enternal-rune-admin.com'
        },
        {
            name: 'Eternal Dynasty',
            domain: 'eternaldynasty.com'
        }
    ],

    // Countries and their data
    countries: [
        'VN', 'US', 'JP', 'SG', 'KR', 'TH', 'MY', 'ID', 'PH', 'CN',
        'AU', 'CA', 'GB', 'DE', 'FR'
    ],

    // Pages for navigation
    pages: [
        '/', '/products', '/about', '/contact', '/blog', '/services',
        '/portfolio', '/pricing', '/support', '/login', '/register',
        '/dashboard', '/profile', '/settings', '/cart', '/checkout', '/analytics'
    ],

    // Traffic sources
    sources: [
        { type: 'organic', value: 'google.com' },
        { type: 'social', value: 'facebook.com' },
        { type: 'direct', value: 'direct' },
        { type: 'referral', value: 'github.com' },
        { type: 'social', value: 'twitter.com' },
        { type: 'organic', value: 'bing.com' },
        { type: 'email', value: 'newsletter' },
        { type: 'paid', value: 'google-ads' },
        { type: 'social', value: 'linkedin.com' },
        { type: 'referral', value: 'stackoverflow.com' }
    ],

    // Event types
    events: [
        'click', 'scroll', 'form_submit', 'download', 'video_play',
        'search', 'share', 'like', 'comment', 'purchase'
    ]
};

// Helper functions
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function clearDatabase() {
    console.log('🧹 Clearing existing data...');
    // Clear in the correct order due to foreign key constraints
    await prisma.event.deleteMany({});
    await prisma.pageView.deleteMany({});
    await prisma.userSession.deleteMany({});
    await prisma.deviceInfo.deleteMany({});
    await prisma.website.deleteMany({});
    console.log('✅ Database cleared');
}

async function seedWebsites() {
    console.log('🌐 Seeding websites...');
    const websites = [];

    for (const site of sampleData.websites) {
        const website = await prisma.website.create({
            data: site
        });
        websites.push(website);
    }

    console.log(`✅ Created ${websites.length} websites`);
    return websites;
}

async function seedDeviceInfo(websites) {
    console.log('💻 Seeding device info...');
    const devices = [];

    // Create device info for the last 30 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);

    const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'];
    const oses = ['Windows', 'macOS', 'Linux', 'iOS', 'Android'];
    const deviceTypes = ['Desktop', 'Mobile', 'Tablet'];

    for (let day = 0; day < 30; day++) {
        const currentDate = new Date(startDate.getTime() + day * 24 * 60 * 60 * 1000);

        for (const website of websites) {
            for (const browser of browsers) {
                for (const os of oses) {
                    for (const deviceType of deviceTypes) {
                        if (Math.random() > 0.3) { // 70% chance to create this combination
                            const deviceInfo = await prisma.deviceInfo.create({
                                data: {
                                    websiteId: website.id,
                                    browser,
                                    os,
                                    device: deviceType,
                                    sessionCount: getRandomNumber(1, 50),
                                    lastSeen: new Date(currentDate.getTime() + getRandomNumber(0, 86400000)), // Random time during the day
                                    date: currentDate
                                }
                            });
                            devices.push(deviceInfo);
                        }
                    }
                }
            }
        }
    }

    console.log(`✅ Created ${devices.length} device info records`);
    return devices;
}

async function seedUserSessions(websites) {
    console.log('👥 Seeding user sessions...');
    const sessions = [];

    // Generate sessions for the last 90 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 90);

    for (let i = 0; i < 5000; i++) {
        const sessionStart = getRandomDate(startDate, endDate);

        const session = await prisma.userSession.create({
            data: {
                websiteId: getRandomElement(websites).id,
                browser: getRandomElement(['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera']),
                os: getRandomElement(['Windows', 'macOS', 'Linux', 'iOS', 'Android']),
                device: getRandomElement(['Desktop', 'Mobile', 'Tablet']),
                screen: getRandomElement(['1920x1080', '1366x768', '375x667', '768x1024', '1440x900']),
                language: getRandomElement(['vi-VN', 'en-US', 'ja-JP', 'ko-KR', 'zh-CN']),
                country: getRandomElement(sampleData.countries),
                region: getRandomElement(['HCM', 'CA', 'TK', 'SL', 'SG', 'BK', 'KL']),
                city: getRandomElement(['Ho Chi Minh City', 'New York', 'Tokyo', 'Seoul', 'Singapore', 'Bangkok', 'Kuala Lumpur']),
                distinctId: Math.random() > 0.3 ? `user_${getRandomNumber(1, 1000)}` : null,
                createdAt: sessionStart
            }
        });

        sessions.push(session);
    }

    console.log(`✅ Created ${sessions.length} user sessions`);
    return sessions;
}

async function seedPageViews(sessions, websites) {
    console.log('📄 Seeding page views...');
    const pageViews = [];

    for (const session of sessions) {
        // Each session has 1-8 page views
        const pageViewCount = getRandomNumber(1, 8);
        let currentTime = new Date(session.createdAt);

        for (let i = 0; i < pageViewCount; i++) {
            const viewDuration = getRandomNumber(30000, 300000); // 30 seconds to 5 minutes in ms
            const nextTime = new Date(currentTime.getTime() + viewDuration);

            const pageView = await prisma.pageView.create({
                data: {
                    sessionId: session.id,
                    websiteId: session.websiteId,
                    urlPath: getRandomElement(sampleData.pages),
                    urlQuery: Math.random() > 0.7 ? '?utm_source=google&utm_medium=organic' : null,
                    pageTitle: `Page Title ${getRandomNumber(1, 100)}`,
                    hostname: getRandomElement(websites).domain,
                    referrerPath: Math.random() > 0.5 ? getRandomElement(sampleData.pages) : null,
                    referrerDomain: Math.random() > 0.3 ? getRandomElement(sampleData.sources).value : null,
                    utmSource: Math.random() > 0.7 ? getRandomElement(['google', 'facebook', 'twitter', 'linkedin']) : null,
                    utmMedium: Math.random() > 0.7 ? getRandomElement(['cpc', 'organic', 'social', 'email']) : null,
                    utmCampaign: Math.random() > 0.8 ? getRandomElement(['summer_sale', 'new_product', 'retargeting']) : null,
                    createdAt: currentTime
                }
            });

            pageViews.push(pageView);
            currentTime = nextTime;
        }
    }

    console.log(`✅ Created ${pageViews.length} page views`);
    return pageViews;
}

async function seedEvents(sessions) {
    console.log('🎯 Seeding events...');
    const events = [];

    for (const session of sessions) {
        // Each session has 0-15 events
        const eventCount = getRandomNumber(0, 15);

        for (let i = 0; i < eventCount; i++) {
            // Random time within an hour after session start
            const eventTime = new Date(session.createdAt.getTime() + getRandomNumber(0, 3600000));

            const event = await prisma.event.create({
                data: {
                    sessionId: session.id,
                    websiteId: session.websiteId,
                    eventName: getRandomElement(sampleData.events),
                    eventData: {
                        element: getRandomElement(['button', 'link', 'form', 'image']),
                        value: getRandomNumber(1, 100),
                        position: getRandomElement(['header', 'sidebar', 'footer', 'main'])
                    },
                    urlPath: getRandomElement(sampleData.pages),
                    pageTitle: `Page Title ${getRandomNumber(1, 100)}`,
                    createdAt: eventTime
                }
            });

            events.push(event);
        }
    }

    console.log(`✅ Created ${events.length} events`);
    return events;
}

async function main() {
    try {
        console.log('🚀 Starting database seeding...\n');

        await clearDatabase();

        const websites = await seedWebsites();
        const devices = await seedDeviceInfo(websites);
        const sessions = await seedUserSessions(websites);
        const pageViews = await seedPageViews(sessions, websites);
        const events = await seedEvents(sessions);

        console.log('\n🎉 Database seeding completed successfully!');
        console.log(`
📊 Summary:
- Websites: ${websites.length}
- Device Info: ${devices.length}
- User Sessions: ${sessions.length}
- Page Views: ${pageViews.length}
- Events: ${events.length}
    `);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main().catch(console.error);