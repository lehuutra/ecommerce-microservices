# Câu Trả Lời Chi Tiết - Backend Foundation

> Các câu trả lời dành cho Sections 1-6 của interview.md
> Level: **[BASIC]**

---

# 1. [BASIC] Câu hỏi tổng quan / kinh nghiệm thực tế

## Câu trả lời

### 1. Bạn hãy giới thiệu ngắn gọn về project gần nhất bạn làm.

**Trả lời tốt:**
"Tôi vừa hoàn thành 1 project e-commerce microservices. Đây là một hệ thống bán hàng trực tuyến được chia thành nhiều service độc lập:
- Product Service: Quản lý catalog sản phẩm, danh mục
- Order Service: Xử lý đơn hàng, thanh toán
- Auth Service: Xác thực người dùng, JWT tokens
- Notification Service: Gửi email, SMS thông báo
- API Gateway: Entry point, rate limiting, JWT verification

Project sử dụng Spring Boot 3.5.14, PostgreSQL, Redis, Kafka, Docker Compose."

**Điều cần tránh:**
- Chỉ nói "làm backend" mà không chi tiết
- Không nói được tên công nghệ/framework
- Không giải thích nghiệp vụ project

---

### 2. Trong project đó bạn phụ trách phần nào?

**Trả lời tốt:**
"Tôi phụ trách:
1. **Backend Architecture**: Thiết kế API Gateway, các service, database schema
2. **Core Services**: Implement Product Service (CRUD, search, cache), Order Service (order flow)
3. **Data Layer**: JPA/Hibernate entities, repository, query optimization
4. **Security**: JWT implementation, role-based access control
5. **Infrastructure**: Docker, docker-compose setup, local development environment
6. **Testing**: Unit test, integration test cho các service"

**Điểm cộng:**
- Liệt kê rõ từng phần
- Có evidence về từng kỹ năng

---

### 3. Backend bạn dùng Spring Boot như thế nào?

**Trả lời tốt:**
"Spring Boot là framework chính cho tất cả service:
1. **Dependency Injection**: `@Service`, `@Repository`, `@Component` cho tổ chức code
2. **REST API**: `@RestController`, `@RequestMapping` để expose endpoint
3. **Data Layer**: Spring Data JPA với `JpaRepository`, `@Entity`, transaction management
4. **Configuration**: `@Configuration`, `@EnableCaching`, `@EnableTransactionManagement`
5. **Validation**: `@Valid`, custom validators cho request validation
6. **Exception Handling**: `@ControllerAdvice` để handle error globally
7. **Security**: Spring Security + JWT filters
8. **Caching**: `@Cacheable`, `@CacheEvict` với Redis backend"

**Trái chiều:**
"Spring Boot là framework để chạy app, cài lệnh `java -jar`..." (quá chung chung)

---

### 4. Frontend bạn dùng ReactJS hay NextJS? Vì sao chọn công nghệ đó?

**Trả lời tốt:**
"Project tôi có frontend là NextJS 14. Tôi chọn NextJS thay vì ReactJS thuần vì:
1. **SSR Support**: Một số page cần SEO tốt (product listing) nên cần server-side rendering
2. **API Routes**: Next API route giúp có backend nhẹ, tránh CORS issues khi gọi API
3. **File-based Routing**: Tự động routing theo folder structure, không cần cấu hình
4. **Performance**: Built-in image optimization, code splitting
5. **Type Safety**: Full TypeScript support out-of-box
6. **Deployment**: Vercel deployment rất đơn giản

Các page như public product page dùng SSR, còn dashboard admin là CSR."

---

### 5. Database project dùng MySQL hay PostgreSQL? Bạn đã từng optimize query chưa?

**Trả lời tốt:**
"Project dùng PostgreSQL 16 vì nó stable, support JSON type, và có advanced features.

**Query Optimization tôi từng làm:**
1. **Index**: Tạo composite index trên `orders(user_id, created_at)` để query danh sách order nhanh hơn
2. **JOIN optimization**: Thay vì N+1 query khi lấy order + user info, dùng JPA `@EntityGraph` hoặc `JOIN FETCH`
3. **Lazy Loading vs Eager**: Chuyển từ eager loading mặc định thành lazy loading để tránh load quá nhiều data
4. **Query Analysis**: Dùng `EXPLAIN ANALYZE` để xem plan execution, thấy được bottleneck
5. **Pagination**: Implement proper pagination với `LIMIT`, `OFFSET` thay vì load toàn bộ
6. **Caching**: Dùng Redis cache cho những query hay được lặp lại"

**Ví dụ cụ thể:**
"Query lấy danh sách product với category filter + search. Ban đầu chậm vì full-text search trên name field.
Tôi:
- Tạo index trên category_id
- Tạo text index trên name field
- Kết quả: Từ 2s xuống 50ms"

---

### 6. Project của bạn là monolith hay microservice?

**Trả lời tốt:**
"Project là **microservice** architecture. Lý do:
1. **Scalability**: Mỗi service scale độc lập. VD: Peak season tăng traffic order service mà không cần tăng product service
2. **Development**: Mỗi team develop service riêng, không block nhau
3. **Technology Freedom**: Order service dùng Kafka, product service dùng Redis cache - không bắt buộc thống nhất
4. **Resilience**: Nếu Notification Service down, user vẫn có thể order

**Trade-off:**
- Phức tạp hơn về deployment, monitoring
- Distributed transaction khó (phải dùng Saga pattern)
- Network latency giữa service"

---

### 7. Bạn đã từng deploy ứng dụng lên môi trường dev/staging/production chưa?

**Trả lời tốt:**
"Có. Project tôi có 3 môi trường:

1. **Local Dev**: Chạy docker-compose locally, mỗi service có container riêng
2. **Staging**: Deploy lên server staging, test thực tế trước khi lên production
3. **Production**: Deploy lên cloud (AWS EC2/ECS)

**Deployment Process:**
- Code push to GitHub
- GitHub Actions trigger pipeline: build, test, create Docker image, push to registry
- Deploy image lên production qua container orchestration (Docker Compose / Kubernetes)"

---

### 8. Khi production bị lỗi, bạn thường debug như thế nào?

**Trả lời tốt:**
"**Debug step:**
1. **Check logs**:
   - Xem application logs (tìm stack trace)
   - Xem system logs, server resources (CPU, memory, disk)

2. **Monitoring tools**:
   - Dùng Prometheus + Grafana để xem metrics (requests/sec, latency, error rate)
   - Dùng distributed tracing (Jaeger) để trace request qua các service

3. **Database**:
   - Kiểm tra slow query log
   - Dùng `EXPLAIN` để xem query plan

4. **Network/Connectivity**:
   - Ping các service khác từ service có lỗi
   - Kiểm tra DNS resolution

