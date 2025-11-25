"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  SearchIcon,
  EmojiIcon,
  PaperClipIcon,
  MicrophoneIcon,
  PaperPlaneIcon,
} from "@/icons";

// Kiểu dữ liệu cho chat items
type Chat = {
  id: number;
  name: string;
  role: string;
  lastMessage: string;
  time: string;
  avatar: string;
  isOnline: boolean;
  unreadCount: number;
};

// Mock data cho danh sách chat
const chatList: Chat[] = [
  {
    id: 1,
    name: "Lindsey Curtis",
    role: "Project Manager",
    lastMessage: "I want to make an appointment tomorrow from 2:00 to 5:00pm?",
    time: "15 mins",
    avatar: "/images/user/user-01.jpg",
    isOnline: true,
    unreadCount: 2,
  },
  {
    id: 2,
    name: "Sarah Wilson",
    role: "Designer",
    lastMessage: "Can you review the latest design mockups?",
    time: "30 mins",
    avatar: "/images/user/user-02.jpg",
    isOnline: true,
    unreadCount: 0,
  },
  {
    id: 3,
    name: "Mike Johnson",
    role: "Content Writer",
    lastMessage: "The blog post is ready for review",
    time: "45 mins",
    avatar: "/images/user/user-03.jpg",
    isOnline: false,
    unreadCount: 1,
  },
  {
    id: 4,
    name: "Emily Davis",
    role: "Front-end Developer",
    lastMessage: "I've completed the responsive design",
    time: "2 days",
    avatar: "/images/user/user-04.jpg",
    isOnline: true,
    unreadCount: 0,
  },
  {
    id: 5,
    name: "David Brown",
    role: "Digital Marketer",
    lastMessage: "The campaign results look promising",
    time: "1 hour",
    avatar: "/images/user/user-05.jpg",
    isOnline: false,
    unreadCount: 3,
  },
  {
    id: 6,
    name: "David Brown",
    role: "Digital Marketer",
    lastMessage: "The campaign results look promising",
    time: "1 hour",
    avatar: "/images/user/user-05.jpg",
    isOnline: false,
    unreadCount: 3,
  },
  {
    id: 7,
    name: "David Brown",
    role: "Digital Marketer",
    lastMessage: "The campaign results look promising",
    time: "1 hour",
    avatar: "/images/user/user-05.jpg",
    isOnline: false,
    unreadCount: 3,
    
  },
  {
    id: 8,
    name: "David Brown",
    role: "Digital Marketer",
    lastMessage: "The campaign results look promising",
    time: "1 hour",
    avatar: "/images/user/user-05.jpg",
    isOnline: false,
    unreadCount: 3,
  },
  {
    id: 9,
    name: "David Brown",
    role: "Digital Marketer",
    lastMessage: "The campaign results look promising",
    time: "1 hour",
    avatar: "/images/user/user-05.jpg",
    isOnline: false,
    unreadCount: 3,
  },
  {
    id: 10,
    name: "David Brown",
    role: "Digital Marketer",
    lastMessage: "The campaign results look promising",
    time: "1 hour",
    avatar: "/images/user/user-05.jpg",
    isOnline: false,
    unreadCount: 3,
  },
  {
    id: 11,
    name: "David Brown",
    role: "Digital Marketer",
    lastMessage: "The campaign results look promising",
    time: "1 hour",
    avatar: "/images/user/user-05.jpg",
    isOnline: false,
    unreadCount: 3,
  },
  {
    id: 12,
    name: "David Brown",
    role: "Digital Marketer",
    lastMessage: "The campaign results look promising",
    time: "1 hour",
    avatar: "/images/user/user-05.jpg",
    isOnline: false,
    unreadCount: 3,
  },
];

