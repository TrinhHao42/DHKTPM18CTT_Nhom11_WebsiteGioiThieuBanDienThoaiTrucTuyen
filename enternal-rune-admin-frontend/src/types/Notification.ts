// WebSocket notification format (from backend)
export type Notification = {
    type: string;
    userId: number;
    userName: string;
    message: string;
    timestamp: string;
}

// Backend stored notification format
export type BackendNotification = {
    id: number;
    type: string;
    userId: number | null;
    userName: string;
    message: string;
    timestamp: string;
    isRead: boolean;
}

// Display format for UI (transformed from backend notification)
export type DisplayNotification = {
    id?: number;
    user: {
        id: string;
        name: string;
        avatar: string;
    },
    message: string;
    time: string;
    isRead?: boolean;
}