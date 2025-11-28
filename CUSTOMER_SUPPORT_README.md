# Hệ thống Hỗ trợ Khách hàng - Customer Support

## Tổng quan
Hệ thống chat real-time cho phép nhân viên hỗ trợ khách hàng qua WebSocket STOMP.

## Các thành phần đã tạo

### Frontend (Admin)
1. **`src/services/chatService.ts`** - Service quản lý WebSocket và API calls
2. **`src/components/customerSupport/CustomerSupport.tsx`** - Component chính
3. **`src/components/customerSupport/ConversationList.tsx`** - Danh sách yêu cầu hỗ trợ
4. **`src/components/customerSupport/ChatInterface.tsx`** - Giao diện chat

### Backend
1. **ConversationController.java** - Thêm endpoints:
   - `GET /api/conversations` - Lấy tất cả conversations
   - `PATCH /api/conversations/{id}` - Cập nhật status/agentId

## Cách sử dụng

### 1. Cài đặt Dependencies
```bash
cd enternal-rune-admin-frontend
npm install @stomp/stompjs sockjs-client
```

### 2. Cấu hình Environment
Tạo file `.env.local`:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

### 3. Khởi động Backend
```bash
cd enternal-rune-backend
./mvnw spring-boot:run
```

### 4. Khởi động Frontend
```bash
cd enternal-rune-admin-frontend
npm run dev
```

### 5. Truy cập trang Customer Support
Mở trình duyệt và truy cập: `http://localhost:3001` và điều hướng đến trang Customer Support

## Luồng hoạt động

### Khi khách hàng gửi yêu cầu hỗ trợ:
1. Conversation được tạo với status `PENDING`
2. Nhân viên thấy yêu cầu mới trong danh sách (có hiệu ứng ping)
3. Nhân viên click vào để xem chi tiết

### Khi nhân viên chọn conversation:
1. Status tự động chuyển từ `PENDING` → `IN_PROGRESS`
2. `agentId` được gán cho nhân viên đang xử lý
3. Load lịch sử tin nhắn
4. Subscribe WebSocket để nhận tin nhắn real-time

### Khi chat:
1. Nhân viên gõ tin nhắn và nhấn Enter hoặc nút Gửi
2. Tin nhắn được gửi qua WebSocket STOMP
3. Backend lưu vào MongoDB và broadcast lại
4. Cả nhân viên và khách hàng đều nhận tin nhắn real-time

### Khi hoàn thành:
1. Nhân viên nhấn nút "Hoàn thành"
2. Status chuyển sang `CLOSED`
3. `closedAt` được set
4. Không thể gửi tin nhắn mới

## WebSocket Endpoints

### STOMP Connection
- **SockJS**: `ws://localhost:8080/ws/sockjs`
- **Native WebSocket**: `ws://localhost:8080/ws`

### Subscribe (Client nhận tin nhắn)
- Topic: `/topic/conversations/{conversationId}`

### Send (Client gửi tin nhắn)
- Destination: `/assistance/conversations/{conversationId}/send`
- Payload:
```json
{
  "senderId": "agent-001",
  "senderRole": "AGENT",
  "content": "Xin chào, tôi có thể giúp gì cho bạn?"
}
```

## REST API Endpoints

### Conversations
- `POST /api/conversations?customerId={id}` - Tạo conversation mới
- `GET /api/conversations` - Lấy tất cả conversations
- `GET /api/conversations/{id}` - Lấy chi tiết conversation
- `GET /api/conversations/customer/{customerId}` - Lấy conversations của khách
- `PATCH /api/conversations/{id}` - Cập nhật conversation
  ```json
  {
    "status": "IN_PROGRESS|CLOSED",
    "agentId": "agent-001"
  }
  ```

### Messages
- `GET /api/messages/conversation/{conversationId}` - Lấy lịch sử tin nhắn
- `GET /api/messages/{messageId}` - Lấy chi tiết tin nhắn

## Giao diện

### Layout
- **2 cột**: Danh sách conversations (trái) | Chat interface (phải)
- **Responsive**: Hoạt động tốt trên desktop và tablet

### Màu sắc theo status
- 🟡 **PENDING** (Chờ xử lý) - Warning badge, có animation ping
- 🔵 **IN_PROGRESS** (Đang xử lý) - Info badge, hiện nút "Hoàn thành"
- ⚪ **CLOSED** (Đã hoàn thành) - Light badge, disable input

### Features
- ✅ Real-time messaging qua WebSocket
- ✅ Auto-scroll khi có tin nhắn mới
- ✅ Hiển thị thời gian tin nhắn
- ✅ Phân biệt tin nhắn của nhân viên/khách hàng
- ✅ Status indicator (online/offline)
- ✅ Enter để gửi, Shift+Enter để xuống dòng
- ✅ Disable input khi conversation đã CLOSED

## Lưu ý

1. **MongoDB**: Backend cần MongoDB đang chạy để lưu conversations và messages
2. **CORS**: Backend đã config cho phép origins từ admin frontend
3. **Agent ID**: Hiện đang hardcode `agent-001`, cần tích hợp với authentication context
4. **Error Handling**: Cần bổ sung UI cho các trường hợp lỗi kết nối WebSocket

## Phát triển tiếp

- [ ] Tích hợp với hệ thống authentication để lấy agent ID thực
- [ ] Thêm typing indicator (đang gõ...)
- [ ] Thêm file upload
- [ ] Thêm emoji picker
- [ ] Thêm search/filter conversations
- [ ] Thêm notification sound khi có tin nhắn mới
- [ ] Thêm pagination cho danh sách conversations
- [ ] Thêm analytics (response time, satisfaction, etc.)
