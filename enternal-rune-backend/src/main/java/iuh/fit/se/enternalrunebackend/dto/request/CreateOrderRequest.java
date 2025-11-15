package iuh.fit.se.enternalrunebackend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CreateOrderRequest {
    private Long userId;
    private Integer addressId;
    private List<OrderItemRequest> orderItems;
    private Integer discountId;
}

