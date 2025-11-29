package iuh.fit.se.enternalrunebackend.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TransactionRequest {

    Long timestamp;

    @JsonProperty("notification_type")
    String notificationType;

    OrderData order;
    TransactionData transaction;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class OrderData {
        String id;

        @JsonProperty("order_id")
        String orderId;

        @JsonProperty("order_status")
        String orderStatus;

        @JsonProperty("order_currency")
        String orderCurrency;

        @JsonProperty("order_amount")
        String orderAmount;

        @JsonProperty("order_invoice_number")
        String orderInvoiceNumber;

        @JsonProperty("custom_data")
        Object[] customData;

        @JsonProperty("user_agent")
        String userAgent;

        @JsonProperty("ip_address")
        String ipAddress;

        @JsonProperty("order_description")
        String orderDescription;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class TransactionData {
        String id;

        @JsonProperty("payment_method")
        String paymentMethod;

        @JsonProperty("transaction_id")
        String transactionId;

        @JsonProperty("transaction_type")
        String transactionType;

        @JsonProperty("transaction_date")
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        LocalDateTime transactionDate;

        @JsonProperty("transaction_status")
        String transactionStatus;

        @JsonProperty("transaction_amount")
        BigDecimal transactionAmount;

        @JsonProperty("transaction_currency")
        String transactionCurrency;

        @JsonProperty("authentication_status")
        String authenticationStatus;

        @JsonProperty("card_number")
        String cardNumber;

        @JsonProperty("card_holder_name")
        String cardHolderName;

        @JsonProperty("card_expiry")
        String cardExpiry;

        @JsonProperty("card_funding_method")
        String cardFundingMethod;

        @JsonProperty("card_brand")
        String cardBrand;
    }
}
