package iuh.fit.se.enternalrunebackend.controller;

import iuh.fit.se.enternalrunebackend.dto.response.ProductDashboardResponse;

import iuh.fit.se.enternalrunebackend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class ProductDashboardController {
    private final ProductService productService;
    @GetMapping("/products")
    public ProductDashboardResponse getDashboard() {
        return productService.getProductDashboard();
    }
}
