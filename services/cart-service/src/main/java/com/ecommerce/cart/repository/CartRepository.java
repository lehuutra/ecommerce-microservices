package com.ecommerce.cart.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class CartRepository {

    private static final String KEY_PREFIX = "cart:";

    private final RedisTemplate<String, String> redisTemplate;

    @Value("${cart.ttl.days:7}")
    private long ttlDays;

    public Map<Long, Integer> findItems(String email) {
        String key = cartKey(email);
        Map<Object, Object> entries = redisTemplate.opsForHash().entries(key);
        refreshTtl(key);

        Map<Long, Integer> items = new LinkedHashMap<>();
        entries.forEach((productId, quantity) -> items.put(
                Long.valueOf(productId.toString()),
                Integer.valueOf(quantity.toString())));
        return items;
    }

    public int findQuantity(String email, Long productId) {
        Object quantity = redisTemplate.opsForHash()
                .get(cartKey(email), productId.toString());
        return quantity == null ? 0 : Integer.parseInt(quantity.toString());
    }

    public void saveItem(String email, Long productId, int quantity) {
        String key = cartKey(email);
        redisTemplate.opsForHash()
                .put(key, productId.toString(), Integer.toString(quantity));
        refreshTtl(key);
    }

    public void removeItem(String email, Long productId) {
        String key = cartKey(email);
        redisTemplate.opsForHash().delete(key, productId.toString());
        refreshTtl(key);
    }

    public void clear(String email) {
        redisTemplate.delete(cartKey(email));
    }

    private String cartKey(String email) {
        return KEY_PREFIX + email;
    }

    private void refreshTtl(String key) {
        if (Boolean.TRUE.equals(redisTemplate.hasKey(key))) {
            redisTemplate.expire(key, Duration.ofDays(ttlDays));
        }
    }
}
