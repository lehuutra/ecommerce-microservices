package com.ecommerce.payment.gateway;

import com.ecommerce.payment.event.PaymentProcessEvent;
import com.ecommerce.payment.exception.PaymentProcessingException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class MockPaymentGateway implements PaymentGateway {

    @Value("${payment.mock.force-failure:false}")
    private boolean forceFailure;

    @Override
    public String charge(PaymentProcessEvent event) {
        if (forceFailure) {
            throw new PaymentProcessingException("Mock payment gateway rejected the charge");
        }
        return "mock-" + UUID.randomUUID();
    }
}
