# General Engineering Rules

## Core Principles

- Keep classes and methods small, cohesive, and focused on one responsibility.
- Use meaningful, intent-revealing names and prefer self-documenting code.
- Prefer high cohesion and low coupling.
- Use early returns to reduce unnecessary nesting.
- Extract helper methods when they make complex logic easier to understand.
- Avoid excessive method extraction that fragments simple logic across too many small methods.
- Prefer simple and readable solutions over clever or overly abstract implementations.
- Avoid premature abstraction and unnecessary design patterns.
- Do not introduce new layers, interfaces, or components unless they provide a clear benefit.
- Follow the existing project conventions unless there is a strong reason to change them.
- Keep changes focused on the requested scope.
- Do not refactor unrelated code as part of a feature or bug fix.
- Reuse existing project utilities and patterns before introducing new ones.
- Make invalid states difficult to represent where practical.
- Fail fast when required assumptions or inputs are invalid.

------

## Requirement Coverage and Completion
- Turn explicit requirements, business rules, prohibited approaches, and required verification steps into a working checklist before implementation.
- Trace each material requirement to implementation code and, where behavior matters, to an automated test or an explicitly documented manual verification.
- Treat cross-cutting requirements such as validation, concurrency, transactions, error handling, logging, time handling, and pagination as first-class behavior rather than cleanup work.
- Distinguish required behavior from examples, suggestions, and optional enhancements.
- Do not claim a feature is complete merely because it compiles, starts, or passes a small happy-path test suite.
- Do not replace an explicitly required behavior with a superficially similar shortcut.
- Revisit the requirement checklist after implementation and report any unmet or only partially verified item.

------

## Default Implementation Workflow

- Read repository instruction files and every directly referenced rule before editing code.
- Inspect the relevant build configuration, source structure, nearby implementations, tests, and formatting or lint configuration.
- Translate the request into a concise objective and observable acceptance criteria.
- Identify affected layers and contracts, including data model, migration, API, backend, frontend, configuration, documentation, and tests where applicable.
- Search for existing patterns, utilities, and extension points before creating new ones.
- Identify material risks and boundary conditions such as compatibility, validation, security, concurrency, partial failure, and data migration.
- Ask for clarification only when a missing decision would materially change behavior or scope; otherwise state a reasonable assumption and proceed.
- Use a plan proportional to the task, then implement the smallest coherent end-to-end change.
- Keep changes inside the requested scope and preserve existing conventions unless there is a concrete reason to deviate.
- Do not leave placeholders, fake implementations, core-path TODOs, disabled checks, or weakened tests as a substitute for completion.
- Add or update tests at the lowest practical level that verifies the changed behavior.
- Run every relevant compile, lint, type-check, test, and production-build command.
- If one verification command prevents later commands from running, execute independent checks separately and report each result accurately.
- Fix failures caused by the change rather than suppressing checks or weakening tests.
- Review the final diff against the acceptance criteria, explicit prohibitions, and cross-cutting requirements.
- Report changed behavior, important decisions, verification results, assumptions, and anything not completed.

------

## High-Risk Technical Requirements
- Treat concurrency, transaction boundaries, scheduling, time zones, authorization, data integrity, and persistence guarantees as high-risk requirements.
- For each relevant high-risk requirement:
  - State the chosen design.
  - Consider the failure modes and edge cases.
  - Add automated tests where practical.
  - Document limitations of the database, framework, or local runtime.
- Do not silently replace a requested guarantee with a weaker approximation.
- Do not use in-memory locking, process-local state, or single-instance assumptions when the requirement must remain correct across multiple application instances.
- Prefer correctness and explicit limitations over an implementation that appears complete but does not satisfy the required guarantees.


------

## Architecture

