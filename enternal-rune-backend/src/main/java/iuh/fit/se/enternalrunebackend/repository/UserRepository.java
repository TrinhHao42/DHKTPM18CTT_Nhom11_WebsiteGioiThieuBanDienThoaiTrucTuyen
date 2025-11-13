package iuh.fit.se.enternalrunebackend.repository;


import java.util.Optional;
import iuh.fit.se.enternalrunebackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path="users")
public interface UserRepository extends JpaRepository<User,Long> {
    User findByEmail(String email);


    boolean existsByEmail(String email);
}
