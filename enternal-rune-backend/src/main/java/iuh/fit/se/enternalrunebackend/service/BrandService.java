package iuh.fit.se.enternalrunebackend.service;

import iuh.fit.se.enternalrunebackend.dto.response.BrandResponse;

import java.util.List;

public interface BrandService {
    List<BrandResponse> getDistinctBrandNames();
}
