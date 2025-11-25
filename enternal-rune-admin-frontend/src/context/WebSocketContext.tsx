'use client'
import React, { createContext, useContext, ReactNode, useState, useEffect, useRef } from 'react';
import type { Notification } from "@/types/Notification";

interface WebSocketContextType {
    notifications: Notification[];
    addNotification: (notification: Notification) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function WebSocketProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            user: {
                id: "1",
                name: "Terry Franci",
                avatar: "/images/user/user-02.jpg",
            },
            message: "requests permission to change",
            time: "5 min ago",
        },
        {
            user: {
                id: "2",
                name: "Alena Franci",
                avatar: "/images/user/user-03.jpg",
            },
            message: "requests permission to change",
            time: "8 min ago",
        },
        {
            user: {
                id: "3",
                name: "Brandon Philips",
                avatar: "/images/user/user-05.jpg",
            },
            message: "requests permission to change",
            time: "1 hr ago",
        }
    ]);

    const socketRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        let isMounted = true;

        const connect = () => {
            if (!isMounted) return;

            try {
                console.log('🔄 Attempting to connect to WebSocket...');
                const ws = new WebSocket('ws://localhost:8080/notifications?role=admin');
                socketRef.current = ws;

                ws.onopen = () => {
                    console.log('✅ Admin WebSocket connected successfully');
                    
                    // Request notification permission
                    if (typeof window !== 'undefined' && 'Notification' in window) {
                        if (window.Notification.permission === 'default') {
                            window.Notification.requestPermission();
                        }
                    }
                };

                ws.onmessage = (event) => {
                    console.log('📩 Admin received:', event.data);
                    try {
                        const notification: Notification = JSON.parse(event.data);
                        
                        setNotifications((prev) => [notification, ...prev]);

                        if (typeof window !== 'undefined' && 'Notification' in window) {
                            if (window.Notification.permission === 'granted') {
                                new window.Notification('Thông báo đơn hàng mới', {
                                    body: `${notification.user.name} ${notification.message}`,
                                    icon: notification.user.avatar
                                });
                            }
                        }
                    } catch (error) {
                        console.error('Error parsing notification:', error);
                    }
                };

                ws.onerror = (event) => {
                    console.error('❌ Admin WebSocket error - Kiểm tra backend có đang chạy tại http://localhost:8080 không?');
                    console.error('WebSocket URL:', 'ws://localhost:8080/notifications?role=admin');
                };

                ws.onclose = (event) => {
                    console.log('🔌 Admin WebSocket closed', {
                        code: event.code,
                        reason: event.reason,
                        wasClean: event.wasClean
                    });
                    if (isMounted) {
                        console.log('🔄 Reconnecting in 5s...');
                        reconnectTimeoutRef.current = setTimeout(connect, 5000);
                    }
                };
            } catch (error) {
                console.error('Failed to create WebSocket:', error);
                if (isMounted) {
                    reconnectTimeoutRef.current = setTimeout(connect, 5000);
                }
            }
        };

        connect();

        return () => {
            isMounted = false;
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);

    const addNotification = (notification: Notification) => {
        setNotifications((prev) => [notification, ...prev]);
    };

    return (
        <WebSocketContext.Provider value={{ notifications, addNotification }}>
            {children}
        </WebSocketContext.Provider>
    );
}

export function useWebSocketContext() {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocketContext must be used within WebSocketProvider');
    }
    return context;
}
