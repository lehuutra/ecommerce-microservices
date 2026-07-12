# E-Commerce Microservices — Project Handover

> Cập nhật: 2026-07-12

## 1. Mục tiêu và cách làm việc

Project học tập xây dựng hệ thống e-commerce theo kiến trúc microservices, hướng tới năng lực Senior Backend/Microservices Engineer.

Nguyên tắc hỗ trợ:

- Giải thích WHY trước HOW.
- Chia thay đổi thành phần nhỏ, nhưng có thể thực hiện trọn gói khi được yêu cầu.
- Khi có lỗi: đọc log, xác định root cause, sửa đúng nguyên nhân và test lại.
- Ưu tiên hiểu sâu, code rõ ràng và commit theo một chủ đề.

Môi trường chính: Windows 11, IntelliJ IDEA, Git Bash/PowerShell và Docker Desktop.

## 2. Tech stack hiện tại

| Thành phần | Phiên bản / lựa chọn |
|---|---|
| Java | 21 |
| Spring Boot | 3.5.14 |
| Spring Cloud | 2025.0.3 |
| Gradle Wrapper | 9.0.0 |
| Docker build image | Gradle 8.5 + JDK 21 |
| PostgreSQL | 16 |
| Redis | 7-alpine |
| Kafka / Zookeeper | Confluent 7.5.0 |
| Flyway | 11.7.2 |
| JWT | jjwt 0.12.3 |

Gateway sử dụng WebFlux/Netty qua `spring-cloud-starter-gateway-server-webflux`; không thêm Spring MVC vào Gateway.

## 3. Kiến trúc và ports

```text
Client
  |
  v :8080
API Gateway
  |-- /api/auth/**       -> auth-service:8081
  |-- /api/products/**   -> product-service:8082
  |-- /api/categories/** -> product-service:8082
  |-- /api/orders/**     -> order-service:8083
  `-- /api/cart/**       -> cart-service:8085

Order Service -> Kafka order.created -> Notification Service
```

Host ports:

```text
8080 Gateway
8081 Auth Service
8082 Product Service
8083 Order Service
8084 Payment Service (chưa xây dựng)
8085 Cart Service
5432 PostgreSQL
6379 Redis
9092 Kafka external listener
2181 Zookeeper
```

Notification Service là Kafka consumer và không expose host port. Thuộc tính nội bộ của service có thể dùng 8085 mà không xung đột vì mỗi container có network namespace riêng.

## 4. Authentication và identity flow

```text
Client login -> Auth Service cấp JWT
Client request + Bearer token -> Gateway verify JWT
Gateway ghi đè headers:
  X-User-Email
  X-User-Role
Downstream service sử dụng identity headers
```

Gateway trả JSON `401` thống nhất khi token thiếu hoặc không hợp lệ. Public auth endpoints được match chính xác; client không thể giả identity bằng cách gửi sẵn `X-User-Email` hoặc `X-User-Role`.

Secrets phải được cung cấp qua environment variables ở môi trường thực. Không ghi production secrets hoặc user passwords vào tài liệu/repository.

## 5. Database và messaging

Database per service:

- `auth_db`
- `product_db`
- `order_db`

`infrastructure/postgres/init.sql` tạo đủ ba database. Các service không truy cập trực tiếp database của nhau.

Kafka:

- External: `localhost:9092`
- Docker internal: `kafka:29092`
- Topic hiện tại: `order.created`
- Notification consumer dùng `ErrorHandlingDeserializer` và bỏ qua type header cũ không tương thích.

## 6. Product Service và Redis cache

Product Service sử dụng Spring Cache:

```text
products-all::SimpleKey []
products-id::{id}
products-search::{name}
```

- TTL: 10 phút.
- GET đọc/ghi cache.
- Create/update/delete evict các cache liên quan.
- Product delete là soft delete (`INACTIVE`).
- Docker truyền `REDIS_HOST=redis`; local mặc định `localhost`.

Cache đã được test qua Gateway và xác nhận key/TTL trực tiếp trong Redis.

## 7. Cart Service

Cart Service dùng Redis làm primary storage, không dùng PostgreSQL.

Redis Hash:

```text
Key:   cart:{email}
Field: productId
Value: quantity
TTL:   7 ngày, refresh khi user tương tác
```

Layers:

```text
CartController -> CartService -> CartRepository -> RedisTemplate -> Redis
```

APIs:

```text
GET    /api/cart
POST   /api/cart/items
DELETE /api/cart/items/{productId}
DELETE /api/cart
```

Add cùng product sẽ cộng dồn quantity. Request DTO và path variable được validate; error response dùng format `{ status, message, timestamp, errors }`.

Cart đã có unit tests, Docker build và end-to-end test qua Gateway.

## 8. Gateway rate limiting

- Redis key: `rate-limit:{remoteIp}`.
- Giới hạn: 100 requests / 60 giây / remote IP.
- Redis `INCR` quyết định ngưỡng dựa trên counter atomic.
- Request thứ 100 được phép; request thứ 101 trả JSON `429`.
- Không tin `X-Forwarded-For` khi chưa cấu hình trusted proxy.
- Áp dụng cho auth, public và protected endpoints.

Đã test unit và runtime với kết quả 100 response `200`, sau đó 1 response `429`.

## 9. Trạng thái hiện tại

Đã hoàn thành:

- Auth Service: register/login/JWT.
- API Gateway: routes, JWT verification, identity header injection, JSON errors.
- Product/Category APIs và Redis cache.
- Order Service và Kafka producer.
- Notification Service và Kafka consumer.
- Cart Service với Redis Hash storage.
- Redis rate limiting tại Gateway.
- Docker Compose cho các service hiện tại.
- PostgreSQL schemas và Flyway migrations.

Các checkpoint gần nhất:

```text
feat(product): add Redis caching
chore(gateway): align Spring Cloud and Redis config
feat(cart): add Redis-backed cart service
fix(gateway): harden authentication filter
feat(gateway): add Redis rate limiting
chore(gateway): replace deprecated starter
```

## 10. Công việc tiếp theo

### Phase 8 — Payment Service và Saga

- Tạo Payment Service tại port 8084 và `payment_db`.
- Thiết kế events `payment.process`, `payment.completed`, `payment.failed`.
- Saga choreography từ order created đến confirmed/cancelled.
- Idempotency key để tránh double charge.
- Update Order status từ `PENDING` sang `CONFIRMED` hoặc `CANCELLED`.

### Các phase sau

- CI/CD bằng GitHub Actions.
- Environment configs và secret management.
- AWS deployment.
- Next.js frontend.
- Observability: metrics, tracing và centralized logging.

### Technical debt

- Product Service vẫn còn security/JWT code cũ; cần thống nhất hoàn toàn chiến lược trust Gateway.
- Rate limiting cần trusted proxy configuration trước khi sử dụng `X-Forwarded-For` khi deploy.
- Notification mới log event, chưa gửi email thật.
- Inventory chưa được tách khỏi Product Service.
- API versioning và OpenAPI chưa có.

## 11. Lệnh thường dùng

```bash
# Chạy hệ thống
docker compose up -d

# Build/recreate một service
docker compose build cart-service
docker compose up -d --force-recreate cart-service

# Xem trạng thái và logs
docker compose ps
docker compose logs --tail=100 gateway

# Redis
docker compose exec -T redis redis-cli --scan --pattern 'products-*'
docker compose exec -T redis redis-cli HGETALL 'cart:user@example.com'

# Tests
./gradlew :gateway:test
./gradlew :services:product-service:test
./gradlew :services:cart-service:test
```

Repository: `https://github.com/lehuutra/ecommerce-microservices`
