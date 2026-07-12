package com.ecommerce.gateway.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.data.redis.core.ReactiveStringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.net.InetSocketAddress;
import java.time.LocalDateTime;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class RateLimitingFilter implements GlobalFilter, Ordered {

    private final ReactiveStringRedisTemplate redisTemplate;
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    // Rate limiting config: 100 requests per 60 seconds per IP
    private static final long MAX_REQUESTS = 100;
    private static final long WINDOW_SIZE = 60;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String clientIp = getClientIp(exchange);
        String key = "rate-limit:" + clientIp;

        return checkRateLimit(key)
                .flatMap(allowed -> {
                    if (allowed) {
                        return chain.filter(exchange);
                    } else {
                        return writeErrorResponse(exchange,
                                HttpStatus.TOO_MANY_REQUESTS,
                                "Rate limit exceeded: 100 requests per minute");
                    }
                });
    }

    private Mono<Boolean> checkRateLimit(String key) {
        return redisTemplate.opsForValue()
                .increment(key)
                .flatMap(requestCount -> {
                    boolean allowed = requestCount <= MAX_REQUESTS;
                    if (requestCount == 1) {
                        return redisTemplate.expire(key, Duration.ofSeconds(WINDOW_SIZE))
                                .thenReturn(allowed);
                    }
                    return Mono.just(allowed);
                });
    }

    private String getClientIp(ServerWebExchange exchange) {
        InetSocketAddress remoteAddress = exchange.getRequest().getRemoteAddress();
        if (remoteAddress == null) {
            return "unknown";
        }
        return remoteAddress.getAddress() == null
                ? remoteAddress.getHostString()
                : remoteAddress.getAddress().getHostAddress();
    }

    private Mono<Void> writeErrorResponse(ServerWebExchange exchange,
                                          HttpStatus status, String message) {
        exchange.getResponse().setStatusCode(status);
        exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", status.value());
        body.put("message", message);
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("errors", null);

        try {
            byte[] bytes = OBJECT_MAPPER.writeValueAsBytes(body);
            DataBuffer buffer = exchange.getResponse()
                    .bufferFactory().wrap(bytes);
            return exchange.getResponse().writeWith(Mono.just(buffer));
        } catch (Exception e) {
            return exchange.getResponse().setComplete();
        }
    }

    @Override
    public int getOrder() {
        return -2;
    }
}
