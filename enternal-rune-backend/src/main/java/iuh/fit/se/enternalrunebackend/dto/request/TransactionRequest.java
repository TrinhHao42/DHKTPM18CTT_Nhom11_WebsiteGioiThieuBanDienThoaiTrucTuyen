package iuh.fit.se.enternalrunebackend.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@AllArgsConstructor
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TransactionRequest {
    private Long id;
    private String gateway;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime transactionDate;
    private String accountNumber;
    private String content;
    private String transferType;
    private String description;
    private BigDecimal transferAmount;
    private String referenceCode;
}