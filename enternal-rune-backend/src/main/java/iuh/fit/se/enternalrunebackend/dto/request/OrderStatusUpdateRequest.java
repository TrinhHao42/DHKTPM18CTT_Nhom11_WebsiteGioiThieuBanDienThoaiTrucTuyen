package iuh.fit.se.enternalrunebackend.dto.request;

import iuh.fit.se.enternalrunebackend.entity.enums.PaymentStatus;
import iuh.fit.se.enternalrunebackend.entity.enums.ShippingStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OrderStatusUpdateRequest {
    private PaymentStatus paymentStatus;
    private ShippingStatus shippingStatus;
}
