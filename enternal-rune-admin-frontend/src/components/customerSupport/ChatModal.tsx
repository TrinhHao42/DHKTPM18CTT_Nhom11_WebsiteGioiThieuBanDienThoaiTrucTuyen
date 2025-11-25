'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Message, Conversation } from '@/services/chatService';
import Badge from '../ui/badge/Badge';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: Conversation;
  customerName?: string;
  customerEmail?: string;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onCompleteConversation: () => void;
  onReopenConversation: () => void;
  agentId: string;
}

export default function ChatModal({
  isOpen,
  onClose,
  conversation,
  customerName,
  customerEmail,
  messages,
  onSendMessage,
  onCompleteConversation,
  onReopenConversation,
}: ChatModalProps) {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const autoResizeTextarea = () => {
    if (inputRef.current) {
      inputRef.current.style.height = '48px'; // Reset về min-height
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    autoResizeTextarea();
  }, [messageInput]);

  const handleSend = () => {
    if (messageInput.trim() && conversation.status !== 'CLOSED') {
      onSendMessage(messageInput.trim());
      setMessageInput('');
      if (inputRef.current) {
        inputRef.current.style.height = '48px'; // Reset về min-height
      }
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessageTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadge = () => {
    switch (conversation.status) {
      case 'PENDING':
        return <Badge variant="light" color="warning">Chờ xử lý</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="light" color="info">Đang xử lý</Badge>;
      case 'CLOSED':
        return <Badge variant="light" color="light">Đã hoàn thành</Badge>;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl" showCloseButton={false}>
      <div className="flex h-[80vh] flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-lg font-bold text-white">
              {customerName 
                ? customerName.substring(0, 2).toUpperCase()
                : conversation.customerId.substring(0, 2).toUpperCase()
              }
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {customerName || `Khách hàng #${conversation.customerId.substring(0, 12)}`}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {customerEmail || `ID: ${conversation.id.substring(0, 20)}...`}
              </p>
            </div>
          </div>
          
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 p-6 dark:bg-gray-900/50">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="mb-4 text-6xl">💬</div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message, index) => {
                const isAgent = message.senderRole === 'AGENT';
                return (
                  <div
                    key={message.id || index}
                    className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
                        isAgent
                          ? 'bg-brand-500 text-white'
                          : 'bg-white text-gray-900 dark:bg-white/[0.05] dark:text-white'
                      }`}
                    >
                      <div className="mb-1 flex items-center gap-2">
                        <span className={`text-xs font-medium ${isAgent ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                          {isAgent ? '👨‍💼 Nhân viên' : '👤 Khách hàng'}
                        </span>
                        <span className={`text-xs ${isAgent ? 'text-white/60' : 'text-gray-400'}`}>
                          {formatMessageTime(message.createdAt)}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
          {conversation.status === 'CLOSED' ? (
            <div className="space-y-3">
              <div className="rounded-lg bg-gray-100 px-4 py-3 text-center text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                🔒 Cuộc trò chuyện đã kết thúc
              </div>
              <div className="text-center">
                <button
                  onClick={onReopenConversation}
                  className="rounded-lg bg-brand-500 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-700"
                >
                  ↻ Khôi phục để tiếp tục trả lời
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <textarea
                ref={inputRef}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Nhập tin nhắn của bạn..."
                rows={1}
                className="min-h-[48px] max-h-[200px] flex-1 resize-none overflow-y-auto rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
              />
              <button
                onClick={handleSend}
                disabled={!messageInput.trim()}
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-brand-500 text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-brand-600 dark:hover:bg-brand-700"
              >
                <svg className="h-5 w-5 rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