5. **Reproduction**:
   - Tạo staging environment giống production
   - Reproduce issue
   - Fix and test

6. **Recovery**:
   - Blue-green deployment / rolling restart nếu là temporary issue
   - Rollback if needed

**Ví dụ thực tế:**
'Order processing chậm hơn bình thường. Tôi check:
- Logs: thấy timeout calling Payment Service
- Check Payment Service: CPU spike 90% do N+1 query
- Fix: Thêm `@EntityGraph` để eager load data
- Result: Latency từ 5s xuống 200ms'"

---

### 9. Bạn đã từng làm việc với Docker, CI/CD, cloud chưa?

**Trả lời tốt:**
"**Docker:**
- Từng dockerize Spring Boot application
- Tạo Dockerfile optimize: multi-stage build để giảm image size
- Dùng docker-compose để orchestrate multiple services locally
- Push images to Docker Hub / ECR

**CI/CD:**
- GitHub Actions: Build → Test → Push image → Deploy
- Jenkins: Từng cấu hình declarative pipeline
- Pipeline stages: build, unit test, integration test, security scan, deploy

**Cloud:**
- AWS: EC2 cho application, RDS cho database, ElastiCache cho Redis
- Environment management qua terraform / CloudFormation
- Auto-scaling groups để handle traffic spike"

---

### 10. Bạn thấy phần khó nhất trong project cũ là gì? Bạn đã xử lý ra sao?

**Trả lời tốt:**
"**Challenge:** Distributed transaction khi user order.
- Order Service cần gọi Payment Service (synchronous) + Notification Service (async)
- Nếu Payment success nhưng Notification fail, cần rollback order?

**Giải pháp:**
Dùng **Saga Pattern** - Orchestration approach:
1. Order Service nhận request
2. Gọi Payment Service (synchronous): nếu fail → reject order
3. Nếu success, publish event `order.created` lên Kafka topic
4. Notification Service consume event và send email
5. Nếu Notification fail, event được retry sau vài phút

**Code snippet:**
```java
@Service
public class OrderService {
  public Order createOrder(CreateOrderRequest request) {
    Order order = new Order(...);
    order = repository.save(order);

    // Synchronous: Payment
    PaymentResult result = paymentClient.charge(order.getId(), order.getAmount());
    if (!result.success) {
      order.setStatus(PAYMENT_FAILED);
      repository.save(order);
      throw new PaymentException(...);
    }

    // Asynchronous: Notification
    kafkaTemplate.send('order.created', new OrderEvent(order.getId()));

    return order;
  }
}
```

**Result:** Decoupled services, robust to failures"

---

## Câu hỏi follow-up hay

### Nếu bạn nói "tôi làm API", API đó cụ thể làm gì?

**Trả lời tốt:**
"API Create Order `/api/v1/orders` [POST] chính xác làm gì:
1. **Input**:
   - user_id (from JWT token)
   - product_id, quantity (from request body)

2. **Validation**:
   - Check user exists (lookup in-memory cache)
   - Check product exists & have enough stock
   - Validate quantity > 0

3. **Processing**:
   - Calculate total price (product price × quantity)
   - Deduct stock from product table
   - Create order record
   - Call Payment Service to charge
   - Publish event to Kafka

4. **Response**:
   - 201 Created + order details
   - Or 400 Bad Request với validation errors
   - Or 402 Payment Required if payment fails"

---

### Flow request từ UI đến database đi qua những layer nào?

**Trả lời tốt:**
"**End-to-end flow:**
```
1. UI (React): onClick → axios.post('/api/orders', {product_id, quantity})

2. API Gateway (Spring Cloud Gateway):
   - RateLimitingFilter: Check rate limit (100 req/60sec per IP)
   - AuthenticationFilter: Verify JWT, inject X-User-Id header

3. Order Service:
   - OrderController: Parse request, call service
   - OrderService: Business logic, validation, orchestration
   - OrderRepository: Query product_service_db
   - PaymentClient: Call Payment Service via Feign

4. Database:
   - PostgreSQL: INSERT into orders table
   - INSERT into order_items table
   - UPDATE product table (deduct stock)

5. Message Queue:
   - Kafka: Publish order.created event

6. Notification Service:
   - Consume event
   - Send email

7. Response back:
   - OrderService return Order object
   - OrderController convert to DTO
   - HTTP 201 back to UI
   - React: setState, show success message
```"

---

### Bạn tự design hay làm theo design có sẵn?

**Trả lời tốt:**
"**Hybrid approach:**
1. **Architecture design** - Tôi contribute:
   - Decide services division (Order, Product, Payment)
   - Database schema per service
   - Communication patterns (REST sync + Kafka async)

2. **Technical decisions** - Follow best practices:
   - Layer structure (Controller → Service → Repository)
   - Error handling strategy
   - Validation approach

3. **Implementation** - Follow company standard:
   - Code style, naming convention
   - Folder structure
   - Security practices (JWT, HTTPS)

Tôi không chỉ follow design mù quáng, mà hiểu vì sao mỗi design decision, có thể argue nếu thấy better approach."

---

### Bạn đã từng refactor code chưa? Vì sao cần refactor?

**Trả lời tốt:**
"**Refactor vì:**

1. **Code Duplication:**
   - Validation logic lặp lại ở 3 service
   - Giải pháp: Extract to shared library `validation-starter`

2. **Long Methods:**
   - OrderService.createOrder() có 150 dòng
   - Giải pháp: Tách thành createOrder(), validateOrder(), processPayment(), publishEvent()

3. **God Class:**
   - ProductService làm CRUD + caching + search + recommendation
   - Giải pháp: Tách thành ProductService, ProductSearchService, ProductCacheService

4. **Poor Naming:**
   - Method được đặt tên 'handle()' không rõ ý
   - Giải pháp: Rename thành 'processOrderPayment()'

5. **Performance:**
   - N+1 query issue
   - Giải pháp: Dùng @EntityGraph, JOIN FETCH

**Benefit:**
- Code dễ test hơn
- Dễ maintain, reuse
- Performance tốt hơn
- Team mới onboard dễ hiểu"

---

---

# 2. [BASIC] Java Core

## Câu trả lời

### 1. OOP là gì? 4 tính chất chính là gì?

**Trả lời tốt:**
"OOP (Object-Oriented Programming) là một paradigm lập trình dựa trên các object và class.

**4 tính chất chính:**

1. **Encapsulation (Đóng gói)**
   - Hide internal implementation, chỉ expose public interface
   - Dùng access modifier: `private`, `protected`, `public`
   ```java
   public class Order {
     private double totalAmount; // Hide implementation

     public void setTotalAmount(double amount) {
       if (amount < 0) throw new IllegalArgumentException();
       this.totalAmount = amount; // Validation in setter
     }

     public double getTotalAmount() {
       return totalAmount;
     }
   }
   ```
   - Benefit: Dễ change internal implementation mà không affect client code

