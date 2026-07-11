package com.ecommerce.cart.repository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Duration;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CartRepositoryTest {

    private static final String EMAIL = "test@example.com";
    private static final String CART_KEY = "cart:" + EMAIL;

    @Mock
    private RedisTemplate<String, String> redisTemplate;

    @Mock
    private HashOperations<String, Object, Object> hashOperations;

    @InjectMocks
    private CartRepository cartRepository;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(cartRepository, "ttlDays", 7L);
        when(redisTemplate.opsForHash()).thenReturn(hashOperations);
    }

    @Test
    void findItems_convertsRedisHashToTypedMap() {
        when(hashOperations.entries(CART_KEY)).thenReturn(Map.of("1", "3"));
        when(redisTemplate.hasKey(CART_KEY)).thenReturn(true);

        Map<Long, Integer> result = cartRepository.findItems(EMAIL);

        assertThat(result).containsEntry(1L, 3);
        verify(redisTemplate).expire(CART_KEY, Duration.ofDays(7));
    }

    @Test
    void saveItem_storesStringsAndRefreshesTtl() {
        when(redisTemplate.hasKey(CART_KEY)).thenReturn(true);

        cartRepository.saveItem(EMAIL, 1L, 3);

        verify(hashOperations).put(CART_KEY, "1", "3");
        verify(redisTemplate).expire(CART_KEY, Duration.ofDays(7));
    }
}
