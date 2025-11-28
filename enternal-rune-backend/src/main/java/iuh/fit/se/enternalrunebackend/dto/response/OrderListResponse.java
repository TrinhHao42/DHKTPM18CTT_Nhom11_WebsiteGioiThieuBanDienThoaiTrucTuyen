package iuh.fit.se.enternalrunebackend.dto.response;
import iuh.fit.se.enternalrunebackend.entity.User;
import iuh.fit.se.enternalrunebackend.entity.enums.PaymentStatus;
import iuh.fit.se.enternalrunebackend.entity.enums.ShippingStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.bson.codecs.BigDecimalCodec;

import java.math.BigDecimal;
import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OrderListResponse {
    private int orderId;
    private String userName;
    private String userEmail;
    private Integer totalProduct;
    private BigDecimal totalAmount;
    private PaymentStatus status;
    private ShippingStatus shippingStatus;
    private LocalDate orderDate;
}

