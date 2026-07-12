package com.ecommerce.gateway.filter;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.data.redis.core.ReactiveStringRedisTemplate;
import org.springframework.data.redis.core.ReactiveValueOperations;
import org.springframework.http.HttpStatus;
import org.springframework.mock.http.server.reactive.MockServerHttpRequest;
import org.springframework.mock.web.server.MockServerWebExchange;
import reactor.core.publisher.Mono;

import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.time.Duration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RateLimitingFilterTest {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private static final String RATE_LIMIT_KEY = "rate-limit:127.0.0.1";

    @Mock
    private ReactiveStringRedisTemplate redisTemplate;

    @Mock
    private ReactiveValueOperations<String, String> valueOperations;

    @Mock
    private GatewayFilterChain chain;

    @InjectMocks
    private RateLimitingFilter filter;

    @BeforeEach
    void setUp() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    }

    @Test
    void firstRequest_setsTtlAndIgnoresSpoofedForwardedForHeader() {
        when(valueOperations.increment(RATE_LIMIT_KEY)).thenReturn(Mono.just(1L));
        when(redisTemplate.expire(RATE_LIMIT_KEY, Duration.ofSeconds(60)))
                .thenReturn(Mono.just(true));
        when(chain.filter(any())).thenReturn(Mono.empty());

        MockServerWebExchange exchange = MockServerWebExchange.from(
                requestWithRemoteAddress()
                        .header("X-Forwarded-For", "203.0.113.10")
                        .build());

        filter.filter(exchange, chain).block();

        verify(valueOperations).increment(RATE_LIMIT_KEY);
        verify(redisTemplate).expire(RATE_LIMIT_KEY, Duration.ofSeconds(60));
        verify(chain).filter(exchange);
    }

    @Test
    void requestAtLimit_isAllowed() {
        when(valueOperations.increment(RATE_LIMIT_KEY)).thenReturn(Mono.just(100L));
        when(chain.filter(any())).thenReturn(Mono.empty());
        MockServerWebExchange exchange = MockServerWebExchange.from(
                requestWithRemoteAddress().build());

        filter.filter(exchange, chain).block();

        verify(chain).filter(exchange);
        verify(redisTemplate, never()).expire(any(String.class), any(Duration.class));
    }

    @Test
    void requestOverLimit_returnsConsistentTooManyRequestsBody() throws Exception {
        when(valueOperations.increment(RATE_LIMIT_KEY)).thenReturn(Mono.just(101L));
        MockServerWebExchange exchange = MockServerWebExchange.from(
                requestWithRemoteAddress().build());

        filter.filter(exchange, chain).block();

        assertThat(exchange.getResponse().getStatusCode())
                .isEqualTo(HttpStatus.TOO_MANY_REQUESTS);
        JsonNode body = OBJECT_MAPPER.readTree(readResponseBody(exchange));
        assertThat(body.get("status").asInt()).isEqualTo(429);
        assertThat(body.get("message").asText())
                .isEqualTo("Rate limit exceeded: 100 requests per minute");
        assertThat(body.has("timestamp")).isTrue();
        assertThat(body.get("errors").isNull()).isTrue();
        verify(chain, never()).filter(any());
    }

    private MockServerHttpRequest.BaseBuilder<?> requestWithRemoteAddress() {
        return MockServerHttpRequest.get("/api/products")
                .remoteAddress(new InetSocketAddress("127.0.0.1", 54321));
    }

    private String readResponseBody(MockServerWebExchange exchange) {
        DataBuffer buffer = DataBufferUtils.join(exchange.getResponse().getBody()).block();
        assertThat(buffer).isNotNull();

        byte[] bytes = new byte[buffer.readableByteCount()];
        buffer.read(bytes);
        DataBufferUtils.release(buffer);
        return new String(bytes, StandardCharsets.UTF_8);
    }
}
