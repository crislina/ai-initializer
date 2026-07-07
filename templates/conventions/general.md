# General Engineering Rules

## Rule Priority

- **Guardrails** are hard constraints. Violations are quality or correctness issues unless an explicit project requirement justifies an exception.
- **Quality Gates** define what must be verified before work is reported as complete.
- **Conventions** are default preferences. Follow existing repository conventions when they differ and remain sound.
- **Heuristics** are review signals, not automatic failures.
- **Conditional Guidance** applies only when the relevant capability is used.
- Correctness, security, explicit requirements, and repository-specific instructions take precedence over general preferences.

------

## Guardrails

- Do not replace explicitly required behavior with a superficially similar shortcut.
- Do not claim completion when material requirements are unmet or unverified.
- Do not expose persistence entities directly as public API request or response contracts.
- Do not place business logic or persistence access directly in controllers.
- Multi-write business operations that must succeed or fail together must have a clear transaction boundary.
- Do not rely only on a pre-insert existence check for concurrent uniqueness or integrity guarantees.
- Do not use process-local locks or single-instance assumptions for guarantees that must hold across instances.
- Do not expose raw exception messages, stack traces, SQL, internal class names, credentials, or sensitive implementation details to clients.
- Do not hardcode secrets, credentials, environment-specific URLs, or operational configuration in business code.
- Do not disable, weaken, or delete meaningful tests or checks merely to make a build pass.
- Do not modify previously applied database migration files; add a new migration for schema changes.
- Do not leave placeholders, fake implementations, core-path TODOs, or disabled checks as a substitute for completion.

------

## Quality Gates

Before reporting completion:

- Review the implementation against explicit requirements, business rules, prohibited approaches, and acceptance criteria.
- Run relevant compile, test, lint, formatting, type-check, and production-build commands supported by the repository.
- Fix failures caused by the change rather than suppressing checks or weakening tests.
- Verify explicitly requested runtime flows, or report them accurately as unverified.
- Confirm schema changes use new migration files and existing migrations remain unchanged.
- Review the final diff for unrelated edits, generated output, logs, local data, credentials, and temporary files.
- Summarize which material requirements are covered by automated tests, manually verified, or still unverified.
- Report failed, skipped, unavailable, incomplete, or partially verified work accurately.

------

## Requirement Coverage

- Turn explicit requirements, business rules, prohibited approaches, and required verification into a working checklist proportional to task size.
- Distinguish required behavior from examples, suggestions, and optional enhancements.
- Trace material requirements to implementation and, where behavior matters, tests or documented manual verification.
- Treat validation, concurrency, transactions, error handling, logging, time handling, and pagination as first-class behavior when relevant.
- Revisit the checklist after implementation and report unmet or partially verified items.

------

## Implementation Workflow

- Read repository instructions and relevant conventions before editing.
- Inspect the build configuration, source structure, nearby code, tests, and formatting or lint setup.
- Identify the affected contracts, existing patterns, material risks, and required verification.
- Ask for clarification only when a missing decision would materially change behavior or scope; otherwise state a reasonable assumption.
- Implement the smallest coherent end-to-end change.
- Keep changes focused and preserve existing conventions unless there is a concrete reason to deviate.
- Add or update tests at the lowest practical level that verifies the changed behavior.
- Keep final reports concise, accurate, and evidence-based.

------

## Conventions

### Architecture and Responsibilities

- Separate transport, business logic, persistence, mapping, configuration, and external integrations.
- Controllers should handle HTTP concerns, input validation, delegation, and response construction.
- Business rules should remain independent of HTTP and persistence details where practical.
- Persistence logic should remain in repositories or persistence-focused components.
- External integrations should be isolated behind dedicated clients or adapters.
- Both package-by-layer and package-by-feature are valid. Follow the repository's established style; for a new project, choose one and apply it consistently.
- Evaluate architecture by responsibility clarity, dependency direction, duplication, testability, and ability to change safely, not folder names alone.

### Code Quality

- Prefer simple, readable solutions over clever or unnecessary abstraction.
- Use meaningful names and keep classes/methods centered on one primary responsibility.
- Prefer high cohesion, low coupling, and explicit state changes.
- Extract helpers or focused components when non-trivial logic obscures the primary flow.
- Avoid excessive extraction that fragments simple logic.
- Avoid duplicated business logic; extract shared logic only when it represents the same concept and should evolve together.
- Do not improve completeness by concentrating unrelated concerns in one controller or service.
- Move substantial mapping, query construction, pagination parsing, or reusable validation into focused components when they obscure business logic.

### Validation

