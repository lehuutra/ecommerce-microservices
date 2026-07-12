package com.ecommerce.payment.gateway;

import com.ecommerce.payment.event.PaymentProcessEvent;

public interface PaymentGateway {
    String charge(PaymentProcessEvent event);
}
