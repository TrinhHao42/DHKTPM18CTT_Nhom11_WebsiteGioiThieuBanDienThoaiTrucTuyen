export type Notification = {
    type: string;
    userId: number;
    userName: string;
    message: string;
    timestamp: string;
}

// Display format for UI (transformed from backend notification)
export type DisplayNotification = {
    user: {
        id: string;
        name: string;
        avatar: string;
    },
    message: string;
    time: string;
}