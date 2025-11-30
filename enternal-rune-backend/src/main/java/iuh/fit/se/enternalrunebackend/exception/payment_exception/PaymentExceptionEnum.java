package iuh.fit.se.enternalrunebackend.exception.payment_exception;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum PaymentExceptionEnum {
    PAYMENT_PROCESS_ERROR(400, HttpStatus.BAD_REQUEST, "Lỗi trong quá trình thanh toán"),
    PAYMENT_ALREADY_PAID(400, HttpStatus.BAD_REQUEST, "Đơn hàng đã được thanh toán trước đó"),
    PAYMENT_EXPIRED(400, HttpStatus.BAD_REQUEST, "Đơn hàng đã hết hạn để thanh toán"),
    PAYMENT_CANCELLED(400, HttpStatus.BAD_REQUEST, "Đơn hàng đã bị hủy bởi khách hàng"),
    PAYMENT_ORDER_NOT_FOUND(404, HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng"),
    PAYMENT_INVALID_INVOICE(400, HttpStatus.BAD_REQUEST, "Mã invoice không hợp lệ");

    int httpCode;
    HttpStatus httpStatus;
    String message;
}
