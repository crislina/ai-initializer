# Java and Spring Rules

## Java Style

- Follow the Java version configured by the project.
- Do not use APIs or language features unavailable in the configured Java version.
- Follow the project’s existing formatter and static-analysis rules.
- Use meaningful class, method, variable, and package names.
- Use nouns for classes and variables.
- Use verbs or verb phrases for methods that perform actions.
- Use singular names for classes representing one concept.
- Avoid unnecessary abbreviations.
- Avoid generic names such as `Manager`, `Helper`, `Util`, or `Processor` unless the responsibility is genuinely clear.
- Keep visibility as restrictive as practical.
- Prefer `private` methods and fields unless broader access is required.
- Use `final` for dependencies and values that should not change.
- Prefer immutable objects where practical.
- Use records for simple immutable data carriers when supported by the project and appropriate for the use case.
- Avoid mutable static state.
- Avoid static utility methods when the behavior requires dependencies, configuration, or test substitution.
- Do not return `null` collections.
- Avoid excessive use of streams when a loop is clearer.
- Do not use streams for complex stateful logic or code with hidden side effects.
- Prefer readability over reducing code to a single expression.

------

## Dependency Injection

- Use constructor injection.
- Do not use field injection.
- Use `final` fields for required dependencies.
- Do not call constructors directly for Spring-managed dependencies.
- Do not use the application context as a service locator.
- Keep injected dependencies focused and limited.
- A large number of constructor dependencies may indicate that the class has too many responsibilities.
- Avoid optional dependencies unless they represent a genuine optional capability.
- Prefer explicit configuration over conditional behavior hidden inside business logic.

------

## Null and Optional Handling

- Use `Optional<T>` for return values when absence is an expected and meaningful result.
- Do not use `Optional` as an entity field.
- Do not use `Optional` as a DTO property.
- Do not use `Optional` as a method parameter.
- Do not return `null` instead of `Optional.empty()`.
- Return empty collections instead of `null`.
- Do not wrap collections in `Optional`.
- Validate required constructor and method arguments where appropriate.
- Avoid repeated null checks by designing clear contracts.
- Do not use `Optional.get()` without first proving that a value is present.
- Prefer `orElseThrow`, `map`, `flatMap`, or explicit branching when they improve clarity.
- Avoid deeply nested `Optional` chains that reduce readability.

------

## Package Responsibilities

Use the following package responsibilities unless the existing project defines a different structure:

- `controller`: HTTP request handling, input validation, response mapping, and delegation.
- `service`: application logic, business orchestration, and transaction boundaries.
- `repository`: persistence access.
- `entity`: persistence entities.
- `domain`: domain models and domain behavior.
- `dto`: API request and response models.
- `mapper`: conversion between API, domain, and persistence models.
- `client`: communication with external services.
- `exception`: typed application, domain, and integration exceptions.
- `config`: framework and application configuration.
- `security`: authentication and authorization components.
- `event`: application or domain events and their handlers.
- `scheduler`: scheduled jobs.
- `validation`: reusable custom validation logic.

- Keep controllers thin.
- Keep repositories focused on persistence access.
- Do not place business rules in repositories.
- Do not place HTTP concerns in services.
- Do not expose entities directly through controllers.
- Do not create a generic `util` package for unrelated functionality.
- Place code according to responsibility rather than convenience.
- Follow the existing project package structure when one already exists.

------

## Service Interfaces

- Do not create an interface for every service by default.
- Use a concrete service class when there is only one implementation and no meaningful abstraction boundary.
- Introduce an interface when:
  - Multiple implementations exist or are expected.
  - The interface represents a meaningful application or domain boundary.
  - The implementation is an infrastructure detail behind a port.
  - A public module contract is required.
  - The project already consistently uses service interfaces.
- Do not create an interface solely to make unit testing possible.
- Avoid interface names prefixed with `I`.
- Avoid implementation names ending in `Impl` unless the project convention requires it or multiple implementations need distinction.
- Prefer names that explain the implementation, such as `DatabaseOrderRepository` or `HttpPaymentClient`.

------

## Controllers

