"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import AxiosInstance from "@/configs/AxiosInstance";
import { formatPrice } from "@/lib/format";

export default function FloatChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen && panelRef.current) {
      gsap.from(panelRef.current, {
        opacity: 0,
        scale: 0.8,
        y: 20,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !chatContainerRef.current) return;
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messages, isOpen]);

  const refusalMessage =
    "Xin lỗi, hiện tại tôi chỉ có thể cung cấp thông tin dựa trên dữ liệu sản phẩm có trong cửa hàng. Bạn vui lòng hỏi về sản phẩm cụ thể nhé!";

  const generateMessageId = () =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Date.now().toString();

  const normalizeSources = (payload: unknown): SupportProductInfo[] => {
    if (!Array.isArray(payload)) return [];
    return payload.map((item: unknown, index) => {
      const itemObj = item && typeof item === "object" ? item as Record<string, unknown> : {};
      
      const rawPrice =
        typeof itemObj.price === "number"
          ? itemObj.price
          : typeof itemObj.price === "string"
            ? Number(itemObj.price)
            : null;
      const safePrice =
        typeof rawPrice === "number" && Number.isFinite(rawPrice) ? rawPrice : null;
      const safeId =
        Number.isFinite(Number(itemObj.id)) && itemObj.id !== undefined
          ? Number(itemObj.id)
          : index;

      return {
        id: safeId,
        name: (typeof itemObj.name === "string" ? itemObj.name : null) ?? "Sản phẩm chưa xác định",
        brand: (typeof itemObj.brand === "string" ? itemObj.brand : null) ?? "Không rõ thương hiệu",
        price: safePrice,
        description: (typeof itemObj.description === "string" ? itemObj.description : null) ?? null,
      };
    });
  };

  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return "Đang cập nhật";
    }
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const buildSuggestionFromSources = (sources: SupportProductInfo[], keyword: string) => {
    if (!sources.length) {
      return refusalMessage;
    }
    const highlights = sources.slice(0, 3).map((item) => {
      return `• ${item.name} (${item.brand}) - ${formatCurrency(item.price)}`;
    });
    return [
      `Tôi đã tìm được sản phẩm "${keyword}" phù hợp với nhu cầu của bạn:`,
      ...highlights,
      sources.length > 3 ? `... và ${sources.length - 3} sản phẩm khác` : "",
      "Bạn muốn xem chi tiết mẫu nào hoặc cần tư vấn thêm thông tin gì?",
    ].filter(Boolean).join("\n");
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue.trim();
    const userMessage: Message = {
      id: generateMessageId(),
      text: userText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = inputValue;
    setInputValue("");
    setIsLoading(true);

    // Scroll to bottom sau khi user message được thêm
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
    }, 50);

    try {
      // Gọi API AI - backend nhận String trong body
      const response = await AxiosInstance.post<string>("/ai/generate", messageToSend, {
        headers: {
          "Content-Type": "application/json",
        },
        transformRequest: [(data) => data], // Gửi trực tiếp string, không stringify
      });

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: response.data || "Xin lỗi, tôi không thể xử lý yêu cầu này.",
        isUser: false,
        timestamp: new Date(),
        sources: normalizedSources,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error calling AI API:", error);
      let errorText = "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.";
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
        errorText = axiosError.response?.data?.message || axiosError.message || errorText;
      } else if (error instanceof Error) {
        errorText = error.message || errorText;
      }
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: errorText,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      // Scroll to bottom sau khi AI message được thêm
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight;
        }
      }, 50);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isThinking) {
      e.preventDefault();
      handleSend();
    }
  };

  // Format markdown text thành JSX đẹp hơn
  const formatMessage = (text: string) => {
    if (!text) return null;

    // Tách text theo line breaks
    const lines = text.split('\n').filter(line => line.trim());
    const elements: React.ReactNode[] = [];

    lines.forEach((line, lineIndex) => {
      // Kiểm tra nếu là list item (bắt đầu bằng * hoặc -)
      if (line.trim().startsWith('*') || line.trim().startsWith('-')) {
        const listContent = line.trim().substring(1).trim();
        elements.push(
          <div key={`line-${lineIndex}`} className="flex items-start gap-2 my-1.5">
            <span className="text-[#1447E6] mt-1.5">•</span>
            <span className="flex-1">{formatInlineMarkdown(listContent)}</span>
          </div>
        );
      } else {
        // Text thường, format inline markdown
        elements.push(
          <div key={`line-${lineIndex}`} className="my-1.5">
            {formatInlineMarkdown(line)}
          </div>
        );
      }
    });

    return <div>{elements}</div>;
  };

  // Format inline markdown (bold, số tiền)
  const formatInlineMarkdown = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let currentIndex = 0;

    // Regex để tìm **bold** và số tiền (bao gồm scientific notation)
    const boldRegex = /\*\*(.*?)\*\*/g;
    // Nhận diện: số thường, số có dấu chấm, scientific notation (2.799E7), kèm theo VNĐ hoặc đ
    const priceRegex = /(\d+(?:\.\d+)?(?:[Ee][+-]?\d+)?)\s*(?:VNĐ|đ|VND)/gi;
    const matches: Array<{ type: 'bold' | 'price'; start: number; end: number; content: string; formatted?: string }> = [];

    // Tìm tất cả bold
    let match;
    while ((match = boldRegex.exec(text)) !== null) {
      matches.push({
        type: 'bold',
        start: match.index,
        end: match.index + match[0].length,
        content: match[1],
      });
    }

    // Tìm tất cả số tiền (bao gồm scientific notation)
    while ((match = priceRegex.exec(text)) !== null) {
      const priceStr = match[1];
      let priceNum: number;
      
      // Convert scientific notation hoặc số thường sang number
      try {
        priceNum = parseFloat(priceStr);
        if (!isNaN(priceNum)) {
          // Format lại theo formatPrice
          const formatted = formatPrice(priceNum);
          matches.push({
            type: 'price',
            start: match.index,
            end: match.index + match[0].length,
            content: match[0], // Original text để replace
            formatted: formatted, // Formatted text để hiển thị
          });
        }
      } catch {
        // Nếu không parse được, giữ nguyên
        matches.push({
          type: 'price',
          start: match.index,
          end: match.index + match[0].length,
          content: match[0],
        });
      }
    }

    // Sắp xếp matches theo vị trí
    matches.sort((a, b) => a.start - b.start);

    // Nếu không có matches, trả về text gốc
    if (matches.length === 0) {
      return [text];
    }

    // Xử lý từng phần
    matches.forEach((m, idx) => {
      // Thêm text trước match
      if (m.start > currentIndex) {
        const beforeText = text.substring(currentIndex, m.start);
        if (beforeText) parts.push(beforeText);
      }

      // Thêm formatted content
      if (m.type === 'bold') {
        parts.push(
          <strong key={`bold-${idx}`} className="font-semibold text-slate-900">
            {m.content}
          </strong>
        );
      } else if (m.type === 'price') {
        parts.push(
          <span key={`price-${idx}`} className="font-semibold text-[#1447E6]">
            {m.formatted || m.content}
          </span>
        );
      }

      currentIndex = m.end;
    });

    // Thêm phần còn lại
    if (currentIndex < text.length) {
      const remainingText = text.substring(currentIndex);
      if (remainingText) parts.push(remainingText);
    }

    return parts.length > 0 ? parts : [text];
  };

  return (
    <>
      {/* Float Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        style={{ background: 'linear-gradient(to bottom right, #1447E6, #0d3bb8)' }}
        aria-label="Chat với AI"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 group-hover:scale-110 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className="fixed bottom-24 right-6 z-50 w-[380px] h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="text-white p-4 flex items-center justify-between" style={{ background: 'linear-gradient(to right, #1447E6, #0d3bb8)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Trợ lý AI</h3>
                <p className="text-xs text-white/80">Sẵn sàng hỗ trợ bạn</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Đóng chat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50"
          >
            {messages.length === 0 ? (
              <div className="text-center text-slate-500 mt-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 mx-auto mb-3 text-slate-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p className="text-sm">
                  Chào mừng! Hãy đặt câu hỏi về sản phẩm hoặc chính sách cửa hàng.
                </p>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                        msg.isUser
                          ? "text-white rounded-br-sm"
                          : "bg-white text-slate-900 border border-slate-200 rounded-bl-sm"
                      }`}
                      style={msg.isUser ? { backgroundColor: '#1447E6' } : {}}
                    >
                      {msg.isUser ? (
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      ) : (
                        <div className="text-sm leading-relaxed">{formatMessage(msg.text)}</div>
                      )}
                      <p
                        className={`text-xs mt-1 ${
                          msg.isUser ? "text-white/60" : "text-slate-400"
                        }`}
                      >
                        {msg.timestamp.toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-slate-900 border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-2 max-w-[75%]">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-xs text-slate-500">AI đang suy nghĩ...</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-slate-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-sm"
                style={{ '--tw-ring-color': '#1447E6' } as React.CSSProperties}
                onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px #1447E6'}
                onBlur={(e) => e.currentTarget.style.boxShadow = ''}
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className="w-10 h-10 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                style={{ backgroundColor: '#1447E6' }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = '#0d3bb8';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = '#1447E6';
                  }
                }}
                aria-label="Gửi tin nhắn"
              >
                {isLoading ? (
                  <svg
                    className="animate-spin w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
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
        </div>
      )}
    </>
  );
}