2. **Inheritance (Kế thừa)**
   - Child class kế thừa properties/methods từ parent class
   ```java
   public class Vehicle { }
   public class Car extends Vehicle { } // Car is-a Vehicle
   ```
   - Benefit: Code reuse, create hierarchy

3. **Polymorphism (Đa hình)**
   - Cùng method name nhưng khác implementation
   ```java
   public class Shape {
     public void draw() { }
   }
   public class Circle extends Shape {
     @Override
     public void draw() { System.out.println('Draw circle'); }
   }
   public class Square extends Shape {
     @Override
     public void draw() { System.out.println('Draw square'); }
   }

   // Usage
   List<Shape> shapes = new ArrayList<>();
   shapes.add(new Circle());
   shapes.add(new Square());
   for (Shape s : shapes) {
     s.draw(); // Correct version được gọi
   }
   ```
   - Benefit: Flexible, extensible code

4. **Abstraction (Trừu tượng)**
   - Hide complex logic, show only necessary interface
   ```java
   public abstract class PaymentProcessor {
     public abstract void processPayment(double amount);
   }
   public class CreditCardProcessor extends PaymentProcessor {
     @Override
     public void processPayment(double amount) {
       // Implementation
     }
   }
   ```
   - Benefit: Định nghĩa contract, từng subclass implement khác"

---

### 2. `interface` và `abstract class` khác nhau thế nào?

**Trả lời tốt:**

| Feature | Interface | Abstract Class |
|---------|-----------|-----------------|
| **Method** | Tất cả public abstract (Java 8+ có default) | Mix: abstract + concrete |
| **State** | Không có state (chỉ constants) | Có state (fields) |
| **Constructor** | Không có | Có constructor |
| **Inheritance** | Implement nhiều interface | Extend 1 abstract class |
| **Access** | Tất cả public | public, protected, private |
| **Use case** | Define contract/behavior | Share code + define contract |

**Ví dụ:**
```java
// Interface: Define payment behavior
public interface PaymentProcessor {
  void processPayment(double amount);
  void refund(String transactionId);
}

// Abstract class: Share common code
public abstract class BasePaymentProcessor {
  private Logger logger = LoggerFactory.getLogger(...);

  public void logTransaction(String id) {
    logger.info('Transaction: ' + id); // Shared logic
  }

  public abstract void processPayment(double amount);
}

// Concrete class: Implement both
public class CreditCardProcessor
    extends BasePaymentProcessor
    implements PaymentProcessor {

  @Override
  public void processPayment(double amount) {
    logTransaction('CC-' + System.currentTimeMillis());
    // Implementation
  }
}
```

**Khi nào dùng:**
- Interface: Define contract khi không có shared code
- Abstract class: Share common logic + define contract
- Best practice: Interface for contract, abstract class for shared implementation"

---

### 3. `==` và `.equals()` khác nhau thế nào?

**Trả lời tốt:**
"**`==` (Operator):**
- So sánh **reference** (memory address)
- Dùng cho primitive types cũng được
```java
String s1 = new String('hello');
String s2 = new String('hello');
System.out.println(s1 == s2); // false - khác reference
```

**`.equals()` (Method):**
- So sánh **content/value**
- Phải override trong class nếu muốn custom comparison
```java
String s1 = new String('hello');
String s2 = new String('hello');
System.out.println(s1.equals(s2)); // true - cùng value
```

**Ví dụ thực tế:**
```java
public class Order {
  private Long id;
  private String customerEmail;

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    if (!(o instanceof Order)) return false;

    Order order = (Order) o;
    return Objects.equals(id, order.id) &&
           Objects.equals(customerEmail, order.customerEmail);
  }
}

// Usage
Order order1 = new Order(1L, 'customer@email.com');
Order order2 = new Order(1L, 'customer@email.com');

System.out.println(order1 == order2); // false - khác reference
System.out.println(order1.equals(order2)); // true - cùng id, email
```

**Best practice:**
- Dùng `.equals()` để compare objects
- Dùng `==` để compare references hoặc primitives
- Implement `equals()` kèm theo `hashCode()` (nhất là khi dùng trong Map/Set)"

---

### 4. `String`, `StringBuilder`, `StringBuffer` khác nhau thế nào?

**Trả lời tốt:**

| Feature | String | StringBuilder | StringBuffer |
|---------|--------|---------------|--------------|
| **Immutable** | Yes | No | No |
| **Thread-safe** | Yes | No | Yes (synchronized) |
| **Performance** | Slow (mỗi concat tạo new object) | Fast | Medium (synchronized overhead) |
| **Use case** | Khi string không thay đổi | Single-thread, cần modify | Multi-thread, cần modify |

**Ví dụ:**
```java
// SLOW - tạo 100 object
String result = '';
for (int i = 0; i < 100; i++) {
  result += 'X'; // Tương đương: result = new String(result + 'X')
}

// FAST - reuse buffer
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 100; i++) {
  sb.append('X'); // Modify buffer, không tạo new object
}
String result = sb.toString();
```

**Vì sao String immutable?**
```java
String s1 = 'hello';
String s2 = s1; // s2 reference same object
s1 = s1 + ' world'; // Tạo new object, s1 reference mới
// s2 vẫn là 'hello' - không affected

// Benefit:
// 1. Thread-safe (không cần synchronize)
// 2. Hashmap key: String safe as key vì không thay đổi
// 3. Security: String sensitive data không bị modify ngẫu nhiên
```

**Best practice:**
- Dùng String khi không modify
- Loop string build: dùng StringBuilder (hoặc String.join())
- Multi-thread: dùng StringBuffer"

---

### 5. `final`, `finally`, `finalize` khác nhau thế nào?

**Trả lời tốt:**

| Keyword | Type | Use |
|---------|------|-----|
| **final** | Modifier | Class/Method/Variable không thể thay đổi |
| **finally** | Block | Execute sau try/catch (cleanup code) |
| **finalize** | Method | Garbage collector gọi trước xóa object |

**Ví dụ:**
```java
// final class - không thể extend
public final class ImmutableClass {
  private final String name; // field không thể reassign
  private final List<String> items; // Phải initialize

  public ImmutableClass(String name) {
    this.name = name;
    this.items = new ArrayList<>();
  }

  public final void doSomething() { } // Subclass không override được
}

// finally block
public void readFile() {
  BufferedReader reader = null;
  try {
    reader = new BufferedReader(new FileReader('file.txt'));
    String line = reader.readLine();
    System.out.println(line);
  } catch (IOException e) {
    System.err.println('Error: ' + e);
  } finally {
    if (reader != null) {
      reader.close(); // Always execute
    }
  }
}

// finalize method (deprecated in Java 9+)
public class Resource {
  @Deprecated(forRemoval = true)
  protected void finalize() throws Throwable {
    // Garbage collector call trước xóa object
    cleanup();
  }
}
```

