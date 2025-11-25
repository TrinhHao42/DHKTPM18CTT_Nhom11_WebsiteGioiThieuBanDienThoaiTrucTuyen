'use client'
import React, { createContext, useContext, ReactNode } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';

interface WebSocketContextType {
    send: (data: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function WebSocketProvider({ children }: { children: ReactNode }) {
    const { send } = useWebSocket({
        url: 'ws://localhost:8080/notifications?role=user',
        onOpen: () => {
            console.log('✅ User WebSocket connected');
        },
        onMessage: (data) => {
            console.log('📩 User received notification:', data);
            // Có thể thêm logic để hiển thị notification cho user ở đây
        },
        onError: (error) => {
            console.error('❌ User WebSocket error:', error);
        },
        autoReconnect: true,
        reconnectInterval: 5000
    });

    return (
        <WebSocketContext.Provider value={{ send }}>
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
