package com.ecommerce.order.publisher;

import com.ecommerce.order.event.OrderPlacedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Slf4j
@Component
@RequiredArgsConstructor
public class OrderKafkaPublisher {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void publish(OrderPlacedEvent event) {
        String key = String.valueOf(event.orderCreated().getOrderId());
        kafkaTemplate.send("order.created", key, event.orderCreated());
        kafkaTemplate.send("payment.process", key, event.paymentProcess());
        log.info("Order and payment events published: orderId={}", key);
    }
}