**Best practice:**
- final: Dùng để prevent unintended modification
- finally: Dùng để cleanup (mặc dù try-with-resources tốt hơn)
- finalize: KHÔNG NÊN DÙNG (use try-with-resources hoặc @Cleanup thay)"

---

### 6. `ArrayList` và `LinkedList` khác nhau thế nào?

**Trả lời tốt:**

| Operation | ArrayList | LinkedList |
|-----------|-----------|------------|
| **Get(i)** | O(1) - direct access | O(n) - iterate từ head/tail |
| **Add/Remove(end)** | O(1) amortized | O(1) |
| **Add/Remove(middle)** | O(n) - shift elements | O(n) - find position |
| **Memory** | Dense, no extra pointers | Extra memory for pointers |
| **Iteration** | Fast | Relatively slower |

**Khi nào dùng:**
```java
// ArrayList: Nhiều read, ít modification
List<Product> products = new ArrayList<>();
for (int i = 0; i < products.size(); i++) {
  Product p = products.get(i); // Fast
}

// LinkedList: Thường remove/add from middle
Queue<String> queue = new LinkedList<>();
queue.add('item1'); // Add to tail: O(1)
queue.remove(); // Remove from head: O(1)
```

**Performance example:**
```java
// ArrayList - fast random access
ArrayList<Integer> al = new ArrayList<>();
for (int i = 0; i < 1000000; i++) al.add(i);
long start = System.currentTimeMillis();
for (int i = 0; i < al.size(); i++) {
  int x = al.get(i); // O(1)
}
// Time: ~5ms

// LinkedList - slow random access
LinkedList<Integer> ll = new LinkedList<>(al);
start = System.currentTimeMillis();
for (int i = 0; i < ll.size(); i++) {
  int x = ll.get(i); // O(n)
}
// Time: ~500ms (100x slower!)
```

**Best practice:**
- Default dùng ArrayList (faster, better cache locality)
- LinkedList chỉ khi thật sự cần efficient middle insertion (rare)"

---

### 7. `HashMap` hoạt động như thế nào?

**Trả lời tốt:**
"**HashMap internal structure:**
```
Array of buckets:
[0] -> null
[1] -> Entry(key1, val1) -> Entry(key2, val2) -> null (collision chain)
[2] -> Entry(key3, val3) -> null
...
```

**Put operation:**
```java
map.put('name', 'John');

1. Hash key: hash('name') = 1234567
2. Get bucket index: 1234567 % capacity = 1
3. Check bucket[1]:
   - Empty? Add new Entry
   - Collision? Add to chain (or use tree if too many)
4. If size > threshold: Resize array
```

**Get operation:**
```java
String value = map.get('name');

1. Hash key: hash('name') = 1234567
2. Get bucket index: 1234567 % capacity = 1
3. Iterate chain at bucket[1]:
   - Compare keys (using equals())
   - If match: return value
   - If not: continue chain
```

**Key requirements:**
```java
public class User {
  private Long id;
  private String email;

  @Override
  public int hashCode() {
    // Distributed hash to reduce collisions
    return Objects.hash(id, email);
  }

  @Override
  public boolean equals(Object o) {
    if (!(o instanceof User)) return false;
    User user = (User) o;
    return Objects.equals(id, user.id) &&
           Objects.equals(email, user.email);
  }
}

Map<User, String> map = new HashMap<>();
map.put(new User(1, 'john@email.com'), 'John');
// hashCode() & equals() được gọi để find bucket và compare
```

**Performance:**
- Average: O(1) get/put
- Worst: O(n) nếu quá nhiều collision

**Java 8+ improvement:**
- Bucket dùng tree (Red-Black) khi chain > 8 nodes → O(log n)"

---

### 8. `HashMap` và `ConcurrentHashMap` khác nhau thế nào?

**Trả lời tốt:**

| Feature | HashMap | ConcurrentHashMap |
|---------|---------|-------------------|
| **Thread-safe** | No | Yes |
| **Synchronization** | None | Segment lock (bucket-level) |
| **Performance (single-thread)** | Faster | Slightly slower |
| **Performance (multi-thread)** | Issues (race condition) | Better (less contention) |

**Ví dụ problem với HashMap:**
```java
// WRONG - race condition
Map<String, Integer> map = new HashMap<>();
Thread t1 = new Thread(() -> {
  for (int i = 0; i < 1000; i++) {
    map.put('key', i); // Race condition với t2
  }
});
Thread t2 = new Thread(() -> {
  for (int i = 0; i < 1000; i++) {
    map.put('key', i);
  }
});
// Final size có thể < 1000 (missing updates)
```

**Solution với ConcurrentHashMap:**
```java
Map<String, Integer> map = new ConcurrentHashMap<>();
Thread t1 = new Thread(() -> {
  for (int i = 0; i < 1000; i++) {
    map.put('key' + i, i); // Thread-safe
  }
});
// ConcurrentHashMap: chia thành segments, mỗi segment có lock riêng
// Multiple threads có thể update khác segment đồng thời
```

**Comparison:**
```java
// Khi nào dùng HashMap
Map<String, String> config = new HashMap<>();
// Single-thread initialization, read-only sau

// Khi nào dùng ConcurrentHashMap
Map<String, Session> sessions = new ConcurrentHashMap<>();
// Multiple threads: add/remove/update sessions concurrently
sessions.putIfAbsent(sessionId, newSession); // Atomic operation
```

**Best practice:**
- Single-thread: HashMap
- Multi-thread: ConcurrentHashMap (better than Collections.synchronizedMap)
- ConcurrentHashMap: Preferred over synchronized map vì better performance"

---

### 9. Exception checked và unchecked khác nhau thế nào?

**Trả lời tốt:**

| Type | Exception | Compile | When | Example |
|------|-----------|---------|------|---------|
| **Checked** | extends Exception | Error if not caught | Expected error | IOException, SQLException |
| **Unchecked** | extends RuntimeException | No compile error | Programming error | NullPointerException, IllegalArgumentException |

**Ví dụ:**
```java
// Checked Exception - MUST handle
public void readFile() throws IOException {
  BufferedReader reader = new BufferedReader(new FileReader('file.txt'));
  String line = reader.readLine();
  // Compiler error nếu không throws hoặc try-catch
}

// Unchecked Exception - optional handle
public void processUser(User user) {
  String name = user.getName();
  // NullPointerException nếu user == null
  // Không compile error mặc dù không handle
}

// Checked Exception - explicit handling
public void saveUser(User user) {
  try {
    database.save(user); // throws SQLException (checked)
  } catch (SQLException e) {
    logger.error('DB error', e);
    throw new RuntimeException(e); // Wrap as unchecked
  }
}

// Unchecked Exception - implicit handling
public User getUser(Long id) {
  User user = database.findById(id);
  if (user == null) {
    throw new IllegalArgumentException('User not found: ' + id);
  }
  return user;
}
```

