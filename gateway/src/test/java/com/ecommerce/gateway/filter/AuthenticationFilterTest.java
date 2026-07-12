package com.ecommerce.gateway.filter;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.http.HttpStatus;
import org.springframework.mock.http.server.reactive.MockServerHttpRequest;
import org.springframework.mock.web.server.MockServerWebExchange;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class AuthenticationFilterTest {

    private static final String SECRET =
            "ecommerce-secret-key-must-be-at-least-256-bits-long-for-hs256";
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    private AuthenticationFilter filter;

    @BeforeEach
    void setUp() {
        filter = new AuthenticationFilter();
        ReflectionTestUtils.setField(filter, "secretKey", SECRET);
    }

    @Test
    void protectedEndpoint_withoutToken_returnsConsistentUnauthorizedBody() throws Exception {
        GatewayFilterChain chain = mock(GatewayFilterChain.class);
        MockServerWebExchange exchange = MockServerWebExchange.from(
                MockServerHttpRequest.get("/api/orders").build());

        filter.filter(exchange, chain).block();

        assertThat(exchange.getResponse().getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(exchange.getResponse().getHeaders().getContentType().toString())
                .isEqualTo("application/json");

        JsonNode body = OBJECT_MAPPER.readTree(readResponseBody(exchange));
        assertThat(body.get("status").asInt()).isEqualTo(401);
        assertThat(body.get("message").asText())
                .isEqualTo("Missing or invalid Authorization header");
        assertThat(body.has("timestamp")).isTrue();
        assertThat(body.get("errors").isNull()).isTrue();
        verify(chain, never()).filter(any());
    }

    @Test
    void authPathWithExtraSuffix_isNotTreatedAsPublic() {
        GatewayFilterChain chain = mock(GatewayFilterChain.class);
        MockServerWebExchange exchange = MockServerWebExchange.from(
                MockServerHttpRequest.post("/api/auth/login-extra").build());

        filter.filter(exchange, chain).block();

        assertThat(exchange.getResponse().getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        verify(chain, never()).filter(any());
    }

    @Test
    void validToken_overwritesClientSuppliedIdentityHeaders() {
        GatewayFilterChain chain = mock(GatewayFilterChain.class);
        when(chain.filter(any())).thenReturn(Mono.empty());

        SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
        String token = Jwts.builder()
                .subject("real-user@example.com")
                .claim("role", "CUSTOMER")
                .signWith(key)
                .compact();

        MockServerWebExchange exchange = MockServerWebExchange.from(
                MockServerHttpRequest.get("/api/orders")
                        .header("Authorization", "Bearer " + token)
                        .header("X-User-Email", "spoofed@example.com")
                        .header("X-User-Role", "ADMIN")
                        .build());

        filter.filter(exchange, chain).block();

        ArgumentCaptor<ServerWebExchange> captor =
                ArgumentCaptor.forClass(ServerWebExchange.class);
        verify(chain).filter(captor.capture());

        assertThat(captor.getValue().getRequest().getHeaders().get("X-User-Email"))
                .containsExactly("real-user@example.com");
        assertThat(captor.getValue().getRequest().getHeaders().get("X-User-Role"))
                .containsExactly("CUSTOMER");
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
