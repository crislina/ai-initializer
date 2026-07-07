# Java and Spring Rules

## Rule Priority

- **Guardrails** are hard constraints for Java and Spring code unless an explicit repository requirement justifies an exception.
- **Quality Gates** define what must be verified before Java/Spring work is reported as complete.
- **Conventions** are default implementation preferences and should follow established repository style when it differs and remains sound.
- **Heuristics** are review signals, not automatic failures.
- **Conditional Guidance** applies only when the relevant Spring capability is used.

------

## Guardrails

- Do not use field injection.
- Do not access repositories directly from controllers.
- Do not expose JPA entities as public API request or response contracts.
- Do not place transaction boundaries in controllers.
- Do not rely on `@Transactional` on private methods or self-invocation.
- Multi-write state changes that must remain consistent must execute within a clear service or application transaction boundary.
- Do not use a pre-insert existence check as the sole uniqueness guarantee.
- Do not rely on Java `synchronized`, static locks, or process-local state for multi-instance concurrency guarantees.
- Do not modify previously applied Flyway or Liquibase migrations.
- Do not use Hibernate automatic schema creation as the schema-management strategy in shared or production-like environments.
- Do not return raw internal exceptions, SQL errors, class names, or stack traces through APIs.
- Do not use `CascadeType.ALL`, eager loading, Lombok `@Data`, or generated entity equality methods by default without deliberate justification.
- Do not introduce a second HTTP client, mapping framework, or persistence approach without a clear need.
- Do not run concurrent database tests sequentially and claim they prove concurrency safety.

------

## Quality Gates

Before reporting Java/Spring work as complete:

- Java compilation must pass.
- Relevant JUnit tests must pass.
- Repository-required formatting, static analysis, and build checks must pass.
- Flyway or Liquibase validation must pass when schema changes are involved.
- New schema changes must use a new migration file.
- Material custom queries and persistence mappings must have integration coverage.
- Concurrency guarantees must be tested with overlapping operations, separate threads, separate transaction contexts, and final-state assertions when concurrency is in scope.
- Transactional multi-write flows must have rollback coverage when partial persistence is a material risk.
- Database-specific behavior must not be claimed as verified solely by H2 when H2 differs materially from the target database.
- Failed, skipped, or unavailable verification steps must be reported accurately.

------

## Conventions

### Java Style

- Follow the Java version, formatter, and static-analysis configuration defined by the project.
- Use meaningful class, method, variable, and package names.
- Keep visibility as restrictive as practical.
- Use `final` for required dependencies and values that should not change.
- Prefer immutable objects and records for simple immutable data carriers when appropriate.
- Avoid mutable static state.
- Prefer loops over streams when streams obscure stateful or side-effecting logic.
- Prefer readability over compressing logic into a single expression.

### Dependency Injection

- Use constructor injection with `final` fields for required dependencies.
- Do not use the application context as a service locator.
- Keep injected dependencies focused and limited.
- Avoid optional dependencies unless they represent a genuine optional capability.
- Prefer explicit configuration over conditional behavior hidden in business logic.

### Null and Optional Handling

- Use `Optional<T>` for return values when absence is expected and meaningful.
- Do not use `Optional` as an entity field, DTO property, or method parameter.
- Return empty collections instead of `null`.
- Do not wrap collections in `Optional`.
- Avoid `Optional.get()` unless presence has already been established.
- Prefer explicit branching when Optional chains reduce readability.

### Package Structure and Responsibilities

- Follow the repository's existing package structure.
- For new projects, both package-by-layer and package-by-feature are acceptable; choose one and apply it consistently.
- Regardless of package style, keep HTTP, business logic, persistence, mapping, configuration, and integration responsibilities clear.
- Common layer packages may include `controller`, `service`, `repository`, `entity`, `dto`, `mapper`, `client`, `exception`, `config`, `security`, `scheduler`, and `validation` when those responsibilities exist.
- Do not create packages merely to satisfy a template.
- Do not create a generic `util` package for unrelated behavior.
- Place code according to responsibility rather than convenience.

### Service Interfaces

- Do not create an interface for every service by default.
- Use a concrete service when there is one implementation and no meaningful abstraction boundary.
- Introduce an interface for multiple implementations, a real application/domain boundary, a public module contract, or an established repository convention.
- Do not create service interfaces solely for unit testing.
- Avoid `I` prefixes and generic `Impl` suffixes unless existing project convention requires them.

### Controllers

- Use `@RestController` for REST APIs.
- Keep controllers focused on transport concerns: input validation, request context, delegation, and response construction.
- Use explicit request and response DTOs.
- Use `@Valid` or `@Validated` where appropriate.
- Use `ResponseEntity` when status, headers, or response behavior must be controlled explicitly.
- Keep path, query parameter, and response conventions consistent.
- Avoid mixing unrelated resources in one controller.