- Use a clear layered architecture by default.
- Keep transport, business logic, persistence, and external integrations separated.
- Controllers should handle transport concerns and delegate business logic.
- Business rules should not depend directly on HTTP, database, or framework-specific details where practical.
- Persistence logic should remain in repositories or persistence-specific components.
- External integrations should be isolated behind dedicated client or adapter components.
- Dependencies should point toward business logic rather than away from it.
- Avoid circular dependencies between modules, packages, or layers.
- Do not bypass layers without a clear and documented reason.
- Prefer explicit data flow over hidden framework behavior.
- Keep architectural boundaries proportional to the size and complexity of the project.
- Do not introduce full Clean Architecture, ports and adapters, or additional abstraction layers unless the project complexity justifies them.

------

## Code Quality

- Write code that is easy to read, test, debug, and maintain.
- Prefer descriptive names over explanatory comments.
- Use comments to explain why something exists, not to restate what the code does.
- Remove dead code, commented-out code, and unused imports.
- Avoid duplicated business logic.
- Extract shared logic only when the duplication represents the same concept and is likely to evolve together.
- Avoid deeply nested conditionals and complex boolean expressions.
- Extract complex boolean conditions into well-named variables or methods.
- Avoid methods with excessive parameters.
- Group related parameters into a meaningful object when appropriate.
- Avoid hidden side effects.
- Make state changes explicit.
- Prefer immutable data where practical.
- Keep configuration outside business logic.
- Do not hardcode environment-specific values, secrets, URLs, credentials, or operational limits.

------

## Validation

- Validate input at the system boundary.
- Reject invalid input with clear and stable error responses.
- Do not rely only on frontend or client-side validation.
- Validate required fields, ranges, formats, and supported values.
- Perform business validation in the business or application layer.
- Do not duplicate the same validation across multiple layers without a clear reason.
- Treat all external input as untrusted.
- Normalize input only when normalization is part of the documented contract.
- Do not silently correct ambiguous or invalid input.

------

## Logging

- Use structured logging with parameterized placeholders.
- Include useful operational context such as request ID, correlation ID, entity ID, operation, and outcome.
- Use stable field names where structured log fields are supported.
- Do not build log messages through string concatenation.
- Do not log passwords, tokens, credentials, session identifiers, secret keys, full payment data, or other sensitive information.
- Avoid logging complete request or response payloads unless explicitly required and safely sanitized.
- Do not expose raw exception messages or stack traces in API responses.
- Log stack traces for unexpected system failures when they are needed for diagnosis.
- Avoid logging the same failure repeatedly across multiple layers.
- Log an exception at the layer responsible for handling or terminating the operation.
- Include enough context to diagnose a failure without exposing sensitive data.

Use log levels consistently:

- `INFO` for meaningful business or operational milestones.
- `DEBUG` for diagnostic details useful during development or troubleshooting.
- `WARN` for unexpected but recoverable situations.
- `ERROR` for failures that prevent an operation from completing.

Do not use:

- `ERROR` for expected validation failures.
- `WARN` for normal business outcomes.
- `INFO` for highly repetitive low-value events.
- Logging as a replacement for proper error handling or monitoring.

------

## Exception Handling

- Never silently swallow exceptions.
- Use typed domain or application exceptions instead of raw generic runtime exceptions.
- Catch exceptions only when the code can recover, translate the exception, add necessary context, or perform required cleanup.
- Preserve the original cause when translating an exception.
- Do not catch broad exceptions unless handling them at a system boundary.
- Do not use exceptions for normal control flow.
- Avoid logging and rethrowing the same exception unless the log adds unique and necessary context.
- Do not return raw exception messages to clients.
- Do not expose stack traces, SQL errors, internal class names, infrastructure details, or downstream implementation details.
- Convert internal failures into stable application-level errors.
- Keep error codes stable and machine-readable.
- Provide safe and useful client-facing messages.
- Distinguish validation errors, business rule violations, missing resources, conflicts, integration failures, and unexpected system errors.
- Map exceptions consistently through centralized error handling.
- Handle cleanup with language-supported resource management mechanisms where available.
- Do not ignore failures during cleanup unless they are explicitly non-critical and safely logged.

------

## API Conventions

