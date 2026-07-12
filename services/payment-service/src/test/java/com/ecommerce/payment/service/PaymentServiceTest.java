package com.ecommerce.payment.service;

import com.ecommerce.payment.entity.Payment;
import com.ecommerce.payment.event.PaymentProcessEvent;
import com.ecommerce.payment.exception.PaymentProcessingException;
import com.ecommerce.payment.gateway.PaymentGateway;
import com.ecommerce.payment.repository.PaymentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private PaymentGateway paymentGateway;

    @InjectMocks
    private PaymentService paymentService;

    private PaymentProcessEvent event;

    @BeforeEach
    void setUp() {
        event = new PaymentProcessEvent(
                1L, "user@example.com", new BigDecimal("100.00"), "order:1");
    }

    @Test
    void process_successfulCharge_completesPayment() {
        when(paymentRepository.findByIdempotencyKey("order:1"))
                .thenReturn(Optional.empty());
        when(paymentRepository.save(any(Payment.class))).thenAnswer(invocation -> {
            Payment payment = invocation.getArgument(0);
            if (payment.getId() == null) {
                payment.setId(10L);
            }
            return payment;
        });
        when(paymentGateway.charge(event)).thenReturn("tx-123");

        Payment result = paymentService.process(event);

        assertThat(result.getStatus()).isEqualTo(Payment.Status.COMPLETED);
        assertThat(result.getTransactionId()).isEqualTo("tx-123");
        verify(paymentRepository).findByIdempotencyKey("order:1");
    }

    @Test
    void process_gatewayFailure_marksPaymentFailed() {
        when(paymentRepository.findByIdempotencyKey("order:1"))
                .thenReturn(Optional.empty());
        when(paymentRepository.save(any(Payment.class))).thenAnswer(invocation -> {
            Payment payment = invocation.getArgument(0);
            payment.setId(10L);
            return payment;
        });
        when(paymentGateway.charge(event))
                .thenThrow(new PaymentProcessingException("declined"));

        Payment result = paymentService.process(event);

        assertThat(result.getStatus()).isEqualTo(Payment.Status.FAILED);
        assertThat(result.getFailureReason()).isEqualTo("declined");
    }

    @Test
    void process_duplicateEvent_returnsExistingPaymentWithoutChargingAgain() {
        Payment existing = Payment.builder()
                .id(10L)
                .orderId(1L)
                .idempotencyKey("order:1")
                .status(Payment.Status.COMPLETED)
                .build();
        when(paymentRepository.findByIdempotencyKey("order:1"))
                .thenReturn(Optional.of(existing));

        Payment result = paymentService.process(event);

        assertThat(result).isSameAs(existing);
        verify(paymentGateway, never()).charge(any());
        verify(paymentRepository, never()).save(any());
    }
}