**Best practice:**
- Use checked exception: Recoverable errors (network, I/O)
- Use unchecked exception: Programming errors (null, invalid argument)
- Don't throw generic Exception
- Wrap checked exception as unchecked if caller cannot recover"

---

### 10. Java pass by value hay pass by reference?

**Trả lời tốt:**
"Java là **pass by value**.

**Primitive types:**
```java
public void modify(int x) {
  x = 100; // Modify local copy
}

int value = 5;
modify(value);
System.out.println(value); // 5 - unchanged
```

**Object references:**
```java
public void modify(User user) {
  user.setName('New Name'); // Modify object (reference là same)
  user = new User(); // Reassign reference (local copy)
}

User user = new User('Old Name');
modify(user);
System.out.println(user.getName()); // 'New Name' - changed
// Nhưng 'user' trong main vẫn là object cũ (không là new object)
```

**Key point:**
- Java passes **copy of reference**, not reference itself
- Change object properties → visible outside
- Reassign reference → NOT visible outside

**Detailed example:**
```java
public class RefTest {
  static class Container {
    String value;
  }

  static void modify(Container c) {
    c.value = 'Modified'; // Change object → visible
    c = new Container(); // Reassign → not visible
  }

  public static void main(String[] args) {
    Container c = new Container();
    c.value = 'Original';
    modify(c);
    System.out.println(c.value); // 'Modified' - thay đổi
    // c là object original, không phải new Container
  }
}
```

**Conclusion:**
Java is **pass-by-value** where:
- Primitive values: copy of value
- Object: copy of reference (but reference points to same object)"

---

## Câu hỏi middle level

### 1. Vì sao object dùng trong `HashMap` nên override cả `equals()` và `hashCode()`?

**Trả lời tốt:**
"**HashMap hoạt động:**
```
1. Tính bucket: bucketIndex = hashCode() % capacity
2. So sánh key trong bucket: key1.equals(key2)
```

**Nếu chỉ override `equals()` mà không `hashCode()`:**
```java
public class User {
  private String email;

  @Override
  public boolean equals(Object o) {
    if (!(o instanceof User)) return false;
    return email.equals(((User) o).email);
  }
  // WRONG: không override hashCode()
}

User user1 = new User('john@gmail.com');
User user2 = new User('john@gmail.com');

System.out.println(user1.equals(user2)); // true - OK
System.out.println(user1.hashCode() == user2.hashCode()); // false - PROBLEM

Map<User, String> map = new HashMap<>();
map.put(user1, 'John');
map.get(user2); // KHÔNG FIND vì khác bucket (khác hashCode)
```

**Nếu chỉ override `hashCode()` mà không `equals()`:**
```java
public class User {
  private String email;

  @Override
  public int hashCode() {
    return Objects.hash(email);
  }
  // WRONG: không override equals()
}

User user1 = new User('john@gmail.com');
User user2 = new User('john@gmail.com');

map.put(user1, 'John');
if (map.get(user2) != null) { // Same bucket (same hashCode)
  // Nhưng vẫn so sánh reference bằng == trong bucket
  // Không find vì user1 != user2 (reference)
}
```

**Contract - MUST follow:**
```
If equals() return true
→ hashCode() MUST return same value

If hashCode() return same value
→ equals() có thể true hoặc false (collision)
```

**Correct implementation:**
```java
@Override
public int hashCode() {
  return Objects.hash(id, email); // Distributed hash
}

@Override
public boolean equals(Object o) {
  if (this == o) return true;
  if (!(o instanceof User)) return false;
  User user = (User) o;
  return Objects.equals(id, user.id) &&
         Objects.equals(email, user.email);
}
```

**Best practice:**
- Luôn override cả 2 hoặc cái nào cũng không override
- IDE có thể generate (IntelliJ: Ctrl+Insert → equals() and hashCode())"

---

### 2. Nếu 2 object có cùng `hashCode()` thì chuyện gì xảy ra?

**Trả lời tốt:**
"**Collision xảy ra:**
```
User u1 = new User(1, 'john@gmail.com');
User u2 = new User(2, 'jane@gmail.com');

u1.hashCode() = 12345
u2.hashCode() = 12345 (collision - cùng bucket)

map.put(u1, 'John');
map.put(u2, 'Jane');

Bucket[12345]:
Entry(u1, 'John') -> Entry(u2, 'Jane') -> null (linked list chain)
```

**Get operation:**
```java
String name = map.get(new User(1, 'john@gmail.com'));

1. Hash: 12345 → bucket[12345]
2. Iterate chain:
   - Check Entry(u1, 'John'): equals(u1) → true → return 'John'
```

**Performance impact:**
```java
// GOOD hash function - distributed
Bucket[0]: Entry1
Bucket[1]: Entry2, Entry3 (chain length = 2)
Bucket[2]: Entry4
// Average chain length ~ 1
// O(1) access

// POOR hash function - many collisions
Bucket[0]: Entry1 → Entry2 → Entry3 → Entry4 → ... (long chain)
Bucket[1]: null
Bucket[2]: null
// Average chain length ~ 1000
// O(n) access (effectively like linked list)
```

**Java 8+ optimization:**
```
When chain length > TREEIFY_THRESHOLD (8):
- Convert linked list to Red-Black tree
- Get/Put: O(log n) instead of O(n)
```

**Lesson:**
- Collision normal & acceptable (trade-off between hashCode compute & bucket array size)
- Good hash function: minimize collision, distribute evenly
- Java HashMap handles collision via chaining + tree"

---

### 3. `Optional` dùng để làm gì? Có nên lạm dụng không?

**Trả lời tốt:**
"**Optional:** Wrapper cho value có thể null hoặc không.

**Vì sao cần Optional:**
```java
// OLD style - easy to miss null check
public User getUser(Long id) {
  User user = database.findById(id);
  if (user != null) {
    return user;
  }
  return null; // Easy to forget checking null
}

// NEW style - explicit handling
public Optional<User> getUser(Long id) {
  return database.findById(id); // Return Optional
}

// Caller MUST handle:
Optional<User> userOpt = getUser(1);
if (userOpt.isPresent()) {
  User user = userOpt.get();
}
```

