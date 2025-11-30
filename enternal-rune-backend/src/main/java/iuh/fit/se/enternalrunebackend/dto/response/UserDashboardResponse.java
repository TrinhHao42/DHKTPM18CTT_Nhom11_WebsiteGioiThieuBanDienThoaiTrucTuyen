package iuh.fit.se.enternalrunebackend.dto.response;

import iuh.fit.se.enternalrunebackend.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class UserDashboardResponse {
    private Long id;
    private String name;
    private String email;
    private User.AuthProvider authProvider;
    private boolean activate;
    private Integer totalOrder;
    private BigDecimal totalPrice;
}