// Mock data cho tin nhắn
const messages = [
  {
    id: 1,
    sender: "Lindsey Curtis",
    content: "I want to make an appointment tomorrow from 2:00 to 5:00pm?",
    time: "2 hours ago",
    isOwn: false,
    avatar: "/images/user/user-01.jpg",
  },
  {
    id: 2,
    sender: "You",
    content: "If don't like something, I'll stay away from it.",
    time: "2 hours ago",
    isOwn: true,
  },
  {
    id: 3,
    sender: "Lindsey Curtis",
    content: "I want more detailed information.",
    time: "2 hours ago",
    isOwn: false,
    avatar: "/images/user/user-01.jpg",
  },
  {
    id: 4,
    sender: "You",
    content: "If don't like something, I'll stay away from it.",
    time: "2 hours ago",
    isOwn: true,
  },
  {
    id: 5,
    sender: "You",
    content: "They got there early and got really good seats",
    time: "2 hours ago",
    isOwn: true,
  },
  {
    id: 6,
    sender: "You",
    content: "They got there early and got really good seats",
    time: "2 hours ago",
    isOwn: true,
  },
  {
    id: 7,
    sender: "You",
    content: "They got there early and got really good seats",
    time: "2 hours ago",
    isOwn: true,
  },

  {
    id: 8,
    sender: "You",
    content: "They got there early and got really good seats",
    time: "2 hours ago",
    isOwn: true,
  },
  {
    id: 9,
    sender: "You",
    content: "They got there early and got really good seats",
    time: "2 hours ago",
    isOwn: true,
  },
  {
    id: 10,
    sender: "You",
    content: "They got there early and got really good seats",
    time: "2 hours ago",
    isOwn: true,
  },
];

