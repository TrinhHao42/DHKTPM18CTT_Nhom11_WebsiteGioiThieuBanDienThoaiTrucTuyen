package iuh.fit.se.enternalrunebackend.controller;

import iuh.fit.se.enternalrunebackend.dto.response.BrandResponse;
import iuh.fit.se.enternalrunebackend.service.BrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/brands")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Cho phép gọi từ frontend (React, v.v.)
public class BrandController {
    private final BrandService brandService;

    @GetMapping("/names")
    public List<BrandResponse> getDistinctBrandNames() {
        return brandService.getDistinctBrandNames();
    }
}
