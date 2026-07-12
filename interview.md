Nếu mình là **Senior Engineer** phỏng vấn vị trí **FullStack Developer** với main skill:

* Backend: **Java Spring Boot**
* Database: **MySQL/PostgreSQL**
* Frontend: **ReactJS / NextJS**
* Architecture: **Microservice knowledge**

thì mình sẽ chia câu hỏi theo nhiều vòng/nhiều nhóm như sau.

---

# 1. [BASIC] Câu hỏi tổng quan / kinh nghiệm thực tế

Mục tiêu: xem ứng viên có thật sự từng làm project thực tế không.

## Câu hỏi

1. Bạn hãy giới thiệu ngắn gọn về project gần nhất bạn làm.
2. Trong project đó bạn phụ trách phần nào?
3. Backend bạn dùng Spring Boot như thế nào?
4. Frontend bạn dùng ReactJS hay NextJS? Vì sao chọn công nghệ đó?
5. Database project dùng MySQL hay PostgreSQL? Bạn đã từng optimize query chưa?
6. Project của bạn là monolith hay microservice?
7. Bạn đã từng deploy ứng dụng lên môi trường dev/staging/production chưa?
8. Khi production bị lỗi, bạn thường debug như thế nào?
9. Bạn đã từng làm việc với Docker, CI/CD, cloud chưa?
10. Bạn thấy phần khó nhất trong project cũ là gì? Bạn đã xử lý ra sao?

## Câu hỏi follow-up hay

* Nếu bạn nói "tôi làm API", API đó cụ thể làm gì?
* Flow request từ UI đến database đi qua những layer nào?
* Bạn tự design hay làm theo design có sẵn?
* Bạn đã từng refactor code chưa? Vì sao cần refactor?

---

# 2. [BASIC] Java Core

Mục tiêu: kiểm tra nền tảng Java.

## Câu hỏi cơ bản

1. OOP là gì? 4 tính chất chính là gì?
2. `interface` và `abstract class` khác nhau thế nào?
3. `==` và `.equals()` khác nhau thế nào?
4. `String`, `StringBuilder`, `StringBuffer` khác nhau thế nào?
5. `final`, `finally`, `finalize` khác nhau thế nào?
6. `ArrayList` và `LinkedList` khác nhau thế nào?
7. `HashMap` hoạt động như thế nào?
8. `HashMap` và `ConcurrentHashMap` khác nhau thế nào?
9. Exception checked và unchecked khác nhau thế nào?
10. Java pass by value hay pass by reference?

## Câu hỏi middle level

1. Vì sao object dùng trong `HashMap` nên override cả `equals()` và `hashCode()`?
2. Nếu 2 object có cùng `hashCode()` thì chuyện gì xảy ra?
3. `Optional` dùng để làm gì? Có nên lạm dụng không?
4. Stream API khác gì vòng lặp `for` thông thường?
5. `map()` và `flatMap()` khác nhau thế nào?
6. Lambda expression dùng khi nào?
7. Functional interface là gì?
8. Garbage Collection hoạt động cơ bản như thế nào?
9. Memory leak trong Java có xảy ra không? Ví dụ?
10. Bạn đã từng xử lý multi-thread chưa?

## Câu hỏi coding nhỏ

Ví dụ:

```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6);
```

Hỏi:

* Lọc số chẵn
* Tính tổng
* Tìm số lớn nhất
* Group danh sách user theo department
* Loại bỏ duplicate trong list

---

# 3. [BASIC] Spring Boot

Mục tiêu: kiểm tra hiểu biết backend framework.

## Câu hỏi cơ bản

1. Spring Boot là gì?
2. Spring Boot khác Spring Framework truyền thống như thế nào?
3. `@SpringBootApplication` gồm những annotation nào bên trong?
4. `@Component`, `@Service`, `@Repository`, `@Controller` khác nhau thế nào?
5. `@RestController` và `@Controller` khác nhau thế nào?
6. Dependency Injection là gì?
7. Bean là gì?
8. Bean lifecycle trong Spring như thế nào?
9. `@Autowired` hoạt động như thế nào?
10. Constructor injection và field injection khác nhau thế nào?

## Câu hỏi về Controller / Service / Repository

1. Vì sao nên chia Controller, Service, Repository?
2. Controller có nên xử lý business logic không?
3. Service interface và ServiceImpl dùng để làm gì?
4. Repository trong Spring Data JPA hoạt động như thế nào?
5. `JpaRepository` và `CrudRepository` khác nhau thế nào?
6. DTO và Entity khác nhau thế nào?
7. Vì sao không nên return trực tiếp Entity ra API?
8. Mapper dùng để làm gì?
9. Bạn đã dùng MapStruct hoặc ModelMapper chưa?
10. Bạn tổ chức package structure trong Spring Boot như thế nào?

## Câu hỏi về REST API

