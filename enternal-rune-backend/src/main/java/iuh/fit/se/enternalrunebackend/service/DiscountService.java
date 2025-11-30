package iuh.fit.se.enternalrunebackend.service;

import iuh.fit.se.enternalrunebackend.dto.request.DiscountRequest;
import iuh.fit.se.enternalrunebackend.dto.response.DiscountResponse;
import iuh.fit.se.enternalrunebackend.dto.response.DiscountStatisticResponse;
import org.springframework.data.domain.Page;

public interface DiscountService {

    DiscountResponse create(DiscountRequest request);

    DiscountResponse update(int id, DiscountRequest request);

    Page<DiscountResponse> getAll(String keyword, String status, int page, int size);

    DiscountResponse getById(int id);

    void delete(int id);

    DiscountStatisticResponse getStatistics();

}