- Use nouns for resource paths and avoid verbs where possible.
- Use plural resource names, such as `/users` and `/orders`.
- Use lowercase paths and consistent naming conventions.
- Use path parameters for resource identity.
- Use query parameters for filtering, sorting, searching, and pagination.
- Avoid deeply nested resource paths.
- Keep API paths stable and predictable.

Use HTTP methods consistently:

- `GET` retrieves resources and must not change server state.
- `POST` creates resources or performs non-idempotent operations.
- `PUT` replaces a complete resource and should be idempotent.
- `PATCH` partially updates a resource.
- `DELETE` removes a resource and should be idempotent where practical.

Use appropriate HTTP status codes:

- `200 OK` for successful retrieval or update with a response body.
- `201 Created` for successful resource creation.
- `202 Accepted` for asynchronous processing that has not completed.
- `204 No Content` for successful operations without a response body.
- `400 Bad Request` for malformed or invalid requests.
- `401 Unauthorized` when authentication is required or invalid.
- `403 Forbidden` when the authenticated caller lacks permission.
- `404 Not Found` when a requested resource does not exist.
- `409 Conflict` for state conflicts or duplicate operations.
- `422 Unprocessable Content` for semantically invalid requests where the project uses it consistently.
- `429 Too Many Requests` when rate limits are exceeded.
- `500 Internal Server Error` for unexpected system failures.
- `502 Bad Gateway`, `503 Service Unavailable`, or `504 Gateway Timeout` for relevant downstream or availability failures.

------

## API Request and Response Design

- Validate request payloads at the API boundary.
- Keep controllers thin: validate input, delegate work, and map responses.
- Do not expose persistence entities directly through APIs.
- Use dedicated request and response models.
- Do not reuse one DTO for unrelated operations merely because the fields are similar.
- Make required and optional fields explicit.
- Use consistent field naming across APIs.
- Avoid returning internal identifiers unless clients need them.
- Do not expose fields that clients should not depend on.
- Use ISO 8601 for date and time values.
- Use UTC internally unless the domain explicitly requires a local timezone.
- Include timezone or offset information for timestamps where appropriate.
- Use consistent serialization formats.
- Avoid ambiguous date-only and time-only fields.
- Use enums or documented constrained values instead of arbitrary strings where appropriate.
- Preserve backward compatibility when adding fields.
- Avoid removing, renaming, or changing the meaning of existing fields without a migration strategy.
- Do not introduce breaking API changes without explicit versioning or coordinated migration planning.

------

## API Error Responses

Return a consistent error structure containing, where applicable:

- A stable machine-readable error code.
- A safe human-readable message.
- A trace or correlation ID.
- Field-level validation details.
- Relevant non-sensitive context.

Example:

```json
{
  "code": "ORDER_NOT_FOUND",
  "message": "The requested order could not be found.",
  "traceId": "abc123",
  "details": []
}
```

- Do not expose raw exception messages.
- Do not expose stack traces.
- Do not expose database queries, SQL errors, internal class names, or framework details.
- Do not expose raw downstream service responses.
- Keep error response formats consistent across endpoints.
- Use stable error codes that clients can safely depend on.
- Do not require clients to parse human-readable messages to determine the error type.

------

## Pagination, Filtering, and Sorting

- Support pagination for collections that may grow large.
- Use a consistent pagination model across the API.
- Define default and maximum page sizes.
- Validate pagination parameters.
- Avoid returning unbounded collections.
- Use stable sorting to prevent duplicate or missing records across pages.
- Document supported filter and sort fields.
- Reject unsupported or invalid filter fields clearly.
- Avoid exposing database-specific query syntax through public APIs.
- Prefer cursor pagination for large or frequently changing datasets where offset pagination becomes unreliable.

------

## Idempotency and Concurrency

- Make retry behavior explicit.
- Support idempotency keys for operations where duplicate submissions could cause harmful side effects.
- Do not automatically retry non-idempotent operations unless they are explicitly designed to be safe.
- Protect state-changing operations from duplicate processing where necessary.
- Use optimistic locking, version fields, or equivalent concurrency controls when conflicting updates are possible.
- Return clear conflict responses when an update cannot be safely applied.
- Avoid hidden last-write-wins behavior for important state changes.