**Useful methods:**
```java
Optional<User> userOpt = getUser(1);

// 1. orElse - provide default
User user = userOpt.orElse(new User('Anonymous'));

// 2. orElseThrow - throw if absent
User user = userOpt.orElseThrow(() -> new UserNotFoundException());

// 3. map - transform if present
Optional<String> name = userOpt.map(User::getName);

// 4. flatMap - transform to another Optional
Optional<Address> address = userOpt
  .flatMap(user -> user.getAddress());

// 5. filter - keep if match condition
Optional<User> adult = userOpt
  .filter(user -> user.getAge() >= 18);

// 6. ifPresent - execute if present
userOpt.ifPresent(user -> System.out.println(user.getName()));
```

**DON'T overuse Optional:**
```java
// WRONG - using Optional for everything
public Optional<String> getName(Optional<User> userOpt) {
  return userOpt
    .map(User::getName)
    .map(String::toUpperCase)
    .filter(n -> n.length() > 3);
}

// BETTER - keep Optional at boundaries
public String getName(User user) {
  if (user == null) {
    return 'Unknown';
  }
  String name = user.getName();
  return (name != null && name.length() > 3) ? name.toUpperCase() : 'Unknown';
}
```

**Best practice:**
- Use Optional: API return type, method parameter boundaries
- Don't use Optional: getter/setter, within business logic
- Don't chain Optional > 3 levels (readability suffers)"

---

### Remaining questions (4-10 in middle level) covered in production implementation patterns...

---

# 3. [BASIC] Spring Boot

## Câu trả lời

### 1. Spring Boot là gì?

**Trả lời tốt:**
"Spring Boot là framework dựa trên Spring Framework, nhưng simplify việc develop Spring applications.

**Key features:**
1. **Auto-configuration**: Tự động cấu hình beans dựa trên classpath dependencies
2. **Embedded servers**: Tomcat/Jetty/Undertow built-in, không cần WAR deployment
3. **Starter dependencies**: Pre-configured dependency sets (spring-boot-starter-web, -data-jpa, etc.)
4. **Production-ready**: Metrics, health check, monitoring built-in

**Ví dụ:**
```java
@SpringBootApplication // Auto-enable @ComponentScan, @Configuration, @EnableAutoConfiguration
public class Application {
  public static void main(String[] args) {
    SpringApplication.run(Application.class, args); // Start embedded Tomcat
  }
}
```

**Benefit:**
- Không cần cấu hình XML complex
- 'Convention over configuration'
- Quickly build production-ready app"

---

### 2. Spring Boot khác Spring Framework truyền thống như thế nào?

**Trả lời tốt:**

| Aspect | Spring Framework | Spring Boot |
|--------|------------------|-------------|
| **Config** | XML hoặc Java config | Auto-configuration + application.properties |
| **Server** | Deploy WAR to Tomcat | Embedded Tomcat |
| **Dependencies** | Manual manage versions | Starter dependencies |
| **Setup** | Complex, many steps | Just run main() |

---

### 3. `@SpringBootApplication` gồm những annotation nào bên trong?

**Trả lời tốt:**
"`@SpringBootApplication` là composite annotation gồm 3 annotation chính:

```java
@SpringBootApplication
// Tương đương:
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan
public class Application {
  public static void main(String[] args) {
    SpringApplication.run(Application.class, args);
  }
}

// Breakdown:
// 1. @SpringBootConfiguration: Marks class as configuration class (thay @Configuration)
// 2. @EnableAutoConfiguration: Enable auto-configuration based on classpath
// 3. @ComponentScan: Scan for @Component, @Service, @Repository, @Controller
```

**Auto-configuration example:**
```properties
# application.properties
spring.datasource.url=jdbc:postgresql://localhost/mydb
spring.jpa.hibernate.ddl-auto=update
```

Lúc app start, Spring Boot tự động:
- Detect PostgreSQL driver trong classpath
- Auto-configure DataSource, JpaRepository
- Không cần viết XML config hay Java @Bean config thủ công"

---

### 4. `@Component`, `@Service`, `@Repository`, `@Controller` khác nhau thế nào?

**Trả lời tốt:**
"Tất cả đều là **stereotype annotations** để mark class cho component scanning. Khác nhau chủ yếu ở **semantic meaning** và vài special handling:

```java
// 1. @Component: Generic component
@Component
public class UtilityClass {
  // General purpose bean
}

// 2. @Service: Business logic layer
@Service
public class OrderService {
  private OrderRepository repository;

  public Order createOrder(CreateOrderRequest req) {
    // Business logic
  }
}

// 3. @Repository: Data access layer (DAO)
@Repository
public class OrderRepository {
  // Database operations
}
// Special: @Repository translates database exceptions to Spring DataAccessException

// 4. @Controller: Web layer (traditional view-based)
@Controller
public class HomeController {
  @GetMapping('/')
  public String home() {
    return 'home'; // View name
  }
}

// 5. @RestController: Web layer (RESTful, JSON response)
@RestController
public class OrderController {
  @GetMapping('/orders/{id}')
  public OrderDto getOrder(@PathVariable Long id) {
    return orderService.getOrder(id); // Returns JSON
  }
}
```

**Hierarchy:**
```
@Component (root)
├── @Service (business logic)
├── @Repository (data access)
├── @Controller (web - view)
└── @RestController (web - REST API)
```

**Best practice:**
- @Service: For business logic
- @Repository: For data access
- @RestController: For API endpoints
- @Component: Only khi không fit vào categories trên"

---

### 5. `@RestController` và `@Controller` khác nhau thế nào?

**Trả lời tốt:**
"**@Controller** - Traditional MVC (returns View):
```java
@Controller
public class ProductController {
  @GetMapping('/products')
  public String listProducts(Model model) {
    List<Product> products = service.getAll();
    model.addAttribute('products', products);
    return 'product-list'; // Return view name (HTML template)
  }
}
// Response: HTML page
```

**@RestController** - RESTful API (returns Data):
```java
@RestController
@RequestMapping('/api')
public class ProductController {
  @GetMapping('/products')
  public List<Product> listProducts() {
    return service.getAll(); // Automatically convert to JSON
  }
}
// Response: JSON array
```

**Difference:**
- @Controller: Kết hợp @Component + @RequestMapping
  - Return value: view name (String)
  - Need @ResponseBody nếu muốn return JSON

- @RestController: Kết hợp @Controller + @ResponseBody
  - Return value: automatically serialized to JSON/XML
  - Không cần @ResponseBody annotation

**Equivalent:**
```java
// Cách 1
@Controller
@ResponseBody
public class ProductController { }

// Cách 2 (concise)
@RestController
public class ProductController { }
```"

---

### 6. Dependency Injection là gì?

**Trả lời tốt:**
"Dependency Injection (DI) là design pattern: **Provide dependencies từ outside, không create bên trong class**.

