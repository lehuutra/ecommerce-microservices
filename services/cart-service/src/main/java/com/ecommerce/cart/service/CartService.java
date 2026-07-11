package com.ecommerce.cart.service;

import com.ecommerce.cart.dto.CartItem;
import com.ecommerce.cart.dto.CartResponse;
import com.ecommerce.cart.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;

    public CartResponse getCart(String email) {
        List<CartItem> items = cartRepository.findItems(email).entrySet().stream()
                .map(entry -> new CartItem(
                        entry.getKey(),
                        entry.getValue()))
                .sorted(Comparator.comparing(CartItem::getProductId))
                .toList();

        return new CartResponse(email, items);
    }

    public CartResponse addItem(String email, CartItem item) {
        int currentQuantity = cartRepository.findQuantity(email, item.getProductId());
        int updatedQuantity = currentQuantity + item.getQuantity();
        cartRepository.saveItem(email, item.getProductId(), updatedQuantity);
        return getCart(email);
    }

    public CartResponse removeItem(String email, Long productId) {
        cartRepository.removeItem(email, productId);
        return getCart(email);
    }

    public void clearCart(String email) {
        cartRepository.clear(email);
    }
}
