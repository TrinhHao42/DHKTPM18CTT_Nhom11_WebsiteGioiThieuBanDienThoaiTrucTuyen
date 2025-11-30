package iuh.fit.se.enternalrunebackend.dto.response;

import iuh.fit.se.enternalrunebackend.entity.enums.TargetType;
import iuh.fit.se.enternalrunebackend.entity.enums.ValueType;
import lombok.*;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class DiscountResponse {

    private int discountId;
    private String discountName;
    private String discountCode;

    private TargetType discountTargetType;
    private ValueType discountValueType;

    private double discountValue;
    private double discountMaxAmount;

    private LocalDate discountStartDate;
    private LocalDate discountEndDate;

    private long discountQuantityLimit;
    private long usedQuantity;

    private boolean discountActive;

    private int usedPercent; // used/limit * 100
}