**Without DI (Tightly coupled):**
```java
public class OrderService {
  private OrderRepository repo = new OrderRepository();

  public void createOrder(Order order) {
    repo.save(order);
  }
}
// Problem: OrderService tightly coupled with OrderRepository implementation
// Khó test (không thể mock repository)
```

**With DI (Loosely coupled):**
```java
public class OrderService {
  private OrderRepository repo;

  // Dependency injected via constructor
  public OrderService(OrderRepository repo) {
    this.repo = repo;
  }

  public void createOrder(Order order) {
    repo.save(order);
  }
}

// Usage:
OrderRepository repo = new OrderRepository();
OrderService service = new OrderService(repo); // Inject dependency

// Test:
OrderRepository mockRepo = mock(OrderRepository.class);
OrderService service = new OrderService(mockRepo); // Inject mock
```

**Spring handles DI:**
```java
@Service
public class OrderService {
  private OrderRepository repo;

  @Autowired
  public OrderService(OrderRepository repo) {
    this.repo = repo; // Spring auto-injects
  }
}

// Or field injection:
@Service
public class OrderService {
  @Autowired
  private OrderRepository repo; // Spring injects
}

// Or setter injection:
@Service
public class OrderService {
  private OrderRepository repo;

  @Autowired
  public void setRepository(OrderRepository repo) {
    this.repo = repo;
  }
}
```

**Benefits:**
- Loose coupling
- Easy testing (mock dependencies)
- Easy to swap implementations
- Centralized configuration"

---

### 7. Bean là gì?

**Trả lời tốt:**
"Bean là một object được quản lý bởi Spring container.

**Creating Bean:**
```java
// Method 1: Annotation
@Component
public class OrderService {
  // Spring creates instance, manage lifecycle
}

// Method 2: Java Configuration
@Configuration
public class AppConfig {
  @Bean
  public OrderService orderService() {
    return new OrderService();
  }
}

// Method 3: XML Configuration (old style)
<bean id='orderService' class='com.example.OrderService' />
```

**Spring Container manages:**
```java
public class Main {
  public static void main(String[] args) {
    ApplicationContext context = SpringApplication.run(Application.class, args);

    // Get bean từ container
    OrderService service = context.getBean(OrderService.class);
    service.createOrder(...);
  }
}
```

**Bean Scope:**
```java
// 1. Singleton (default): One instance per app
@Component // default scope
public class OrderService { }

// 2. Prototype: New instance every time
@Component
@Scope('prototype')
public class ShoppingCart { }

// 3. Request: New instance per HTTP request (web app)
@Component
@Scope('request')
public class RequestContext { }

// 4. Session: One instance per HTTP session
@Component
@Scope('session')
public class UserSession { }
```"

---

### 8. Bean lifecycle trong Spring như thế nào?

**Trả lời tốt:**
"**Bean lifecycle stages:**

```
1. Instantiation
   ↓
2. Property Population (Setter injection)
   ↓
3. BeanName/BeanFactory Aware (if implements *Aware interfaces)
   ↓
4. @PostConstruct / afterPropertiesSet()
   ↓
5. READY TO USE (Bean in container, ready for application)
   ↓
6. @PreDestroy / destroy()
   ↓
7. Destroyed (removed from container)
```

**Example:**
```java
public class OrderService implements InitializingBean, DisposableBean {
  private OrderRepository repo;

  @Autowired
  public OrderService(OrderRepository repo) {
    System.out.println('1. Constructor called');
    this.repo = repo;
  }

  @PostConstruct
  public void init() {
    System.out.println('2. @PostConstruct - initialize resources');
    // Initialize connections, caches, etc.
  }

  @Override
  public void afterPropertiesSet() {
    System.out.println('3. afterPropertiesSet - InitializingBean');
  }

  public void createOrder(Order order) {
    System.out.println('4. Using bean - createOrder');
  }

  @PreDestroy
  public void cleanup() {
    System.out.println('5. @PreDestroy - cleanup resources');
  }

  @Override
  public void destroy() {
    System.out.println('6. destroy() - DisposableBean');
  }
}

// Output:
// 1. Constructor called
// 2. @PostConstruct - initialize resources
// 3. afterPropertiesSet - InitializingBean
// 4. Using bean - createOrder (when called)
// 5. @PreDestroy - cleanup resources
// 6. destroy() - DisposableBean (when context closes)
```

**Best practice:**
- Use @PostConstruct for initialization
- Use @PreDestroy for cleanup
- Don't use InitializingBean/DisposableBean (older approach)"

---

### 9. `@Autowired` hoạt động như thế nào?

**Trả lời tốt:**
"@Autowired: Spring auto-wire bean dependency.

**How it works:**
```
1. Scan component with @Autowired
2. Look for matching bean in container:
   a. By type (default)
   b. By name (if @Qualifier specified)
3. Inject bean
```

**Injection types:**
```java
// 1. Constructor injection (recommended)
@Service
public class OrderService {
  private OrderRepository repo;

  @Autowired
  public OrderService(OrderRepository repo) {
    this.repo = repo;
  }
}

// 2. Setter injection
@Service
public class OrderService {
  private OrderRepository repo;

  @Autowired
  public void setRepository(OrderRepository repo) {
    this.repo = repo;
  }
}

// 3. Field injection (not recommended)
@Service
public class OrderService {
  @Autowired
  private OrderRepository repo; // Direct field injection
}
```

**Handling multiple beans:**
```java
// Interface
public interface PaymentProcessor {
  void process();
}

// Two implementations
@Component
public class CreditCardProcessor implements PaymentProcessor {
  @Override
  public void process() { }
}

@Component
public class PayPalProcessor implements PaymentProcessor {
  @Override
  public void process() { }
}

// Usage - specify which one
@Service
public class OrderService {
  @Autowired
  @Qualifier('creditCardProcessor') // Specify which bean
  private PaymentProcessor processor;
}

// Or using @Primary
@Component
@Primary
public class CreditCardProcessor implements PaymentProcessor { }

@Service
public class OrderService {
  @Autowired
  private PaymentProcessor processor; // Auto-select @Primary
}
```

**Optional dependency:**
```java
@Service
public class OrderService {
  @Autowired(required = false) // Don't fail if not found
  private Logger logger;
}

// Or using Optional
@Service
public class OrderService {
  @Autowired
  private Optional<Logger> logger;

  public void doSomething() {
    logger.ifPresent(l -> l.info('...'));
  }
}
```"

---

### 10. Constructor injection và field injection khác nhau thế nào?

**Trả lời tốt:**

| Aspect | Constructor Injection | Field Injection |
|--------|----------------------|-----------------|
| **Immutability** | Field có thể final | Field không final |
| **Test** | Easy: new Service(mockDep) | Hard: need Spring context |
| **Dependency clarity** | Clear parameters | Hidden |
| **Circular dependency** | Caught at startup | Runtime error |
| **Performance** | Slightly faster | Slower (reflection) |

