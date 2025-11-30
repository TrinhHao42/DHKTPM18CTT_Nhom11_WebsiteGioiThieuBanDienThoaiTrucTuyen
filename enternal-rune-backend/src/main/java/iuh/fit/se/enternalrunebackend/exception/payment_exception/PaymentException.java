package iuh.fit.se.enternalrunebackend.exception.payment_exception;

import lombok.Getter;

@Getter
public class PaymentException extends RuntimeException {

    private final PaymentExceptionEnum error;

    public PaymentException(PaymentExceptionEnum error) {
        super(error.getMessage());
        this.error = error;
    }
}
