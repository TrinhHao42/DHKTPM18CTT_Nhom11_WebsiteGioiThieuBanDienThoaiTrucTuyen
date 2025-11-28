import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ChatMessageDto, Message } from './assistanceChatService';

const WEBSOCKET_URL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080';

export class ChatWebSocketService {
  private client: Client | null = null;
  private conversationId: string | null = null;
  private onMessageCallback: ((message: Message) => void) | null = null;
  private onConnectCallback: (() => void) | null = null;
  private onDisconnectCallback: (() => void) | null = null;

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS(`${WEBSOCKET_URL}/ws/sockjs`),
      debug: () => {
        // STOMP debug disabled
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = () => {
      
      if (this.onConnectCallback) {
        this.onConnectCallback();
      }
    };

    this.client.onDisconnect = () => {
     
      if (this.onDisconnectCallback) {
        this.onDisconnectCallback();
      }
    };

    this.client.onStompError = (frame) => {
      console.error('❌ STOMP error:', frame);
    };
  }

  connect(): void {
    if (this.client && !this.client.active) {
      this.client.activate();
    }
  }

  disconnect(): void {
    if (this.client && this.client.active) {
      this.client.deactivate();
    }
  }

  subscribeToConversation(conversationId: string, onMessage: (message: Message) => void): Promise<void> {
    this.conversationId = conversationId;
    this.onMessageCallback = onMessage;

    return new Promise((resolve, reject) => {
      const doSubscribe = () => {
        if (!this.client) {
          reject(new Error('Client not initialized'));
          return;
        }

        try {
          this.client.subscribe(`/topic/conversations/${conversationId}`, (message: IMessage) => {
            try {
              const receivedMessage: Message = JSON.parse(message.body);
             
              if (this.onMessageCallback) {
                this.onMessageCallback(receivedMessage);
              }
            } catch (error) {
              console.error('Error parsing message:', error);
            }
          });
          
          resolve();
        } catch (error) {
          console.error('❌ Error subscribing:', error);
          reject(error);
        }
      };

      if (this.client && this.client.connected) {
        // Already connected, subscribe immediately
        doSubscribe();
      } else {
        // Wait for connection
        const originalOnConnect = this.client!.onConnect;
        this.client!.onConnect = (frame) => {
          originalOnConnect(frame);
          doSubscribe();
        };
      }
    });
  }

  sendMessage(conversationId: string, senderId: string, content: string): void {
    if (!this.client || !this.client.active) {
      console.error('WebSocket not connected');
      return;
    }

    const messageDto: ChatMessageDto = {
      conversationId,
      senderId,
      senderRole: 'CUSTOMER',
      content,
    };

    // Send to backend endpoint: /assistance/conversations/{conversationId}/send
    this.client.publish({
      destination: `/assistance/conversations/${conversationId}/send`,
      body: JSON.stringify(messageDto),
    });

    
  }

  onConnect(callback: () => void): void {
    this.onConnectCallback = callback;
  }

  onDisconnect(callback: () => void): void {
    this.onDisconnectCallback = callback;
  }

  isConnected(): boolean {
    return this.client?.active || false;
  }
}

// Singleton instance
let chatWebSocketServiceInstance: ChatWebSocketService | null = null;

export const getChatWebSocketService = (): ChatWebSocketService => {
  if (!chatWebSocketServiceInstance) {
    chatWebSocketServiceInstance = new ChatWebSocketService();
  }
  return chatWebSocketServiceInstance;
};
