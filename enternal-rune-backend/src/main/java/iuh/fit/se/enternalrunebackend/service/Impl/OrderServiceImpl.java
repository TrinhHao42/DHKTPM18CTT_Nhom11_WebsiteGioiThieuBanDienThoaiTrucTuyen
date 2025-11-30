package iuh.fit.se.enternalrunebackend.service.Impl;

import iuh.fit.se.enternalrunebackend.dto.notification.OrderNotification;
import iuh.fit.se.enternalrunebackend.dto.request.CreateOrderRequest;
import iuh.fit.se.enternalrunebackend.dto.request.OrderItemRequest;
import iuh.fit.se.enternalrunebackend.dto.response.*;
import iuh.fit.se.enternalrunebackend.dto.response.OrderStatusInfo;
import iuh.fit.se.enternalrunebackend.entity.*;
import iuh.fit.se.enternalrunebackend.repository.*;
import iuh.fit.se.enternalrunebackend.service.NotificationService;
import iuh.fit.se.enternalrunebackend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private ProductVariantRepository productVariantRepository;

    @Autowired
    private DiscountRepository discountRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private OrderRefundRepository orderRefundRequestRepository;

    @Autowired
    private PaymentStatusRepository paymentStatusRepository;

    @Autowired
    private ShippingStatusRepository shippingStatusRepository;

    @Override
    public DashboardSummaryResponse getSummaryForMonth(int year, int month) {
        // Tổng số đơn hàng, đơn hoàn thành, đơn đang xử lý
        long totalOrders = orderRepository.countTotalOrders();
        long completedOrders = orderRepository.countCompletedOrders();
        long processingOrders = orderRepository.countProcessingOrders();

        // Dữ liệu tháng hiện tại
        Double revenueThisMonth = orderRepository.sumRevenueByMonth(year, month);
        Integer refundsThisMonth = orderRepository.countRefundsByMonth(year, month);

        // Dữ liệu tháng trước để so sánh
        int prevMonth = (month == 1) ? 12 : month - 1;
        int prevYear = (month == 1) ? year - 1 : year;

        Double revenuePrevMonth = orderRepository.sumRevenueByMonth(prevYear, prevMonth);
        Integer refundsPrevMonth = orderRepository.countRefundsByMonth(prevYear, prevMonth);

        // Tính % thay đổi
        double revenueChange = calcChangePercent(revenueThisMonth, revenuePrevMonth);
        double refundChange = calcChangePercent(refundsThisMonth, refundsPrevMonth);

        return new DashboardSummaryResponse(
                totalOrders,
                revenueThisMonth,
                completedOrders,
                processingOrders,
                refundChange,
                revenueChange
        );
    }

    /**
     * Tính % thay đổi giữa 2 tháng.
     * Nếu tháng trước = 0 thì:
     * - nếu tháng này > 0 → 100%
     * - nếu tháng này = 0 → 0%
     */
    private double calcChangePercent(Number current, Number previous) {
        if (current == null) current = 0;
        if (previous == null || previous.doubleValue() == 0)
            return current.doubleValue() > 0 ? 100.0 : 0.0;

        return ((current.doubleValue() - previous.doubleValue()) / previous.doubleValue()) * 100.0;
    }

    @Override
    @Transactional
    public Order createOrder(CreateOrderRequest request) {
        // 1. Validate và lấy User
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User không tồn tại với ID: " + request.getUserId()));

        // 2. Validate và lấy Address
        Address address = addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new RuntimeException("Address không tồn tại với ID: " + request.getAddressId()));

        // 3. Kiểm tra xem user có quyền sử dụng địa chỉ này không (có trong danh sách addresses của user)
        boolean hasAddress = user.getAddresses().stream()
                .anyMatch(a -> a.getAddressId() == address.getAddressId());
        if (!hasAddress) {
            throw new RuntimeException("User không có quyền sử dụng địa chỉ này!");
        }

        // 4. Lấy Discount nếu có
        Discount discount = null;
        if (request.getDiscountId() != null) {
            discount = discountRepository.findById(request.getDiscountId())
                    .orElse(null);
        }

        // 5. Lấy initial statuses
        PaymentStatus pendingPaymentStatus = paymentStatusRepository.findByStatusCode("PENDING")
                .orElseThrow(() -> new RuntimeException("Payment status PENDING not found"));
        ShippingStatus processingShippingStatus = shippingStatusRepository.findByStatusCode("PROCESSING")
                .orElseThrow(() -> new RuntimeException("Shipping status PROCESSING not found"));

        // 6. Tạo Order
        Order order = Order.builder()
                .orderDate(LocalDate.now())
                .orderUser(user)
                .orderShippingAddress(address)
                .discount(discount)
                .orderDetails(new ArrayList<>())
                .paymentStatusHistories(new ArrayList<>())
                .shippingStatusHistories(new ArrayList<>())
                .build();

        // Add initial statuses with note
        order.addPaymentStatus(pendingPaymentStatus, "Tạo đơn hàng");
        order.addShippingStatus(processingShippingStatus, "Đơn hàng đang được xử lý");

        // 7. Tạo OrderDetails và tính tổng tiền
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemRequest item : request.getOrderItems()) {
            // Lấy ProductVariant
            ProductVariant productVariant = productVariantRepository.findById(item.getProductVariantId())
                    .orElseThrow(() -> new RuntimeException("ProductVariant không tồn tại với ID: " + item.getProductVariantId()));

            // Lấy giá hiện tại của ProductVariant
            ProductPrice productPrice = productVariant.getProdvPrice();
            if (productPrice == null) {
                throw new RuntimeException("ProductVariant không có giá: " + item.getProductVariantId());
            }

            // Tính tổng giá cho item này
            double itemTotal = productPrice.getPpPrice() * item.getQuantity();
            totalAmount = totalAmount.add(BigDecimal.valueOf(itemTotal));

            // Tạo OrderDetail
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOdQuantity(item.getQuantity());
            orderDetail.setOdTotalPrice(itemTotal);
            orderDetail.setOdProductVariant(productVariant);
            orderDetail.setOrder(order);

            order.getOrderDetails().add(orderDetail);
        }

        // 8. Áp dụng discount nếu có
        if (discount != null) {
            // Kiểm tra discount còn hiệu lực không
            LocalDate now = LocalDate.now();
            if (now.isBefore(discount.getDiscountStartDate()) || now.isAfter(discount.getDiscountEndDate())) {
                throw new RuntimeException("Mã giảm giá đã hết hạn hoặc chưa có hiệu lực!");
            }

            // Tính giảm giá dựa trên discountValueType
            BigDecimal discountAmount = BigDecimal.ZERO;

            // Giả sử ValueType có PERCENTAGE và FIXED_AMOUNT
            // Bạn cần điều chỉnh theo enum ValueType thực tế của bạn
            if (discount.getDiscountValueType().toString().equals("PERCENTAGE")) {
                discountAmount = totalAmount.multiply(BigDecimal.valueOf(discount.getDiscountValue() / 100.0));
                // Nếu có giới hạn giảm giá tối đa
                if (discount.getDiscountMaxAmount() > 0) {
                    BigDecimal maxDiscount = BigDecimal.valueOf(discount.getDiscountMaxAmount());
                    if (discountAmount.compareTo(maxDiscount) > 0) {
                        discountAmount = maxDiscount;
                    }
                }
            } else {
                // Fixed amount
                discountAmount = BigDecimal.valueOf(discount.getDiscountValue());
            }

            totalAmount = totalAmount.subtract(discountAmount);

            // Đảm bảo tổng tiền không âm
            if (totalAmount.compareTo(BigDecimal.ZERO) < 0) {
                totalAmount = BigDecimal.ZERO;
            }
        }

        // 9. Set tổng tiền cho order
        order.setOrderTotalAmount(totalAmount);

        // 10. Lưu order (cascade sẽ lưu OrderDetails)
        Order savedOrder = orderRepository.save(order);

        // 11. Gửi notification tới admin
        try {
            OrderNotification notification = OrderNotification.builder()
                    .type("NEW_ORDER")
                    .userId(user.getUserId())
                    .userName(user.getName())
                    .message("đã đặt một đơn hàng mới")
                    .timestamp(LocalDateTime.now())
                    .build();

            notificationService.sendOrderNotificationToAdmin(notification);
        } catch (Exception e) {
            System.err.println("Failed to send notification: " + e.getMessage());
        }

        return savedOrder;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponse> getOrdersByUserIdPaginated(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("orderDate").descending());
        Page<Order> orderPage = orderRepository.findOrdersByCustomerIdWithDetails(userId, pageable);

        return orderPage.map(this::convertToOrderResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(int orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với ID: " + orderId));
        return convertToOrderResponse(order);
    }

    private OrderResponse convertToOrderResponse(Order order) {
        // Map Address
        AddressResponse addressInfo = new AddressResponse(
                order.getOrderShippingAddress().getAddressId(),
                order.getOrderShippingAddress().getStreetName(),
                order.getOrderShippingAddress().getWardName(),
                order.getOrderShippingAddress().getCityName(),
                order.getOrderShippingAddress().getCountryName()
        );

        // Map User
        OrderResponse.OrderUserInfo userInfo = OrderResponse.OrderUserInfo.builder()
                .userName(order.getOrderUser().getName())
                .userEmail(order.getOrderUser().getEmail())
                .build();

        // Map Payment Status History
        List<OrderStatusInfo> paymentHistory = order.getPaymentStatusHistories().stream()
                .map(history -> OrderStatusInfo.builder()
                        .statusId(history.getPaymentStatus().getStatusId())
                        .statusCode(history.getPaymentStatus().getStatusCode())
                        .statusName(history.getPaymentStatus().getStatusName())
                        .description(history.getPaymentStatus().getDescription())
                        .createdAt(history.getCreatedAt())
                        .note(history.getNote())
                        .build())
                .collect(Collectors.toList());

        // Map Shipping Status History
        List<OrderStatusInfo> shippingHistory = order.getShippingStatusHistories().stream()
                .map(history -> OrderStatusInfo.builder()
                        .statusId(history.getShippingStatus().getStatusId())
                        .statusCode(history.getShippingStatus().getStatusCode())
                        .statusName(history.getShippingStatus().getStatusName())
                        .description(history.getShippingStatus().getDescription())
                        .createdAt(history.getCreatedAt())
                        .note(history.getNote())
                        .build())
                .collect(Collectors.toList());

        // Map OrderDetails with ProductVariant
        List<OrderDetailResponse> orderDetailInfos = order.getOrderDetails().stream()
                .map(detail -> {
                    ProductVariant variant = detail.getOdProductVariant();

                    // Get image URL
                    String imageUrl = null;
                    if (variant.getProdvImg() != null && variant.getProdvImg().getImageData() != null) {
                        imageUrl = variant.getProdvImg().getImageData();
                    }

                    // Map ProductVariant info
                    ProductVariantResponse variantInfo = ProductVariantResponse.toProductVariantResponse(variant);

                    return new OrderDetailResponse(
                            detail.getOdId(),
                            detail.getOdQuantity(),
                            detail.getOdTotalPrice(),
                            variantInfo
                    );
                })
                .collect(Collectors.toList());

        // Get current statuses
        PaymentStatus currentPayment = order.getCurrentPaymentStatus();
        ShippingStatus currentShipping = order.getCurrentShippingStatus();

        return OrderResponse.builder()
                .orderId(order.getOrderId())
                .orderDate(order.getOrderDate())
                .orderTotalAmount(order.getOrderTotalAmount())
                .currentPaymentStatus(currentPayment != null ? OrderStatusInfo.builder()
                        .statusId(currentPayment.getStatusId())
                        .statusCode(currentPayment.getStatusCode())
                        .statusName(currentPayment.getStatusName())
                        .description(currentPayment.getDescription())
                        .build() : null)
                .currentShippingStatus(currentShipping != null ? OrderStatusInfo.builder()
                        .statusId(currentShipping.getStatusId())
                        .statusCode(currentShipping.getStatusCode())
                        .statusName(currentShipping.getStatusName())
                        .description(currentShipping.getDescription())
                        .build() : null)
                .paymentStatusHistory(paymentHistory)
                .shippingStatusHistory(shippingHistory)
                .orderShippingAddress(addressInfo)
                .orderUser(userInfo)
                .orderDetails(orderDetailInfos)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderListResponse> getOrderList(
            String keyword,
            String paymentStatusCode,
            String shippingStatusCode,
            Pageable pageable
    ) {
        Page<Order> ordersPage = orderRepository.searchOrders(keyword, paymentStatusCode, shippingStatusCode, pageable);

        List<OrderListResponse> dtoList = ordersPage.getContent().stream().map(order -> {
            int totalProduct = order.getOrderDetails()
                    .stream()
                    .mapToInt(OrderDetail::getOdQuantity)
                    .sum();

            PaymentStatus currentPayment = order.getCurrentPaymentStatus();
            ShippingStatus currentShipping = order.getCurrentShippingStatus();

            return OrderListResponse.builder()
                    .orderId(order.getOrderId())
                    .orderDate(order.getOrderDate())
                    .totalAmount(order.getOrderTotalAmount())
                    .totalProducts(totalProduct)
                    .userName(order.getOrderUser().getName())
                    .userEmail(order.getOrderUser().getEmail())
                    .currentPaymentStatus(currentPayment != null ? new OrderStatusInfo(currentPayment.getStatusCode(), currentPayment.getStatusName()) : null)
                    .currentShippingStatus(currentShipping != null ? new OrderStatusInfo(currentShipping.getStatusCode(), currentShipping.getStatusName()) : null)
                    .build();
        }).toList();
        return new PageImpl<>(dtoList, pageable, ordersPage.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public OrderStatisticsResponse getOrderStatistics() {
        long totalOrders = orderRepository.count();

        BigDecimal totalRevenue = orderRepository.getTotalRevenue();
        if (totalRevenue == null) totalRevenue = BigDecimal.ZERO;

        long completedOrders = orderRepository.countByCurrentShippingStatus("DELIVERED");

        long processingOrders = orderRepository.countProcessingOrders();

        return new OrderStatisticsResponse(
                totalOrders,
                totalRevenue,
                completedOrders,
                processingOrders
        );
    }

    @Override
    public void deleteById(int id) {
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderDetail(int orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        List<OrderDetailResponse> orderDetails = order.getOrderDetails().stream()
                .map(od -> OrderDetailResponse.builder()
                        .orderId(od.getOrder().getOrderId())
                        .quantity(od.getOdQuantity())
                        .totalPrice(od.getOdTotalPrice())
                        .productVariantResponse(ProductVariantResponse.toProductVariantResponse(od.getOdProductVariant()))
                        .build()
                )
                .toList();

        PaymentStatus currentPayment = order.getCurrentPaymentStatus();
        ShippingStatus currentShipping = order.getCurrentShippingStatus();

        // Map address nếu có
        AddressResponse addressResponse = order.getOrderShippingAddress() != null 
            ? AddressResponse.toAddressResponse(order.getOrderShippingAddress())
            : null;

        return OrderResponse.builder()
                .orderId(order.getOrderId())
                .orderDate(order.getOrderDate())
                .orderTotalAmount(order.getOrderTotalAmount())
                .orderUser(new OrderResponse.OrderUserInfo(order.getOrderUser().getName(), order.getOrderUser().getEmail()))
                .currentPaymentStatus(currentPayment != null ? new OrderStatusInfo(currentPayment.getStatusCode(), currentPayment.getStatusName()) : null)
                .currentShippingStatus(currentShipping != null ? new OrderStatusInfo(currentShipping.getStatusCode(), currentShipping.getStatusName()) : null)
                .orderShippingAddress(addressResponse)
                .orderDetails(orderDetails)
                .build();
    }

    @Override
    @Transactional
    public Order cancelOrder(int orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với ID: " + orderId));

        // Kiểm tra quyền của user
        if (!order.getOrderUser().getUserId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền hủy đơn hàng này!");
        }

        // Kiểm tra trạng thái đơn hàng
        ShippingStatus currentShippingStatus = order.getCurrentShippingStatus();
        if (currentShippingStatus == null || !"PROCESSING".equals(currentShippingStatus.getStatusCode())) {
            throw new RuntimeException("Chỉ có thể hủy đơn hàng đang xử lý!");
        }

        PaymentStatus currentPaymentStatus = order.getCurrentPaymentStatus();
        if (currentPaymentStatus != null && "PAID".equals(currentPaymentStatus.getStatusCode())) {
            throw new RuntimeException("Không thể hủy đơn hàng đã thanh toán. Vui lòng tạo yêu cầu hoàn tiền!");
        }

        // Cập nhật trạng thái
        ShippingStatus cancelledStatus = shippingStatusRepository.findByStatusCode("CANCELLED")
                .orElseThrow(() -> new RuntimeException("Shipping status CANCELLED not found"));
        order.addShippingStatus(cancelledStatus, "Đơn hàng bị hủy bởi khách hàng");

        PaymentStatus paymentCanceled = paymentStatusRepository.findByStatusCode("CANCELLED")
                .orElseThrow(() -> new RuntimeException("Payment status CANCELLED not found"));
        order.addPaymentStatus(paymentCanceled, "Đơn hàng bị hủy bởi khách hàng");

        Order savedOrder = orderRepository.save(order);

        // Gửi notification tới admin
        try {
            OrderNotification notification = OrderNotification.builder()
                    .type("CANCEL_ORDER")
                    .userId(order.getOrderUser().getUserId())
                    .userName(order.getOrderUser().getName())
                    .message("đã hủy đơn hàng")
                    .timestamp(LocalDateTime.now())
                    .build();

            notificationService.sendOrderNotificationToAdmin(notification);
        } catch (Exception e) {
            System.err.println("Failed to send notification: " + e.getMessage());
        }

        return savedOrder;
    }

    @Override
    @Transactional
    public void updateShippingStatus(int orderId, String statusCode) {
        // Tìm order
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với ID: " + orderId));

        // Tìm shipping status
        ShippingStatus newStatus = shippingStatusRepository.findByStatusCode(statusCode)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy trạng thái giao hàng: " + statusCode));

        // Thêm status mới vào history
        order.addShippingStatus(newStatus, "Cập nhật bởi admin");

        // Lưu order
        orderRepository.save(order);
    }
}