- Use `@RestController` for REST APIs.
- Keep controllers thin.
- Controllers should:
  - Accept and validate input.
  - Extract required transport-level context.
  - Delegate work to a service or application component.
  - Map results to response models.
  - Return the appropriate HTTP status.
- Controllers should not:
  - Contain business logic.
  - Open database transactions.
  - Access repositories directly.
  - Construct complex domain objects through extensive procedural logic.
  - Call multiple infrastructure clients to orchestrate a business process.
  - Catch broad exceptions for local response mapping.
- Use explicit request and response DTOs.
- Use `@Valid` or `@Validated` where appropriate.
- Use `ResponseEntity` only when status, headers, or response behavior must be controlled explicitly.
- Avoid unnecessary `ResponseEntity.ok(...)` wrappers when the project convention allows direct response bodies.
- Use consistent path and parameter naming.
- Avoid mixing multiple unrelated resources in one controller.

------

## DTOs

- Use dedicated request and response DTOs.
- Do not expose JPA entities through API contracts.
- Separate request and response models when they have different responsibilities.
- Do not reuse persistence entities as messaging or API models.
- Use Jakarta Bean Validation annotations for structural input validation.
- Keep business validation in the service or domain layer.
- Do not place business logic in DTOs.
- Prefer immutable DTOs.
- Use records for DTOs when supported and consistent with the project.
- Do not expose sensitive internal fields.
- Make serialization names explicit only when they differ from Java naming or are required for compatibility.
- Avoid optional fields with ambiguous meaning.
- Document nullability and required fields through types, validation, or API documentation.

------

## Mapping

- Keep mapping logic explicit and easy to locate.
- Use dedicated mapper classes when mappings are complex or reused.
- Small one-off mappings may remain close to the calling code when this is clearer.
- Do not hide business decisions inside mapping code.
- Do not silently discard important fields.
- Keep persistence-to-domain and domain-to-API transformations separate when the models have different responsibilities.
- Follow the project’s existing mapping approach.
- Do not introduce a mapping library unless the volume and complexity of mappings justify it.
- Add mapping tests for non-trivial transformations.

------

## Transactions

- Define transaction boundaries at the service or application layer.
- Do not start transactions in controllers.
- Keep transactional methods focused.
- Avoid long-running work inside database transactions.
- Avoid external network calls inside database transactions where practical.
- Use `@Transactional(readOnly = true)` for read-only operations where appropriate.
- Do not assume `readOnly = true` is a security or correctness boundary.
- Be aware that Spring proxy-based transactions do not apply to self-invocation.
- Do not rely on `@Transactional` on private methods.
- Use explicit rollback rules only when the default behavior is insufficient.
- Avoid catching an exception inside a transactional method when doing so would unintentionally prevent rollback.
- Do not open a new transaction without a clear reason.
- Use `REQUIRES_NEW` sparingly and document why it is necessary.
- Keep transaction ownership clear.
- Do not mix multiple unrelated business operations in one transaction solely for convenience.

------

## Persistence and Repositories

- Use Spring Data repositories for standard persistence operations where appropriate.
- Keep repositories focused on database access.
- Do not place business logic in repository implementations.
- Avoid loading more data than required.
- Use projections when only a subset of fields is needed and this materially improves the query.
- Avoid unbounded queries.
- Use pagination for large result sets.
- Prevent N+1 query problems.
- Use fetch joins, entity graphs, batch fetching, or projections when appropriate.
- Do not default every association to eager loading.
- Use lazy loading carefully and avoid accessing lazy relationships outside the required persistence context.
- Make query intent clear.
- Prefer derived query methods for simple queries.
- Use explicit JPQL, criteria, or native SQL when a derived query becomes unclear or inefficient.
- Do not use native SQL without a clear reason.
- Keep database-specific behavior isolated where practical.
- Add integration tests for custom or complex queries.
- Do not rely on implicit database ordering.
- Specify ordering when result order matters.
- Do not rely on an application-level check followed by a write when concurrent requests can invalidate the check; coordinate through locks, constraints, atomic statements, or an equivalent shared mechanism.
- Do not use a pre-insert existence check as the sole uniqueness guarantee.
- Preserve database constraints for concurrent safety and translate constraint violations into stable, specific application errors.
- Use a consistent lock acquisition order when one operation locks multiple rows or aggregates.
- Keep database-specific locking, sequence, and date arithmetic isolated and document portability limitations.

