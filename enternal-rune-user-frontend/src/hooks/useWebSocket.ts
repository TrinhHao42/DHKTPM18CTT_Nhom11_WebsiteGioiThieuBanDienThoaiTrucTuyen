import { useEffect, useRef, useCallback } from 'react';

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
    
    // Store callbacks in refs to avoid re-creating WebSocket on callback changes
    const onMessageRef = useRef(onMessage);
    const onOpenRef = useRef(onOpen);
    const onCloseRef = useRef(onClose);
    const onErrorRef = useRef(onError);
    
    // Update refs when callbacks change
    useEffect(() => {
        onMessageRef.current = onMessage;
        onOpenRef.current = onOpen;
        onCloseRef.current = onClose;
        onErrorRef.current = onError;
    }, [onMessage, onOpen, onClose, onError]);

    useEffect(() => {
        // Skip if no URL provided
        if (!url) {
            console.log('⏸️ WebSocket: No URL provided, skipping connection');
            return;
        }
        
        isUnmountedRef.current = false;

        const connect = () => {
            if (isUnmountedRef.current) return;
            
            // Close existing socket if any
            if (socketRef.current) {
                socketRef.current.close();
                socketRef.current = null;
            }

            try {
                console.log('🔄 WebSocket connecting to:', url);
                const socket = new WebSocket(url);
                socketRef.current = socket;

                socket.onopen = () => {
                    console.log('✅ WebSocket connected:', url);
                    onOpenRef.current?.();
                };

                socket.onmessage = (event) => {
                    if (onMessageRef.current) {
                        try {
                            const data = JSON.parse(event.data);
                            onMessageRef.current(data);
                        } catch (error) {
                            console.error('Failed to parse WebSocket message:', error);
                        }
                    }
                };

                socket.onerror = (error) => {
                    console.error('❌ WebSocket error:', error);
                    onErrorRef.current?.(error);
                };

                socket.onclose = (event) => {
                    console.log('🔌 WebSocket closed, wasClean:', event.wasClean, 'code:', event.code);
                    onCloseRef.current?.();

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
                reconnectTimeoutRef.current = null;
            }
            if (socketRef.current) {
                socketRef.current.close();
                socketRef.current = null;
            }
        };
    }, [url, autoReconnect, reconnectInterval]);

    const send = useCallback((data: any) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(typeof data === 'string' ? data : JSON.stringify(data));
        } else {
            console.warn('WebSocket is not connected');
        }
    }, []);

    return { send };
}
