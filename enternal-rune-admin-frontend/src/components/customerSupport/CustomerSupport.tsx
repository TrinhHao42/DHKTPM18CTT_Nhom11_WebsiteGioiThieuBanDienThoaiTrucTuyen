'use client';
import React, { useState, useEffect, useRef } from 'react';
import { chatService, Conversation, Message, ChatUser } from '@/services/chatService';
import ChatModal from './ChatModal';

export default function CustomerSupport() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [userInfoCache, setUserInfoCache] = useState<Map<string, ChatUser>>(new Map());
  const [unreadCounts, setUnreadCounts] = useState<Map<string, number>>(new Map());
  const openConversationIdRef = useRef<string | null>(null);
  const subscribedConversationsRef = useRef<Set<string>>(new Set());
  const pageSize = 20;

  // ID nhân viên - trong thực tế sẽ lấy từ auth context
  const agentId = 'agent-001';

  useEffect(() => {
    // Kết nối WebSocket
    chatService.connect(
      () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        loadConversations();
        subscribeToNewConversations();
      },
      (error) => {
        console.error('WebSocket connection error:', error);
        setIsConnected(false);
      }
    );

    return () => {
      chatService.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Subscribe to new conversations and updates
  const subscribeToNewConversations = () => {
    chatService.subscribeToAllConversations(async (updatedConversation) => {
      // Fetch user info ngay khi nhận conversation mới
      if (updatedConversation.customerId && !userInfoCache.has(updatedConversation.customerId)) {
        try {
          const userInfo = await chatService.getUserInfo(updatedConversation.customerId);
          setUserInfoCache((prevCache) => {
            const newCache = new Map(prevCache);
            newCache.set(userInfo.id, userInfo);
            return newCache;
          });
        } catch (error) {
          console.error('Failed to fetch user info:', error);
        }
      }
      
      setConversations((prev) => {
        const existingIndex = prev.findIndex((c) => c.id === updatedConversation.id);
        
        if (existingIndex >= 0) {
          // Update existing conversation
          const updated = [...prev];
          updated[existingIndex] = updatedConversation;
          return updated;
        } else {
          // Add new conversation at the beginning
          setTotalElements((prevTotal) => prevTotal + 1);
          // Tăng số tin nhắn chưa đọc cho conversation mới
          setUnreadCounts((prevCounts) => {
            const newCounts = new Map(prevCounts);
            newCounts.set(updatedConversation.id, 1);
            return newCounts;
          });
          
          // Subscribe to messages của conversation mới này
          subscribeToConversationMessages(updatedConversation.id);
          
          return [updatedConversation, ...prev];
        }
      });
    });
  };

  // Subscribe to messages của một conversation
  const subscribeToConversationMessages = (conversationId: string) => {
    // Kiểm tra đã subscribe chưa để tránh trùng
    if (subscribedConversationsRef.current.has(conversationId)) {
      return;
    }
    
    subscribedConversationsRef.current.add(conversationId);
    
    chatService.subscribeToConversation(conversationId, (newMessage) => {
      // Kiểm tra xem có đang xem conversation này không
      const isViewingThis = openConversationIdRef.current === conversationId;
      
      if (isViewingThis) {
        // Cập nhật messages nếu đang xem
        setMessages((prev) => {
          const exists = prev.some((m) => m.id === newMessage.id);
          if (exists) return prev;
          return [...prev, { ...newMessage }];
        });
        
        // Xóa chấm đỏ vì đang xem conversation
        setUnreadCounts((prevCounts) => {
          const newCounts = new Map(prevCounts);
          newCounts.delete(conversationId);
          return newCounts;
        });
      } else {
        // KHÔNG đang xem conversation này
        // Nếu tin nhắn từ customer hoặc từ agent khác (không phải mình)
        if (newMessage.senderRole === 'CUSTOMER' || 
           (newMessage.senderRole === 'AGENT' && newMessage.senderId !== agentId)) {
          // Tăng số tin nhắn chưa đọc
          setUnreadCounts((prevCounts) => {
            const newCounts = new Map(prevCounts);
            const currentCount = newCounts.get(conversationId) || 0;
            newCounts.set(conversationId, currentCount + 1);
            return newCounts;
          });
        }
      }
    });
  };

  const loadConversations = async (page: number = 0) => {
    try {
      setLoading(true);
      const data = await chatService.getConversations(page, pageSize);
      setConversations(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
      setCurrentPage(page);
      
      // Lấy thông tin user cho các conversation
      const userIds = [...new Set(data.content.map(c => c.customerId))];
      const userInfoPromises = userIds.map(userId => 
        chatService.getUserInfo(userId).catch(() => null)
      );
      const userInfos = await Promise.all(userInfoPromises);
      
      const newCache = new Map(userInfoCache);
      userInfos.forEach(info => {
        if (info) newCache.set(info.id, info);
      });
      setUserInfoCache(newCache);
      
      // Lấy unread counts từ backend (thay vì check từng message)
      try {
        const unreadCountsFromBackend = await chatService.getUnreadCounts(agentId);
        setUnreadCounts(unreadCountsFromBackend);
      } catch (error) {
        console.error('Failed to fetch unread counts:', error);
      }
      
      // Subscribe to messages cho tất cả conversations hiện có
      data.content.forEach((conversation) => {
        subscribeToConversationMessages(conversation.id);
      });
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    openConversationIdRef.current = conversation.id;

    try {
      // Load messages
      const conversationMessages = await chatService.getMessages(conversation.id);
      setMessages(conversationMessages);

      // Xóa chấm đỏ khi mở conversation
      setUnreadCounts((prevCounts) => {
        const newCounts = new Map(prevCounts);
        newCounts.delete(conversation.id);
        return newCounts;
      });

      // Nếu conversation đang PENDING, chuyển sang IN_PROGRESS và assign cho agent
      if (conversation.status === 'PENDING') {
        const updated = await chatService.updateConversationStatus(
          conversation.id,
          'IN_PROGRESS',
          agentId
        );
        setSelectedConversation(updated);
        setConversations((prev) =>
          prev.map((c) => (c.id === conversation.id ? updated : c))
        );
      }

      // Mở modal
      setIsChatModalOpen(true);
    } catch (error) {
      console.error('Failed to load conversation messages:', error);
    }
  };

  const handleSendMessage = (content: string) => {
    if (!selectedConversation) return;

    // Gửi tin nhắn qua WebSocket
    // Tin nhắn sẽ được nhận lại qua WebSocket subscription và hiển thị
    chatService.sendMessage(selectedConversation.id, {
      senderId: agentId,
      senderRole: 'AGENT',
      content,
    });
  };

  const handleSendImage = async (file: File, caption?: string) => {
    if (!selectedConversation) return;

    try {
      // Upload image - API trả về message object và tự động broadcast
      const imageMessage = await chatService.uploadImageMessage(
        selectedConversation.id,
        agentId,
        'AGENT',
        file,
        caption
      );
      
      // Thêm message ngay lập tức vào UI để hiển thị
      setMessages((prev) => {
        // Kiểm tra xem message đã tồn tại chưa (tránh duplicate)
        const exists = prev.some((m) => m.id === imageMessage.id);
        if (exists) return prev;
        return [...prev, imageMessage];
      });
    } catch (error) {
      console.error('Failed to upload image:', error);
      throw error;
    }
  };

  const handleCompleteConversation = async () => {
    if (!selectedConversation) return;

    try {
      const updated = await chatService.updateConversationStatus(
        selectedConversation.id,
        'CLOSED'
      );
      setSelectedConversation(updated);
      setConversations((prev) =>
        prev.map((c) => (c.id === selectedConversation.id ? updated : c))
      );
    } catch (error) {
      console.error('Failed to complete conversation:', error);
    }
  };

  const handleReopenConversation = async () => {
    if (!selectedConversation) return;

    try {
      const updated = await chatService.updateConversationStatus(
        selectedConversation.id,
        'IN_PROGRESS',
        agentId
      );
      setSelectedConversation(updated);
      setConversations((prev) =>
        prev.map((c) => (c.id === selectedConversation.id ? updated : c))
      );
    } catch (error) {
      console.error('Failed to reopen conversation:', error);
    }
  };

  const handleCloseModal = () => {
    setIsChatModalOpen(false);
    setSelectedConversation(null);
    openConversationIdRef.current = null;
    // Không unsubscribe để tiếp tục nhận tin nhắn từ tất cả conversations
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  const getUserDisplay = (customerId: string) => {
    const userInfo = userInfoCache.get(customerId);
    return {
      name: userInfo?.displayName || `Khách hàng #${customerId.substring(0, 12)}`,
      email: userInfo?.email || '',
      initials: userInfo?.displayName 
        ? userInfo.displayName.substring(0, 2).toUpperCase()
        : customerId.substring(0, 2).toUpperCase()
    };
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-6 dark:bg-gray-900/50">
      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Hỗ Trợ Khách Hàng
            </h1>
           
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 dark:bg-white/[0.03]">
              <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-success-500' : 'bg-error-500'}`} />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {isConnected ? 'Đã kết nối' : 'Mất kết nối'}
              </span>
            </div>
          </div>
        </div>

      
       

        {/* Conversations List */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
            </div>
          ) : conversations.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mb-4 text-6xl">📬</div>
              <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                Không có yêu cầu nào
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Chưa có yêu cầu hỗ trợ nào từ khách hàng
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {conversations.map((conversation) => {
                const userDisplay = getUserDisplay(conversation.customerId);
                return (
                <div
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation)}
                  className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:border-brand-300 hover:shadow-lg dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-brand-700"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-lg font-bold text-white shadow-lg">
                        {userDisplay.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {userDisplay.name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {userDisplay.email || formatTime(conversation.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTime(conversation.createdAt)}
                    </p>
                    {unreadCounts.get(conversation.id) ? (
                      <div className="relative flex items-center">
                        <span className="flex h-3 w-3">
                          <span className="absolute inline-flex h-3 w-3 animate-ping rounded-full bg-error-400 opacity-75"></span>
                          <span className="relative inline-flex h-3 w-3 rounded-full bg-error-500"></span>
                        </span>
                      </div>
                    ) : null}
                  </div>
                  <div className="mt-3 text-center">
                    <span className="text-xs font-medium text-brand-500 opacity-0 transition-opacity group-hover:opacity-100">
                      Nhấn để trả lời →
                    </span>
                  </div>
                </div>
              );})}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Trang {currentPage + 1} / {totalPages} ({totalElements} yêu cầu)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => loadConversations(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/[0.05]"
                >
                  ← Trước
                </button>
                <button
                  onClick={() => loadConversations(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/[0.05]"
                >
                  Sau →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Modal */}
      {selectedConversation && (() => {
        const userDisplay = getUserDisplay(selectedConversation.customerId);
        return (
          <ChatModal
            isOpen={isChatModalOpen}
            onClose={handleCloseModal}
            conversation={selectedConversation}
            customerName={userDisplay.name}
            customerEmail={userDisplay.email}
            messages={messages}
            onSendMessage={handleSendMessage}
            onSendImage={handleSendImage}
            onCompleteConversation={handleCompleteConversation}
            onReopenConversation={handleReopenConversation}
            agentId={agentId}
          />
        );
      })()}
    </div>
  );
}
