import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ChatMessageDto, Message } from './assistanceChatService';

const WEBSOCKET_URL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080';

export class ChatWebSocketService {
  private client: Client | null = null;
  private conversationId: string | null = null;
  private subscription: any = null; // Lưu subscription để có thể unsubscribe
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
    // Unsubscribe trước khi disconnect
    this.unsubscribeFromConversation();
    
    if (this.client && this.client.active) {
      this.client.deactivate();
    }
  }

  subscribeToConversation(conversationId: string, onMessage: (message: Message) => void): Promise<void> {
    // Unsubscribe conversation cũ nếu có
    this.unsubscribeFromConversation();

    this.conversationId = conversationId;
    this.onMessageCallback = onMessage;

    return new Promise((resolve, reject) => {
      const doSubscribe = () => {
        if (!this.client) {
          reject(new Error('Client not initialized'));
          return;
        }

        try {
          // Unsubscribe subscription cũ nếu có
          if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
          }

          // Subscribe conversation mới
          this.subscription = this.client.subscribe(`/topic/conversations/${conversationId}`, (message: IMessage) => {
            try {
              const receivedMessage: Message = JSON.parse(message.body);
              
              // Validate message thuộc về conversation đang subscribe
              if (receivedMessage.conversationId !== conversationId) {
                console.warn('⚠️ Received message for different conversation:', {
                  subscribedConversationId: conversationId,
                  messageConversationId: receivedMessage.conversationId
                });
                return;
              }
             
              if (this.onMessageCallback) {
                this.onMessageCallback(receivedMessage);
              }
            } catch (error) {
              console.error('Error parsing message:', error);
            }
          });
          
          console.log('✅ Subscribed to conversation:', conversationId);
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

  unsubscribeFromConversation(): void {
    if (this.subscription) {
      try {
        this.subscription.unsubscribe();
        console.log('✅ Unsubscribed from conversation:', this.conversationId);
      } catch (error) {
        console.error('❌ Error unsubscribing:', error);
      }
      this.subscription = null;
    }
    this.conversationId = null;
    this.onMessageCallback = null;
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
