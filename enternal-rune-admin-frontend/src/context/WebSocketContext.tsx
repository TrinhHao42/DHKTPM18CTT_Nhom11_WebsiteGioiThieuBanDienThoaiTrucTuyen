'use client'
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import type { Notification, DisplayNotification } from "@/types/Notification";
import { useAuth } from './AuthContext';
import { useWebSocket } from '@/hooks/useWebSocket';

interface WebSocketContextType {
    notifications: DisplayNotification[];
    addNotification: (notification: DisplayNotification) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function WebSocketProvider({ children }: { children: ReactNode }) {
    const { isAuthenticated, token, isLoading } = useAuth();
    const [notifications, setNotifications] = useState<DisplayNotification[]>([]);
    const [wsUrl, setWsUrl] = useState<string | null>(null);

    // Đợi auth load xong và có token mới tạo WebSocket URL
    useEffect(() => {
        if (!isLoading && isAuthenticated && token) {
            setWsUrl(`ws://localhost:8080/notifications?role=admin&token=${token}`);
        } else {
            setWsUrl(null);
        }
    }, [isLoading, isAuthenticated, token]);

    // Chỉ connect khi có URL
    useWebSocket({
        url: wsUrl || '',
        onOpen: () => {
            console.log('✅ Admin WebSocket connected');
            
            // Request browser notification permission
            if (typeof window !== 'undefined' && 'Notification' in window) {
                if (window.Notification.permission === 'default') {
                    window.Notification.requestPermission();
                }
            }
        },
        onMessage: (data) => {
            console.log('📩 Admin received notification:', data);
            try {
                // Parse backend notification format
                const backendNotification: Notification = data;
                
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
                console.error('❌ Error processing notification:', error);
            }
        },
        onError: (error) => {
            console.error('❌ Admin WebSocket error:', error);
        },
        autoReconnect: true,
        reconnectInterval: 5000
    });

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
