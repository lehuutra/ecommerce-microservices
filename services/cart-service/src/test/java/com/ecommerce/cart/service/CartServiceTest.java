package com.ecommerce.cart.service;

import com.ecommerce.cart.dto.CartItem;
import com.ecommerce.cart.dto.CartResponse;
import com.ecommerce.cart.repository.CartRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    private static final String EMAIL = "test@example.com";
    @Mock
    private CartRepository cartRepository;

    @InjectMocks
    private CartService cartService;

    @Test
    void addItem_incrementsExistingQuantityAndReturnsUpdatedCart() {
        when(cartRepository.findQuantity(EMAIL, 1L)).thenReturn(2);
        when(cartRepository.findItems(EMAIL)).thenReturn(Map.of(1L, 3));

        CartResponse result = cartService.addItem(EMAIL, new CartItem(1L, 1));

        verify(cartRepository).saveItem(EMAIL, 1L, 3);
        assertThat(result.getUserEmail()).isEqualTo(EMAIL);
        assertThat(result.getItems()).containsExactly(new CartItem(1L, 3));
    }

    @Test
    void getCart_returnsEmptyItemsWhenNoRedisHashExists() {
        when(cartRepository.findItems(EMAIL)).thenReturn(Map.of());

        CartResponse result = cartService.getCart(EMAIL);

        assertThat(result.getUserEmail()).isEqualTo(EMAIL);
        assertThat(result.getItems()).isEmpty();
    }
}