1. RESTful API là gì?
2. HTTP method GET, POST, PUT, PATCH, DELETE khác nhau thế nào?
3. PUT và PATCH khác nhau thế nào?
4. HTTP status code 200, 201, 400, 401, 403, 404, 500 là gì?
5. Bạn design API create/update/delete như thế nào?
6. Pagination API nên thiết kế thế nào?
7. Sorting và filtering API nên thiết kế thế nào?
8. API response format nên thống nhất như thế nào?
9. Global exception handler là gì?
10. `@ControllerAdvice` dùng để làm gì?

## Câu hỏi về validation

1. `@Valid` và `@Validated` khác nhau thế nào?
2. Các annotation như `@NotNull`, `@NotBlank`, `@Size`, `@Email` dùng khi nào?
3. Validate request ở Controller hay Service?
4. Custom validation annotation làm như thế nào?
5. Nếu validation fail thì nên trả response gì?

---

# 4. [BASIC] Spring Security / Authentication

Mục tiêu: kiểm tra khả năng làm login, phân quyền.

## Câu hỏi

1. Authentication và Authorization khác nhau thế nào?
2. JWT là gì?
3. Access token và refresh token khác nhau thế nào?
4. JWT gồm những phần nào?
5. JWT được validate như thế nào?
6. Password nên lưu trong database như thế nào?
7. BCrypt là gì?
8. Role-based access control là gì?
9. `401 Unauthorized` và `403 Forbidden` khác nhau thế nào?
10. Bạn đã từng implement login/logout chưa?

## Câu hỏi follow-up

1. Nếu access token hết hạn thì xử lý thế nào?
2. Refresh token nên lưu ở đâu?
3. Làm sao để logout khi dùng JWT?
4. Làm sao để revoke token?
5. Nếu user đổi password thì token cũ có còn hợp lệ không?
6. CORS là gì?
7. CSRF là gì?
8. API public và API protected cấu hình thế nào?
9. Bạn đã từng dùng OAuth2 chưa?
10. Bạn đã từng tích hợp login Google/Microsoft chưa?

---

# 5. [BASIC] JPA / Hibernate

Mục tiêu: kiểm tra khả năng làm việc với database qua ORM.

## Câu hỏi cơ bản

1. JPA là gì?
2. Hibernate là gì?
3. Entity là gì?
4. `@Entity`, `@Table`, `@Id`, `@GeneratedValue` dùng để làm gì?
5. `@Column` dùng để làm gì?
6. `@OneToMany`, `@ManyToOne`, `@OneToOne`, `@ManyToMany` là gì?
7. Lazy loading và eager loading khác nhau thế nào?
8. N+1 query problem là gì?
9. Làm sao để fix N+1 query?
10. Transaction là gì?

## Câu hỏi middle level

1. `@Transactional` hoạt động như thế nào?
2. Nếu method trong cùng class gọi nhau thì `@Transactional` có hoạt động không?
3. Dirty checking là gì?
4. Persistence context là gì?
5. Entity lifecycle gồm những trạng thái nào?
6. JPQL và native query khác nhau thế nào?
7. Khi nào dùng native query?
8. Optimistic lock và pessimistic lock khác nhau thế nào?
9. `CascadeType` dùng để làm gì?
10. `orphanRemoval` là gì?

---

# 6. [BASIC] MySQL / PostgreSQL

Mục tiêu: kiểm tra nền tảng database và khả năng optimize.

## Câu hỏi cơ bản

1. Primary key là gì?
2. Foreign key là gì?
3. Unique key là gì?
4. Index là gì?
5. Vì sao index giúp query nhanh hơn?
6. Khi nào index lại làm chậm hệ thống?
7. `INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN` khác nhau thế nào?
8. `WHERE` và `HAVING` khác nhau thế nào?
9. `GROUP BY` dùng để làm gì?
10. Transaction trong database là gì?

## Câu hỏi nâng hơn

1. ACID là gì?
2. Isolation level là gì?
3. Dirty read, non-repeatable read, phantom read là gì?
4. Deadlock là gì?
5. Làm sao phát hiện query chậm?
6. `EXPLAIN` dùng để làm gì?
7. Composite index là gì?
8. Thứ tự column trong composite index có quan trọng không?
9. MySQL và PostgreSQL khác nhau ở điểm nào?
10. Bạn đã từng optimize query nào chưa? Kể chi tiết.

## Câu hỏi thực tế

Giả sử có bảng:

```sql
orders(id, user_id, status, created_at, total_amount)
```

Hỏi:

1. Lấy danh sách order theo user mới nhất.
2. Tính tổng tiền order theo từng user.
3. Tìm user có tổng order lớn nhất.
4. Nếu query theo `user_id` và `created_at` chậm thì tạo index như thế nào?
5. Nếu bảng có 50 triệu record thì bạn xử lý performance ra sao?

---

# 7. [BASIC] ReactJS

Mục tiêu: kiểm tra frontend foundation.

## Câu hỏi cơ bản

