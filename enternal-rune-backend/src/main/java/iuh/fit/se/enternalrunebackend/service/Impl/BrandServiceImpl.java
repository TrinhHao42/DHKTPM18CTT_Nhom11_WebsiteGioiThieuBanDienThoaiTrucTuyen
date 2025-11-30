package iuh.fit.se.enternalrunebackend.service.Impl;

import iuh.fit.se.enternalrunebackend.dto.request.BrandRequest;
import iuh.fit.se.enternalrunebackend.dto.response.BrandDashboardListResponse;
import iuh.fit.se.enternalrunebackend.dto.response.BrandResponse;
import iuh.fit.se.enternalrunebackend.dto.response.BrandStatisticResponse;
import iuh.fit.se.enternalrunebackend.entity.Message;
import iuh.fit.se.enternalrunebackend.repository.BrandRepository;
import iuh.fit.se.enternalrunebackend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import iuh.fit.se.enternalrunebackend.entity.Brand;


import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BrandServiceImpl implements iuh.fit.se.enternalrunebackend.service.BrandService {
    private final BrandRepository brandRepository;

    private final ProductRepository productRepository;
    @Override
    public List<BrandResponse> getDistinctBrandNames() {
        return brandRepository.findAll()
                .stream()
                .map(b -> new BrandResponse(b.getBrandId(), b.getBrandName()))
                .distinct()
                .collect(Collectors.toList());
    }
    @Override
    public Page<BrandDashboardListResponse> getBrands(String keyword, Pageable pageable) {

        Page<Brand> brandPage;

        if (keyword == null || keyword.isBlank()) {
            brandPage = brandRepository.findAll(pageable);
        } else {
            brandPage = brandRepository.searchBrands(keyword, pageable);
        }

        List<BrandDashboardListResponse> dtoList = brandPage.getContent()
                .stream()
                .map(b -> new BrandDashboardListResponse(
                        b.getBrandId(),
                        b.getBrandLogoUrl(),
                        b.getBrandDescription(),
                        b.getBrandName(),
                        productRepository.countByBrandId(b.getBrandId()), // lấy tổng product
                        b.getBrandStatus()
                ))
                .toList();
        return new PageImpl<>(dtoList, pageable, brandPage.getTotalElements());
    }
    
    @Override
    public void addBrand(BrandRequest brandRequest) {
        Optional<Brand> existingBrand = brandRepository.findByBrandName(brandRequest.getBrandName());
        if (existingBrand.isPresent()) {
            throw new RuntimeException("Thương hiệu đã tồn tại");
        }
        Brand brand = new Brand();
        brand.setBrandName(brandRequest.getBrandName());
        brand.setBrandLogoUrl(brandRequest.getBrandLogoUrl());
        brand.setBrandDescription(brandRequest.getBrandDescription());
        brand.setBrandStatus(brandRequest.getBrandStatus());

        brandRepository.save(brand);
    }

    @Override
    public void deleteBrandById(Integer id) {
        Brand brand = brandRepository.findById(id).orElse(null);
        if(brand==null){
            throw new RuntimeException("Thương hiệu không tồn tại!");
        }
        brandRepository.delete(brand);
    }

    @Override
    public void updateBrand(Integer id, BrandRequest brandRequest) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Thương hiệu không tồn tại!"));

        if (brandRequest.getBrandName() != null) {
            brand.setBrandName(brandRequest.getBrandName());
        }
        if (brandRequest.getBrandLogoUrl() != null) {
            brand.setBrandLogoUrl(brandRequest.getBrandLogoUrl());
        }
        if (brandRequest.getBrandDescription() != null) {
            brand.setBrandDescription(brandRequest.getBrandDescription());
        }
        if (brandRequest.getBrandStatus() != null) {
            brand.setBrandStatus(brandRequest.getBrandStatus());
        }

        brandRepository.save(brand);
    }
    @Override
    public BrandStatisticResponse getBrandStatistics() {
        long totalBrands = brandRepository.count();
        long totalProducts = brandRepository.getTotalProducts();
        String mostPopularBrand = brandRepository.getMostPopularBrand();
        long emptyBrandCount = brandRepository.countEmptyBrands();

        double averageProductsPerBrand =
                totalBrands == 0 ? 0 :
                        Math.round(((double) totalProducts / totalBrands) * 100.0) / 100.0;

        return new BrandStatisticResponse(
                totalBrands,
                mostPopularBrand,
                averageProductsPerBrand,
                emptyBrandCount
        );
    }

    @Override
    public Brand getBrandById(Integer id) {
        return brandRepository.findById(id).orElse(null);
    }
}
