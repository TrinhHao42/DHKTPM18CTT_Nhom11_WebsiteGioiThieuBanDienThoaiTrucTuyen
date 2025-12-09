package iuh.fit.se.enternalrunebackend.dto.request;

import iuh.fit.se.enternalrunebackend.dto.response.AddressResponse;
import iuh.fit.se.enternalrunebackend.entity.Role;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StaffRequest {
    private String name;
    private String email;
    private Role role;
    private boolean status;
    private String password;
    private AddressResponse  address;
}