- Validate input at system boundaries and return clear, stable errors.
- Validate required fields, ranges, formats, supported values, and relevant cross-field rules.
- Keep persisted-state and business validation in the business or application layer.
- Avoid duplicating the same validation across layers without a clear reason.
- Treat external input as untrusted.
- Normalize input only when normalization is part of the documented contract.
- Do not silently correct ambiguous or invalid input.

### Logging and Error Handling

- Use structured logging with parameterized placeholders and useful context such as correlation ID, entity ID, operation, and outcome.
- Avoid logging full request or response payloads unless explicitly required and safely sanitized.
- Use typed domain or application exceptions for expected failures.
- Catch exceptions only to recover, translate, add necessary context, or perform required cleanup.
- Preserve the original cause when translating exceptions.
- Centralize API exception mapping.
- Use stable machine-readable error codes and safe client-facing messages.
- Distinguish validation, business-rule, not-found, conflict, integration, and unexpected failures.
- Log unexpected failures once at the handling boundary.

### API Design

- Use stable resource-oriented paths and consistent HTTP method semantics.
- Use path parameters for identity and query parameters for filtering, searching, sorting, and pagination.
- Use dedicated request and response models.
- Make required and optional fields explicit.
- Use consistent field names, serialization formats, and timestamp formats.
- Preserve backward compatibility unless a breaking change is explicitly requested and planned.
- Return consistent API errors with stable code, safe message, correlation ID, and field details where applicable.
- Use appropriate HTTP status codes for validation, missing resources, conflicts, dependency failures, and unexpected failures.

### Pagination, Filtering, and Sorting

- Use database-backed filtering, sorting, and pagination for collections that may grow large.
- Define sensible default and maximum page sizes.
- Validate pagination parameters and supported sort fields.
- Use stable sorting where inconsistent ordering could cause duplicate or missing records.
- Avoid exposing database-specific query syntax through public APIs.
- Prefer cursor pagination only when dataset size or mutation rate makes offset pagination unsuitable.

### Idempotency and Concurrency

- Make retry behavior explicit for state-changing operations.
- Support idempotency when duplicate submissions could cause harmful side effects.
- Use optimistic locking, pessimistic locking, atomic statements, database constraints, or equivalent shared mechanisms when conflicts are possible.
- Return clear conflict responses when an operation cannot be safely applied.
- Avoid hidden last-write-wins behavior for important state changes.

### Testing

- Treat relevant tests as part of the definition of done.
- Test observable behavior rather than private implementation details.
- Keep tests deterministic and independent.
- Cover required behavior, important decision branches, validation failures, boundaries, error paths, and regressions rather than optimizing for test count.
- Choose the lowest-cost test level that provides confidence, using integration or end-to-end tests when framework, persistence, or cross-component behavior is the risk.
- Cover rollback and all-or-nothing behavior for relevant multi-step operations.
- For concurrency guarantees, coordinate overlapping operations and assert both outcomes and final persisted state.
- When automation is impractical, document why and describe reproducible manual verification.

### Change Discipline

- Keep changes minimal and aligned with the requested objective.
- Do not refactor unrelated code as part of a feature or bug fix.
- Preserve backward compatibility unless a breaking change is explicitly requested.
- Update tests and documentation when behavior changes.
- Highlight assumptions, risks, and unresolved decisions.
- Avoid new libraries when the existing stack already provides an adequate solution.
- Prefer incremental and reversible changes.

------

## Heuristics

- Review a service or controller for decomposition when it accumulates unrelated responsibilities; line count alone is not a violation.
- Many constructor dependencies may indicate too many responsibilities.
- Methods with many related parameters may benefit from a request, criteria, or value object.
- Substantial or repeated pagination, sorting, mapping, query construction, or reusable validation may justify a focused support component.
- Dynamic query construction that obscures business orchestration may justify a dedicated query component.
- Repeated translation between the same models may justify a mapper; trivial one-off mappings do not require one.
- Add enterprise mechanisms only when they address a current requirement or realistic risk.

------

## Conditional Guidance

Apply only when the feature or existing repository uses the relevant capability.

### Security

- Apply authentication and authorization at appropriate boundaries.
- Validate access to the specific resource being requested.
- Apply least privilege and secure transport for external communication.
- Do not disable security controls merely to simplify development or tests.
- Document intentional security exceptions.

### External Integrations

- Isolate external communication behind dedicated clients or adapters.
- Configure connection and read timeouts explicitly.
- Translate downstream failures into application-level errors without leaking implementation details.
- Retry only transient failures with bounded retries and backoff.
- Propagate correlation identifiers where supported.

### Observability

- Add metrics and tracing only where they provide operational value.
- Prefer low-cardinality metric dimensions.
- Avoid user-generated or unbounded identifiers as metric labels.
- Ensure important failures can be correlated across logs, metrics, and traces.