------

## JPA Entities

- Do not expose entities directly through APIs.
- Keep entity identity and equality behavior deliberate.
- Avoid Lombok-generated `equals`, `hashCode`, or `toString` across all entity fields.
- Do not include lazy-loaded associations in `toString`.
- Avoid bidirectional relationships unless they are genuinely required.
- Keep ownership of relationships clear.
- Use cascade operations deliberately.
- Do not use `CascadeType.ALL` by default.
- Avoid exposing mutable collections directly.
- Prefer helper methods that preserve relationship consistency.
- Use appropriate column constraints.
- Keep database constraints aligned with application validation where practical.
- Do not depend solely on application validation for data integrity.
- Avoid business logic that requires an active persistence session unless the entity is intentionally used as a domain model.
- Be explicit about enum persistence strategy.
- Prefer string enum persistence unless storage or compatibility requirements dictate otherwise.

------

## Database Migrations

- Use the project’s configured migration tool, such as Flyway or Liquibase.
- Do not rely on automatic schema creation in shared or production environments.
- Make migrations backward-compatible where rolling deployments are possible.
- Avoid destructive schema changes without a migration plan.
- Separate schema expansion from later cleanup when compatibility is required.
- Provide safe defaults or nullable transitions when adding required columns to existing tables.
- Do not modify previously deployed migration files.
- Add a new migration for each schema change.
- Review indexes for new query patterns.
- Avoid adding indexes without considering write cost and storage impact.
- Keep migration names descriptive.
- Ensure migrations can run on realistic existing data volumes.

------

## Spring Configuration

- Use `@ConfigurationProperties` for grouped application configuration.
- Prefer typed configuration over scattered `@Value` usage.
- Validate required configuration at startup.
- Keep environment-specific values outside source code.
- Do not store secrets in configuration files committed to source control.
- Use clear configuration prefixes.
- Provide sensible non-production defaults only when safe.
- Fail startup when required configuration is missing or invalid.
- Avoid hidden conditional bean creation unless the condition is intentional and documented.
- Use profiles sparingly.
- Do not use profiles as a substitute for well-structured configuration.
- Keep configuration classes focused.
- Avoid placing business logic in configuration classes.

------

## Spring Components

- Use stereotypes consistently:
  - `@RestController` for REST controllers.
  - `@Service` for application or business services.
  - `@Repository` for persistence components.
  - `@Component` only when no more specific stereotype applies.
  - `@Configuration` for bean configuration.
- Do not annotate domain objects as Spring components.
- Keep component scanning boundaries clear.
- Avoid creating beans with hidden side effects during application startup.
- Avoid executing remote calls or heavy processing in bean constructors.
- Use lifecycle hooks only when necessary.
- Ensure startup failures provide clear diagnostic information.

------

## HTTP Clients

- Prefer Spring declarative HTTP clients using `@HttpExchange` for synchronous integrations when supported by the project’s Spring version.
- Follow the existing client technology when the project already uses WebClient, RestClient, OpenFeign, or another approved client.
- Do not introduce a second HTTP client technology without a clear reason.
- Keep HTTP client interfaces focused on transport concerns.
- Use dedicated external request and response models.
- Do not reuse internal domain or API DTOs solely for convenience.
- Configure:
  - Base URLs.
  - Authentication.
  - Connection timeouts.
  - Read timeouts.
  - Error mapping.
  - Logging and tracing.
  - Retry behavior.
- Do not use default infinite or excessively long timeouts.
- Translate downstream errors into typed integration exceptions.
- Do not leak raw client exceptions beyond the integration boundary.
- Do not retry non-idempotent operations unless explicitly designed to be safe.
- Use bounded retries with backoff for transient failures only.
- Avoid logging full sensitive external payloads.
- Propagate correlation IDs where supported.

------

## Exception Handling

