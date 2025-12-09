package iuh.fit.se.enternalrunebackend.dto.response;

import iuh.fit.se.enternalrunebackend.entity.Role;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class StaffResponse {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private boolean status;
    private String password;
    private AddressResponse address;
}