1. ReactJS là gì?
2. Component là gì?
3. Functional component và class component khác nhau thế nào?
4. Props và state khác nhau thế nào?
5. `useState` dùng để làm gì?
6. `useEffect` dùng để làm gì?
7. Dependency array trong `useEffect` có ý nghĩa gì?
8. Controlled component và uncontrolled component khác nhau thế nào?
9. React re-render khi nào?
10. Key trong list dùng để làm gì?

## Câu hỏi middle level

1. `useMemo` và `useCallback` khác nhau thế nào?
2. Khi nào cần dùng `React.memo`?
3. Context API dùng để làm gì?
4. Context API có thay thế Redux được không?
5. Redux/Zustand dùng khi nào?
6. Custom hook là gì?
7. Làm sao để tránh call API nhiều lần không cần thiết?
8. Làm sao handle loading/error/empty state?
9. Form validation trong React xử lý thế nào?
10. Bạn đã dùng React Hook Form/Formik chưa?

## Câu hỏi practical

1. Khi vào màn hình detail, bạn gọi API ở đâu?
2. Nếu API chậm, UI nên xử lý thế nào?
3. Nếu user double click submit button thì xử lý thế nào?
4. Nếu form có nhiều field dynamic thì bạn làm thế nào?
5. Nếu component quá lớn thì bạn refactor như thế nào?

---

# 8. [BASIC] NextJS

Mục tiêu: kiểm tra khả năng làm fullstack/frontend hiện đại.

## Câu hỏi

1. NextJS là gì?
2. NextJS khác ReactJS thường như thế nào?
3. SSR là gì?
4. SSG là gì?
5. CSR là gì?
6. ISR là gì?
7. Khi nào dùng SSR, khi nào dùng SSG?
8. Routing trong NextJS hoạt động như thế nào?
9. App Router và Pages Router khác nhau thế nào?
10. API route trong NextJS dùng để làm gì?

## Câu hỏi thực tế

1. Nếu một page cần SEO tốt thì bạn render kiểu gì?
2. Nếu page là dashboard private thì dùng SSR hay CSR?
3. Nếu dữ liệu thay đổi mỗi 5 phút thì nên dùng approach nào?
4. Bạn handle authentication trong NextJS thế nào?
5. Middleware trong NextJS dùng để làm gì?
6. Server Component và Client Component khác nhau thế nào?
7. Khi nào cần `"use client"`?
8. Làm sao optimize image trong NextJS?
9. Làm sao handle environment variables?
10. Làm sao deploy NextJS app?

---

# 9. [BASIC] API Integration giữa Frontend và Backend

Mục tiêu: kiểm tra tư duy fullstack thật sự.

## Câu hỏi

1. Frontend gọi API backend như thế nào?
2. Bạn dùng Axios hay Fetch? Vì sao?
3. Interceptor dùng để làm gì?
4. Nếu API trả 401 thì frontend xử lý thế nào?
5. Nếu API trả validation error thì hiển thị ra sao?
6. Làm sao tránh duplicate request?
7. Làm sao cancel request khi user rời page?
8. Làm sao handle global loading?
9. Làm sao handle refresh token ở frontend?
10. CORS error là gì và xử lý thế nào?

## Câu hỏi tình huống

Giả sử user click vào một record, frontend cần gọi 3 API:

* Get manual information
* Get approval result information
* Get attachment information

Hỏi:

1. Bạn gọi 3 API song song hay tuần tự?
2. Nếu 1 API fail thì UI xử lý thế nào?
3. Có nên gom thành 1 API backend không?
4. Khi nào nên tách API, khi nào nên aggregate API?
5. Loading state nên hiển thị như thế nào?

---

# 10. [BASIC] Microservice

Mục tiêu: xem ứng viên hiểu concept hay chỉ nghe qua.

## Câu hỏi cơ bản

1. Microservice là gì?
2. Monolith và microservice khác nhau thế nào?
3. Ưu điểm của microservice là gì?
4. Nhược điểm của microservice là gì?
5. Khi nào không nên dùng microservice?
6. Mỗi service có nên dùng database riêng không?
7. Service giao tiếp với nhau bằng cách nào?
8. Synchronous communication và asynchronous communication khác nhau thế nào?
9. REST và message queue khác nhau thế nào?
10. API Gateway dùng để làm gì?

## Câu hỏi middle level

1. Service discovery là gì?
2. Config server là gì?
3. Circuit breaker là gì?
4. Retry mechanism là gì?
5. Timeout quan trọng như thế nào?
6. Distributed transaction khó ở điểm nào?
7. Saga pattern là gì?
8. Eventual consistency là gì?
9. Idempotency là gì?
10. Làm sao trace request qua nhiều service?

## Câu hỏi thực tế

Giả sử hệ thống có:

* User Service
* Order Service
* Payment Service
* Notification Service

Khi user đặt hàng:

