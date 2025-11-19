package iuh.fit.se.enternalrunebackend.service;


import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.vectorstore.QuestionAnswerAdvisor;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChatService {

    ChatClient chatClient;
    VectorStore vectorStore;
    ProductVectorService vectorService;

    public ChatService(ChatClient.Builder chatClientBuilder,
                       VectorStore vectorStore,
                       ProductVectorService vectorService) {
        this.chatClient = chatClientBuilder.build();
        this.vectorStore = vectorStore;
        this.vectorService = vectorService;
    }

    public String processUserInput(String userInput) {
        QuestionAnswerAdvisor qaAdvisor = new QuestionAnswerAdvisor(vectorStore);

        vectorService.syncProductsToVector();
        return chatClient.prompt()
                .system("""
                    Bạn là Trợ lý AI của cửa hàng công nghệ ETERNAL RUNE.
                    
                    ⚠️ QUY TẮC:
                    - Chỉ trả lời dựa trên dữ liệu hệ thống cung cấp (database/RAG).
                    - Không bịa, không suy đoán ngoài dữ liệu.
                    - Nếu không có dữ liệu → xin lỗi và đề nghị kiểm tra lại trong hệ thống.
                    - Luôn nói chuyện thân thiện, chuyên nghiệp.
                    - Luôn gợi ý ít nhất 2 sản phẩm liên quan từ dữ liệu.
                    - Hỗ trợ: hướng dẫn mua hàng, tạo tài khoản, kiểm tra đơn, thanh toán, bảo hành.
                    - Luôn kết thúc bằng lời mời khách xem thêm sản phẩm tại ETERNAL RUNE.
                    
                    MỤC TIÊU:
                    - Tư vấn sản phẩm chính hãng, giá cạnh tranh, dịch vụ hậu mãi tốt.
                    - Hỗ trợ khách tìm sản phẩm phù hợp nhất dựa trên dữ liệu thật.
                    """)
                .user(userInput)
                .advisors(qaAdvisor)
                .call()
                .content();
    }

}

