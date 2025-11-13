package iuh.fit.se.enternalrunebackend.service.Impl;

import iuh.fit.se.enternalrunebackend.dto.response.BrandResponse;
import iuh.fit.se.enternalrunebackend.repository.BrandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import iuh.fit.se.enternalrunebackend.entity.Brand;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BrandServiceImpl implements iuh.fit.se.enternalrunebackend.service.BrandService {
    private final BrandRepository brandRepository;

    @Override
    public List<BrandResponse> getDistinctBrandNames() {
        return brandRepository.findAll()
                .stream()
                .map(b -> new BrandResponse(b.getBrandId(), b.getBrandName()))
                .distinct()
                .collect(Collectors.toList());
    }
}
