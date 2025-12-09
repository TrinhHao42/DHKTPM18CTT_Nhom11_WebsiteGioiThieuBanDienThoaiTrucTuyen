package iuh.fit.se.enternalrunebackend.repository;

import iuh.fit.se.enternalrunebackend.entity.Comment;
import iuh.fit.se.enternalrunebackend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.time.LocalDateTime;
import java.util.List;

@RepositoryRestResource(path = "comments")
public interface CommentRepository extends JpaRepository<Comment, Integer> {

    Page<Comment> findByCmProductOrderByCmDateDesc(Product product, Pageable pageable);

    @Query("SELECT c FROM Comment c LEFT JOIN FETCH c.cmUser LEFT JOIN FETCH c.comment LEFT JOIN FETCH c.images WHERE c.cmProduct.prodId = :productId AND c.comment IS NULL ORDER BY c.cmDate DESC")
    Page<Comment> findByProductIdOrderByCmDateDesc(@Param("productId") Integer productId, Pageable pageable);

    int countByIpAddressAndCmDateAfter(String ipAddress, LocalDateTime after);

    /**
     * Get rating distribution for a product
     * 
     * @param productId the product ID
     * @return list of objects with rating and count
     */
    @Query("""
            SELECT c.cmRating as rating, COUNT(c) as count
            FROM Comment c
            WHERE c.cmProduct.prodId = :productId AND c.comment IS NULL
            GROUP BY c.cmRating
            """)
    List<Object[]> getRatingDistributionList(@Param("productId") Integer productId);

    @Query("""
            SELECT COALESCE(AVG(CAST(c.cmRating AS double)), 0.0)
            FROM Comment c
            WHERE c.cmProduct.prodId = :productId AND c.comment IS NULL
            """)
    Double getAverageRating(@Param("productId") Integer productId);

    @Query("SELECT COUNT(c) FROM Comment c WHERE c.cmProduct.prodId = :productId AND c.comment IS NULL")
    Long countByProductId(@Param("productId") Integer productId);

    Page<Comment> findByCommentOrderByCmDateAsc(Comment parentComment, Pageable pageable);

    // Admin queries for dashboard
    @Query("SELECT c FROM Comment c LEFT JOIN FETCH c.cmUser LEFT JOIN FETCH c.cmProduct WHERE c.comment IS NULL ORDER BY c.cmDate DESC")
    Page<Comment> findAllMainCommentsForAdmin(Pageable pageable);

    @Query("SELECT c FROM Comment c LEFT JOIN FETCH c.cmUser LEFT JOIN FETCH c.cmProduct WHERE c.cmProduct.prodId = :productId AND c.comment IS NULL ORDER BY c.cmDate DESC")
    Page<Comment> findCommentsByProductIdForAdmin(@Param("productId") Integer productId, Pageable pageable);

    @Query("SELECT COUNT(c) FROM Comment c WHERE c.comment IS NULL")
    Long countAllMainComments();

    @Query("SELECT COUNT(c) FROM Comment c WHERE c.comment IS NOT NULL")
    Long countAllReplies();

    @Query("SELECT COALESCE(AVG(CAST(c.cmRating AS double)), 0.0) FROM Comment c WHERE c.comment IS NULL")
    Double getOverallAverageRating();

    @Query("""
            SELECT c.cmRating as rating, COUNT(c) as count
            FROM Comment c
            WHERE c.comment IS NULL
            GROUP BY c.cmRating
            """)
    List<Object[]> getOverallRatingDistribution();

    @Query("SELECT COUNT(c) FROM Comment c WHERE c.cmDate >= :startDate")
    Long countCommentsSince(@Param("startDate") LocalDateTime startDate);

    // Simple query without JOIN FETCH to avoid circular references, but with basic product/user info
    @Query("SELECT c FROM Comment c LEFT JOIN FETCH c.cmProduct p LEFT JOIN FETCH c.cmUser u WHERE c.comment IS NULL ORDER BY c.cmDate DESC")
    Page<Comment> findAllMainCommentsSimple(Pageable pageable);

    // Count replies for a specific comment
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.comment.cmId = :parentCommentId")
    Long countRepliesForComment(@Param("parentCommentId") Integer parentCommentId);
}
