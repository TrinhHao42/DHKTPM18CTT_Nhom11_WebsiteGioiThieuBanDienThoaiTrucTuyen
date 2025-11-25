package iuh.fit.se.enternalrunebackend.repository;



import iuh.fit.se.enternalrunebackend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path="users")
public interface UserRepository extends JpaRepository<User,Long> {
    User findByEmail(String email);


    boolean existsByEmail(String email);
    @Query("""
            SELECT DISTINCT u FROM User u
            JOIN u.roles r
            WHERE
            r.roleName = 'ROLE_USER' AND
            (LOWER(u.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                  OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
                  OR :keyword IS NULL)
            AND (u.userActive = :activated OR :activated IS NULL)
            """)
    Page<User> searchUser(
            @Param("keyword") String keyword,
            @Param("activated") Boolean activated,
            Pageable pageable
    );

    @Query("""
            SELECT COUNT(u)
            FROM User u
            JOIN u.roles r
            WHERE r.roleName = :role
        """)
    Integer countByRole(@Param("role") String role);

    @Query("""
        SELECT COUNT(u)
        FROM User u
        JOIN u.roles r
        WHERE r.roleName = 'ROLE_USER'
          AND u.userActive = :active
    """)
        Integer countActiveCustomer(boolean active);

        @Query("""
        SELECT COUNT(u)
        FROM User u
        JOIN u.roles r
        WHERE r.roleName = 'ROLE_USER'
          AND u.authProvider = :provider
    """)
    Integer countCustomerByProvider(@Param("provider") User.AuthProvider provider);


}
