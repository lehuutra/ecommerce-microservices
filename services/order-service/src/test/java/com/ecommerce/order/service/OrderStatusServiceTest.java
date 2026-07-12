package com.ecommerce.order.service;

import com.ecommerce.order.entity.Order;
import com.ecommerce.order.repository.OrderRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderStatusServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderStatusService orderStatusService;

    @Test
    void confirmOrder_movesPendingOrderToConfirmed() {
        Order order = Order.builder().id(1L).status(Order.Status.PENDING).build();
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        orderStatusService.confirmOrder(1L);

        assertThat(order.getStatus()).isEqualTo(Order.Status.CONFIRMED);
        verify(orderRepository).save(order);
    }

    @Test
    void duplicateResult_doesNotSaveAgain() {
        Order order = Order.builder().id(1L).status(Order.Status.CONFIRMED).build();
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        orderStatusService.confirmOrder(1L);

        verify(orderRepository, never()).save(order);
    }
}