1. Flow xử lý sẽ như thế nào?
2. Nếu Payment fail thì Order xử lý ra sao?
3. Nếu Notification fail thì có rollback Order không?
4. Bạn dùng synchronous hay async?
5. Bạn đảm bảo data consistency thế nào?
6. Bạn log và trace request ra sao?
7. Bạn xử lý duplicate event thế nào?
8. Nếu một service down thì hệ thống xử lý thế nào?

---

# 11. [INTERMEDIATE] Message Queue / Event-Driven Architecture

Mục tiêu: kiểm tra hiểu biết về async communication & event streaming.

## Câu hỏi cơ bản

1. Message queue là gì?
2. Kafka là gì?
3. RabbitMQ là gì?
4. Kafka khác RabbitMQ thế nào?
5. Topic, partition trong Kafka là gì?
6. Producer, consumer, broker trong Kafka là gì?
7. Consumer group dùng để làm gì?
8. Offset trong Kafka là gì?
9. Message acknowledgment là gì?
10. At-least-once vs exactly-once delivery?

## Câu hỏi intermediate

1. Partition trong Kafka hoạt động như thế nào?
2. Làm sao Kafka đảm bảo message ordering?
3. Replication factor có ý nghĩa gì?
4. Leader và follower trong Kafka?
5. Consumer lag là gì?
6. Làm sao monitor consumer lag?
7. Retry mechanism trong message queue?
8. Dead letter queue (DLQ) là gì?
9. Message batching dùng để làm gì?
10. Compression algorithm (snappy, lz4, gzip)?

## Câu hỏi advanced

1. Exactly-once semantics implement như thế nào?
2. Idempotent producer là gì?
3. Transactional message trong Kafka?
4. Schema evolution trong message queue?
5. Poison pill message xử lý thế nào?
6. Message deduplication strategy?
7. Kafka cluster setup & failover?
8. Performance tuning Kafka?
9. Khi nào dùng Kafka, khi nào dùng RabbitMQ?
10. Event sourcing pattern là gì?

---

# 12. [INTERMEDIATE] Logging, Monitoring & Observability

Mục tiêu: kiểm tra khả năng debug production issues.

## Câu hỏi cơ bản

1. Logging là gì?
2. Log level (DEBUG, INFO, WARN, ERROR) là gì?
3. SLF4J là gì?
4. Logback là gì?
5. Logging configuration file (logback.xml)?
6. Appender trong logging là gì?
7. Pattern layout trong logging?
8. Monitoring là gì?
9. Metric là gì?
10. Alert là gì?

## Câu hỏi intermediate

1. Structured logging vs plain text logging?
2. Correlation ID / Trace ID dùng để làm gì?
3. Log aggregation là gì?
4. ELK stack (Elasticsearch, Logstash, Kibana) là gì?
5. Loki + Promtail là gì?
6. Prometheus dùng để làm gì?
7. Time series database là gì?
8. Grafana dùng để làm gì?
9. Health check endpoint thiết kế thế nào?
10. Distributed tracing là gì?

## Câu hỏi advanced

1. Jaeger dùng để làm gì?
2. Zipkin vs Jaeger khác nhau thế nào?
3. Span, trace trong distributed tracing?
4. Baggage trong tracing context?
5. Log sampling strategy (sampling rate)?
6. Metric cardinality explosion là gì?
7. Custom metric implement như thế nào?
8. SLO, SLA, SLI là gì?
9. Alerting rule configuration?
10. On-call rotation & incident management?

---

# 13. [INTERMEDIATE] Caching Patterns & Strategies

Mục tiêu: kiểm tra khả năng optimize performance qua caching.

## Câu hỏi cơ bản

1. Cache là gì?
2. Hit rate vs miss rate?
3. Cache-aside pattern là gì?
4. Write-through pattern là gì?
5. Write-behind pattern là gì?
6. TTL (Time To Live) là gì?
7. Cache invalidation là gì?
8. Warm cache là gì?
9. Cold start problem là gì?
10. Cache penetration là gì?

## Câu hỏi intermediate

1. Cache-aside pattern implement như thế nào?
2. Write-through vs write-behind trade-off?
3. Cache stampede (thundering herd) là gì?
4. Bloom filter dùng để làm gì?
5. Lazy deletion vs proactive deletion?
6. Cache coherence trong distributed system?
7. Consistent hashing trong distributed cache?
8. Cache warming strategy?
9. Eviction policy (LRU, LFU, FIFO)?
10. Partial cache invalidation?

## Câu hỏi advanced

1. Cache-aside implement với retry & fallback?
2. Probabilistic early expiration dùng để làm gì?
3. Two-level cache (local + distributed)?
4. Cache collision resolution?
5. Cache monitoring & optimization?
6. Memory pressure handling?
7. Multi-tier caching architecture?
8. Cache versioning strategy?
9. Distributed cache sync issue?
10. Cache warmer implementation?

---

# 14. [INTERMEDIATE] API Documentation & Versioning

