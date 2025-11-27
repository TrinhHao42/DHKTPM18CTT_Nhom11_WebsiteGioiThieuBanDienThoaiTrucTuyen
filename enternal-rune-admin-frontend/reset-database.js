import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetDatabase() {
    try {
        console.log('🗑️  Bắt đầu xóa toàn bộ dữ liệu...');

        // Xóa theo thứ tự để tránh foreign key constraint

        // 1. Xóa events
        const eventsDeleted = await prisma.event.deleteMany({});
        console.log(`✅ Đã xóa ${eventsDeleted.count} events`);

        // 2. Xóa page_views  
        const pageViewsDeleted = await prisma.pageView.deleteMany({});
        console.log(`✅ Đã xóa ${pageViewsDeleted.count} page views`);

        // 3. Xóa user_sessions
        const sessionsDeleted = await prisma.userSession.deleteMany({});
        console.log(`✅ Đã xóa ${sessionsDeleted.count} user sessions`);

        // 4. Xóa websites
        const websitesDeleted = await prisma.website.deleteMany({});
        console.log(`✅ Đã xóa ${websitesDeleted.count} websites`);

        const deviceInfo = await prisma.deviceInfo.deleteMany({});
        console.log(`✅ Đã xóa ${deviceInfo.count} device info`);

        console.log('\n📊 Kiểm tra database sau khi xóa:');

        // Kiểm tra số lượng records còn lại
        const remainingEvents = await prisma.event.count();
        const remainingPageViews = await prisma.pageView.count();
        const remainingSessions = await prisma.userSession.count();
        const remainingWebsites = await prisma.website.count();
        const remainingDeviceInfo = await prisma.deviceInfo.count();

        console.log(`- Events: ${remainingEvents}`);
        console.log(`- Page Views: ${remainingPageViews}`);
        console.log(`- User Sessions: ${remainingSessions}`);
        console.log(`- Websites: ${remainingWebsites}`);
        console.log(`- Device Info: ${remainingDeviceInfo}`);

        const totalRemaining = remainingEvents + remainingPageViews + remainingSessions + remainingWebsites + remainingDeviceInfo;

        if (totalRemaining === 0) {
            console.log('\n🎉 Database đã được xóa hoàn toàn! Sẵn sàng cho testing.');
        } else {
            console.log(`\n⚠️  Còn lại ${totalRemaining} records trong database`);
        }

    } catch (error) {
        console.error('❌ Lỗi khi xóa database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

resetDatabase();