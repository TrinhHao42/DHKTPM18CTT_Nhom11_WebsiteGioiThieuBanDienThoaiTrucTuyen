package iuh.fit.se.enternalrunebackend.service;



import iuh.fit.se.enternalrunebackend.dto.request.UserRequestDTO;
import iuh.fit.se.enternalrunebackend.dto.response.UserResponseDTO;
import iuh.fit.se.enternalrunebackend.entity.User;
import org.springframework.security.core.userdetails.UserDetailsService;


public interface UserService extends UserDetailsService {
    public User findByEmail(String email);
}
