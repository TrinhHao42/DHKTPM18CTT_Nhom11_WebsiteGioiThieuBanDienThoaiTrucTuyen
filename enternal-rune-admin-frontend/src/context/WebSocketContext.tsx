'use client'
import { createContext, useContext, ReactNode, useState, useEffect, useRef } from 'react';
import type { Notification } from "@/types/Notification";
import { useAuth } from './AuthContext';

interface WebSocketContextType {
    notifications: Notification[];
    addNotification: (notification: Notification) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function WebSocketProvider({ children }: { children: ReactNode }) {
    const { isAuthenticated, token } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const socketRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isConnectingRef = useRef(false);

    useEffect(() => {
        if (!isAuthenticated || !token) {
            console.log('⏸️ WebSocket: Waiting for authentication...');
            return;
        }

        let isMounted = true;

        const connect = () => {
            if (!isMounted || !isAuthenticated) return;

            // Tránh tạo multiple connections
            if (socketRef.current?.readyState === WebSocket.CONNECTING || 
                socketRef.current?.readyState === WebSocket.OPEN) {
                console.log('⏭️ WebSocket already connecting or connected, skipping...');
                return;
            }

            // Tránh race condition khi Strict Mode mount 2 lần
            if (isConnectingRef.current) {
                console.log('⏭️ Connection already in progress, skipping...');
                return;
            }

            try {
                isConnectingRef.current = true;
                console.log('🔄 Attempting to connect to WebSocket...');
                // Truyền token vào WebSocket URL
                const ws = new WebSocket(`ws://localhost:8080/notifications?role=admin&token=${token}`);
                socketRef.current = ws;

                ws.onopen = () => {
                    isConnectingRef.current = false;
                    console.log('✅ Admin WebSocket connected successfully');

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
                    isConnectingRef.current = false;
                    console.error('❌ Admin WebSocket error - Kiểm tra backend có đang chạy tại http://localhost:8080 không?');
                    console.error('WebSocket URL:', `ws://localhost:8080/notifications?role=admin&token=${token}`);
                };

                ws.onclose = (event) => {
                    isConnectingRef.current = false;
                    console.log('🔌 Admin WebSocket closed', {
                        code: event.code,
                        reason: event.reason,
                        wasClean: event.wasClean
                    });
                    if (isMounted && isAuthenticated) {
                        console.log('🔄 Reconnecting in 5s...');
                        reconnectTimeoutRef.current = setTimeout(connect, 5000);
                    }
                };
            } catch (error) {
                isConnectingRef.current = false;
                console.error('Failed to create WebSocket:', error);
                if (isMounted) {
                    reconnectTimeoutRef.current = setTimeout(connect, 5000);
                }
            }
        };

        connect();

        return () => {
            isMounted = false;
            isConnectingRef.current = false;
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (socketRef.current) {
                console.log('🔌 Cleaning up WebSocket connection...');
                socketRef.current.close();
                socketRef.current = null;
            }
        };
    }, [isAuthenticated, token]);

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
