package com.ecommerce.order.event;

public record OrderPlacedEvent(
        OrderCreatedEvent orderCreated,
        PaymentProcessEvent paymentProcess) {
}
