package iuh.fit.se.enternalrunebackend.service;

import iuh.fit.se.enternalrunebackend.dto.request.BrandRequest;
import iuh.fit.se.enternalrunebackend.dto.response.BrandDashboardListResponse;
import iuh.fit.se.enternalrunebackend.dto.response.BrandResponse;
import iuh.fit.se.enternalrunebackend.entity.Brand;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BrandService {
    List<BrandResponse> getDistinctBrandNames();
    Page<BrandDashboardListResponse> getBrands(String keyword, Pageable pageable);
    void  addBrand(BrandRequest brandRequest);
    void deleteBrandById(Integer id);
    void updateBrand(Integer id,BrandRequest brandRequest);

}
