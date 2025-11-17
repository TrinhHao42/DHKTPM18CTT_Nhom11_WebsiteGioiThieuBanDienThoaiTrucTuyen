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