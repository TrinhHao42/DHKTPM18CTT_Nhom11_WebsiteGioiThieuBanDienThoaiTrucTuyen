'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Message, Conversation } from '@/services/chatService';
import Badge from '../ui/badge/Badge';
import Image from 'next/image';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: Conversation;
  customerName?: string;
  customerEmail?: string;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onSendImage: (file: File, caption?: string) => Promise<void>;
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
  onSendImage,
  onCompleteConversation,
  onReopenConversation,
}: ChatModalProps) {
  const [messageInput, setMessageInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (!selectedImage) return;

    setIsUploading(true);
    try {
      await onSendImage(selectedImage, messageInput.trim() || undefined);
      setMessageInput('');
      handleRemoveImage();
      if (inputRef.current) {
        inputRef.current.style.height = '48px';
      }
      inputRef.current?.focus();
    } catch (error) {
      console.error('❌ Error uploading image:', error);
      alert('Không thể gửi ảnh. Vui lòng thử lại.');
    } finally {
      setIsUploading(false);
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
                            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                              {message.content}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                          {message.content}
                        </p>
                      )}
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
            <div className="space-y-3">
              {/* Image Preview */}
              {imagePreview && (
                <div className="relative inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-32 rounded-lg border-2 border-brand-500"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              
              <div className="flex items-start gap-3">
                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                />
                
                {/* Image upload button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                  title="Gửi ảnh"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
                
                <textarea
                  ref={inputRef}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={selectedImage ? "Thêm chú thích cho ảnh (tùy chọn)..." : "Nhập tin nhắn của bạn..."}
                  rows={1}
                  className="min-h-[48px] max-h-[200px] flex-1 resize-none overflow-y-auto rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
                  disabled={isUploading}
                />
                <button
                  onClick={selectedImage ? handleSendImage : handleSend}
                  disabled={(selectedImage ? false : !messageInput.trim()) || isUploading}
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-brand-500 text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-brand-600 dark:hover:bg-brand-700"
                >
                  {isUploading ? (
                    <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
