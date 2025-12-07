# Tài liệu Chi tiết: Hệ thống Chat của ETERNAL RUNE

## 📋 Mục lục

1. [Tổng quan](#1-tổng-quan)
2. [Chat với AI (Trợ lý AI)](#2-chat-với-ai-trợ-lý-ai)
3. [Chat với Nhân viên (Assistance Chat)](#3-chat-với-nhân-viên-assistance-chat)
4. [Kiến trúc tổng thể](#4-kiến-trúc-tổng-thể)
5. [API Endpoints](#5-api-endpoints)
6. [Cấu hình & Triển khai](#6-cấu-hình--triển-khai)

---

## 1. Tổng quan

Hệ thống ETERNAL RUNE cung cấp **2 chức năng chat** chính:

| Chức năng | Mô tả | Công nghệ chính |
|-----------|-------|-----------------|
| **Chat với AI** | Trợ lý AI tư vấn sản phẩm, hỗ trợ khách hàng tự động | Spring AI, Google Gemini 2.0 Flash, Vector Store (RAG) |
| **Chat với Nhân viên** | Chat real-time giữa khách hàng và nhân viên hỗ trợ | WebSocket, STOMP, MongoDB |

---

## 2. Chat với AI (Trợ lý AI)

### 2.1 Mô tả chức năng

Trợ lý AI sử dụng **Google Gemini 2.0 Flash** kết hợp với **RAG (Retrieval-Augmented Generation)** để tư vấn sản phẩm dựa trên dữ liệu thực từ database.

**Khả năng:**
- Tư vấn sản phẩm dựa trên thông tin thực (tên, giá, mô tả, thương hiệu)
- Hỗ trợ hướng dẫn mua hàng, tạo tài khoản, kiểm tra đơn hàng
- Gợi ý sản phẩm liên quan từ database
- Không bịa thông tin ngoài dữ liệu có sẵn

### 2.2 Backend Implementation

#### 2.2.1 Controller: `ChatController.java`

```java
@RestController
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/ai/generate")
    public String generate(@RequestBody String message) {
        return chatService.processUserInput(message);
    }
}
```

**Endpoint:** `POST /ai/generate`
- **Request Body:** Plain text (tin nhắn từ user)
- **Response:** Plain text (câu trả lời từ AI)

#### 2.2.2 Service: `ChatService.java`

```java
@Service
public class ChatService {

    private final ChatClient chatClient;        // Spring AI ChatClient
    private final VectorStore vectorStore;       // Vector database cho RAG
    private final ProductVectorService vectorService;

    public String processUserInput(String userInput) {
        // Sử dụng RAG để truy vấn thông tin sản phẩm từ vector store
        QuestionAnswerAdvisor qaAdvisor = new QuestionAnswerAdvisor(vectorStore);

        // Đồng bộ sản phẩm vào vector store (nếu cần)
        vectorService.syncProductsToVector();

        return chatClient.prompt()
                .system("""
                    Bạn là Trợ lý AI của cửa hàng công nghệ ETERNAL RUNE.
                    
                    QUY TẮC:
                    - Chỉ trả lời dựa trên dữ liệu hệ thống cung cấp (database/RAG).
                    - Không bịa, không suy đoán ngoài dữ liệu.
                    - Luôn gợi ý ít nhất 2 sản phẩm liên quan từ dữ liệu.
                    - Luôn kết thúc bằng lời mời khách xem thêm sản phẩm.
                    
                    MỤC TIÊU:
                    - Tư vấn sản phẩm chính hãng, giá cạnh tranh.
                    - Hỗ trợ khách tìm sản phẩm phù hợp nhất.
                    """)
                .user(userInput)
                .advisors(qaAdvisor)  // RAG advisor
                .call()
                .content();
    }
}
```

**Công nghệ sử dụng:**
- **Spring AI:** Framework tích hợp AI vào Spring Boot
- **ChatClient:** Client gọi Google Gemini model
- **VectorStore:** Lưu trữ vector embeddings của sản phẩm (768 dimensions)
- **QuestionAnswerAdvisor:** RAG advisor để truy vấn ngữ cảnh

#### 2.2.3 Vector Service: `ProductVectorService.java`

```java
@Service
public class ProductVectorService {

    private final VectorStore vectorStore;
    private final ProductService productService;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void syncProductsToVector() {
        if(vectorStore.similaritySearch("products").isEmpty()) {
            List<Product> products = productService.getAllProductsWithActivePrice();
            List<Document> documents = products.stream()
                    .map(p -> Document.builder()
                            .id(UUID.randomUUID().toString())
                            .text(p.getProdName() + " - " + p.getProdDescription() +
                                    ". Giá: " + p.getProductPrices().getFirst().getPpPrice())
                            .metadata(Map.of(
                                    "entity", "product",
                                    "productId", p.getProdId(),
                                    "price", p.getProductPrices().getFirst().getPpPrice(),
                                    "brand", p.getProdBrand().getBrandName(),
                                    "description", p.getProdDescription()
                            ))
                            .build())
                    .toList();

            vectorStore.add(documents);
        }
    }
}
```

**Chức năng:**
- Tự động đồng bộ sản phẩm vào vector store khi ứng dụng khởi động
- Tạo document embeddings với metadata (productId, price, brand, description)
- Cho phép AI truy vấn thông tin sản phẩm chính xác

### 2.3 Frontend User Implementation

#### 2.3.1 Component: `FloatChatButton.tsx`

**Vị trí:** `enternal-rune-user-frontend/src/components/FloatChatButton.tsx`

```tsx
"use client";
import React, { useState, useRef } from "react";
import AxiosInstance from "@/configs/AxiosInstance";

export default function FloatChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
  }>>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Thêm tin nhắn user vào UI
    const userMessage = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Gọi API AI
      const response = await AxiosInstance.post<string>("/ai/generate", inputValue, {
        headers: { "Content-Type": "application/json" },
        transformRequest: [(data) => data], // Gửi trực tiếp string
      });

      // Thêm response AI vào UI
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: response.data,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      // Xử lý lỗi
    } finally {
      setIsLoading(false);
    }
  };

  // ... render UI (floating button + chat panel)
}
```

**Đặc điểm:**
- **Float Button:** Nút chat nổi ở góc phải dưới màn hình
- **Chat Panel:** Panel chat mở ra khi click button
- **Loading State:** Hiển thị animation "AI đang suy nghĩ..." khi chờ response
- **Markdown Formatting:** Format bold text và giá tiền trong response
- **GSAP Animation:** Animation mượt mà khi mở/đóng panel

### 2.4 Luồng hoạt động

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CHAT VỚI AI - LUỒNG HOẠT ĐỘNG                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  User Frontend                Backend                    Google Gemini      │
│       │                          │                              │           │
│       │ 1. Gửi tin nhắn         │                              │           │
│       │─────────────────────────>│                              │           │
│       │   POST /ai/generate      │                              │           │
│       │   body: "Tìm laptop..."  │                              │           │
│       │                          │                              │           │
│       │                          │ 2. Query VectorStore        │           │
│       │                          │    (RAG - tìm sản phẩm)     │           │
│       │                          │<─────────────────────────────│           │
│       │                          │                              │           │
│       │                          │ 3. Gọi ChatClient + context │           │
│       │                          │─────────────────────────────>│           │
│       │                          │                              │           │
│       │                          │ 4. Nhận response            │           │
│       │                          │<─────────────────────────────│           │
│       │                          │                              │           │
│       │ 5. Trả response text    │                              │           │
│       │<─────────────────────────│                              │           │
│       │                          │                              │           │
│       │ 6. Hiển thị lên UI      │                              │           │
│       │                          │                              │           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Chat với Nhân viên (Assistance Chat)

### 3.1 Mô tả chức năng

Chat real-time giữa khách hàng (user) và nhân viên hỗ trợ (agent) sử dụng WebSocket.

**Khả năng:**
- Chat text real-time
- Gửi hình ảnh
- Quản lý trạng thái cuộc hội thoại (PENDING → IN_PROGRESS → CLOSED)
- Lưu lịch sử tin nhắn vào MongoDB
- Thông báo real-time cho nhân viên khi có khách hàng mới

### 3.2 Backend Implementation

#### 3.2.1 Entities (MongoDB)

**Conversation.java:**
```java
@Data
@Document(collection = "conversations")
public class Conversation {
    @Id
    private String id;
    private String customerId;    // ID khách hàng
    private String agentId;       // ID nhân viên (null khi chưa assign)
    private String status;        // PENDING / IN_PROGRESS / CLOSED
    private Instant createdAt;
    private Instant closedAt;
}
```

**Message.java:**
```java
@Data
@Document(collection = "messages")
public class Message {
    @Id
    private String id;
    private String conversationId;
    private String senderId;          // ID người gửi
    private Role senderRole;          // CUSTOMER / AGENT
    private String content;           // Nội dung text
    private String type;              // TEXT / IMAGE
    private String fileUrl;           // URL file (nếu type = IMAGE)
    private Instant createdAt;
}
```

**Role.java (Enum):**
```java
public enum Role {
    CUSTOMER,
    AGENT
}
```

**User.java:**
```java
@Data
@Document(collection = "chat_users")
public class User {
    @Id
    private String id;
    private String displayName;
    private String email;
    private Role role;    // CUSTOMER / AGENT / ADMIN
}
```

#### 3.2.2 WebSocket Configuration: `WebsocketConfig.java`

```java
@Configuration
@EnableWebSocket
@EnableWebSocketMessageBroker
public class WebsocketConfig implements WebSocketConfigurer, WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // SockJS endpoint cho frontend web
        registry.addEndpoint("/ws/sockjs")
                .setAllowedOriginPatterns("*")
                .withSockJS()
                .setSuppressCors(true);
        
        // Native WebSocket endpoint
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*");
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Prefix cho client gửi message
        registry.setApplicationDestinationPrefixes("/assistance");

        // Prefix cho client subscribe (nhận broadcast)
        registry.enableSimpleBroker("/topic");
    }
}
```

**Endpoints:**
- **`/ws/sockjs`:** WebSocket endpoint với SockJS fallback
- **`/ws`:** Native WebSocket endpoint
- **`/assistance/*`:** Prefix cho message gửi từ client
- **`/topic/*`:** Prefix cho broadcast từ server

#### 3.2.3 WebSocket Controller: `ChatWebSocketController.java`

```java
@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final MessageRepository messageRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/conversations/{conversationId}/send")
    public void sendMessage(
            @DestinationVariable String conversationId,
            @Payload ChatMessageDto chatMessageDto
    ) {
        // 1. Tạo và lưu message vào MongoDB
        Message message = new Message();
        message.setConversationId(conversationId);
        message.setSenderId(chatMessageDto.getSenderId());
        message.setSenderRole(chatMessageDto.getSenderRole());
        message.setContent(chatMessageDto.getContent());
        message.setType("TEXT");
        message.setCreatedAt(Instant.now());
        Message saved = messageRepository.save(message);

        // 2. Broadcast message tới tất cả client đang subscribe
        messagingTemplate.convertAndSend(
                "/topic/conversations/" + conversationId,
                saved
        );
    }
}
```

**Luồng xử lý:**
1. Client gửi message tới `/assistance/conversations/{id}/send`
2. Server lưu message vào MongoDB
3. Server broadcast message tới `/topic/conversations/{id}`
4. Tất cả client đang subscribe nhận được message real-time

#### 3.2.4 REST Controllers

**ConversationController.java:**
```java
@RestController
@RequestMapping("/api/conversations")
public class ConversationController {

    // Tạo conversation mới
    @PostMapping
    public Conversation createConversation(@RequestParam String customerId) {
        // Kiểm tra có conversation active không
        List<Conversation> existing = conversationRepository.findByCustomerId(customerId);
        for (Conversation conv : existing) {
            if ("PENDING".equals(conv.getStatus()) || "IN_PROGRESS".equals(conv.getStatus())) {
                return conv; // Trả về conversation đang active
            }
        }
        
        // Tạo mới
        Conversation c = new Conversation();
        c.setCustomerId(customerId);
        c.setStatus("PENDING");
        c.setCreatedAt(Instant.now());
        Conversation saved = conversationRepository.save(c);

        // Broadcast tới admin
        messagingTemplate.convertAndSend("/topic/conversations", saved);
        
        return saved;
    }

    // Lấy conversation theo ID
    @GetMapping("/{id}")
    public Conversation getConversation(@PathVariable String id);

    // Lấy tất cả conversations (phân trang)
    @GetMapping
    public Page<Conversation> getAllConversations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    );

    // Cập nhật trạng thái conversation
    @PatchMapping("/{id}")
    public Conversation updateConversation(
            @PathVariable String id,
            @RequestBody Map<String, Object> updates  // { status, agentId }
    );

    // Lấy số tin nhắn chưa đọc
    @GetMapping("/unread-counts")
    public Map<String, Integer> getUnreadCounts(@RequestParam String agentId);
}
```

**MessageController.java:**
```java
@RestController
@RequestMapping("/api/messages")
public class MessageController {

    // Lấy lịch sử tin nhắn của conversation
    @GetMapping("/conversation/{conversationId}")
    public List<Message> getMessages(@PathVariable String conversationId);
}
```

**ChatFileController.java:**
```java
@RestController
@RequestMapping("/api/chat")
public class ChatFileController {

    // Upload hình ảnh trong chat
    @PostMapping("/conversations/{conversationId}/image")
    public ResponseEntity<Message> uploadImage(
            @PathVariable String conversationId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("senderId") String senderId,
            @RequestParam("senderRole") Role senderRole,
            @RequestParam(value = "caption", required = false) String caption
    );
}
```

**ChatUserController.java:**
```java
@RestController
@RequestMapping("/api/chat-users")
public class ChatUserController {

    // Đăng ký hoặc cập nhật thông tin user
    @PostMapping("/register-or-update")
    public User registerOrUpdateUser(@RequestBody Map<String, String> userInfo);

    // Lấy thông tin user
    @GetMapping("/{userId}")
    public User getUser(@PathVariable String userId);
}
```

### 3.3 Frontend User Implementation

#### 3.3.1 Service: `assistanceChatService.ts`

```typescript
// Types
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
  fileUrl?: string;
  createdAt: string;
}

// API Functions
export const createConversation = async (customerId: string): Promise<Conversation> => {
  const response = await AxiosInstance.post(`/api/conversations?customerId=${customerId}`);
  return response.data;
};

export const getMessagesByConversation = async (conversationId: string): Promise<Message[]> => {
  const response = await AxiosInstance.get(`/api/messages/conversation/${conversationId}`);
  return response.data;
};

export const uploadImageMessage = async (
  conversationId: string,
  senderId: string,
  senderRole: 'CUSTOMER' | 'AGENT',
  file: File,
  caption?: string
): Promise<Message> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('senderId', senderId);
  formData.append('senderRole', senderRole);
  if (caption) formData.append('caption', caption);

  const response = await AxiosInstance.post(
    `/api/chat/conversations/${conversationId}/image`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data;
};
```

#### 3.3.2 WebSocket Service: `chatWebSocketService.ts`

```typescript
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export class ChatWebSocketService {
  private client: Client | null = null;

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS(`${WEBSOCKET_URL}/ws/sockjs`),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });
  }

  connect(): void {
    if (this.client && !this.client.active) {
      this.client.activate();
    }
  }

  subscribeToConversation(conversationId: string, onMessage: (message: Message) => void): Promise<void> {
    return new Promise((resolve) => {
      this.client.subscribe(
        `/topic/conversations/${conversationId}`,
        (message: IMessage) => {
          const receivedMessage: Message = JSON.parse(message.body);
          onMessage(receivedMessage);
        }
      );
      resolve();
    });
  }

  sendMessage(conversationId: string, senderId: string, content: string): void {
    const messageDto = {
      conversationId,
      senderId,
      senderRole: 'CUSTOMER',
      content,
    };

    this.client.publish({
      destination: `/assistance/conversations/${conversationId}/send`,
      body: JSON.stringify(messageDto),
    });
  }
}

// Singleton instance
export const getChatWebSocketService = (): ChatWebSocketService => {
  if (!chatWebSocketServiceInstance) {
    chatWebSocketServiceInstance = new ChatWebSocketService();
  }
  return chatWebSocketServiceInstance;
};
```

#### 3.3.3 Chat Page: `AssistanceChat/index.tsx`

**Vị trí:** `enternal-rune-user-frontend/src/pages/AssistanceChat/index.tsx`

```tsx
const AssistanceChat = () => {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsServiceRef = useRef(getChatWebSocketService());

  useEffect(() => {
    if (!user?.userId || !token) return;

    const initializeChat = async () => {
      // 1. Đăng ký user trong MongoDB
      await registerOrUpdateChatUser(user.userId.toString(), user.userName, user.userEmail);

      // 2. Kiểm tra conversation active
      const conversations = await getConversationsByCustomer(user.userId.toString());
      const activeConv = conversations.find(
        conv => conv.status === 'PENDING' || conv.status === 'IN_PROGRESS'
      );

      if (activeConv) {
        setConversationId(activeConv.id);
        
        // Load lịch sử tin nhắn
        const history = await getMessagesByConversation(activeConv.id);
        setMessages(history.map(convertBackendMessage));

        // Connect WebSocket & subscribe
        wsService.connect();
        await wsService.subscribeToConversation(activeConv.id, handleNewMessage);
      } else {
        // Chỉ connect WebSocket, tạo conversation khi user gửi tin đầu tiên
        wsService.connect();
      }
    };

    initializeChat();
  }, [user?.userId, token]);

  const handleSendMessage = async () => {
    let currentConvId = conversationId;
    
    // Tạo conversation nếu chưa có
    if (!currentConvId) {
      const newConversation = await createConversation(user.userId.toString());
      currentConvId = newConversation.id;
      setConversationId(currentConvId);
      await wsService.subscribeToConversation(currentConvId, handleNewMessage);
    }

    // Gửi message qua WebSocket
    wsService.sendMessage(currentConvId, user.userId.toString(), messageContent);
  };

  // ... render UI
};
```

**Đặc điểm:**
- Yêu cầu đăng nhập mới sử dụng được
- Tự động load lịch sử tin nhắn
- Real-time messaging qua WebSocket
- Hỗ trợ gửi hình ảnh
- Hiển thị trạng thái kết nối

### 3.4 Frontend Admin Implementation

#### 3.4.1 Service: `chatService.ts`

**Vị trí:** `enternal-rune-admin-frontend/src/services/chatService.ts`

```typescript
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class ChatService {
  private stompClient: Client | null = null;
  private subscriptions: Map<string, any> = new Map();

  connect(onConnected?: () => void, onError?: (error: any) => void) {
    const socket = new SockJS(`${BACKEND_URL}/ws/sockjs`);
    
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => onConnected?.(),
      onStompError: (frame) => onError?.(frame),
    });

    this.stompClient.activate();
  }

  // Subscribe to all conversations (for real-time updates)
  subscribeToAllConversations(onConversationUpdate: (conversation: Conversation) => void) {
    this.stompClient.subscribe('/topic/conversations', (message: IMessage) => {
      const updatedConversation: Conversation = JSON.parse(message.body);
      onConversationUpdate(updatedConversation);
    });
  }

  // Subscribe to specific conversation messages
  subscribeToConversation(conversationId: string, onMessageReceived: (message: Message) => void) {
    this.stompClient.subscribe(
      `/topic/conversations/${conversationId}`,
      (message: IMessage) => {
        const receivedMessage: Message = JSON.parse(message.body);
        onMessageReceived(receivedMessage);
      }
    );
  }

  // Send message as agent
  sendMessage(conversationId: string, message: Omit<Message, 'conversationId'>) {
    this.stompClient.publish({
      destination: `/assistance/conversations/${conversationId}/send`,
      body: JSON.stringify({ ...message, conversationId }),
    });
  }

  // REST API calls
  async getConversations(page: number = 0, size: number = 20): Promise<PageResponse>;
  async getMessages(conversationId: string): Promise<Message[]>;
  async updateConversationStatus(conversationId: string, status: string, agentId?: string): Promise<Conversation>;
  async getUnreadCounts(agentId: string): Promise<Map<string, number>>;
  async uploadImageMessage(conversationId: string, senderId: string, senderRole: string, file: File, caption?: string): Promise<Message>;
}

export const chatService = new ChatService();
```

#### 3.4.2 Main Component: `CustomerSupport.tsx`

**Vị trí:** `enternal-rune-admin-frontend/src/components/customerSupport/CustomerSupport.tsx`

```tsx
export default function CustomerSupport() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState<Map<string, number>>(new Map());
  const agentId = 'agent-001'; // Từ auth context

  useEffect(() => {
    // Kết nối WebSocket
    chatService.connect(
      () => {
        setIsConnected(true);
        loadConversations();
        subscribeToNewConversations();
      },
      (error) => setIsConnected(false)
    );

    return () => chatService.disconnect();
  }, []);

  // Subscribe to new conversations
  const subscribeToNewConversations = () => {
    chatService.subscribeToAllConversations(async (updatedConversation) => {
      // Update UI with new/updated conversation
      setConversations((prev) => {
        const existingIndex = prev.findIndex((c) => c.id === updatedConversation.id);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = updatedConversation;
          return updated;
        } else {
          // New conversation - add to top with unread indicator
          setUnreadCounts((prevCounts) => {
            const newCounts = new Map(prevCounts);
            newCounts.set(updatedConversation.id, 1);
            return newCounts;
          });
          return [updatedConversation, ...prev];
        }
      });
    });
  };

  // Handle selecting a conversation
  const handleSelectConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation);

    // Load messages
    const conversationMessages = await chatService.getMessages(conversation.id);
    setMessages(conversationMessages);

    // Clear unread count
    setUnreadCounts((prev) => {
      const newCounts = new Map(prev);
      newCounts.delete(conversation.id);
      return newCounts;
    });

    // If PENDING, change to IN_PROGRESS
    if (conversation.status === 'PENDING') {
      await chatService.updateConversationStatus(conversation.id, 'IN_PROGRESS', agentId);
    }

    setIsChatModalOpen(true);
  };

  // Handle sending message
  const handleSendMessage = (content: string) => {
    chatService.sendMessage(selectedConversation.id, {
      senderId: agentId,
      senderRole: 'AGENT',
      content,
    });
  };

  // Handle completing conversation
  const handleCompleteConversation = async () => {
    await chatService.updateConversationStatus(selectedConversation.id, 'CLOSED');
  };

  // ... render UI with conversation list, chat modal, etc.
}
```

#### 3.4.3 Chat Interface Component: `ChatInterface.tsx`

```tsx
interface ChatInterfaceProps {
  conversationId: string;
  customerName?: string;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onCompleteConversation: () => void;
  conversationStatus: 'PENDING' | 'IN_PROGRESS' | 'CLOSED';
  agentId: string;
}

export default function ChatInterface({
  messages,
  onSendMessage,
  onCompleteConversation,
  conversationStatus,
}: ChatInterfaceProps) {
  const [messageInput, setMessageInput] = useState('');

  const handleSend = () => {
    if (messageInput.trim() && conversationStatus !== 'CLOSED') {
      onSendMessage(messageInput.trim());
      setMessageInput('');
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header with customer info and status badges */}
      <div className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>{customerName}</div>
          <div>
            {conversationStatus === 'IN_PROGRESS' && (
              <button onClick={onCompleteConversation}>Hoàn thành</button>
            )}
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6">
        {messages.map((message) => (
          <div key={message.id} className={message.senderRole === 'AGENT' ? 'justify-end' : 'justify-start'}>
            <div className="rounded-2xl px-4 py-3">
              <p>{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="border-t px-6 py-4">
        {conversationStatus === 'CLOSED' ? (
          <div>Cuộc trò chuyện đã kết thúc</div>
        ) : (
          <div className="flex gap-3">
            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
            />
            <button onClick={handleSend}>Gửi</button>
          </div>
        )}
      </div>
    </div>
  );
}
```

### 3.5 Luồng hoạt động chi tiết

#### 3.5.1 Giải thích tổng quan

Chat với nhân viên sử dụng **WebSocket** để truyền tin nhắn real-time giữa 3 bên:
1. **User Frontend** (khách hàng cần hỗ trợ)
2. **Backend** (server xử lý và lưu trữ)
3. **Admin Frontend** (nhân viên hỗ trợ)

**Công nghệ:**
- **WebSocket Protocol:** Kết nối 2 chiều liên tục (persistent connection)
- **STOMP:** Protocol messaging trên WebSocket (như HTTP cho REST)
- **SockJS:** Fallback khi WebSocket không khả dụng (dùng long-polling)
- **MongoDB:** Lưu trữ conversations và messages

#### 3.5.2 Các khái niệm quan trọng

**1. WebSocket Endpoints:**
```
/ws/sockjs          → Endpoint để kết nối WebSocket (có SockJS fallback)
```

**2. Destination Patterns:**
```
/assistance/*       → Client GỬI message tới server (publish)
/topic/*            → Client NHẬN message từ server (subscribe/broadcast)
```

**3. Message Flow:**
```
Client gửi → /assistance/conversations/{id}/send
           ↓
       Server nhận & lưu vào MongoDB
           ↓
       Server broadcast → /topic/conversations/{id}
           ↓
       Tất cả clients đang subscribe nhận được
```

#### 3.5.3 Ví dụ cụ thể: Khách hàng chat với nhân viên

**BƯỚC 1: Khách hàng mở trang chat**

*User Frontend:*
```typescript
// 1.1. Đăng ký user vào hệ thống chat
await registerOrUpdateChatUser(
  userId: "123",
  displayName: "Nguyễn Văn A",
  email: "a@gmail.com"
);

// 1.2. Kết nối WebSocket
const wsService = new ChatWebSocketService();
wsService.connect(); // Kết nối tới ws://localhost:8080/ws/sockjs
```

*Backend lưu vào MongoDB:*
```json
{
  "_id": "123",
  "displayName": "Nguyễn Văn A",
  "email": "a@gmail.com",
  "role": "CUSTOMER"
}
```

---

**BƯỚC 2: Nhân viên cũng mở trang hỗ trợ**

*Admin Frontend:*
```typescript
// 2.1. Kết nối WebSocket
chatService.connect();

// 2.2. Subscribe để nhận thông báo conversation mới
chatService.subscribe(
  '/topic/conversations',  // Lắng nghe conversation mới
  (conversation) => {
    console.log('Có yêu cầu hỗ trợ mới:', conversation);
    // Hiển thị chấm đỏ thông báo
  }
);
```

---

**BƯỚC 3: Khách hàng gửi tin nhắn đầu tiên**

*User Frontend:*
```typescript
// 3.1. Tạo conversation mới (vì chưa có)
const newConversation = await createConversation(userId: "123");
// Backend tạo và trả về:
{
  "id": "conv-abc-123",
  "customerId": "123",
  "status": "PENDING",
  "createdAt": "2025-12-07T10:00:00Z"
}

// 3.2. Subscribe để nhận tin nhắn trong conversation này
wsService.subscribeToConversation(
  "conv-abc-123",
  (message) => {
    console.log('Nhận tin nhắn:', message);
    // Hiển thị tin nhắn trong UI
  }
);

// 3.3. Gửi tin nhắn
wsService.sendMessage(
  conversationId: "conv-abc-123",
  senderId: "123",
  content: "Xin chào, tôi cần hỗ trợ về sản phẩm"
);
```

*Backend xử lý:*
```java
@MessageMapping("/conversations/{conversationId}/send")
public void sendMessage(@DestinationVariable String conversationId,
                       @Payload ChatMessageDto dto) {
    // 1. Lưu vào MongoDB
    Message message = new Message();
    message.setConversationId("conv-abc-123");
    message.setSenderId("123");
    message.setSenderRole("CUSTOMER");
    message.setContent("Xin chào, tôi cần hỗ trợ về sản phẩm");
    message.setCreatedAt(Instant.now());
    Message saved = messageRepository.save(message);
    
    // 2. Broadcast tới tất cả client đang subscribe
    messagingTemplate.convertAndSend(
        "/topic/conversations/conv-abc-123",
        saved
    );
}
```

*Admin Frontend nhận được:*
```typescript
// Nhân viên thấy conversation mới xuất hiện trong danh sách
// với status = "PENDING" và số tin nhắn chưa đọc = 1
```

---

**BƯỚC 4: Nhân viên click vào conversation**

*Admin Frontend:*
```typescript
// 4.1. Load lịch sử tin nhắn
const messages = await chatService.getMessages("conv-abc-123");
// Backend trả về:
[
  {
    "id": "msg-1",
    "conversationId": "conv-abc-123",
    "senderId": "123",
    "senderRole": "CUSTOMER",
    "content": "Xin chào, tôi cần hỗ trợ về sản phẩm",
    "createdAt": "2025-12-07T10:00:15Z"
  }
]

// 4.2. Subscribe để nhận tin mới trong conversation
chatService.subscribe(
  '/topic/conversations/conv-abc-123',
  (message) => {
    setMessages(prev => [...prev, message]);
  }
);

// 4.3. Cập nhật status sang IN_PROGRESS
await chatService.updateConversationStatus(
  "conv-abc-123",
  "IN_PROGRESS",
  agentId: "agent-456"
);
```

---

**BƯỚC 5: Nhân viên trả lời**

*Admin Frontend:*
```typescript
chatService.sendMessage("conv-abc-123", {
  senderId: "agent-456",
  senderRole: "AGENT",
  content: "Xin chào! Tôi có thể giúp gì cho bạn?"
});
```

*Backend xử lý:*
```java
// Lưu vào MongoDB và broadcast
messagingTemplate.convertAndSend(
    "/topic/conversations/conv-abc-123",
    savedMessage
);
```

*User Frontend nhận được:*
```typescript
// Callback được trigger
(message) => {
  console.log('Nhân viên trả lời:', message.content);
  // Hiển thị tin nhắn của nhân viên trong UI
}
```

---

**BƯỚC 6: Chat qua lại real-time**

Từ giờ, mọi tin nhắn đều đi theo luồng:

```
Người gửi → /assistance/conversations/conv-abc-123/send
         ↓
    Backend lưu MongoDB
         ↓
    Broadcast → /topic/conversations/conv-abc-123
         ↓
    Tất cả người đang subscribe nhận được (cả user lẫn agent)
```

---

**BƯỚC 7: Kết thúc hỗ trợ**

*Admin Frontend:*
```typescript
await chatService.updateConversationStatus("conv-abc-123", "CLOSED");
```

*Backend:*
```java
// Cập nhật status trong MongoDB
conversation.setStatus("CLOSED");
conversationRepository.save(conversation);
```

Sau đó, cả khách hàng và nhân viên đều không thể gửi tin nhắn mới nữa.

---

#### 3.5.4 Diagram tổng quan

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                     CHAT VỚI NHÂN VIÊN - LUỒNG HOẠT ĐỘNG                                 │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│  User Frontend            Backend (WebSocket + REST)          Admin Frontend             │
│       │                          │                                   │                  │
│       │ 1. User đăng nhập        │                                   │                  │
│       │──────────────────────────>│                                   │                  │
│       │   POST /api/chat-users    │                                   │                  │
│       │   /register-or-update     │                                   │                  │
│       │                          │                                   │                  │
│       │ 2. Connect WebSocket     │                                   │                  │
│       │──────────────────────────>│                                   │ Agent connected │
│       │   /ws/sockjs              │<──────────────────────────────────│ đang subscribe │
│       │                          │                                   │ /topic/convs    │
│       │                          │                                   │                  │
│       │ 3. Gửi tin nhắn đầu tiên │                                   │                  │
│       │──────────────────────────>│                                   │                  │
│       │   POST /api/conversations │                                   │                  │
│       │   (tạo conversation)      │                                   │                  │
│       │                          │                                   │                  │
│       │                          │ 4. Broadcast new conversation     │                  │
│       │                          │─────────────────────────────────-->│                  │
│       │                          │   /topic/conversations             │ 5. Hiển thị    │
│       │                          │                                   │    yêu cầu mới  │
│       │                          │                                   │    (chấm đỏ)    │
│       │                          │                                   │                  │
│       │ 6. Subscribe conversation │                                   │                  │
│       │──────────────────────────>│                                   │                  │
│       │   /topic/conversations/X  │                                   │                  │
│       │                          │                                   │                  │
│       │ 7. Gửi message           │                                   │                  │
│       │──────────────────────────>│                                   │                  │
│       │   /assistance/convs/X     │                                   │                  │
│       │   /send                   │                                   │                  │
│       │                          │                                   │                  │
│       │                          │ 8. Lưu MongoDB + Broadcast        │                  │
│       │<─────────────────────────│─────────────────────────────────-->│                  │
│       │   /topic/conversations/X  │                                   │ 9. Agent thấy  │
│       │   (nhận lại message)      │                                   │    tin nhắn    │
│       │                          │                                   │                  │
│       │                          │                                   │ 10. Agent click │
│       │                          │<──────────────────────────────────│     vào conv    │
│       │                          │   PATCH /api/conversations/X      │                  │
│       │                          │   { status: IN_PROGRESS }         │                  │
│       │                          │                                   │                  │
│       │                          │ 11. Agent gửi reply               │                  │
│       │                          │<──────────────────────────────────│                  │
│       │                          │   /assistance/convs/X/send        │                  │
│       │                          │                                   │                  │
│       │ 12. Nhận reply          │                                   │                  │
│       │<─────────────────────────│─────────────────────────────────-->│                  │
│       │   /topic/conversations/X  │                                   │                  │
│       │                          │                                   │                  │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

#### 3.5.5 So sánh WebSocket vs REST API

| Khía cạnh | REST API | WebSocket (Chat với nhân viên) |
|-----------|----------|--------------------------------|
| **Kết nối** | Request-Response (ngắn hạn) | Persistent connection (duy trì liên tục) |
| **Chiều truyền** | 1 chiều (client → server) | 2 chiều (client ↔ server) |
| **Cách hoạt động** | Client hỏi, server trả lời | Server có thể PUSH tin mới bất cứ lúc nào |
| **Use case** | Chat AI, CRUD operations | Chat real-time, notifications |
| **Ví dụ** | `POST /ai/generate` | `SEND → /assistance/conversations/{id}/send`<br>`SUBSCRIBE ← /topic/conversations/{id}` |

**Tại sao Chat AI dùng REST còn Chat Nhân viên dùng WebSocket?**

- **Chat AI:** User hỏi → AI trả lời → xong. Không cần 2 chiều real-time.
- **Chat Nhân viên:** Cần 2 chiều real-time. Nhân viên có thể gửi tin bất cứ lúc nào, user cũng vậy.

#### 3.5.6 Câu hỏi thường gặp

**Q1: Nếu user mất kết nối WebSocket thì sao?**
- User sẽ reconnect tự động (logic trong `ChatWebSocketService`)
- Khi reconnect, sẽ load lại lịch sử tin nhắn từ MongoDB (không bị mất tin)

**Q2: Làm sao biết tin nhắn của ai?**
- Mỗi message có `senderId` và `senderRole` (CUSTOMER / AGENT)
- Frontend render khác nhau dựa vào `senderRole`:
  - CUSTOMER → tin nhắn bên trái, màu xám
  - AGENT → tin nhắn bên phải, màu xanh

**Q3: Nhiều nhân viên có thể cùng nhìn thấy conversation không?**
- **Có!** Tất cả agent đang subscribe `/topic/conversations` đều thấy conversation mới
- Nhưng chỉ agent nào click vào trước (status → IN_PROGRESS) thì xử lý
- Agent khác vẫn thấy nhưng biết đã có người xử lý rồi

**Q4: Conversation được lưu ở đâu?**
- **MongoDB collections:**
  - `conversations` - Thông tin conversation (customerId, agentId, status, timestamps)
  - `messages` - Tất cả tin nhắn (conversationId, senderId, content, createdAt)
  - `chat_users` - Thông tin user (displayName, email, role)

**Q5: WebSocket endpoint `/ws/sockjs` vs `/ws` khác gì?**
- `/ws/sockjs` - Có SockJS fallback (nếu WebSocket bị chặn, dùng long-polling)
- `/ws` - WebSocket thuần (native)
- Frontend ưu tiên dùng `/ws/sockjs` để đảm bảo tương thích

---

## 4. Kiến trúc tổng thể

### 4.1 Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Spring Boot 3.x, Spring AI, Spring WebSocket, MongoDB |
| **AI/LLM** | Google Gemini 2.0 Flash (via Spring AI), Vector Store (PGVector) |
| **WebSocket** | STOMP over SockJS |
| **Frontend User** | Next.js 14+, React 19, TypeScript, @stomp/stompjs, SockJS-client |
| **Frontend Admin** | Next.js 14+, React 19, TypeScript, @stomp/stompjs, SockJS-client |
| **Database** | PostgreSQL (main), MongoDB (chat data) |

### 4.2 Dependencies

**Backend (pom.xml):**
```xml
<!-- Spring AI -->
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-vertex-ai-gemini-spring-boot-starter</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-pgvector-store-spring-boot-starter</artifactId>
</dependency>

<!-- WebSocket -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>

<!-- MongoDB -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-mongodb</artifactId>
</dependency>
```

**Frontend (package.json):**
```json
{
  "dependencies": {
    "@stomp/stompjs": "^7.x",
    "sockjs-client": "^1.x",
    "axios": "^1.x"
  }
}
```

---

## 5. API Endpoints

### 5.1 Chat AI

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/ai/generate` | Gửi tin nhắn cho AI, nhận response |

### 5.2 Chat với Nhân viên - REST API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/conversations?customerId={id}` | Tạo conversation mới |
| GET | `/api/conversations` | Lấy danh sách conversations (phân trang) |
| GET | `/api/conversations/{id}` | Lấy conversation theo ID |
| GET | `/api/conversations/customer/{customerId}` | Lấy conversations của customer |
| PATCH | `/api/conversations/{id}` | Cập nhật status/agentId |
| GET | `/api/conversations/unread-counts?agentId={id}` | Lấy số tin chưa đọc |
| GET | `/api/messages/conversation/{conversationId}` | Lấy tin nhắn của conversation |
| POST | `/api/chat/conversations/{conversationId}/image` | Upload hình ảnh |
| POST | `/api/chat-users/register-or-update` | Đăng ký/cập nhật user |
| GET | `/api/chat-users/{userId}` | Lấy thông tin user |

### 5.3 Chat với Nhân viên - WebSocket

| Type | Destination | Description |
|------|-------------|-------------|
| **Subscribe** | `/topic/conversations` | Nhận notification conversation mới/cập nhật |
| **Subscribe** | `/topic/conversations/{id}` | Nhận tin nhắn của conversation cụ thể |
| **Send** | `/assistance/conversations/{id}/send` | Gửi tin nhắn |

---

## 6. Cấu hình & Triển khai

### 6.1 Backend Configuration

**application.yaml:**
```yaml
spring:
  ai:
    google:
      genai:
        api-key: ${GEMINI_API_KEY}
        chat:
          options:
            model: gemini-2.0-flash
        embedding:
          api-key: ${GEMINI_API_KEY}
    vectorstore:
      pgvector:
        index-type: hnsw
        distance-type: cosine_distance
        dimensions: 768

# MongoDB
spring.data.mongodb.uri=mongodb://localhost:27017/eternal_rune_chat

# Frontend URLs (for CORS)
frontend.user=http://localhost:3000
frontend.admin=http://localhost:3001
```

### 6.2 Frontend Configuration

**User Frontend (.env.local):**
```
NEXT_PUBLIC_API_BASE=http://localhost:8080
```

**Admin Frontend (.env.local):**
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

### 6.3 Lưu ý triển khai

1. **WebSocket Proxy:** Nếu sử dụng Nginx, cần cấu hình proxy cho WebSocket:
   ```nginx
   location /ws {
       proxy_pass http://backend:8080;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection "upgrade";
   }
   ```

2. **CORS:** Backend đã cấu hình `setAllowedOriginPatterns("*")` cho development. Production cần restrict origins.

3. **MongoDB:** Cần chạy MongoDB instance riêng cho chat data.

4. **Vector Store:** Cần PostgreSQL với extension `pgvector` cho lưu trữ embeddings (768 dimensions từ Gemini).

5. **API Key:** Cần thiết lập biến môi trường `GEMINI_API_KEY` để kết nối với Google Gemini API.

---

## Kết luận

Hệ thống chat của ETERNAL RUNE được thiết kế với:

- **Chat AI:** Stateless REST API sử dụng Spring AI + Google Gemini 2.0 Flash + RAG
- **Chat Nhân viên:** Real-time WebSocket với STOMP protocol
- **AI Provider:** Google Gemini với embeddings 768 dimensions
- **Persistence:** MongoDB cho dữ liệu chat, PGVector cho AI embeddings
- **Scalability:** Kiến trúc tách biệt cho từng chức năng

Cả hai chức năng đều được tích hợp đầy đủ vào cả frontend user và frontend admin với UX mượt mà và responsive.
