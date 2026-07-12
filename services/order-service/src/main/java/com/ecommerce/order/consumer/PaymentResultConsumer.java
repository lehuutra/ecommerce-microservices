package com.ecommerce.order.consumer;

import com.ecommerce.order.event.PaymentCompletedEvent;
import com.ecommerce.order.event.PaymentFailedEvent;
import com.ecommerce.order.service.OrderStatusService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PaymentResultConsumer {

    private final ObjectMapper objectMapper;
    private final OrderStatusService orderStatusService;

    @KafkaListener(topics = "payment.completed")
    public void handleCompleted(String payload) {
        PaymentCompletedEvent event = read(payload, PaymentCompletedEvent.class);
        orderStatusService.confirmOrder(event.getOrderId());
    }

    @KafkaListener(topics = "payment.failed")
    public void handleFailed(String payload) {
        PaymentFailedEvent event = read(payload, PaymentFailedEvent.class);
        orderStatusService.cancelOrder(event.getOrderId());
    }

    private <T> T read(String payload, Class<T> eventType) {
        try {
            return objectMapper.readValue(payload, eventType);
        } catch (JsonProcessingException exception) {
            throw new IllegalArgumentException("Invalid payment result event", exception);
        }
    }
}
