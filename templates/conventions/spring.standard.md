# Spring Rules Standard

## Rule Priority

- **Guardrails** are hard constraints for formal Spring business projects unless an explicit repository requirement justifies an exception.
- **Quality Gates** define what must be verified before Spring work is reported as complete.
- **Conventions** are default implementation preferences and should follow established repository style when it differs and remains sound.
- **Heuristics** are review signals, not automatic failures.
- Apply the Java rules alongside these Spring-specific rules.

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
- Do not disable relevant tests or checks merely to make the build pass.

------

## Quality Gates

Before reporting Spring work as complete:

- Java compilation must pass.
- Relevant JUnit and Spring tests must pass.
- Repository-required formatting, static analysis, and build checks must pass.
- Flyway or Liquibase validation must pass when schema changes are involved.
- New schema changes must use a new migration file.
- Material custom queries and persistence mappings must have integration coverage.
- Transactional multi-write flows must have rollback coverage when partial persistence is a material risk.
- Concurrency guarantees must be tested with overlapping operations and final-state assertions when concurrency is in scope.
- Failed, skipped, or unavailable verification steps must be reported accurately.

------

## Conventions

### Spring Structure and Responsibilities

- Follow the repository's existing package structure.
- Keep HTTP, business logic, persistence, mapping, configuration, and integration responsibilities clear.
- Controllers should handle transport concerns: input validation, request context, delegation, and response construction.
- Services should own application orchestration and business workflows.
- Repositories should own database access rather than business rules.
- Do not create packages or service interfaces merely to satisfy a template.

### Dependency Injection and Configuration

- Use constructor injection with `final` fields for required dependencies.
- Do not use the application context as a service locator.
- Prefer explicit configuration over conditional behavior hidden in business logic.
- Use `@ConfigurationProperties` for grouped application configuration.
- Validate required configuration at startup.
- Keep environment-specific values outside source code.
- Do not annotate domain objects as Spring components.

### Controllers, DTOs, and Validation

- Use `@RestController` for REST APIs.
- Use explicit request and response DTOs for public APIs.
- Use Jakarta Bean Validation for structural input validation.
- Keep business validation in services or domain components.
- Keep path, query parameter, pagination, and response conventions consistent.
- Use dedicated mapper classes when mappings are substantial, reused, or obscure business orchestration.
- Do not hide business decisions inside mapping code.

### Transactions and Persistence

- Define transaction boundaries at the service or application layer.
- Use `@Transactional(readOnly = true)` for applicable read operations.
- Avoid long-running work and external network calls inside database transactions where practical.
- Avoid catching exceptions inside transactional methods when doing so would unintentionally prevent rollback.
- Preserve database constraints as final protection and translate violations into stable application errors.
- Use database-backed pagination for large result sets.
- Prevent N+1 query problems using fetch joins, entity graphs, batch fetching, or projections when appropriate.
- Coordinate concurrent check-and-write operations through locks, constraints, atomic statements, versioning, or equivalent shared mechanisms.

### JPA Entities and Migrations

- Keep entity identity and equality behavior deliberate.
- Avoid Lombok-generated `equals`, `hashCode`, and `toString` across all entity fields.
- Exclude lazy associations and sensitive data from `toString`.
- Avoid bidirectional relationships and cascading operations unless genuinely required.
- Align database constraints with application validation where practical.
- Use the migration tool configured by the project.
- Make migrations backward-compatible where rolling deployments are possible.
- Keep migration names descriptive and review lock or data risks for high-risk changes.

### Exception Handling and APIs

- Use typed domain, application, validation, conflict, and integration exceptions.
- Use `@RestControllerAdvice` for centralized HTTP exception mapping.
- Handle bean validation, constraint violations, malformed requests, unsupported values, and unexpected failures consistently.
- Use stable application error codes and safe messages.
- Log unexpected exceptions once at the system boundary.
- Preserve backward compatibility unless a breaking change is explicitly requested and planned.

### Testing

- Use JUnit 5 unless the project specifies otherwise.
- Use unit tests for isolated business logic and integration tests for Spring configuration, persistence, serialization, security, and external boundaries.
- Prefer focused slices such as `@WebMvcTest` and `@DataJpaTest` when appropriate.
- Use `@SpringBootTest` only when the full application context is required.
- Mock external boundaries rather than the class under test or simple value objects.
- Do not rely on H2 to prove target-database-specific locking, SQL, sequence, or date behavior when it differs materially.
- Add focused transaction tests when partial writes or caught exceptions could change rollback behavior.

### Conditional Spring Capabilities

- Configure HTTP clients with base URLs, authentication, timeouts, error mapping, tracing, and retry behavior explicitly.
- Use asynchronous execution only when it provides a clear benefit and bounded executors are configured.
- Use events and messaging to decouple meaningful business or integration actions, not to hide simple method calls.
- Keep scheduled entry points small and coordinate execution across application instances when overlap is unsafe.
- Use Spring Security according to the repository's authentication model and verify access to the specific resource.
- Protect sensitive actuator and management endpoints.
