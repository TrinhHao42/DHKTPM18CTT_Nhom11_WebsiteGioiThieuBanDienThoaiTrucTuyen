package iuh.fit.se.enternalrunebackend.controller;

import iuh.fit.se.enternalrunebackend.dto.request.QRCodeRequest;
import iuh.fit.se.enternalrunebackend.dto.request.TransactionRequest;
import iuh.fit.se.enternalrunebackend.dto.response.QRCodeResponse;
import iuh.fit.se.enternalrunebackend.service.Impl.SePayServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/payment")
public class PaymentController {
    @Autowired
    private SePayServiceImpl sePayService;

    @PostMapping("/getQRcode")
    public ResponseEntity<byte[]> getQRCode(@RequestBody QRCodeRequest request){
        try {
            QRCodeResponse qrCode = sePayService.getQRCode(request.getAmount(), request.getDescription());
            if (qrCode != null) {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.IMAGE_PNG);
                return ResponseEntity.ok()
                        .headers(headers)
                        .body(qrCode.getImage());
            } else {
                return ResponseEntity.badRequest().build();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    };

    @PostMapping("/webhookPayment")
    public boolean Payment(@RequestBody TransactionRequest transactionRequest) {
        return sePayService.sePayWebHookPayment(transactionRequest);
    }
}
