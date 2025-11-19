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
    
    @Query("SELECT c FROM Comment c LEFT JOIN FETCH c.cmUser LEFT JOIN FETCH c.comment WHERE c.cmProduct.prodId = :productId ORDER BY c.cmDate DESC")
    Page<Comment> findByProductIdOrderByCmDateDesc(@Param("productId") Integer productId, Pageable pageable);
    
    int countByIpAddressAndCmDateAfter(String ipAddress, LocalDateTime after);
    
    /**
     * Get rating distribution for a product  
     * @param productId the product ID
     * @return list of objects with rating and count
     */
    @Query("""
        SELECT c.cmRating as rating, COUNT(c) as count
        FROM Comment c
        WHERE c.cmProduct.prodId = :productId
        GROUP BY c.cmRating
        """)
    List<Object[]> getRatingDistributionList(@Param("productId") Integer productId);
    
    @Query("""
        SELECT COALESCE(AVG(CAST(c.cmRating AS double)), 0.0)
        FROM Comment c
        WHERE c.cmProduct.prodId = :productId
        """)
    Double getAverageRating(@Param("productId") Integer productId);
    
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.cmProduct.prodId = :productId")
    Long countByProductId(@Param("productId") Integer productId);

    Page<Comment> findByCommentOrderByCmDateAsc(Comment parentComment, Pageable pageable);
}
