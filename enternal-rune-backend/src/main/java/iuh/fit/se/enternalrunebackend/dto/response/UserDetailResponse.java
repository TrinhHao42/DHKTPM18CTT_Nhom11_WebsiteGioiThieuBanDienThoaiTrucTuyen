package iuh.fit.se.enternalrunebackend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDetailResponse {
    private String name;
    private String email;
    private boolean activate;
    private List<AddressResponse> addresses;
    private int totalOrder;
    private BigDecimal totalPrice;
}
