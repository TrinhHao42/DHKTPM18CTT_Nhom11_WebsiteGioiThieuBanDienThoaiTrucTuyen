package iuh.fit.se.enternalrunebackend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

/**
 * Entity cho lưu trữ hình ảnh của comment
 * Migration Notes:
 * - Tạo bảng comment_images với FK comment_id
 * - Index: (comment_id, display_order) để tăng tốc query
 */
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "comment_images", indexes = {
    @Index(name = "idx_comment_display_order", columnList = "comment_id, display_order")
})
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommentImage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    int id;
    
    @Column(name = "url", nullable = false, length = 500)
    String url;
    
    @Column(name = "file_name", nullable = false, length = 255)
    String fileName;
    
    @Column(name = "file_size", nullable = false)
    long size;
    
    @Column(name = "display_order", nullable = false)
    int displayOrder;
    
    // Relationship - Links to Comment entity (not ProductComment)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comment_id", nullable = false)
    Comment comment;
}