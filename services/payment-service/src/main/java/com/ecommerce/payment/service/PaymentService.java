package com.ecommerce.payment.service;

import com.ecommerce.payment.dto.PaymentResponse;
import com.ecommerce.payment.entity.Payment;
import com.ecommerce.payment.event.PaymentProcessEvent;
import com.ecommerce.payment.exception.BusinessException;
import com.ecommerce.payment.exception.PaymentProcessingException;
import com.ecommerce.payment.gateway.PaymentGateway;
import com.ecommerce.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentGateway paymentGateway;

    @Transactional
    public Payment process(PaymentProcessEvent event) {
        return paymentRepository.findByIdempotencyKey(event.getIdempotencyKey())
                .map(existing -> {
                    log.info("Returning idempotent payment result: orderId={}, paymentId={}",
                            existing.getOrderId(), existing.getId());
                    return existing;
                })
                .orElseGet(() -> createAndProcess(event));
    }

    public PaymentResponse getByOrderId(Long orderId, String userEmail) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new BusinessException(
                        "Payment not found", HttpStatus.NOT_FOUND));
        if (!payment.getUserEmail().equals(userEmail)) {
            throw new BusinessException("Access denied", HttpStatus.FORBIDDEN);
        }
        return toResponse(payment);
    }

    private Payment createAndProcess(PaymentProcessEvent event) {
        Payment payment = Payment.builder()
                .orderId(event.getOrderId())
                .userEmail(event.getUserEmail())
                .idempotencyKey(event.getIdempotencyKey())
                .amount(event.getAmount())
                .status(Payment.Status.PENDING)
                .build();
        payment = paymentRepository.save(payment);

        try {
            payment.setTransactionId(paymentGateway.charge(event));
            payment.setStatus(Payment.Status.COMPLETED);
        } catch (PaymentProcessingException exception) {
            payment.setFailureReason(exception.getMessage());
            payment.setStatus(Payment.Status.FAILED);
        }

        return paymentRepository.save(payment);
    }

    private PaymentResponse toResponse(Payment payment) {
        return new PaymentResponse(
                payment.getId(),
                payment.getOrderId(),
                payment.getAmount(),
                payment.getStatus().name(),
                payment.getTransactionId(),
                payment.getFailureReason(),
                payment.getCreatedAt(),
                payment.getUpdatedAt());
    }
}
