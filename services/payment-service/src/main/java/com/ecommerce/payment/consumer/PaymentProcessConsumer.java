package com.ecommerce.payment.consumer;

import com.ecommerce.payment.entity.Payment;
import com.ecommerce.payment.event.PaymentCompletedEvent;
import com.ecommerce.payment.event.PaymentFailedEvent;
import com.ecommerce.payment.event.PaymentProcessEvent;
import com.ecommerce.payment.service.PaymentService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class PaymentProcessConsumer {

    private final ObjectMapper objectMapper;
    private final PaymentService paymentService;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @KafkaListener(topics = "payment.process")
    public void handle(String payload) {
        PaymentProcessEvent processEvent = read(payload);
        Payment payment = paymentService.process(processEvent);
        String key = String.valueOf(payment.getOrderId());

        if (payment.getStatus() == Payment.Status.COMPLETED) {
            kafkaTemplate.send("payment.completed", key, new PaymentCompletedEvent(
                    payment.getOrderId(), payment.getId(), payment.getTransactionId(),
                    LocalDateTime.now())).join();
        } else {
            kafkaTemplate.send("payment.failed", key, new PaymentFailedEvent(
                    payment.getOrderId(), payment.getId(), payment.getFailureReason(),
                    LocalDateTime.now())).join();
        }
        log.info("Payment result published: orderId={}, status={}",
                payment.getOrderId(), payment.getStatus());
    }

    private PaymentProcessEvent read(String payload) {
        try {
            return objectMapper.readValue(payload, PaymentProcessEvent.class);
        } catch (JsonProcessingException exception) {
            throw new IllegalArgumentException("Invalid payment process event", exception);
        }
    }
}
