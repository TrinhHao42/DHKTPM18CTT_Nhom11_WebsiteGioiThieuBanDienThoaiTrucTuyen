package iuh.fit.se.enternalrunebackend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OrderStatusUpdateRequest {
    private String paymentStatusCode;
    private String shippingStatusCode;
    private String note;
}
