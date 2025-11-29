'use client'
import { createContext, useContext, ReactNode, useState, useEffect, useRef } from 'react';
import type { Notification, DisplayNotification } from "@/types/Notification";
import { useAuth } from './AuthContext';

interface WebSocketContextType {
    notifications: DisplayNotification[];
    addNotification: (notification: DisplayNotification) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function WebSocketProvider({ children }: { children: ReactNode }) {
    const { isAuthenticated, token, isLoading } = useAuth();
    const [notifications, setNotifications] = useState<DisplayNotification[]>([]);

    const socketRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isConnectingRef = useRef(false);

    useEffect(() => {
        // ⚠️ Đợi AuthContext load xong trước
        if (isLoading) {
            console.log('⏳ WebSocket: Waiting for auth to load...');
            return;
        }

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
                    console.log('📩 Admin received raw data:', event.data);
                    try {
                        // Parse backend notification format
                        const backendNotification: Notification = JSON.parse(event.data);
                        console.log('📦 Parsed notification:', backendNotification);
                        
                        // Transform to display format
                        const displayNotification: DisplayNotification = {
                            user: {
                                id: backendNotification.userId.toString(),
                                name: backendNotification.userName,
                                avatar: '' // Default empty avatar
                            },
                            message: backendNotification.message,
                            time: backendNotification.timestamp
                        };
                        
                        setNotifications((prev) => [displayNotification, ...prev]);

                        // Browser notification
                        if (typeof window !== 'undefined' && 'Notification' in window) {
                            if (window.Notification.permission === 'granted') {
                                new window.Notification('Thông báo mới', {
                                    body: `${backendNotification.userName} ${backendNotification.message}`,
                                });
                            }
                        }
                    } catch (error) {
                        console.error('❌ Error parsing notification:', error);
                        console.error('Raw data was:', event.data);
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
                    
                    // Chỉ reconnect nếu component vẫn mounted VÀ đang authenticated
                    // Code 1006 = abnormal closure (backend đột ngột đóng hoặc network issue)
                    if (isMounted && isAuthenticated && !isLoading) {
                        // Không reconnect nếu đang clean up
                        if (event.code !== 1000) { // 1000 = normal closure
                            console.log('🔄 Reconnecting in 5s...');
                            reconnectTimeoutRef.current = setTimeout(connect, 5000);
                        }
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
    }, [isAuthenticated, token, isLoading]); // ✅ Thêm isLoading vào dependencies

    const addNotification = (notification: DisplayNotification) => {
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
