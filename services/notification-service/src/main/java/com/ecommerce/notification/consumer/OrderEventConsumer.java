package com.ecommerce.notification.consumer;

import com.ecommerce.notification.event.OrderCreatedEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class OrderEventConsumer {

    @KafkaListener(topics = "order.created", groupId = "notification-service-group")
    public void handleOrderCreated(OrderCreatedEvent event) {
        log.info("=== NEW ORDER NOTIFICATION ===");
        log.info("Order ID: {}", event.getOrderId());
        log.info("Customer: {}", event.getUserEmail());
        log.info("Total Amount: {}", event.getTotalAmount());
        log.info("Items:");
        event.getItems().forEach(item ->
                log.info("  - {} x{} @ {}",
                        item.getProductName(),
                        item.getQuantity(),
                        item.getPrice())
        );
        log.info("==============================");

        // Trong thực tế: gửi email qua SendGrid, SES...
        sendEmailNotification(event);
    }

    private void sendEmailNotification(OrderCreatedEvent event) {
        // Giả lập gửi email
        log.info("Sending email to: {}", event.getUserEmail());
        log.info("Subject: Order #{} confirmed!", event.getOrderId());
        log.info("Email sent successfully!");
    }
}
