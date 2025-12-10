'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Send, X, User, Bot, Loader2, MessageCircle, ChevronDown, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  createConversation,
  getConversationsByCustomer,
  getMessagesByConversation,
  registerOrUpdateChatUser,
  uploadImageMessage,
  Message as BackendMessage,
} from '@/services/assistanceChatService';
import { getChatWebSocketService } from '@/services/chatWebSocketService';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'staff';
  timestamp: Date;
  senderName?: string;
  type?: string;
  fileUrl?: string;
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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wsServiceRef = useRef(getChatWebSocketService());

  // Convert backend message to UI message
  const convertBackendMessage = (msg: BackendMessage): Message => {
    return {
      id: msg.id,
      content: msg.content,
      sender: msg.senderRole === 'CUSTOMER' ? 'user' : 'staff',
      timestamp: new Date(msg.createdAt),
      senderName: msg.senderRole === 'CUSTOMER' ? user?.userName || 'Bạn' : 'Nhân viên hỗ trợ',
      type: msg.type,
      fileUrl: msg.fileUrl,
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
        
        // 1. Đăng ký hoặc cập nhật user trong MongoDB
        await registerOrUpdateChatUser(
          user.userId.toString(), 
          user.userName || 'Khách hàng',
          user.userEmail
        );

        // 2. Lấy conversation của user này
        const myConversation = await getConversationsByCustomer(user.userId.toString());

        if (myConversation) {
          // Nếu có conversation, load lịch sử và kết nối
          setConversationId(myConversation.id);

          // Load message history
          const history = await getMessagesByConversation(myConversation.id);
          setMessages(history.map(convertBackendMessage));

          // Setup WebSocket
          wsService.onConnect(() => {
            setIsConnected(true);
          });

          wsService.onDisconnect(() => {
            setIsConnected(false);
          });

          // Connect to WebSocket
          wsService.connect();

          // Subscribe to conversation messages
          await wsService.subscribeToConversation(myConversation.id, (newMessage: BackendMessage) => {
            setMessages((prev) => {
              const exists = prev.some(msg => msg.id === newMessage.id);
              if (exists) return prev;
              return [...prev, convertBackendMessage(newMessage)];
            });
          });
        } else {
          // Không có conversation, chỉ setup WebSocket connection
          // Conversation sẽ được tạo khi user gửi tin nhắn đầu tiên
          wsService.onConnect(() => {
            setIsConnected(true);
          });

          wsService.onDisconnect(() => {
            setIsConnected(false);
          });

          wsService.connect();
        }

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

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !user?.userId) return;

    const wsService = wsServiceRef.current;
    const messageContent = inputMessage;
    
    // Clear input immediately for better UX
    setInputMessage('');

    try {
      // Nếu chưa có conversation, tạo mới trước khi gửi tin nhắn
      let currentConvId = conversationId;
      
      if (!currentConvId) {
        const newConversation = await createConversation(user.userId.toString());
        currentConvId = newConversation.id;
        setConversationId(currentConvId);

        // Subscribe to the new conversation
        await wsService.subscribeToConversation(currentConvId, (newMessage: BackendMessage) => {
          setMessages((prev) => {
            const exists = prev.some(msg => msg.id === newMessage.id);
            if (exists) return prev;
            return [...prev, convertBackendMessage(newMessage)];
          });
        });
      }

      // Send message via WebSocket - server will broadcast it back to all clients
      wsService.sendMessage(currentConvId, user.userId.toString(), messageContent);
    } catch (error) {
      console.error('❌ Error sending message:', error);
      // Khôi phục tin nhắn nếu có lỗi
      setInputMessage(messageContent);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle image upload
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendImage = async () => {
    if (!selectedImage || !user?.userId) return;

    setIsUploading(true);

    try {
      // Nếu chưa có conversation, tạo mới
      let currentConvId = conversationId;
      
      if (!currentConvId) {
        const newConversation = await createConversation(user.userId.toString());
        currentConvId = newConversation.id;
        setConversationId(currentConvId);

        const wsService = wsServiceRef.current;
        await wsService.subscribeToConversation(currentConvId, (newMessage: BackendMessage) => {
          setMessages((prev) => {
            const exists = prev.some(msg => msg.id === newMessage.id);
            if (exists) return prev;
            return [...prev, convertBackendMessage(newMessage)];
          });
        });
      }

      // Upload image - backend sẽ tự broadcast qua WebSocket
      await uploadImageMessage(
        currentConvId,
        user.userId.toString(),
        'CUSTOMER',
        selectedImage,
        inputMessage.trim() || undefined
      );

      // Clear input and image
      setInputMessage('');
      handleRemoveImage();
    } catch (error) {
      console.error('❌ Error uploading image:', error);
      alert('Không thể gửi ảnh. Vui lòng thử lại.');
    } finally {
      setIsUploading(false);
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
                {message.type === 'IMAGE' && message.fileUrl ? (
                  <div className="space-y-2">
                    <div className="relative max-w-xs">
                      <Image
                        src={message.fileUrl}
                        alt="Uploaded image"
                        width={300}
                        height={300}
                        className="rounded-lg cursor-pointer hover:opacity-90 transition-opacity w-full h-auto"
                        onClick={() => window.open(message.fileUrl, '_blank')}
                      />
                    </div>
                    {message.content && (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                )}
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
        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-3 relative inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreview}
              alt="Preview"
              className="max-h-32 rounded-lg border-2 border-blue-500"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-shrink-0 w-12 h-12 flex items-center justify-center hover:bg-gray-100 rounded-xl transition-colors text-gray-600 border border-gray-300"
            disabled={isUploading}
            title="Đính kèm hình ảnh"
          >
            <ImageIcon className="w-5 h-5" />
          </button>
          <div className="flex-1 relative h-12">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={selectedImage ? "Thêm chú thích cho ảnh (tùy chọn)..." : "Nhập tin nhắn của bạn..."}
              rows={1}
              className="w-full h-12 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none leading-tight"
              disabled={isUploading}
            />
          </div>
          <button
            onClick={selectedImage ? handleSendImage : handleSendMessage}
            disabled={(selectedImage ? false : !inputMessage.trim()) || isUploading}
            className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-all active:scale-95"
            title="Gửi tin nhắn"
          >
            {isUploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      
      </div>
      </div>
    </div>
  );
};

export default AssistanceChat;