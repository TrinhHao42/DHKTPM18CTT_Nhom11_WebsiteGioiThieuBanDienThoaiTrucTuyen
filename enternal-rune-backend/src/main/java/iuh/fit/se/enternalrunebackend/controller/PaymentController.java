package iuh.fit.se.enternalrunebackend.controller;

import iuh.fit.se.enternalrunebackend.dto.request.QRCodeRequest;
import iuh.fit.se.enternalrunebackend.dto.request.TransactionRequest;
import iuh.fit.se.enternalrunebackend.dto.response.QRCodeResponse;
import iuh.fit.se.enternalrunebackend.entity.Order;
import iuh.fit.se.enternalrunebackend.entity.OrderRefundRequest;
import iuh.fit.se.enternalrunebackend.entity.enums.PaymentStatus;
import iuh.fit.se.enternalrunebackend.entity.enums.ShippingStatus;
import iuh.fit.se.enternalrunebackend.service.Impl.SePayServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin(
        origins = "http://localhost:3000",
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.OPTIONS}
)
@RequestMapping("/payment")
public class PaymentController {
    @Autowired
    private SePayServiceImpl sePayService;

    @PostMapping("/order")
    public Order order(@RequestBody Order order){
        return sePayService.createOrder(order);
    }

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

    @GetMapping("/checkOrderStatus/id={id}")
    public PaymentStatus checkOrderStatus(@PathVariable int id) {
        return sePayService.getOrderStatus(id);
    }

    @PostMapping("/webhook")
    public TransactionRequest Payment(@RequestBody TransactionRequest transactionRequest) {
        return sePayService.sePayWebHook(transactionRequest);
    }

    @GetMapping("/orders/customer/{customerId}")
    public ResponseEntity<List<Order>> getOrdersByCustomerId(@PathVariable Long customerId) {
        List<Order> orders = sePayService.getOrdersByCustomerId(customerId);
        return ResponseEntity.ok(orders);
    }

    @PostMapping("/webhook/refund")
    public ResponseEntity<OrderRefundRequest> refundWebhook(@RequestBody TransactionRequest transactionRequest) {
        try {
            OrderRefundRequest updatedRefundRequest = sePayService.updateRefundRequestPaymentStatus(transactionRequest);
            return ResponseEntity.ok(updatedRefundRequest);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/order/{orderId}/shipping-status")
    public ResponseEntity<Order> updateOrderShippingStatus(
            @PathVariable int orderId,
            @RequestParam ShippingStatus shippingStatus) {
        try {
            Order updatedOrder = sePayService.updateOrderShippingStatus(orderId, shippingStatus);
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
