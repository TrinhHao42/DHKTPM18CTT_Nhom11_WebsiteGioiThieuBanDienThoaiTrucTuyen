package iuh.fit.se.enternalrunebackend.service;

import iuh.fit.se.enternalrunebackend.dto.request.UserRequestDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public interface AccountService {
    ResponseEntity<?> userRegister(UserRequestDTO userRequestDTO);
    ResponseEntity<?> activateAccount(String email, String activateId);

}
