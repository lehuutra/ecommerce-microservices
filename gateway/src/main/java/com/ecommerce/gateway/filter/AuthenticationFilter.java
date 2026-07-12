package com.ecommerce.gateway.filter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Component
public class AuthenticationFilter implements GlobalFilter, Ordered {

    @Value("${jwt.secret}")
    private String secretKey;

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    private static final List<String> PUBLIC_ENDPOINTS = List.of(
            "/api/auth/login",
            "/api/auth/register"
    );

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getPath().toString();
        String method = exchange.getRequest().getMethod().name();

        if (isPublicEndpoint(path, method)) {
            return chain.filter(exchange);
        }

        String authHeader = exchange.getRequest()
                .getHeaders()
                .getFirst("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return writeErrorResponse(exchange, HttpStatus.UNAUTHORIZED,
                    "Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);

        try {
            Claims claims = extractClaims(token);
            exchange = exchange.mutate()
                    .request(request -> request.headers(headers -> {
                        headers.set("X-User-Email", claims.getSubject());
                        headers.set("X-User-Role", claims.get("role", String.class));
                    }))
                    .build();
        } catch (Exception e) {
            return writeErrorResponse(exchange, HttpStatus.UNAUTHORIZED,
                    "Invalid or expired token");
        }

        return chain.filter(exchange);
    }

    // Helper method: trả về JSON error body đúng format
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
        } catch (JsonProcessingException e) {
            return exchange.getResponse().setComplete();
        }
    }

    private boolean isPublicEndpoint(String path, String method) {
        if (method.equals("GET") &&
                (matchesPathSegment(path, "/api/products")
                        || matchesPathSegment(path, "/api/categories"))) {
            return true;
        }
        return PUBLIC_ENDPOINTS.contains(path);
    }

    private boolean matchesPathSegment(String path, String basePath) {
        return path.equals(basePath) || path.startsWith(basePath + "/");
    }

    private Claims extractClaims(String token) {
        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    @Override
    public int getOrder() {
        return -1;
    }
}
