package iuh.fit.se.enternalrunebackend.service;

import iuh.fit.se.enternalrunebackend.dto.request.TransactionRequest;
import iuh.fit.se.enternalrunebackend.dto.response.QRCodeResponse;
import iuh.fit.se.enternalrunebackend.entity.Order;
import iuh.fit.se.enternalrunebackend.entity.OrderRefundRequest;
import iuh.fit.se.enternalrunebackend.entity.enums.PaymentStatus;
import iuh.fit.se.enternalrunebackend.entity.enums.ShippingStatus;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

public interface SePayService {
    QRCodeResponse getQRCode(BigDecimal amount, String description) throws IOException;
    boolean sePayWebHookPayment(TransactionRequest transactionRequest);
    OrderRefundRequest updateRefundRequestPaymentStatus(TransactionRequest transactionRequest);
}
