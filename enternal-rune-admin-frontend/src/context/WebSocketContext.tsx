'use client'
import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback, useMemo } from 'react';
import type { Notification, DisplayNotification, BackendNotification } from "@/types/Notification";
import { useAuth } from './AuthContext';
import { useWebSocket } from '@/hooks/useWebSocket';
import { notificationService } from '@/services/notificationService';

interface WebSocketContextType {
    notifications: DisplayNotification[];
    unreadCount: number;
    addNotification: (notification: DisplayNotification) => void;
    markAsRead: (notificationId: number) => void;
    markAllAsRead: () => void;
    refreshNotifications: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

// Helper function to transform backend notification to display format
const transformToDisplayNotification = (notification: BackendNotification): DisplayNotification => {
    return {
        id: notification.id,
        user: {
            id: notification.userId?.toString() || '0',
            name: notification.userName || 'Unknown',
            avatar: ''
        },
        message: notification.message,
        time: notification.timestamp,
        isRead: notification.isRead
    };
};

export function WebSocketProvider({ children }: { children: ReactNode }) {
    const { isAuthenticated, token, isLoading } = useAuth();
    const [notifications, setNotifications] = useState<DisplayNotification[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [hasFetched, setHasFetched] = useState(false);

    // Compute WebSocket URL
    const wsUrl = useMemo(() => {
        if (!isLoading && isAuthenticated && token) {
            return `ws://localhost:8080/notifications?role=admin&token=${token}`;
        }
        return '';
    }, [isLoading, isAuthenticated, token]);

    // Fetch notifications from backend API
    const fetchNotifications = useCallback(async () => {
        // Double check token exists in localStorage
        const storedToken = localStorage.getItem('admin_token');
        if (!token || !storedToken) {
            console.log('⏸️ No token available, skipping fetch notifications');
            return;
        }
        
        console.log('📥 Fetching notifications from backend...');
        try {
            const backendNotifications = await notificationService.getAllNotifications();
            console.log('✅ Fetched notifications:', backendNotifications);
            const displayNotifications = backendNotifications.map(transformToDisplayNotification);
            setNotifications(displayNotifications);
            
            // Update unread count
            const count = await notificationService.getUnreadCount();
            console.log('✅ Unread count:', count);
            setUnreadCount(count);
        } catch (error) {
            // Silently fail - notifications will be empty until WebSocket receives new ones
            console.warn('⚠️ Could not fetch notifications from server:', error);
        }
    }, [token]);

    // Fetch notifications when authenticated (only once)
    useEffect(() => {
        // Only fetch when auth is fully loaded, authenticated, has token, and haven't fetched yet
        if (!isLoading && isAuthenticated && token && !hasFetched) {
            // Small delay to ensure localStorage is synced
            const timeoutId = setTimeout(() => {
                setHasFetched(true);
                fetchNotifications();
            }, 100);
            return () => clearTimeout(timeoutId);
        }
    }, [isLoading, isAuthenticated, token, hasFetched, fetchNotifications]);
    
    // Reset hasFetched when logged out
    useEffect(() => {
        if (!isAuthenticated) {
            setHasFetched(false);
            setNotifications([]);
            setUnreadCount(0);
        }
    }, [isAuthenticated]);

    // WebSocket callbacks
    const handleOpen = useCallback(() => {
        console.log('✅ Admin WebSocket connected');
        
        // Request browser notification permission
        if (typeof window !== 'undefined' && 'Notification' in window) {
            if (window.Notification.permission === 'default') {
                window.Notification.requestPermission();
            }
        }
    }, []);

    const handleMessage = useCallback((data: Notification) => {
        console.log('📩 Admin received notification:', data);
        try {
            // Transform to display format
            const displayNotification: DisplayNotification = {
                user: {
                    id: data.userId?.toString() || '0',
                    name: data.userName || 'Unknown',
                    avatar: ''
                },
                message: data.message,
                time: data.timestamp,
                isRead: false
            };
            
            setNotifications((prev) => [displayNotification, ...prev]);
            setUnreadCount((prev) => prev + 1);

            // Browser notification
            if (typeof window !== 'undefined' && 'Notification' in window) {
                if (window.Notification.permission === 'granted') {
                    new window.Notification('Thông báo mới', {
                        body: `${data.userName} ${data.message}`,
                    });
                }
            }
        } catch (error) {
            console.error('❌ Error processing notification:', error);
        }
    }, []);

    const handleError = useCallback((error: Event) => {
        console.error('❌ Admin WebSocket error:', error);
    }, []);

    // Connect WebSocket
    useWebSocket({
        url: wsUrl,
        onOpen: handleOpen,
        onMessage: handleMessage,
        onError: handleError,
        autoReconnect: true,
        reconnectInterval: 5000
    });

    const addNotification = useCallback((notification: DisplayNotification) => {
        setNotifications((prev) => [notification, ...prev]);
        if (!notification.isRead) {
            setUnreadCount((prev) => prev + 1);
        }
    }, []);

    const markAsRead = useCallback(async (notificationId: number) => {
        try {
            await notificationService.markAsRead(notificationId);
            setNotifications((prev) =>
                prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            console.error('❌ Error marking notification as read:', error);
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('❌ Error marking all notifications as read:', error);
        }
    }, []);

    const refreshNotifications = useCallback(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const contextValue = useMemo(() => ({
        notifications, 
        unreadCount,
        addNotification, 
        markAsRead, 
        markAllAsRead,
        refreshNotifications 
    }), [notifications, unreadCount, addNotification, markAsRead, markAllAsRead, refreshNotifications]);

    return (
        <WebSocketContext.Provider value={contextValue}>
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