Mục tiêu: kiểm tra khả năng maintain API evolution.

## Câu hỏi cơ bản

1. API documentation là gì?
2. Swagger/OpenAPI là gì?
3. API versioning là gì?
4. URL versioning (/v1/products) là gì?
5. Header versioning (Accept-Version header)?
6. Parameter versioning (api_version query)?
7. Semantic versioning là gì?
8. Backward compatibility là gì?
9. Deprecation là gì?
10. API contract testing là gì?

## Câu hỏi intermediate

1. OpenAPI spec file viết như thế nào?
2. Swagger UI dùng để làm gì?
3. API versioning strategy nên chọn cái nào?
4. Major vs minor version?
5. Deprecation timeline nên bao lâu?
6. Breaking change là gì?
7. Non-breaking change là gì?
8. Client-driven version selection?
9. Server-driven content negotiation?
10. API gateway role trong versioning?

## Câu hỏi advanced

1. Semantic versioning best practice?
2. Gradual API migration strategy?
3. Dual write strategy khi update API?
4. Sunset header implementation?
5. Changelog management?
6. API evolution testing?
7. Consumer-driven contract testing?
8. Version sunsetting process?
9. Legacy API support decision?
10. API versioning metrics & monitoring?

---

# 15. [INTERMEDIATE] Advanced Security

Mục tiêu: kiểm tra khả năng build secure system.

## Câu hỏi cơ bản

1. OAuth2 là gì?
2. Authorization code flow là gì?
3. Client credentials flow là gì?
4. Refresh token rotation là gì?
5. CORS header là gì?
6. CSRF attack là gì?
7. XSS attack là gì?
8. SQL injection là gì?
9. Security headers là gì?
10. SSL/TLS là gì?

## Câu hỏi intermediate

1. OAuth2 vs OAuth1 khác nhau thế nào?
2. SAML vs OAuth2?
3. OpenID Connect là gì?
4. Implicit flow vs authorization code flow?
5. PKCE (Proof Key for Code Exchange) là gì?
6. JWT token trong OAuth2?
7. Scope trong OAuth2 là gì?
8. HSTS header dùng để làm gì?
9. CSP (Content Security Policy) header?
10. X-Frame-Options header?

## Câu hỏi advanced

1. Password hashing strategy (bcrypt vs argon2)?
2. Salt trong password hashing?
3. Pepper trong password storage?
4. MFA (Multi-Factor Authentication) implement?
5. TOTP, SMS, push notification?
6. Secrets management (HashiCorp Vault)?
7. API key rotation strategy?
8. Certificate pinning?
9. OAuth2 security considerations?
10. Common vulnerability (CVE) assessment?

---

# 16. [INTERMEDIATE] Idempotency & Exactly-Once Semantics

Mục tiêu: kiểm tra khả năng handle duplicate requests safely.

## Câu hỏi cơ bản

1. Idempotency là gì?
2. Idempotent request là gì?
3. Exactly-once semantic là gì?
4. At-least-once vs at-most-once?
5. Idempotent key là gì?
6. Deduplication là gì?
7. Request duplication khi nào xảy ra?
8. Retry strategy khi nào cần idempotency?
9. Idempotent operation vs non-idempotent?
10. HTTP method nào là idempotent (GET, PUT, POST)?

## Câu hỏi intermediate

1. Idempotent key generation strategy?
2. Idempotency key header standard?
3. Duplicate detection implement?
4. Request cache (in-memory, Redis)?
5. Idempotent operation design?
6. Race condition trong duplicate handling?
7. Payment processing idempotency?
8. Distributed transaction idempotency?
9. Idempotency timeout (how long keep request record)?
10. Versioning idempotency key?

## Câu hỏi advanced

1. Idempotent Kafka consumer?
2. Exactly-once in distributed transaction?
3. Saga pattern với idempotency?
4. Distributed deduplication strategy?
5. Idempotency key collision handling?
6. Cleanup old idempotency records?
7. Cross-service idempotency?
8. Side effect vs state update idempotency?
9. Compensation transaction idempotency?
10. Monitoring idempotency?

---

# 17. [INTERMEDIATE] CI/CD Pipeline & Git Workflow

Mục tiêu: kiểm tra khả năng deliver code safely & fast.

## Câu hỏi cơ bản

1. CI/CD là gì?
2. Continuous Integration là gì?
3. Continuous Deployment vs Continuous Delivery?
4. Pipeline stage gồm những cái gì?
5. Git branching strategy là gì?
6. Git flow là gì?
7. Trunk-based development là gì?
8. Feature branch là gì?
9. Pull request (PR) / Merge request (MR)?
10. Code review dùng để làm gì?

## Câu hỏi intermediate

1. GitHub Actions, GitLab CI, Jenkins là gì?
2. Build stage gồm những gì?
3. Test stage automation?
4. Deployment stage automation?
5. Blue-green deployment là gì?
6. Canary deployment là gì?
7. Rolling deployment là gì?
8. Smoke test là gì?
9. Automated rollback khi nào?
10. Release management process?

