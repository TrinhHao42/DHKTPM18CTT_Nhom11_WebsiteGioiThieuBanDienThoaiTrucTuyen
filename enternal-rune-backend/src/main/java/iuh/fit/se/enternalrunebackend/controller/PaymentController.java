package iuh.fit.se.enternalrunebackend.controller;

import iuh.fit.se.enternalrunebackend.dto.request.TransactionRequest;
import iuh.fit.se.enternalrunebackend.service.Impl.SePayServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
public class PaymentController {
    @Autowired
    private SePayServiceImpl sePayServiceImpl;

    @PostMapping("/webhookPayment")
    @Transactional
    public boolean Payment(@RequestBody TransactionRequest transactionRequest) {
       return sePayServiceImpl.sePayWebHookPayment(transactionRequest);
    }
}