- Use typed domain, application, validation, and integration exceptions.
- Do not throw raw `RuntimeException` for expected application failures.
- Preserve the original cause when translating technical exceptions.
- Use `@RestControllerAdvice` for centralized HTTP exception mapping.
- Convert validation, domain, authentication, authorization, conflict, integration, and unexpected failures into stable API error responses.
- Do not expose internal exception messages.
- Do not expose stack traces.
- Do not expose SQL errors, class names, package names, or downstream implementation details.
- Avoid controller-level `try-catch` blocks used only to map responses.
- Log unexpected exceptions once at the system boundary.
- Avoid logging expected domain or validation failures at `ERROR`.
- Use stable error codes.
- Keep HTTP exception mappings consistent across controllers.
- Handle `MethodArgumentNotValidException`, constraint violations, malformed requests, and unsupported values consistently.

------

## Validation

- Use Jakarta Bean Validation for request-level structural validation.
- Use annotations such as:
  - `@NotNull`
  - `@NotBlank`
  - `@Size`
  - `@Min`
  - `@Max`
  - `@Positive`
  - `@Email`
  - `@Pattern`
- Use custom validators only when standard constraints are insufficient.
- Keep validators focused and reusable.
- Do not perform database or remote service calls inside standard field validators unless explicitly justified.
- Perform business validation in services or domain components.
- Return field-level validation details in a consistent format.
- Avoid exposing implementation-specific validation messages.
- Use validation groups only when they materially simplify distinct request scenarios.

------

## Lombok

- Follow the existing project convention for Lombok.
- Use Lombok only when it improves readability without hiding important behavior.
- `@RequiredArgsConstructor` is acceptable for constructor injection.
- Avoid `@Data` on entities.
- Avoid generated `equals`, `hashCode`, and `toString` on entities without deliberate field selection.
- Do not include sensitive data in generated `toString`.
- Prefer explicit code when Lombok annotations obscure object behavior.
- Do not introduce Lombok into a project that does not already use it unless explicitly requested.

------

## Asynchronous Processing

- Use asynchronous execution only when it provides a clear benefit.
- Do not use `@Async` to hide slow synchronous design.
- Make thread-pool configuration explicit.
- Do not rely on the default unbounded executor.
- Propagate required logging, tracing, security, and request context intentionally.
- Handle asynchronous exceptions explicitly.
- Do not assume the caller transaction propagates to an asynchronous method.
- Make retry and duplicate-processing behavior clear.
- Design asynchronous handlers to be idempotent where duplicate delivery is possible.

------

## Events and Messaging

- Use events to decouple meaningful business or integration actions, not to hide simple method calls.
- Keep event names clear and past-tense for completed facts where appropriate.
- Keep event payloads stable and minimal.
- Do not expose persistence entities directly in events.
- Design consumers to handle duplicate messages.
- Define retry and dead-letter behavior.
- Preserve trace and correlation context.
- Do not acknowledge messages before required processing is safely complete unless explicitly designed.
- Avoid long database transactions around message processing.
- Document delivery guarantees and ordering assumptions.

------

## Scheduling

- Keep scheduled jobs small and delegate work to services.
- Do not place complex business logic directly in `@Scheduled` methods.
- Prevent overlapping execution when overlapping runs are unsafe.
- Use distributed locking where multiple application instances may execute the same job.
- Make schedules configurable when operationally useful.
- Log job start, completion, duration, and failure at appropriate levels.
- Avoid excessive per-record logging.
- Design jobs to resume safely after partial failure.
- Process large workloads in bounded batches.
- Make retry behavior explicit.

------

## Caching

- Use caching only when there is a demonstrated need.
- Define cache keys, expiry, invalidation, and consistency expectations explicitly.
- Do not cache sensitive data without appropriate protection.
- Avoid caching mutable entities directly.
- Prevent unbounded cache growth.
- Consider stale data behavior.
- Do not use caching to hide inefficient or incorrect data access.
- Ensure cache failure does not cause incorrect business behavior.
- Add metrics for cache effectiveness where operationally important.

------

## Date and Time