## Câu hỏi advanced

1. Git flow vs trunk-based trade-off?
2. Feature flag/toggles dùng để làm gì?
3. Dark deployment là gì?
4. Shadow traffic testing?
5. Production environment parity?
6. Chaos engineering testing?
7. Performance testing trong pipeline?
8. Security scanning (SAST, DAST)?
9. Artifact management strategy?
10. Deployment frequency metrics?

---

# 18. [INTERMEDIATE] Resilience Patterns & Fault Tolerance

Mục tiêu: kiểm tra khả năng build robust system.

## Câu hỏi cơ bản

1. Resilience là gì?
2. Fault tolerance là gì?
3. Retry là gì?
4. Timeout là gì?
5. Circuit breaker là gì?
6. Fallback là gì?
7. Bulkhead pattern là gì?
8. Graceful degradation là gì?
9. Health check là gì?
10. Liveness & readiness probe?

## Câu hỏi intermediate

1. Exponential backoff vs linear backoff?
2. Jitter dùng để làm gì?
3. Max retry attempt decision?
4. Timeout value setting?
5. Circuit breaker state (closed, open, half-open)?
6. Failure rate threshold?
7. Recovery timeout trong circuit breaker?
8. Bulkhead isolation level?
9. Thread pool isolation vs semaphore isolation?
10. Cascading failure prevention?

## Câu hỏi advanced

1. Resilience4J library dùng?
2. Netflix Hystrix (deprecated)?
3. Service mesh (Istio) resilience?
4. Retry + circuit breaker combination?
5. Adaptive timeout strategy?
6. Load shedding vs backpressure?
7. Downstream service dependency management?
8. Retry budget (limit retry resource)?
9. Observability trong resilience pattern?
10. Testing resilience (chaos monkey)?

---

# 19. [INTERMEDIATE] Database Migration & Versioning

Mục tiêu: kiểm tra khả năng evolve database schema safely.

## Câu hỏi cơ bản

1. Database migration là gì?
2. Flyway là gì?
3. Liquibase là gì?
4. Migration file naming convention?
5. Version số trong migration?
6. Undo migration là gì?
7. Flyway vs Liquibase khác nhau thế nào?
8. Schema versioning là gì?
9. Baseline migration?
10. Migration script validation?

## Câu hỏi intermediate

1. Flyway setup & configuration?
2. SQL vs Java migration?
3. Baseline functionality dùng khi nào?
4. Repeatable migration vs versioned migration?
5. Migration order guarantee?
6. Failed migration recovery?
7. Rollback migration strategy?
8. Migration validation & testing?
9. Zero-downtime migration planning?
10. Data migration vs schema migration?

## Câu hỏi advanced

1. Blue-green database deployment?
2. Dual-write pattern trong schema migration?
3. Backward compatible migration?
4. Large table migration optimization?
5. Migration performance testing?
6. Staged migration strategy?
7. Database drift detection?
8. Multi-database consistency?
9. Revert migration safely?
10. Migration documentation & audit trail?

---

# 20. [INTERMEDIATE] Frontend Performance Optimization

Mục tiêu: kiểm tra khả năng build fast UI.

## Câu hỏi cơ bản

1. Performance metric là gì?
2. FCP (First Contentful Paint)?
3. LCP (Largest Contentful Paint)?
4. FID (First Input Delay)?
5. CLS (Cumulative Layout Shift)?
6. Code splitting là gì?
7. Lazy loading là gì?
8. Image optimization?
9. Bundle size là gì?
10. Tree shaking là gì?

## Câu hỏi intermediate

1. Lighthouse score bao nhiêu là tốt?
2. Critical rendering path?
3. Main thread work minimization?
4. Long task là gì?
5. INP (Interaction to Next Paint)?
6. Static import vs dynamic import?
7. Route-based code splitting?
8. Component lazy loading?
9. Compression (gzip, brotli)?
10. CDN caching strategy?

## Câu hỏi advanced

1. Web Vitals optimization strategy?
2. Streaming HTML (progressive rendering)?
3. Resource hints (preload, prefetch, preconnect)?
4. Service worker caching strategy?
5. PWA (Progressive Web App)?
6. Virtual scrolling cho large list?
7. React profiler dùng để làm gì?
8. Memory leak detection?
9. Bundle analysis tool?
10. Performance budgeting?

---

# 21. [ADVANCED] Docker / Deployment / DevOps basic

Mục tiêu: kiểm tra khả năng chạy app thực tế.

## Câu hỏi

1. Docker là gì?
2. Image và container khác nhau thế nào?
3. Dockerfile dùng để làm gì?
4. Docker Compose dùng để làm gì?
5. Bạn đã từng dockerize Spring Boot app chưa?
6. Bạn đã từng dockerize React/Next app chưa?
7. Environment variable dùng để làm gì?
8. Dev, staging, production khác nhau thế nào?
9. CI/CD là gì?
10. Khi deploy bị lỗi thì bạn debug như thế nào?

