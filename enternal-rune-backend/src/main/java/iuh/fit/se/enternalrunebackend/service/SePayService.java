package iuh.fit.se.enternalrunebackend.service;

import iuh.fit.se.enternalrunebackend.dto.request.TransactionRequest;

public interface SePayService {
    boolean sePayWebHookPayment(TransactionRequest transactionRequest);
    boolean refundPayment(String orderInvoiceNumber);
}