------

## External Integrations

- Isolate external service communication behind dedicated clients or adapters.
- Keep transport-specific models separate from internal domain models where practical.
- Configure connection and read timeouts explicitly.
- Do not use infinite or excessively long timeouts.
- Handle downstream error responses consistently.
- Translate downstream errors into application-level exceptions.
- Do not leak downstream implementation details to API consumers.
- Retry only transient failures.
- Use bounded retries with backoff.
- Avoid retry storms.
- Do not retry validation failures, authentication failures, or other permanent errors.
- Use circuit breakers or similar resilience mechanisms when justified by the system’s reliability requirements.
- Include correlation identifiers when calling downstream services where supported.
- Ensure external calls are observable through logs, metrics, or tracing.

------

## Security

- Never hardcode secrets, passwords, credentials, tokens, or private keys.
- Load secrets from approved configuration or secret-management systems.
- Apply least privilege.
- Validate and sanitize untrusted input.
- Use parameterized database queries.
- Do not construct database queries through unsafe string concatenation.
- Do not log sensitive or regulated data.
- Avoid exposing internal system details in responses.
- Apply authentication and authorization at appropriate boundaries.
- Do not assume authentication automatically implies authorization.
- Validate access to the specific resource being requested.
- Avoid insecure default configurations.
- Use secure transport for external communication.
- Keep dependencies updated according to project policy.
- Do not disable security checks merely to make tests or local development easier.
- Document any intentional security exception.

------

## Testing

- Add or update tests for new behavior and bug fixes.
- Test observable behavior rather than implementation details.
- Keep tests deterministic and independent.
- Avoid tests that depend on execution order.
- Use clear test names that describe the scenario and expected outcome.
- Follow an arrange, act, assert structure where practical.
- Cover happy paths, validation failures, boundary conditions, and important error paths.
- Add regression tests for fixed defects.
- Mock external boundaries, not internal implementation details.
- Avoid excessive mocking that makes tests fragile.
- Prefer realistic test data over meaningless placeholder values.
- Do not use production credentials or production services in tests.
- Keep unit tests fast.
- Use integration tests for database mappings, framework configuration, serialization, and external contract boundaries where appropriate.
- Do not reduce meaningful test coverage merely to make a pipeline pass.
- Treat relevant tests as part of the default definition of done; when automation is impractical, document why and describe the manual verification performed.
- Choose the lowest-cost test level that provides confidence, then use integration or end-to-end tests where framework, persistence, or cross-component behavior is the risk.
- Cover transaction rollback and all-or-nothing behavior for multi-step operations.
- Cover time-boundary behavior such as exact cutoffs, intervals crossing calendar days, and timezone transitions when relevant.
- For concurrency guarantees, coordinate test operations so the critical sections overlap and assert the final persisted state as well as response outcomes.
- Measure coverage against required behaviors and decision branches, not only test counts or line coverage percentages.
- At the end of a complex task, summarize which important requirements are covered by automated tests, which were manually verified, and which remain unverified.


------


## Observability

- Make important business and operational flows observable.
- Add metrics for request volume, latency, failures, retries, and dependency health where relevant.
- Use distributed tracing or correlation IDs across service boundaries where supported.
- Avoid high-cardinality metric labels.
- Do not place user-generated identifiers in metric dimensions unless explicitly approved.
- Ensure errors can be correlated across logs, metrics, and traces.
- Monitor failures that require operational action.
- Avoid alerts for conditions that do not require human intervention.
- Prefer actionable alerts with clear ownership and context.

------

## Change Discipline

- Preserve backward compatibility unless a breaking change is explicitly requested.
- Update tests and documentation when behavior changes.
- Highlight assumptions, risks, and unresolved decisions.
- Do not introduce a new library when the existing stack already provides an adequate solution.
- Avoid generated changes to unrelated files.
- Do not remove existing behavior unless it is explicitly obsolete or requested.
- Prefer incremental and reversible changes.
