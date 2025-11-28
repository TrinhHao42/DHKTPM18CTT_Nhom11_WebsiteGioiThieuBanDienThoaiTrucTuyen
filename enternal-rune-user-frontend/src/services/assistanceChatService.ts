import AxiosInstance from '@/configs/AxiosInstance';

// Types theo backend
export interface Conversation {
  id: string;
  customerId: string;
  agentId?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'CLOSED';
  createdAt: string;
  closedAt?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: 'CUSTOMER' | 'AGENT';
  content: string;
  type: string;
  createdAt: string;
}

export interface ChatMessageDto {
  conversationId?: string;
  senderId: string;
  senderRole: 'CUSTOMER' | 'AGENT';
  content: string;
}

export interface ChatUser {
  id: string;
  displayName: string;
  email?: string;
  role: 'CUSTOMER' | 'AGENT' | 'ADMIN';
}

// API Conversation
export const createConversation = async (customerId: string): Promise<Conversation> => {
  const response = await AxiosInstance.post(`/api/conversations?customerId=${customerId}`);
  return response.data;
};

export const getConversation = async (id: string): Promise<Conversation> => {
  const response = await AxiosInstance.get(`/api/conversations/${id}`);
  return response.data;
};

export const getConversationsByCustomer = async (customerId: string): Promise<Conversation[]> => {
  const response = await AxiosInstance.get(`/api/conversations/customer/${customerId}`);
  return response.data;
};

// API Messages
export const getMessagesByConversation = async (conversationId: string): Promise<Message[]> => {
  const response = await AxiosInstance.get(`/api/messages/conversation/${conversationId}`);
  return response.data;
};

export const getMessage = async (messageId: string): Promise<Message> => {
  const response = await AxiosInstance.get(`/api/messages/${messageId}`);
  return response.data;
};

// API Chat Users
export const registerOrUpdateChatUser = async (
  userId: string, 
  displayName: string, 
  email?: string
): Promise<ChatUser> => {
  const response = await AxiosInstance.post('/api/chat-users/register-or-update', {
    userId,
    displayName,
    email
  });
  return response.data;
};
