import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

export interface Message {
  id?: string;
  conversationId: string;
  senderId: string;
  senderRole: 'CUSTOMER' | 'AGENT';
  content: string;
  type?: string;
  fileUrl?: string;
  createdAt?: string;
}

export interface Conversation {
  id: string;
  customerId: string;
  agentId?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'CLOSED';
  createdAt: string;
  closedAt?: string;
}

export interface ChatUser {
  id: string;
  displayName: string;
  email?: string;
  role: 'CUSTOMER' | 'AGENT' | 'ADMIN';
}

class ChatService {
  private stompClient: Client | null = null;
  private subscriptions: Map<string, any> = new Map();

  connect(onConnected?: () => void, onError?: (error: any) => void) {
    // Tạo WebSocket connection qua SockJS
    const socket = new SockJS(`${BACKEND_URL}/ws/sockjs`);
    
    this.stompClient = new Client({
      webSocketFactory: () => socket as any,
      debug: (str) => {
        console.log('STOMP: ', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('Connected to WebSocket');
        onConnected?.();
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
        onError?.(frame);
      },
      onWebSocketError: (error) => {
        console.error('WebSocket error:', error);
        onError?.(error);
      },
    });

    this.stompClient.activate();
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.subscriptions.clear();
    }
  }

  subscribeToConversation(
    conversationId: string,
    onMessageReceived: (message: Message) => void
  ) {
    if (!this.stompClient || !this.stompClient.connected) {
      console.error('STOMP client is not connected');
      return;
    }

    // Unsubscribe nếu đã subscribe trước đó
    this.unsubscribeFromConversation(conversationId);

    const subscription = this.stompClient.subscribe(
      `/topic/conversations/${conversationId}`,
      (message: IMessage) => {
        const receivedMessage: Message = JSON.parse(message.body);
        onMessageReceived(receivedMessage);
      }
    );

    this.subscriptions.set(conversationId, subscription);
  }

  unsubscribeFromConversation(conversationId: string) {
    const subscription = this.subscriptions.get(conversationId);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(conversationId);
    }
  }

  subscribeToAllConversations(
    onConversationUpdate: (conversation: Conversation) => void
  ) {
    if (!this.stompClient || !this.stompClient.connected) {
      console.error('STOMP client is not connected');
      return;
    }

    // Unsubscribe nếu đã subscribe trước đó
    const existingSub = this.subscriptions.get('all-conversations');
    if (existingSub) {
      existingSub.unsubscribe();
    }

    const subscription = this.stompClient.subscribe(
      '/topic/conversations',
      (message: IMessage) => {
        const updatedConversation: Conversation = JSON.parse(message.body);
        onConversationUpdate(updatedConversation);
      }
    );

    this.subscriptions.set('all-conversations', subscription);
  }

  unsubscribeFromAllConversations() {
    const subscription = this.subscriptions.get('all-conversations');
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete('all-conversations');
    }
  }

  sendMessage(conversationId: string, message: Omit<Message, 'conversationId'>) {
    if (!this.stompClient || !this.stompClient.connected) {
      console.error('STOMP client is not connected');
      return;
    }

    this.stompClient.publish({
      destination: `/assistance/conversations/${conversationId}/send`,
      body: JSON.stringify({
        ...message,
        conversationId,
      }),
    });
  }

  // REST API calls
  async getConversations(page: number = 0, size: number = 20): Promise<{ content: Conversation[], totalPages: number, totalElements: number }> {
    const response = await fetch(`${BACKEND_URL}/api/conversations?page=${page}&size=${size}`);
    if (!response.ok) throw new Error('Failed to fetch conversations');
    return response.json();
  }

  async getConversationsByCustomer(customerId: string): Promise<Conversation[]> {
    const response = await fetch(`${BACKEND_URL}/api/conversations/customer/${customerId}`);
    if (!response.ok) throw new Error('Failed to fetch conversations');
    return response.json();
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    const response = await fetch(`${BACKEND_URL}/api/messages/conversation/${conversationId}`);
    if (!response.ok) throw new Error('Failed to fetch messages');
    return response.json();
  }

  async createConversation(customerId: string): Promise<Conversation> {
    const response = await fetch(`${BACKEND_URL}/api/conversations?customerId=${customerId}`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to create conversation');
    return response.json();
  }

  async updateConversationStatus(
    conversationId: string,
    status: 'PENDING' | 'IN_PROGRESS' | 'CLOSED',
    agentId?: string
  ): Promise<Conversation> {
    const response = await fetch(`${BACKEND_URL}/api/conversations/${conversationId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, agentId }),
    });
    if (!response.ok) throw new Error('Failed to update conversation');
    return response.json();
  }

  async getUserInfo(userId: string): Promise<ChatUser> {
    const response = await fetch(`${BACKEND_URL}/api/chat-users/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user info');
    return response.json();
  }

  async uploadImageMessage(
    conversationId: string,
    senderId: string,
    senderRole: 'CUSTOMER' | 'AGENT',
    file: File,
    caption?: string
  ): Promise<Message> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('senderId', senderId);
    formData.append('senderRole', senderRole);
    if (caption) {
      formData.append('caption', caption);
    }

    // Lấy token từ localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const response = await fetch(
      `${BACKEND_URL}/api/chat/conversations/${conversationId}/image`,
      {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }), // Thêm token nếu có
          // Không set Content-Type, browser tự động set cho FormData
        },
        body: formData,
      }
    );

    if (!response.ok) throw new Error('Failed to upload image');
    return response.json();
  }
}

export const chatService = new ChatService();