### DTOs and Mapping

- Separate request and response models when they have different responsibilities.
- Use Jakarta Bean Validation for structural input validation.
- Keep business validation in services or domain components.
- Prefer immutable DTOs and records where appropriate.
- Keep mapping logic explicit and easy to locate.
- Use dedicated mapper classes when mappings are substantial, reused, or obscure business orchestration.
- Keep trivial one-off mappings near the caller when clearer.
- Do not hide business decisions inside mapping code.
- Do not introduce a mapping library unless mapping volume and complexity justify it.

### Transactions

- Define transaction boundaries at the service or application layer.
- Use `@Transactional(readOnly = true)` for applicable read operations.
- Keep transactional methods focused.
- Avoid long-running work and external network calls inside database transactions where practical.
- Avoid catching exceptions inside transactional methods when doing so would unintentionally prevent rollback.
- Use `REQUIRES_NEW` sparingly and document why it is necessary.
- Keep transaction ownership clear.

### Persistence and Repositories

- Use Spring Data repositories for standard persistence operations where appropriate.
- Keep repositories focused on database access rather than business rules.
- Avoid loading more data than required and avoid unbounded queries.
- Use database-backed pagination for large result sets.
- Prevent N+1 query problems using fetch joins, entity graphs, batch fetching, or projections when appropriate.
- Prefer derived queries for simple cases and explicit JPQL, Criteria, Specifications, or native SQL when they make intent clearer or improve performance.
- Specify ordering when result order matters.
- Coordinate concurrent check-and-write operations through locks, constraints, atomic statements, versioning, or equivalent shared mechanisms.
- Preserve database constraints as final protection and translate violations into stable, specific application errors.
- Use a consistent lock acquisition order when one operation locks multiple rows or aggregates.
- Keep dynamic query construction outside a business service when it becomes non-trivial, reused, or obscures the primary business flow.

### JPA Entities

- Keep entity identity and equality behavior deliberate.
- Avoid Lombok-generated `equals`, `hashCode`, and `toString` across all entity fields.
- Exclude lazy associations and sensitive data from `toString`.
- Avoid bidirectional relationships unless genuinely required.
- Use cascade operations deliberately.
- Avoid exposing mutable collections directly.
- Use helper methods when needed to preserve relationship consistency.
- Align database constraints with application validation where practical.
- Persist enums explicitly, preferably as strings unless compatibility or storage requirements dictate otherwise.
- Use optimistic version fields when conflicting updates are possible and the chosen concurrency design benefits from them.

### Database Migrations

- Use the migration tool configured by the project.
- Make migrations backward-compatible where rolling deployments are possible.
- Avoid destructive changes without a migration plan.
- Provide safe transitions when adding required columns to existing data.
- Review indexes for new query patterns and consider write/storage costs.
- Keep migration names descriptive.

### Spring Configuration and Components

- Use `@ConfigurationProperties` for grouped application configuration.
- Prefer typed configuration over scattered `@Value` fields.
- Validate required configuration at startup.
- Keep environment-specific values outside source code.
- Use clear configuration prefixes and safe non-production defaults.
- Use Spring stereotypes consistently.
- Do not annotate domain objects as Spring components.
- Keep configuration classes focused and avoid business logic or heavy startup side effects in bean construction.
- Use profiles sparingly and intentionally.

### Exception Handling and Validation

- Use typed domain, application, validation, conflict, and integration exceptions.
- Use `@RestControllerAdvice` for centralized HTTP exception mapping.
- Handle bean validation, constraint violations, malformed requests, unsupported values, and unexpected failures consistently.
- Use stable application error codes and safe messages.
- Log unexpected exceptions once at the system boundary.
- Avoid logging expected domain or validation failures at `ERROR`.
- Use standard Jakarta Bean Validation constraints where possible.
- Keep custom validators focused and reusable.
- Avoid database or remote calls inside field validators unless explicitly justified.
- Return field-level validation details consistently.

### Date and Time

- Inject `Clock` into business logic that depends on current time so tests can control boundaries deterministically.
- Prefer `Instant` for absolute instants.
- Use `OffsetDateTime` when the offset is part of the API or domain contract.
- Use explicit `ZoneId` when converting local dates into intervals.
- Define and document the representation used at persistence boundaries.
- Do not rely on JVM, database, container, or host default time zones.
- Test exact boundaries, calendar transitions, and daylight-saving behavior when relevant.

### Testing

