package iuh.fit.se.enternalrunebackend.service;

import iuh.fit.se.enternalrunebackend.dto.request.TransactionRequest;
import iuh.fit.se.enternalrunebackend.dto.response.QRCodeResponse;

import java.io.IOException;
import java.math.BigDecimal;

public interface SePayService {
    QRCodeResponse getQRCode(BigDecimal amount, String description) throws IOException;
    boolean sePayWebHookPayment(TransactionRequest transactionRequest);
}
