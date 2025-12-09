package iuh.fit.se.enternalrunebackend.repository;



import iuh.fit.se.enternalrunebackend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(path="users")
public interface UserRepository extends JpaRepository<User,Long> {
    User findByEmail(String email);
    
    /**
     * Find user with roles fetched for authentication
     */
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE u.email = :email")
    User findByEmailWithRoles(@Param("email") String email);

    /**
     * Find user with addresses fetched for order creation and profile
     */
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.addresses WHERE u.userId = :userId")
    User findByIdWithAddresses(@Param("userId") Long userId);
    
    /**
     * Find user with both roles and addresses fetched
     */
    @Query("SELECT DISTINCT u FROM User u " +
           "LEFT JOIN FETCH u.roles " +
           "LEFT JOIN FETCH u.addresses " +
           "WHERE u.userId = :userId")
    User findByIdWithRolesAndAddresses(@Param("userId") Long userId);

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

    //========STAFF
    @Query("""
            SELECT DISTINCT u FROM User u
            JOIN u.roles r
            WHERE
            r.roleName = 'ROLE_STAFF' AND
            (LOWER(u.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                  OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
                  OR :keyword IS NULL)
            AND (u.userActive = :activated OR :activated IS NULL)
            """)
    Page<User> searchStaff(
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
    // =================STAFF==============
    @Query("""
        SELECT COUNT(u)
        FROM User u
        JOIN u.roles r
        WHERE r.roleName = 'ROLE_STAFF'
          AND u.userActive = :active
    """)
    Integer countActiveStaff(boolean active);

        @Query("""
        SELECT COUNT(u)
        FROM User u
        JOIN u.roles r
        WHERE r.roleName = 'ROLE_USER'
          AND u.authProvider = :provider
    """)
    Integer countCustomerByProvider(@Param("provider") User.AuthProvider provider);
    
    /**
     * OPTIMIZED: Get customer country distribution without loading all users
     * Returns: [countryName, count] sorted by count descending
     */
    @Query(value = """
        SELECT COALESCE(a.country_name, 'Unknown') as country, COUNT(DISTINCT u.user_id) as count
        FROM users u
        INNER JOIN user_role ur ON u.user_id = ur.user_id
        INNER JOIN roles r ON ur.role_id = r.role_id
        LEFT JOIN user_address ua ON u.user_id = ua.user_id
        LEFT JOIN addresses a ON ua.address_id = a.address_id
        WHERE r.role_name = 'ROLE_USER'
        GROUP BY a.country_name
        ORDER BY count DESC
        LIMIT 5
    """, nativeQuery = true)
    List<Object[]> getCustomerCountryDistribution();






}