- Use JUnit 5 unless the project specifies otherwise.
- Use unit tests for isolated business logic and integration tests for Spring configuration, persistence, serialization, security, and external boundaries.
- Prefer focused slices such as `@WebMvcTest` and `@DataJpaTest` when appropriate.
- Use `@SpringBootTest` only when the full application context is required.
- Mock external boundaries rather than the class under test or simple value objects.
- Keep Mockito usage minimal and verify important outcomes rather than every internal interaction.
- Use Testcontainers when realistic database or infrastructure behavior is required and supported.
- Do not rely on H2 to prove target-database-specific locking, SQL, sequence, or date behavior when it differs materially.
- Use barriers, latches, or equivalent coordination so competing transactions overlap in concurrency tests.
- Run concurrent database operations on separate threads and transaction contexts.
- Assert outcomes and final database state for locking, uniqueness, cancellation, and rollback scenarios.
- Add focused transaction tests when partial writes or caught exceptions could change rollback behavior.

### Build and Dependencies

- Use the repository's existing build tool and dependency-management conventions.
- Do not mix Maven and Gradle.
- Prefer Spring Boot dependency management where applicable.
- Do not add a dependency when the JDK or existing framework already provides an adequate solution.
- Avoid duplicate libraries serving the same purpose.
- Review security, maintenance, license, and transitive impact before adding a dependency.
- Keep test-only dependencies in test scope and avoid dynamic versions.

### Documentation

- Document public APIs, configuration properties, non-obvious architecture decisions, transaction boundaries, retry behavior, and known limitations where relevant.
- Use OpenAPI or generated documentation according to project convention.
- Avoid duplicating documentation that can be generated reliably from code.
- Keep documentation synchronized with behavior.

------

## Heuristics

- A service with many dependencies or unrelated public operations may have accumulated multiple responsibilities.
- A controller or service above roughly 200 lines is a review signal when size comes from mixed concerns rather than cohesive behavior.
- Substantial DTO mapping inside a service may justify a mapper when it obscures business orchestration.
- Repeated pagination or sorting parsing across controllers may justify reusable web support.
- Non-trivial Specification or Criteria construction inside a service may justify a dedicated query component.
- Full-context tests for simple logic may indicate that a smaller test slice or unit test would be clearer and faster.
- Extensive internal mocking may indicate that boundaries are too fragmented or responsibilities are misplaced.
- `saveAndFlush()` can help translate constraint violations before returning, but should not be used indiscriminately.
- A version field, pessimistic lock, database constraint, or atomic update is not automatically sufficient by itself; review the complete race and final-state guarantee.

------

## Conditional Guidance

Apply only when the feature or existing repository uses the relevant capability.

### Lombok

- Follow the repository's existing Lombok convention.
- `@RequiredArgsConstructor` is acceptable for constructor injection.
- Avoid `@Data` and broad generated equality or string methods on entities.
- Do not introduce Lombok into a project that does not already use it unless explicitly requested.

### HTTP Clients

- Follow the existing HTTP client technology; prefer Spring declarative `@HttpExchange` when supported and consistent with the project.
- Configure base URLs, authentication, timeouts, error mapping, tracing, and retry behavior explicitly.
- Use dedicated external request and response models.
- Translate client failures into typed integration exceptions.
- Retry only safe transient failures with bounded backoff.

### Asynchronous Processing

- Use asynchronous execution only when it provides a clear benefit.
- Configure bounded executors explicitly and propagate required logging, tracing, and security context intentionally.
- Handle asynchronous failures explicitly.
- Do not assume caller transactions propagate to asynchronous methods.
- Design processing to tolerate duplicate execution when necessary.

### Events and Messaging

- Use events to decouple meaningful business or integration actions, not to hide simple method calls.
- Keep payloads stable, minimal, and independent of JPA entities.
- Define duplicate handling, retry, dead-letter, ordering, and delivery assumptions.
- Preserve trace and correlation context.
- Do not acknowledge messages before required processing is safely complete unless explicitly designed.

### Scheduling

- Keep scheduled entry points small and delegate work to services.
- Coordinate execution across application instances when overlap is unsafe.
- Make schedules configurable when operationally useful.
- Process large workloads in bounded batches and design jobs to resume safely after partial failure.
- Log concise start, completion, duration, and failure summaries.

### Caching

- Use caching only when there is a demonstrated need.
- Define keys, expiry, invalidation, consistency, and stale-data behavior explicitly.
- Avoid caching mutable entities directly or using caching to hide inefficient or incorrect queries.
- Prevent unbounded growth and protect sensitive data.

### Security

- Use Spring Security according to the repository's authentication model.
- Keep authentication and authorization separate.
- Verify access to the specific resource.
- Configure CORS and CSRF intentionally.
- Do not use wildcard origins with credentials.
- Protect sensitive actuator and management endpoints.
- Use approved password encoders and platform cryptography.

### Actuator and Observability

- Expose only required actuator endpoints and protect sensitive management endpoints.
- Use low-cardinality Micrometer tags.
- Avoid user IDs, request IDs, order IDs, and other unbounded values as metric tags.
- Add health indicators only when they provide meaningful operational information.
- Preserve trace context through clients and asynchronous processing where supported.