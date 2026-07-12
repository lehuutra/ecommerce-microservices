package com.ecommerce.order.service;

import com.ecommerce.order.dto.*;
import com.ecommerce.order.entity.Order;
import com.ecommerce.order.entity.OrderItem;
import com.ecommerce.order.event.OrderCreatedEvent;
import com.ecommerce.order.event.OrderPlacedEvent;
import com.ecommerce.order.event.PaymentProcessEvent;
import com.ecommerce.order.exception.BusinessException;
import com.ecommerce.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public OrderResponse createOrder(String userEmail, OrderRequest request) {
        // Tính total amount
        BigDecimal totalAmount = request.getItems().stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Tạo Order
        Order order = Order.builder()
                .userEmail(userEmail)
                .totalAmount(totalAmount)
                .build();

        // Tạo OrderItems
        List<OrderItem> orderItems = request.getItems().stream()
                .map(item -> OrderItem.builder()
                        .order(order)
                        .productId(item.getProductId())
                        .productName(item.getProductName())
                        .price(item.getPrice())
                        .quantity(item.getQuantity())
                        .build())
                .collect(Collectors.toList());

        order.setItems(orderItems);
        Order savedOrder = orderRepository.save(order);

        OrderCreatedEvent orderCreatedEvent = OrderCreatedEvent.builder()
                .orderId(savedOrder.getId())
                .userEmail(savedOrder.getUserEmail())
                .totalAmount(savedOrder.getTotalAmount())
                .items(request.getItems().stream()
                        .map(item -> OrderCreatedEvent.OrderItem.builder()
                                .productId(item.getProductId())
                                .productName(item.getProductName())
                                .price(item.getPrice())
                                .quantity(item.getQuantity())
                                .build())
                        .collect(Collectors.toList()))
                .build();

        PaymentProcessEvent paymentProcessEvent = PaymentProcessEvent.builder()
                .orderId(savedOrder.getId())
                .userEmail(savedOrder.getUserEmail())
                .amount(savedOrder.getTotalAmount())
                .idempotencyKey("order:" + savedOrder.getId())
                .build();

        eventPublisher.publishEvent(new OrderPlacedEvent(
                orderCreatedEvent,
                paymentProcessEvent));
        log.info("Order created and events scheduled after commit: orderId={}",
                savedOrder.getId());

        return toResponse(savedOrder);
    }

    public List<OrderResponse> getMyOrders(String userEmail) {
        return orderRepository.findByUserEmailOrderByCreatedAtDesc(userEmail)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public OrderResponse getById(Long id, String userEmail) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Order not found", HttpStatus.NOT_FOUND));

        if (!order.getUserEmail().equals(userEmail)) {
            throw new BusinessException("Access denied", HttpStatus.FORBIDDEN);
        }

        return toResponse(order);
    }

    private OrderResponse toResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .userEmail(order.getUserEmail())
                .status(order.getStatus().name())
                .totalAmount(order.getTotalAmount())
                .createdAt(order.getCreatedAt())
                .items(order.getItems() == null ? List.of() :
                        order.getItems().stream()
                                .map(item -> OrderItemResponse.builder()
                                        .id(item.getId())
                                        .productId(item.getProductId())
                                        .productName(item.getProductName())
                                        .price(item.getPrice())
                                        .quantity(item.getQuantity())
                                        .build())
                                .collect(Collectors.toList()))
                .build();
    }
}
