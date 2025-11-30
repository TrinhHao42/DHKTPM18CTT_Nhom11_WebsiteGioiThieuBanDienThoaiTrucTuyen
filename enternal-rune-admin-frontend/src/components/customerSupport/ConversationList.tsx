'use client';
import React from 'react';
import Badge from '../ui/badge/Badge';
import { Conversation } from '@/services/chatService';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (conversation: Conversation) => void;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
}

export default function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
}: ConversationListProps) {
  const getStatusBadgeColor = (status: Conversation['status']) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'IN_PROGRESS':
        return 'info';
      case 'CLOSED':
        return 'light';
      default:
        return 'primary';
    }
  };

  const getStatusText = (status: Conversation['status']) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ xử lý';
      case 'IN_PROGRESS':
        return 'Đang xử lý';
      case 'CLOSED':
        return 'Đã hoàn thành';
      default:
        return status;
    }
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

  // Sắp xếp: PENDING trước, sau đó IN_PROGRESS, cuối cùng CLOSED
  const sortedConversations = [...conversations].sort((a, b) => {
    const statusOrder = { PENDING: 0, IN_PROGRESS: 1, CLOSED: 2 };
    const orderA = statusOrder[a.status];
    const orderB = statusOrder[b.status];
    if (orderA !== orderB) return orderA - orderB;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2 p-4">
          {sortedConversations.length === 0 ? (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              <p>Chưa có yêu cầu hỗ trợ nào</p>
            </div>
          ) : (
            sortedConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onSelectConversation(conversation)}
                className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 hover:shadow-md ${
                  selectedConversationId === conversation.id
                    ? 'border-brand-500 bg-brand-50 dark:border-brand-600 dark:bg-brand-500/10'
                    : 'border-gray-200 bg-white hover:border-brand-300 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-brand-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white font-semibold">
                        {conversation.customerId.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          Khách hàng #{conversation.customerId.substring(0, 8)}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTime(conversation.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="light"
                        size="sm"
                        color={getStatusBadgeColor(conversation.status)}
                      >
                        {getStatusText(conversation.status)}
                      </Badge>
                      {conversation.status === 'PENDING' && (
                        <span className="flex h-2 w-2">
                          <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-warning-400 opacity-75"></span>
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-warning-500"></span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-gray-200 dark:border-gray-800 p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Hiển thị trang {currentPage + 1} / {totalPages} ({totalElements} yêu cầu)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/[0.05]"
              >
                Trước
              </button>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/[0.05]"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
