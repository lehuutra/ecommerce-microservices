package com.ecommerce.order.service;

import com.ecommerce.order.entity.Order;
import com.ecommerce.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderStatusService {

    private final OrderRepository orderRepository;

    @Transactional
    public void confirmOrder(Long orderId) {
        updateStatus(orderId, Order.Status.CONFIRMED);
    }

    @Transactional
    public void cancelOrder(Long orderId) {
        updateStatus(orderId, Order.Status.CANCELLED);
    }

    private void updateStatus(Long orderId, Order.Status targetStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Order not found for payment result: " + orderId));

        if (order.getStatus() == targetStatus) {
            log.info("Order status already applied: orderId={}, status={}",
                    orderId, targetStatus);
            return;
        }
        if (order.getStatus() != Order.Status.PENDING) {
            log.warn("Ignoring conflicting payment result: orderId={}, current={}, target={}",
                    orderId, order.getStatus(), targetStatus);
            return;
        }

        order.setStatus(targetStatus);
        orderRepository.save(order);
        log.info("Order status updated: orderId={}, status={}", orderId, targetStatus);
    }
}
