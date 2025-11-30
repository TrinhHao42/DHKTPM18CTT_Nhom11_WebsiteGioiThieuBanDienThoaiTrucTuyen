import { useEffect, useRef } from 'react';

interface UseWebSocketOptions {
    url: string;
    onMessage?: (data: any) => void;
    onOpen?: () => void;
    onClose?: () => void;
    onError?: (error: Event) => void;
    autoReconnect?: boolean;
    reconnectInterval?: number;
}

export function useWebSocket({
    url,
    onMessage,
    onOpen,
    onClose,
    onError,
    autoReconnect = true,
    reconnectInterval = 5000
}: UseWebSocketOptions) {
    const socketRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isUnmountedRef = useRef(false);

    useEffect(() => {
        // Không connect nếu URL rỗng hoặc không hợp lệ
        if (!url) {
            console.log('⏸️ WebSocket: No URL provided, skipping connection');
            return;
        }

        isUnmountedRef.current = false;

        const connect = () => {
            if (isUnmountedRef.current) return;

            try {
                const socket = new WebSocket(url);
                socketRef.current = socket;

                socket.onopen = () => {
                    console.log('✅ WebSocket connected:', url);
                    onOpen?.();
                };

                socket.onmessage = (event) => {
                    console.log('📩 WebSocket message:', event.data);
                    if (onMessage) {
                        try {
                            const data = JSON.parse(event.data);
                            onMessage(data);
                        } catch (error) {
                            console.error('Failed to parse WebSocket message:', error);
                        }
                    }
                };

                socket.onerror = (error) => {
                    console.error('❌ WebSocket error:', error);
                    onError?.(error);
                };

                socket.onclose = (event) => {
                    console.log('🔌 WebSocket closed');
                    onClose?.();

                    // Auto reconnect if not clean close and autoReconnect is enabled
                    if (autoReconnect && !event.wasClean && !isUnmountedRef.current) {
                        console.log(`🔄 Reconnecting in ${reconnectInterval / 1000}s...`);
                        reconnectTimeoutRef.current = setTimeout(connect, reconnectInterval);
                    }
                };
            } catch (error) {
                console.error('Failed to create WebSocket:', error);
                if (autoReconnect && !isUnmountedRef.current) {
                    reconnectTimeoutRef.current = setTimeout(connect, reconnectInterval);
                }
            }
        };

        connect();

        return () => {
            isUnmountedRef.current = true;
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [url, autoReconnect, reconnectInterval]);

    const send = (data: any) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(typeof data === 'string' ? data : JSON.stringify(data));
        } else {
            console.warn('WebSocket is not connected');
        }
    };

    return { send };
}
