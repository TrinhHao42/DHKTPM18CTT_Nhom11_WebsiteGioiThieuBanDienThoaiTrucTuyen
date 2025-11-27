'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '@/services/chatService';
import Badge from '../ui/badge/Badge';

interface ChatInterfaceProps {
  conversationId: string;
  customerName?: string;
  customerEmail?: string;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onCompleteConversation: () => void;
  conversationStatus: 'PENDING' | 'IN_PROGRESS' | 'CLOSED';
  agentId: string;
}

export default function ChatInterface({
  conversationId,
  customerName,
  customerEmail,
  messages,
  onSendMessage,
  onCompleteConversation,
  conversationStatus,
  agentId,
}: ChatInterfaceProps) {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (messageInput.trim() && conversationStatus !== 'CLOSED') {
      onSendMessage(messageInput.trim());
      setMessageInput('');
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

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {customerName || 'Khách hàng'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {customerEmail || `ID: ${conversationId.substring(0, 16)}...`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {conversationStatus === 'PENDING' && (
              <Badge variant="light" color="warning">
                Chờ xử lý
              </Badge>
            )}
            {conversationStatus === 'IN_PROGRESS' && (
              <>
                <Badge variant="light" color="info">
                  Đang xử lý
                </Badge>
                <button
                  onClick={onCompleteConversation}
                  className="rounded-lg bg-success-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-success-600 dark:bg-success-600 dark:hover:bg-success-700"
                >
                  Hoàn thành
                </button>
              </>
            )}
            {conversationStatus === 'CLOSED' && (
              <Badge variant="light" color="light">
                Đã hoàn thành
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 p-6 dark:bg-gray-900/50">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">
                Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
              </p>
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
                    className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                      isAgent
                        ? 'bg-brand-500 text-white'
                        : 'bg-white text-gray-900 dark:bg-white/[0.03] dark:text-white'
                    }`}
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-xs font-medium opacity-80">
                        {isAgent ? 'Nhân viên' : 'Khách hàng'}
                      </span>
                      <span className="text-xs opacity-60">
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
      <div className="border-t border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-white/[0.03]">
        {conversationStatus === 'CLOSED' ? (
          <div className="rounded-lg bg-gray-100 px-4 py-3 text-center text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            Cuộc trò chuyện đã kết thúc
          </div>
        ) : (
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Nhập tin nhắn của bạn..."
                rows={3}
                className="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Nhấn Enter để gửi, Shift + Enter để xuống dòng
              </p>
            </div>
            <button
              onClick={handleSend}
              disabled={!messageInput.trim()}
              className="rounded-lg bg-brand-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-brand-600 dark:hover:bg-brand-700"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
  );
}
