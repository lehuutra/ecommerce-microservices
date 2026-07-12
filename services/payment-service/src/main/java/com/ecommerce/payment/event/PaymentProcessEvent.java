package com.ecommerce.payment.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentProcessEvent {
    private Long orderId;
    private String userEmail;
    private BigDecimal amount;
    private String idempotencyKey;
}