- Inject `Clock` into business logic that depends on the current time so tests can control boundary conditions deterministically.
- Prefer `Instant` for absolute instants and use `OffsetDateTime` only when the offset is part of the API or domain contract.
- Use an explicit `ZoneId` when converting a local date into an interval.
- Derive a local day's end from the start of the next local day; do not add a fixed 24-hour duration.
- Clip durations to the interval being summarized or limited when records can cross interval boundaries.
- Test exact boundaries, intervals crossing midnight, and daylight-saving transitions for timezone-sensitive behavior.
- Define and document the time representation used at persistence boundaries; do not rely on the JVM, database, or container default timezone.


------
## Testing

- Use JUnit 5 unless the project specifies otherwise.
- Use unit tests for isolated business logic.
- Use integration tests for Spring configuration, persistence, serialization, security, and external boundaries.
- Use `@SpringBootTest` only when the full application context is required.
- Prefer focused test slices such as `@WebMvcTest` or `@DataJpaTest` where appropriate.
- Avoid loading the full Spring context for simple unit tests.
- Mock external boundaries, not the class under test.
- Do not mock value objects or simple data structures.
- Keep Mockito usage clear and minimal.
- Avoid broad argument matchers when exact values matter.
- Verify important outcomes rather than every internal interaction.
- Use Testcontainers when realistic database or infrastructure behavior is required and supported by the project.
- Avoid H2 when its behavior differs materially from the production database.
- Add regression tests for bug fixes.
- Keep test data clear and reusable without creating an overly abstract test framework.
- Do not use real external services in automated tests unless the test environment is explicitly designed for it.
- Use barriers, latches, or equivalent coordination for concurrency tests so competing transactions execute at the same time.
- Run concurrent database operations on separate threads and transaction contexts; sequential repository calls do not prove concurrency safety.
- Assert both response outcomes and final database state for locking, uniqueness, cancellation, and rollback scenarios.
- Add focused tests for transaction boundaries when partial writes or caught exceptions could change rollback behavior.


-------

## Security

- Use Spring Security according to the project’s authentication model.
- Keep authentication and authorization concerns separate.
- Enforce authorization at the appropriate endpoint, service, or domain boundary.
- Do not trust resource identifiers supplied by the caller without verifying access.
- Avoid disabling CSRF without understanding the application’s authentication model.
- Configure CORS explicitly.
- Do not use wildcard origins with credentials.
- Do not expose actuator endpoints publicly without appropriate security.
- Restrict sensitive management endpoints.
- Avoid logging security tokens or authentication details.
- Use secure password encoding where password handling is required.
- Do not implement custom cryptography.
- Use approved platform libraries and algorithms.

------

## Actuator and Observability

- Use Spring Boot Actuator where appropriate.
- Expose only required actuator endpoints.
- Protect sensitive management endpoints.
- Add application metrics through Micrometer where useful.
- Use low-cardinality metric tags.
- Avoid using user IDs, request IDs, order IDs, or other unbounded values as metric tags.
- Include correlation IDs in logs.
- Preserve trace context through external clients and asynchronous processing where supported.
- Add health indicators for critical dependencies when they provide useful operational information.
- Do not mark the application unhealthy for non-critical optional dependencies unless required by the operational model.

------

## Build and Dependencies

- Use the project’s existing build tool and conventions.
- Do not mix Maven and Gradle.
- Keep dependency versions managed centrally.
- Prefer Spring Boot dependency management where applicable.
- Do not add a dependency when the JDK or existing framework already provides an adequate solution.
- Avoid duplicate libraries serving the same purpose.
- Review security, maintenance, license, and transitive dependency impact before introducing a library.
- Remove unused dependencies.
- Keep test-only dependencies in the test scope.
- Do not use dynamic or floating dependency versions.
- Follow the project’s Java and Spring compatibility matrix.

------

## Documentation

- Document public APIs and non-obvious architectural decisions.
- Keep configuration properties documented.
- Add examples for complex request or response formats.
- Use OpenAPI annotations or generated documentation according to project conventions.
- Do not duplicate documentation that can be generated reliably from code.
- Keep documentation synchronized with behavior.
- Document assumptions, external dependencies, transaction boundaries, retry behavior, and known limitations when they are not obvious.
