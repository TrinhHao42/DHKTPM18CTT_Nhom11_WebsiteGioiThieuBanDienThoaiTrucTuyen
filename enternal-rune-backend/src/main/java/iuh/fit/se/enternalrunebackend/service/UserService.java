package iuh.fit.se.enternalrunebackend.service;



import iuh.fit.se.enternalrunebackend.dto.request.AddressRequest;
import iuh.fit.se.enternalrunebackend.dto.response.AddressResponse;
import iuh.fit.se.enternalrunebackend.dto.response.UserResponse;
import iuh.fit.se.enternalrunebackend.entity.User;
import org.springframework.security.core.userdetails.UserDetailsService;


public interface UserService extends UserDetailsService {
    User findByEmail(String email);
    AddressResponse addUserAddress(Long userId, AddressRequest addressRequest);
    UserResponse getUserWithAddresses(Long userId);
}
