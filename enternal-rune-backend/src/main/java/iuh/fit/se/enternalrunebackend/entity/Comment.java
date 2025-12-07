package iuh.fit.se.enternalrunebackend.entity;

import iuh.fit.se.enternalrunebackend.entity.enums.CommentStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "comments", indexes = {
        @Index(name = "idx_product_date", columnList = "product_id, comment_date")
})
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    int cmId;

    @Column(name = "comment_content", length = 1000)
    String cmContent;

    @Column(name = "comment_rating", nullable = true)
    @Basic(optional = true)
    Integer cmRating;

    @Enumerated(EnumType.STRING)
    @Column(name = "comment_status", nullable = false)
    CommentStatus cmStatus;

    // Changed from LocalDate to LocalDateTime
    @CreationTimestamp
    @Column(name = "comment_date", nullable = false)
    LocalDateTime cmDate;

    // New fields
    @Column(name = "display_name", length = 100)
    String displayName;

    @Column(name = "ip_address", length = 45) // Support IPv6
    String ipAddress;

    @Column(name = "is_anonymous", nullable = false, columnDefinition = "boolean default false")
    boolean isAnonymous = false;
    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_comment_id")
    private Comment comment;

    @OneToMany(mappedBy = "comment", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Comment> cmReplyComment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    User cmUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    Product cmProduct;

    // New relationship for images
    @OneToMany(mappedBy = "comment", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("displayOrder ASC")
    private List<CommentImage> images;

}
