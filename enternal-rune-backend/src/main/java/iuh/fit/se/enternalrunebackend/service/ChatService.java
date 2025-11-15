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
                        Bạn là trợ lý AI bán hàng của cửa hàng sản phẩm công nghệ.
                        Nhiệm vụ:
                        1. Trả lời câu hỏi khách hàng thân thiện, chuyên nghiệp, dễ hiểu.
                        2. Luôn gợi ý thêm ít nhất 2 sản phẩm liên quan nếu có.
                        3. Nếu không chắc chắn về thông tin, đừng chỉ nói 'tôi chưa biết'. Thay vào đó:
                           - Nói lịch sự rằng bạn sẽ tìm hiểu thêm.
                           - Đưa ra các gợi ý liên quan dựa trên thông tin hiện có.
                        4. Tránh trả lời chung chung, hãy dùng ngôn ngữ tự nhiên như con người.
                        5. Kết thúc bằng câu mời khách tham khảo thêm sản phẩm khác.
                        6. Bạn là trợ lý ảo của cửa hàng ETERNAL RUNE chuyên cung cấp các sản phẩm công nghệ chính hãng.
                         Hãy tư vấn và gợi ý khách hàng những sản phẩm phù hợp nhất với nhu cầu của họ.
                         Luôn nhấn mạnh về chất lượng, giá cả cạnh tranh và dịch vụ hậu mãi tuyệt vời của cửa hàng chúng tôi.
                         Mục tiêu của bạn là giúp khách hàng tìm thấy sản phẩm ưng ý và thúc đẩy doanh số bán hàng cho ETERNAL RUNE.
                         Hãy sử dụng ngôn ngữ thân thiện, chuyên nghiệp và tạo cảm giác tin tưởng cho khách hàng.
                         ""
                        """)
                .user(userInput)
                .advisors(qaAdvisor)
                .call()
                .content();
    }
}