export default function CustomerSupport() {
  const [selectedChat, setSelectedChat] = useState<Chat>(chatList[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showChatView, setShowChatView] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Set initial state based on screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const isMobile = window.innerWidth < 1024;
      if (isMobile) {
        setIsSidebarOpen(true);
        setShowChatView(false);
        document.body.classList.add("overflow-hidden");
      } else {
        setIsSidebarOpen(false);
        setShowChatView(false);
        document.body.classList.remove("overflow-hidden");
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Auto scroll xuống cuối tin nhắn
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat]);

  const filteredChats = chatList.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      console.log("Sending message:", messageInput);
      setMessageInput("");
      // TODO: Thêm message mới vào danh sách messages ở đây
    }
  };

  const handleChatClick = (chat: Chat) => {
    setSelectedChat(chat);
    const isMobile = window.innerWidth < 1024;
    if (isMobile) {
      setIsSidebarOpen(false);
      setShowChatView(true);
    }
  };

  const handleBackToList = () => {
    const isMobile = window.innerWidth < 1024;
    if (isMobile) {
      setShowChatView(false);
      setIsSidebarOpen(true);
    }
  };

  return (
    <div className="-mt-3 flex min-h-0 w-full flex-1 flex-col bg-gray-50 dark:bg-gray-900 lg:mx-0 lg:mt-0 lg:flex-row">
      {" "}
      {/* flex-1 để fill parent, -mx/-mt cancel padding của AdminLayout trên mobile, min-h-0 cho flex shrink */}
      {/* Mobile Overlay - Chỉ overlay khi sidebar open và chưa vào chat view */}
      {isSidebarOpen && !showChatView && (
        <div
          className="bg-opacity-50 fixed inset-0 z-40 bg-black transition-opacity duration-300 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      {/* Sidebar - Danh sách chat */}
      <aside
        className={`fixed inset-y-0 overflow-y-auto left-0 z-50 flex h-full min-h-0 w-full transform flex-col rounded-r-lg border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-out will-change-transform lg:static lg:left-auto lg:z-auto lg:w-80 lg:rounded-none lg:shadow-none ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} ${showChatView ? "hidden lg:block" : "block lg:block"} `}
      >
        {/* Search */}
        <div className="sticky top-3 z-10 flex-shrink-0 border-b border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-16 lg:h-[4.5rem] flex items-center px-3 lg:px-4">
          <div className="relative w-full">
            <div className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400 dark:text-gray-500">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 py-2 pr-3 pl-10 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="scrollbar-thin pt-2 scrollbar-thumb-gray-300 scrollbar-track-transparent min-h-0 flex-1 overflow-y-auto">
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleChatClick(chat)}
                className={`cursor-pointer border-b border-gray-100 dark:border-gray-700 p-3 transition-colors duration-150 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 ${
                  selectedChat.id === chat.id
                    ? "border-r-4 border-r-blue-500 bg-blue-50 dark:bg-blue-900/30 lg:border-r-0 lg:border-l-4 lg:border-l-blue-500"
                    : ""
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative h-10 w-10 flex-shrink-0">
                    <Image
                      src={chat.avatar}
                      alt={chat.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    {chat.isOnline && (
                      <div className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800 bg-green-500"></div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <h3 className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                        {chat.name}
                      </h3>
                      <span className="ml-2 flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">
                        {chat.time}
                      </span>
                    </div>
                    <p className="truncate text-xs leading-tight text-gray-500 dark:text-gray-400">
                      {chat.lastMessage}
                    </p>
                  </div>
                  {chat.unreadCount > 0 && (
                    <div className="ml-2 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                      {chat.unreadCount > 9 ? "9+" : chat.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
              No chats found
            </div>
          )}
        </div>
      </aside>
      {/* Main Chat Area */}
      <main className="relative flex flex-col w-full h-full overflow-hidden">

        {/* Chat Header */}
        <header className="sticky top-3 z-10 w-full flex-shrink-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-16 lg:h-[4.5rem] flex items-center px-3 lg:px-4">
        <div className="flex items-center justify-between w-full">
            <div className="flex flex-1 items-center space-x-3">
              {/* Mobile Back Button */}
              <button
                className="-ml-1 rounded-md p-2 transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 lg:hidden"
                onClick={handleBackToList}
              >
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  className="h-5 w-5 text-gray-500 dark:text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div className="relative flex-shrink-0">
                <Image
                  src={selectedChat.avatar}
                  alt={selectedChat.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                {selectedChat.isOnline && (
                  <div className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800 bg-green-500"></div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-semibold text-gray-900 dark:text-gray-100">
                  {selectedChat.name}
                </h3>
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                  {selectedChat.role}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 px-3 py-4 ">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isOwn ? "justify-end" : "justify-start"} mb-4`}
            >
              <div
                className={`flex max-w-[75%] items-end space-x-2 lg:max-w-[60%] ${message.isOwn ? "flex-row-reverse space-x-reverse" : ""}`}
              >
                {!message.isOwn && (
                  <div className="relative h-8 w-8 flex-shrink-0 lg:h-10 lg:w-10">
                    <Image
                      src={message.avatar || "/images/user/default.jpg"}
                      alt={message.sender}
                      width={32}
                      height={32}
                      className="rounded-full lg:h-10 lg:w-10"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div
                    className={`max-w-full rounded-2xl px-3 py-2 ${
                      message.isOwn
                        ? "bg-blue-500 text-white"
                        : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm"
                    }`}
                  >
                    <p className="text-sm break-words whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                  <div
                    className={`mt-1 text-xs text-gray-400 dark:text-gray-500 ${message.isOwn ? "text-right" : "text-left"}`}
                  >
                    {message.isOwn ? message.time : `${message.time}`}
                  </div>
                </div>
                {message.isOwn && <div className="h-8 w-8 lg:h-10 lg:w-10" />}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <footer className="sticky right-0 bottom-0 left-0 flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-3 lg:p-4">
          <div className="flex max-w-full items-end space-x-2">
            <button className="flex-shrink-0 rounded-full p-2 transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600">
              <EmojiIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
            <div className="relative min-w-0 flex-1">
              <input
                type="text"
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && !e.shiftKey && handleSendMessage()
                }
                className="w-full resize-none rounded-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 py-3 text-sm transition-shadow duration-150 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <button className="flex-shrink-0 rounded-full p-2 transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 lg:hidden">
              <PaperClipIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
            <button className="flex-shrink-0 rounded-full p-2 transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 lg:hidden">
              <MicrophoneIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              className="transform rounded-full bg-blue-500 p-2 text-white transition-all duration-150 hover:bg-blue-600 active:scale-95 active:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 dark:disabled:bg-gray-600"
            >
              <PaperPlaneIcon className="h-5 w-5" />
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}