## Câu hỏi thực tế

1. Spring Boot app không connect được database trong Docker thì kiểm tra gì?
2. Container restart liên tục thì check gì?
3. Log container xem bằng lệnh nào?
4. Port mapping hoạt động như thế nào?
5. Nếu local chạy được nhưng server lỗi thì bạn debug theo thứ tự nào?

---

# 22. [ADVANCED] System Design nhỏ cho FullStack

Mục tiêu: kiểm tra tư duy thiết kế hệ thống.

## Bài 1: Design màn hình quản lý user

Yêu cầu:

* List user
* Search
* Filter by role/status
* Pagination
* Create user
* Update user
* Delete user
* View detail

Hỏi:

1. Bạn thiết kế database thế nào?
2. Bạn thiết kế API thế nào?
3. Frontend component structure thế nào?
4. Validate dữ liệu ở đâu?
5. Handle loading/error thế nào?
6. Có cần permission không?
7. Có cần audit log không?
8. Có cần soft delete không?
9. Có cần index không?
10. Có cần export Excel không?

---

## Bài 2: Design order management

Yêu cầu:

* User tạo order
* Thanh toán
* Update order status
* Gửi notification
* Admin xem danh sách order

Hỏi:

1. Nếu monolith thì design thế nào?
2. Nếu microservice thì chia service thế nào?
3. Database schema cơ bản?
4. API cơ bản?
5. Transaction xử lý ra sao?
6. Payment fail thì sao?
7. Notification fail thì sao?
8. Làm sao tránh duplicate order?
9. Làm sao optimize query list order?
10. Làm sao log/debug khi production lỗi?

---

# 23. [ADVANCED] Clean Code / Best Practice

Mục tiêu: xem ứng viên có mindset maintainable code không.

## Câu hỏi

1. Clean code theo bạn là gì?
2. SOLID là gì?
3. Bạn hiểu Single Responsibility Principle như thế nào?
4. Vì sao không nên viết business logic trong Controller?
5. Vì sao không nên để function quá dài?
6. Bạn đặt tên biến/function như thế nào?
7. Bạn xử lý duplicate code như thế nào?
8. Bạn review code thường chú ý gì?
9. Unit test có quan trọng không?
10. Bạn đã từng viết test chưa?

## Câu hỏi thực tế

1. Nếu một service method dài 300 dòng thì bạn refactor thế nào?
2. Nếu có nhiều `if else` xử lý theo type thì bạn cải thiện thế nào?
3. Nếu một component React quá lớn thì bạn tách thế nào?
4. Nếu API response format mỗi chỗ một kiểu thì bạn xử lý thế nào?
5. Nếu team có nhiều coding style khác nhau thì làm sao thống nhất?

---

# 24. [ADVANCED] Testing

Mục tiêu: kiểm tra khả năng đảm bảo chất lượng.

## Backend

1. Unit test là gì?
2. Integration test là gì?
3. Mockito dùng để làm gì?
4. `@SpringBootTest` dùng khi nào?
5. Test controller thì dùng gì?
6. Test service thì mock repository như thế nào?
7. Test repository thì dùng database thật hay in-memory?
8. Bạn test exception case như thế nào?
9. Code coverage bao nhiêu là đủ?
10. Có nên test private method không?

## Frontend

1. Bạn đã dùng Jest chưa?
2. React Testing Library dùng để làm gì?
3. Unit test component là gì?
4. Test user interaction như thế nào?
5. Mock API ở frontend như thế nào?
6. Snapshot test là gì?
7. E2E test là gì?
8. Cypress/Playwright dùng để làm gì?
9. Test form validation như thế nào?
10. Test loading/error state như thế nào?

---

# 25. [ADVANCED] Câu hỏi behavioral / teamwork

Mục tiêu: xem ứng viên có phù hợp team không.

## Câu hỏi

1. Khi bạn và teammate disagree về technical solution thì xử lý thế nào?
2. Nếu deadline gấp nhưng code chưa clean thì bạn làm gì?
3. Nếu bạn estimate sai task thì xử lý ra sao?
4. Nếu production có bug nghiêm trọng thì bạn phản ứng thế nào?
5. Bạn nhận feedback code review như thế nào?
6. Bạn đã từng mentor junior chưa?
7. Bạn có chủ động document không?
8. Bạn communicate với BA/QA như thế nào?
9. Khi requirement không rõ thì bạn làm gì?
10. Bạn mong muốn môi trường làm việc như thế nào?

---

# 26. [ADVANCED] Bài test coding/practical nên giao

## Backend task

Yêu cầu làm API quản lý product:

* Create product
* Update product
* Delete product
* Get product detail
* Search product with pagination
* Validate input
* Global exception handler
* MySQL/PostgreSQL
* Unit test cơ bản

