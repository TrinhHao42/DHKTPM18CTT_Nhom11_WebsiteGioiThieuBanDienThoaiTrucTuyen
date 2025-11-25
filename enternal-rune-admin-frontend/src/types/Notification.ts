export type Notification = {
    user: {
        id: string;
        name: string;
        avatar: string;
    },
    message: string;
    time: string;
    status: "online" | "offline" | "error";
}

export type OrderNotification = {
    type: "NEW_ORDER" | "CANCEL_ORDER" | "REFUND_CANCEL_REQUEST" | "REFUND_RETURN_REQUEST";
    orderId: number;
    userId: number;
    userName: string;
    userAvatar: string;
    message: string;
    timestamp: string;
    orderAmount: number;
}

export function convertOrderNotificationToNotification(orderNotif: OrderNotification): Notification {
    // Calculate relative time
    const now = new Date();
    const timestamp = new Date(orderNotif.timestamp);
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    let timeStr: string;
    if (diffMins < 1) {
        timeStr = "Vừa xong";
    } else if (diffMins < 60) {
        timeStr = `${diffMins} phút trước`;
    } else if (diffMins < 1440) {
        const hours = Math.floor(diffMins / 60);
        timeStr = `${hours} giờ trước`;
    } else {
        const days = Math.floor(diffMins / 1440);
        timeStr = `${days} ngày trước`;
    }

    // Determine status based on notification type
    let status: "online" | "offline" | "error";
    switch (orderNotif.type) {
        case "NEW_ORDER":
            status = "online";
            break;
        case "CANCEL_ORDER":
            status = "error";
            break;
        case "REFUND_CANCEL_REQUEST":
        case "REFUND_RETURN_REQUEST":
            status = "error";
            break;
        default:
            status = "offline";
    }

    return {
        user: {
            id: orderNotif.userId.toString(),
            name: orderNotif.userName,
            avatar: orderNotif.userAvatar
        },
        message: orderNotif.message,
        time: timeStr,
        status: status
    };
}