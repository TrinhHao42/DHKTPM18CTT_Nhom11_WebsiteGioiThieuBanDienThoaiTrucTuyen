package iuh.fit.se.enternalrunebackend.dto.response;

import iuh.fit.se.enternalrunebackend.entity.Address;
import iuh.fit.se.enternalrunebackend.entity.User;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class UserResponse {
    Long userId;
    String userName;
    String userEmail;
    List<AddressResponse> userAddress;

    public static UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .userId(user.getUserId())
                .userName(user.getName())
                .userEmail(user.getEmail())
                .userAddress(user.getAddresses().stream()
                        .map(address -> AddressResponse.toAddressResponse(address))
                        .toList()
                )
                .build();
    }
}
