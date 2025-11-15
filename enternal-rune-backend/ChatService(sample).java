package iuh.fit.se.nguyenphihung.service;


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
    ProductVectorLoader productVectorLoader;

    public ChatService(ChatClient.Builder chatClientBuilder,
                       VectorStore vectorStore,
                       ProductVectorLoader productVectorLoader) {
        this.chatClient = chatClientBuilder.build();
        this.vectorStore = vectorStore;
        this.productVectorLoader = productVectorLoader;
    }

    public String processUserInput(String userInput) {
        QuestionAnswerAdvisor qaAdvisor = new QuestionAnswerAdvisor(vectorStore);

        productVectorLoader.loadProductsToVectorDB();
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
                        """)
                .user(userInput)
                .advisors(qaAdvisor)
                .call()
                .content();
    }
}