**Example:**
```java
// GOOD: Constructor injection
@Service
public class OrderService {
  private final OrderRepository repo; // Can be final
  private final PaymentClient payment;

  @Autowired
  public OrderService(OrderRepository repo, PaymentClient payment) {
    this.repo = repo;
    this.payment = payment;
  }

  public void createOrder(Order order) {
    repo.save(order);
    payment.charge(order.getAmount());
  }
}

// Testing
@Test
public void testCreateOrder() {
  OrderRepository mockRepo = mock(OrderRepository.class);
  PaymentClient mockPayment = mock(PaymentClient.class);

  OrderService service = new OrderService(mockRepo, mockPayment);
  service.createOrder(new Order());

  verify(mockRepo).save(any(Order.class));
}

// BAD: Field injection
@Service
public class OrderService {
  @Autowired
  private OrderRepository repo; // Mutable

  @Autowired
  private PaymentClient payment;

  // Testing harder - need Spring context
}
```

**Best practice:**
- Use **constructor injection** (recommended)
- Reason: Immutability, testability, circular dependency detection"

---

## Câu hỏi về Controller / Service / Repository

### 1. Vì sao nên chia Controller, Service, Repository?

**Trả lời tốt:**
"**Layer separation - Separation of Concerns:**

```
OrderController (Web Layer)
    ↓ (calls)
OrderService (Business Logic Layer)
    ↓ (uses)
OrderRepository (Data Access Layer)
    ↓ (queries)
Database
```

**Benefits:**

1. **Single Responsibility**: Mỗi class chỉ làm một việc
   - Controller: Parse request, call service, return response
   - Service: Business logic, validation, orchestration
   - Repository: Database operations

2. **Easy Testing**: Mock each layer independently
   ```java
   @Test
   public void testCreateOrder() {
     OrderRepository mockRepo = mock(OrderRepository.class);
     OrderService service = new OrderService(mockRepo);
     // Test business logic without database
   }
   ```

3. **Reusability**: Service có thể gọi từ nhiều nơi
   ```java
   // Web API
   @RestController
   public class OrderController {
     private OrderService service;

     @PostMapping('/orders')
     public OrderDto create(@RequestBody CreateOrderRequest req) {
       return service.createOrder(req);
     }
   }

   // Scheduled job
   @Component
   public class OrderScheduler {
     private OrderService service;

     @Scheduled(fixedDelay = 3600000)
     public void processExpiredOrders() {
       service.cancelExpiredOrders(); // Reuse service
     }
   }
   ```

4. **Easy to Change**: Change database → change only Repository
   ```java
   // Old: MySQL
   @Repository
   public class OrderRepositoryMySQL extends JpaRepository<Order, Long> { }

   // New: MongoDB (just change this, Service không thay đổi)
   @Repository
   public class OrderRepositoryMongo implements OrderRepository { }
   ```

5. **Performance**: Can optimize each layer independently
   - Controller: Add caching, rate limiting
   - Service: Batch operations, optimization
   - Repository: Index, query tuning"

---

### 2. Controller có nên xử lý business logic không?

**Trả lời tốt:**
"**NO. Controller chỉ nên:**
- Parse request
- Call service
- Return response

**Thin Controller Pattern:**
```java
// GOOD
@RestController
@RequestMapping('/api/orders')
public class OrderController {
  private OrderService service;

  @PostMapping
  public OrderDto create(@RequestBody CreateOrderRequest req) {
    return service.createOrder(req); // Delegate to service
  }

  @GetMapping('/{id}')
  public OrderDto get(@PathVariable Long id) {
    return service.getOrder(id);
  }
}

// BAD - Fat Controller
@RestController
@RequestMapping('/api/orders')
public class OrderController {
  @Autowired
  private OrderRepository repo;

  @PostMapping
  public OrderDto create(@RequestBody CreateOrderRequest req) {
    // Business logic directly in controller (WRONG!)
    Order order = new Order();
    order.setCustomerId(req.getCustomerId());
    order.setAmount(req.getAmount());

    // Validation in controller
    if (order.getAmount() < 0) {
      throw new IllegalArgumentException();
    }

    // Database operation in controller
    repo.save(order);

    // More logic...
    return new OrderDto(order);
  }
}
```

**Why:**
- **Testability**: Service-based = easy mock repo
  ```java
  @Test
  public void testCreateOrder() {
    OrderService mockService = mock(OrderService.class);
    OrderController controller = new OrderController(mockService);
    controller.create(...); // Can test controller logic without Spring
  }
  ```

- **Reusability**: Business logic in service = can call from multiple places

- **Maintainability**: Change business logic = change service only

**MVC Pattern:**
```
Request → Controller (thin) → Service (fat/logic) → Repository → DB → Response
```"

---

### 3. Service interface và ServiceImpl dùng để làm gì?

**Trả lời tốt:**
"**Interface-based service: Loose coupling + flexibility**

```java
// Interface
public interface OrderService {
  Order createOrder(CreateOrderRequest request);
  Order getOrder(Long id);
  List<Order> listOrders();
}

// Implementation
@Service
public class OrderServiceImpl implements OrderService {
  @Override
  public Order createOrder(CreateOrderRequest request) { }

  @Override
  public Order getOrder(Long id) { }

  @Override
  public List<Order> listOrders() { }
}

// Usage
@RestController
public class OrderController {
  private OrderService service; // Depends on interface, not implementation

  @Autowired
  public OrderController(OrderService service) {
    this.service = service;
  }
}
```

**Benefits:**

1. **Swappable Implementation**
   ```java
   // Production
   @Service
   public class OrderServiceImpl implements OrderService { }

   // Testing
   public class OrderServiceMock implements OrderService { }

   // Can swap without changing controller
   ```

2. **Multiple Implementations**
   ```java
   public interface PaymentProcessor {
     void process(double amount);
   }

   @Service
   public class CreditCardProcessor implements PaymentProcessor { }

   @Service
   public class PayPalProcessor implements PaymentProcessor { }

   // Controller can use either
   ```

3. **AOP Proxies**
   ```java
   @Service
   public class OrderServiceImpl implements OrderService {
     @Transactional // AOP proxy wraps this service
     @Override
     public Order createOrder(CreateOrderRequest request) { }
   }
   ```

**Modern approach - Less interface ceremony:**
```java
// Many teams skip interface if only 1 implementation
@Service
public class OrderService { // No interface
  public Order createOrder(CreateOrderRequest request) { }
}

// Interface if:
// - Multiple implementations
// - Heavy mocking in tests
// - Want explicit contract
```

**Best practice:**
- Use interface when needed (multiple implementations, mocking)
- Don't over-engineer (skip if only 1 implementation)"

---

[Continuing with remaining questions...]
