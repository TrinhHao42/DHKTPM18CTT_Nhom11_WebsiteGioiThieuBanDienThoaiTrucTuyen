'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, X, User, Bot, Loader2, MessageCircle, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  createConversation,
  getConversationsByCustomer,
  getMessagesByConversation,
  Message as BackendMessage,
  Conversation,
} from '@/services/assistanceChatService';
import { getChatWebSocketService } from '@/services/chatWebSocketService';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'staff';
  timestamp: Date;
  senderName?: string;
}

const AssistanceChat = () => {
  const { user, token } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const wsServiceRef = useRef(getChatWebSocketService());

  // Convert backend message to UI message
  const convertBackendMessage = (msg: BackendMessage): Message => {
    return {
      id: msg.id,
      content: msg.content,
      sender: msg.senderRole === 'CUSTOMER' ? 'user' : 'staff',
      timestamp: new Date(msg.createdAt),
      senderName: msg.senderRole === 'CUSTOMER' ? user?.userName || 'Bạn' : 'Nhân viên hỗ trợ',
    };
  };

  // Auto scroll to bottom
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // Check if user has scrolled up
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  };

  // Auto scroll when new message arrives (only if user is at bottom)
  useEffect(() => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
      
      // Only auto scroll if user is near bottom
      if (isNearBottom) {
        scrollToBottom();
      }
    }
  }, [messages]);

  // Initialize conversation and WebSocket when user is logged in
  useEffect(() => {
    if (!user?.userId || !token) return;

    const wsService = wsServiceRef.current;

    const initializeChat = async () => {
      try {
        setIsLoading(true);
        
        // 1. Get or create conversation
        const conversations = await getConversationsByCustomer(user.userId.toString());
        let activeConversation: Conversation;

        if (conversations.length > 0) {
          // Use existing conversation (latest one)
          activeConversation = conversations[conversations.length - 1];
        } else {
          // Create new conversation
          activeConversation = await createConversation(user.userId.toString());
        }

        setConversationId(activeConversation.id);

        // 2. Load message history
        const history = await getMessagesByConversation(activeConversation.id);
        setMessages(history.map(convertBackendMessage));

        // 3. Setup WebSocket callbacks
        wsService.onConnect(() => {
          setIsConnected(true);
        });

        wsService.onDisconnect(() => {
          setIsConnected(false);
        });

        // 4. Connect to WebSocket
        wsService.connect();

        // 5. Subscribe to conversation messages (wait for connection)
        await wsService.subscribeToConversation(activeConversation.id, (newMessage: BackendMessage) => {
          // Only add message if it's from AGENT (not our own message)
          if (newMessage.senderRole === 'AGENT') {
            setMessages((prev) => [...prev, convertBackendMessage(newMessage)]);
          }
        });

        setIsLoading(false);
      } catch (error) {
        console.error('❌ Error initializing chat:', error);
        setIsLoading(false);
      }
    };

    initializeChat();

    // Cleanup on unmount
    return () => {
      if (wsService) {
        wsService.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.userId, token]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !conversationId || !user?.userId) return;

    const wsService = wsServiceRef.current;

    // Add message to UI immediately (optimistic update)
    const tempMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      senderName: user.userName || 'Bạn',
    };

    setMessages((prev) => [...prev, tempMessage]);
    setInputMessage('');

    // Send message via WebSocket
    wsService.sendMessage(conversationId, user.userId.toString(), inputMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Hiển thị thông báo nếu chưa đăng nhập
  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-10 h-10 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Yêu cầu đăng nhập
          </h2>
          <p className="text-gray-600 mb-6">
            Bạn cần đăng nhập để sử dụng chức năng chat với nhân viên hỗ trợ.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push('/LoginScreen')}
              className="px-6 py-3 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors"
            >
              Đăng nhập ngay
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-colors"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8 bg-gray-100">
      <div className="flex flex-col h-[calc(100vh-160px)] w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideUpFadeIn relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              {isConnected && (
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Hỗ trợ khách hàng
              </h2>
              <p className="text-sm text-white/80">
                {isConnected ? (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                    Đang hoạt động
                  </span>
                ) : (
                  'Đang kết nối...'
                )}
              </p>
            </div>
          </div>
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 bg-gray-50 overflow-y-auto px-6 py-4 space-y-4 relative min-h-0"
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            <span className="text-gray-600">Đang tải cuộc trò chuyện...</span>
          </div>
        ) : !isConnected ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            <span className="text-gray-600">Đang kết nối với nhân viên hỗ trợ...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <MessageCircle className="w-16 h-16 text-gray-300" />
            <span className="text-gray-500">Bắt đầu cuộc trò chuyện của bạn</span>
          </div>
        ) : (
          messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 animate-fadeInUp ${
              message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.sender === 'user'
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                  : 'bg-gradient-to-br from-gray-400 to-gray-500'
              }`}
            >
              {message.sender === 'user' ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Bot className="w-5 h-5 text-white" />
              )}
            </div>
            <div
              className={`max-w-[70%] ${
                message.sender === 'user' ? 'items-end' : 'items-start'
              } flex flex-col`}
            >
              <div
                className={`px-4 py-3 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white rounded-tr-sm'
                    : 'bg-white text-gray-800 rounded-tl-sm shadow-sm border border-gray-200'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {message.content}
                </p>
              </div>
              <span className="text-xs text-gray-500 mt-1 px-1">
                {message.timestamp.toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        )))}

        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-28 left-1/2 -translate-x-1/2 w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all active:scale-95 animate-fadeInUp z-10"
          aria-label="Cuộn xuống dưới"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      )}

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-end gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 mb-1">
            <Paperclip className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn của bạn..."
              rows={1}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-32"
              style={{ minHeight: '48px' }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full transition-all active:scale-95 mb-1"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Nhấn Enter để gửi, Shift + Enter để xuống dòng
        </p>
      </div>
      </div>
    </div>
  );
};

export default AssistanceChat;