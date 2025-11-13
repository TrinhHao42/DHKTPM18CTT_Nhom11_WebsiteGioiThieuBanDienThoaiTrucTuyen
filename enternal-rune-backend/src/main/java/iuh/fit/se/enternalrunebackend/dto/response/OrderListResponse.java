package iuh.fit.se.enternalrunebackend.dto.response;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OrderListResponse {
    private int id;
    private String customerName;
    private String customerEmail;
    private Integer productCount;
    private Double totalAmount;
    private String status;
    private String paymentMethod;
    private LocalDate orderDate;
}