### Đánh giá

* Package structure có clean không
* Controller có mỏng không
* Service có xử lý business logic đúng không
* DTO/entity tách rõ không
* Query có pagination không
* Error response có thống nhất không
* Code có dễ đọc không

---

## Frontend task

Yêu cầu làm màn hình Product Management:

* List product
* Search
* Pagination
* Create/Edit modal
* Delete confirm modal
* Form validation
* Loading/error state
* Call API thật hoặc mock API

### Đánh giá

* Component structure
* State management
* Form handling
* API handling
* UX khi loading/error
* Code có reusable không
* Có tránh duplicate code không

---

## Fullstack task

Yêu cầu:

* Backend Spring Boot + PostgreSQL/MySQL
* Frontend React/NextJS
* CRUD Product
* Login simple JWT
* Role Admin/User
* Docker Compose nếu có thể

### Đánh giá cao nếu có

* JWT authentication
* Refresh token
* Docker Compose
* Unit test
* Clear README
* API documentation
* Clean UI
* Error handling tốt

---

# 27. [ADVANCED] Cách chấm điểm ứng viên

Có thể chia như sau:

| Nhóm kỹ năng                | Trọng số |
| --------------------------- | -------: |
| Java Core                   |      15% |
| Spring Boot                 |      20% |
| Database                    |      15% |
| React/NextJS                |      20% |
| Microservice mindset        |      10% |
| API design / fullstack flow |      10% |
| Clean code / testing        |       5% |
| Communication               |       5% |

---

# 28. [ADVANCED] Dấu hiệu ứng viên tốt

Một ứng viên tốt thường sẽ:

* Giải thích được flow end-to-end từ UI → API → Service → DB
* Biết vì sao phải chia layer
* Biết validate cả frontend và backend
* Biết handle error rõ ràng
* Hiểu transaction, index, pagination
* Không chỉ biết code chạy, mà biết code maintain được
* Có kinh nghiệm debug production/log
* Biết khi nào nên dùng microservice, khi nào không
* Có mindset clean code và teamwork tốt

---

# 29. [ADVANCED] Red flags khi phỏng vấn

Nên cẩn thận nếu ứng viên:

* Chỉ nói "em làm API" nhưng không giải thích được flow
* Không phân biệt được Controller/Service/Repository
* Không hiểu transaction
* Không biết index dùng để làm gì
* React chỉ biết copy component, không hiểu state/effect
* Không biết xử lý loading/error
* Nói microservice luôn tốt hơn monolith
* Không biết debug lỗi
* Không từng đọc log
* Không biết explain project mình từng làm

---

# 30. [ADVANCED] Bộ câu hỏi phỏng vấn mẫu trong 60 phút

Nếu chỉ có **60 phút**, mình sẽ hỏi theo flow này:

## 0 - 10 phút: Project experience

1. Giới thiệu project gần nhất.
2. Bạn phụ trách module nào?
3. Flow từ frontend đến backend đến database như thế nào?

## 10 - 25 phút: Backend

1. Controller/Service/Repository khác nhau thế nào?
2. DTO và Entity khác nhau thế nào?
3. `@Transactional` hoạt động thế nào?
4. Lazy/Eager loading là gì?
5. Global exception handler thiết kế thế nào?
6. JWT login flow hoạt động thế nào?

## 25 - 35 phút: Database

1. Index là gì?
2. Khi nào index không hiệu quả?
3. Join và transaction là gì?
4. Bạn optimize query chậm như thế nào?

## 35 - 45 phút: Frontend

1. Props/state khác nhau thế nào?
2. `useEffect` hoạt động thế nào?
3. Làm sao handle loading/error khi gọi API?
4. React re-render khi nào?
5. NextJS SSR/CSR khác nhau thế nào?

## 45 - 55 phút: Microservice/System design

1. Monolith và microservice khác nhau thế nào?
2. Nếu order service gọi payment service fail thì xử lý thế nào?
3. API Gateway dùng để làm gì?
4. Làm sao trace request qua nhiều service?

## 55 - 60 phút: Behavioral

1. Khi production bug thì bạn xử lý thế nào?
2. Khi disagree với teammate thì làm sao?
3. Bạn kỳ vọng gì ở team?

---

# 31. [ADVANCED] Một câu hỏi tổng hợp rất hay

Mình rất thích hỏi câu này:

> Khi user click nút "Submit Order" trên UI, hãy mô tả toàn bộ flow từ React/NextJS đến Spring Boot backend, database, transaction, error handling, response về frontend, và cách UI hiển thị kết quả.

Câu này kiểm tra được gần như toàn bộ:

* Frontend event handling
* API integration
* Backend layer design
* Validation
* Transaction
* Database
* Error handling
* Loading state
* User experience
* Fullstack mindset

Nếu ứng viên trả lời tốt câu này, thường là người có kinh nghiệm thực tế.
