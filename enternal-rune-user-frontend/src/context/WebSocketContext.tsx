'use client'
import React, { createContext, useContext, ReactNode, useMemo, useCallback } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';

interface WebSocketContextType {
    send: (data: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function WebSocketProvider({ children }: { children: ReactNode }) {
    const wsUrl = useMemo(() => {

        if (typeof window !== 'undefined') {
            return '';
        }
        return '';
    }, []);

    const handleOpen = useCallback(() => {
        console.log('✅ User WebSocket connected');
    }, []);

    const handleMessage = useCallback((data: any) => {
        console.log('📩 User received notification:', data);
    }, []);

    const handleError = useCallback((error: Event) => {
        console.error('❌ User WebSocket error:', error);
    }, []);

    const { send } = useWebSocket({
        url: wsUrl,
        onOpen: handleOpen,
        onMessage: handleMessage,
        onError: handleError,
        autoReconnect: true,
        reconnectInterval: 5000
    });

    const contextValue = useMemo(() => ({ send }), [send]);

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
