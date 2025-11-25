package iuh.fit.se.enternalrunebackend.repository;

import iuh.fit.se.enternalrunebackend.entity.Comment;
import iuh.fit.se.enternalrunebackend.entity.CommentImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for CommentImage entity
 */
@Repository
public interface CommentImageRepository extends JpaRepository<CommentImage, Integer> {
    
    /**
     * Find all images for a comment, ordered by display order
     * @param comment the parent comment
     * @return list of images ordered by displayOrder
     */
    List<CommentImage> findByCommentOrderByDisplayOrderAsc(Comment comment);
    
    /**
     * Count images for a comment
     * @param comment the parent comment
     * @return image count
     */
    int countByComment(Comment comment);
    
    /**
     * Delete all images for a comment (cascade delete)
     * @param comment the parent comment
     */
    void deleteByComment(Comment comment);
}
