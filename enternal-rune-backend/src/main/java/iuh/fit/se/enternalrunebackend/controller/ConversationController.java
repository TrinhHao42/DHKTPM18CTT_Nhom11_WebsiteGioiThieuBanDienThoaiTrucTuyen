package iuh.fit.se.enternalrunebackend.controller;


import iuh.fit.se.enternalrunebackend.entity.entityForAssistanceChat.Conversation;
import iuh.fit.se.enternalrunebackend.repository.repositoriesForAssistanceChat.ConversationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/conversations")
@CrossOrigin(origins = "*") // dev, sau cấu hình domain
public class ConversationController {

    private final ConversationRepository conversationRepository;

    @PostMapping
    public Conversation createConversation(@RequestParam String customerId) {
        Conversation c = new Conversation();
        c.setCustomerId(customerId);
        c.setStatus("PENDING");
        c.setCreatedAt(Instant.now());
        return conversationRepository.save(c);
    }

    @GetMapping("/{id}")
    public Conversation getConversation(@PathVariable String id) {
        return conversationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));
    }

    @GetMapping("/customer/{customerId}")
    public List<Conversation> getByCustomer(@PathVariable String customerId) {
        return conversationRepository.findByCustomerId(customerId);
    }
}
