# General Engineering Rules Standard

## Rule Priority

- **Guardrails** are hard constraints for formal business projects unless an explicit project requirement justifies an exception.
- **Quality Gates** define what must be verified before work is reported as complete.
- **Conventions** are default preferences. Follow repository conventions when they differ and remain sound.
- **Heuristics** are review signals, not automatic failures.
- Correctness, security, explicit requirements, and repository-specific instructions take precedence.

------

## Guardrails

- Do not replace explicitly required behavior with a superficially similar shortcut.
- Do not claim completion when material requirements are unmet or unverified.
- Do not expose persistence entities directly as public API request or response contracts.
- Do not place business logic or persistence access directly in controllers or route handlers.
- Multi-write business operations that must succeed or fail together must have a clear transaction boundary.
- Do not rely only on a pre-insert existence check for uniqueness, integrity, or concurrent correctness.
- Do not expose raw exception messages, stack traces, SQL, internal class names, credentials, or sensitive implementation details to clients.
- Do not hardcode secrets, credentials, environment-specific URLs, or operational configuration in business code.
- Do not disable, weaken, or delete meaningful tests or checks merely to make a build pass.
- Do not modify previously applied database migration files; add a new migration for schema changes.
- Do not leave placeholders, fake implementations, core-path TODOs, or disabled checks as a substitute for completion.

------

## Quality Gates

Before reporting completion:

- Review the implementation against explicit requirements, business rules, prohibited approaches, and acceptance criteria.
- Run relevant compile, test, lint, formatting, type-check, migration validation, and production-build commands supported by the repository.
- Fix failures caused by the change rather than suppressing checks or weakening tests.
- Verify explicitly requested runtime flows, or report them accurately as unverified.
- Confirm schema changes use new migration files and existing migrations remain unchanged.
- Review the final diff for unrelated edits, generated output, logs, local data, credentials, and temporary files.
- Summarize which material requirements are covered by automated tests, manually verified, or still unverified.

------

## Requirement Coverage

- Turn explicit requirements, business rules, prohibited approaches, and required verification into a checklist proportional to task size.
- Distinguish required behavior from examples, suggestions, and optional enhancements.
- Treat validation, transactions, error handling, logging, time handling, pagination, and concurrency as first-class behavior when relevant.
- Trace material behavior to implementation and, where practical, tests or documented manual verification.
- Revisit the checklist before reporting completion.

------

## Implementation Workflow

- Read repository instructions and relevant conventions before editing.
- Inspect the build configuration, source structure, nearby code, tests, and formatting or lint setup.
- Identify affected contracts, existing patterns, material risks, and required verification.
- Ask for clarification only when a missing decision would materially change behavior or scope; otherwise state a reasonable assumption.
- Implement the smallest coherent end-to-end change.
- Keep changes focused and preserve existing conventions unless there is a concrete reason to deviate.
- Add or update tests at the lowest practical level that verifies the changed behavior.
- Review the final diff before reporting completion.

------

## Conventions

### Architecture and Responsibilities

- Separate transport, business logic, persistence, mapping, configuration, and external integrations.
- Controllers and route handlers should handle request concerns, validation, delegation, and response construction.
- Business rules should remain independent of HTTP and persistence details where practical.
- Persistence logic should remain in repositories, gateways, or persistence-focused components.
- External integrations should be isolated behind dedicated clients or adapters.
- Follow the repository's established package or folder style; for a new project, choose one clear style and apply it consistently.

### Code Quality

- Prefer simple, readable solutions over clever or unnecessary abstraction.
- Use meaningful names and keep functions, classes, and modules centered on one primary responsibility.
- Avoid duplicated business logic; extract shared logic only when it represents the same concept and should evolve together.
- Move substantial mapping, query construction, pagination parsing, or reusable validation into focused components when they obscure business logic.
- Avoid adding enterprise mechanisms unless they address a current requirement or realistic risk.

### Validation and Errors

- Validate input at system boundaries and return clear, stable errors.
- Validate required fields, ranges, formats, supported values, and relevant cross-field rules.
- Keep persisted-state and business validation in the business or application layer.
- Use typed domain or application errors for expected failures.
- Centralize API exception mapping where the framework supports it.
- Return safe client-facing messages and stable machine-readable error codes where APIs need them.
- Log unexpected failures once at the handling boundary with useful context.

### API Design

- Use stable resource-oriented paths and consistent HTTP method semantics.
- Use path parameters for identity and query parameters for filtering, searching, sorting, and pagination.
- Use dedicated request and response models rather than persistence entities.
- Make required and optional fields explicit.
- Preserve backward compatibility unless a breaking change is explicitly requested and planned.
- Return appropriate HTTP status codes for validation, missing resources, conflicts, dependency failures, and unexpected failures.

### Data, Transactions, and Migrations

- Use database-backed filtering, sorting, and pagination for collections that may grow large.
- Define sensible default and maximum page sizes.
- Use transactions for multi-write operations that must remain consistent.
- Keep transactions short and avoid slow external calls inside them where practical.
- Preserve critical invariants with database constraints or equivalent shared mechanisms.
- Use new migration files for schema changes and keep migrations focused, repeatable, and reviewable.
- Consider safe rollout and rollback for high-risk schema or data changes.

### Testing

- Treat relevant tests as part of the definition of done.
- Test observable behavior rather than private implementation details.
- Cover required behavior, important decision branches, validation failures, boundaries, error paths, and regressions.
- Use the lowest-cost test level that gives confidence; use integration tests when framework, persistence, or cross-component behavior is the risk.
- Cover rollback and all-or-nothing behavior for relevant multi-step operations.
- When automation is impractical, document why and describe reproducible manual verification.

### Change Discipline

- Keep changes minimal and aligned with the requested objective.
- Do not refactor unrelated code as part of a feature or bug fix.
- Preserve backward compatibility unless a breaking change is explicitly requested.
- Update tests and documentation when behavior changes.
- Highlight assumptions, risks, and unresolved decisions.

------

## Heuristics

- A service, controller, route handler, module, or component with many unrelated responsibilities may need decomposition.
- Many dependencies, parameters, flags, or options may indicate an unclear boundary or missing request, criteria, or value object.
- Substantial or repeated mapping, pagination, sorting, validation, query construction, or error translation may justify a focused support component.
- Dynamic query construction that obscures business orchestration may justify a dedicated query component.
- Repeated translation between the same models may justify a mapper; trivial one-off mappings do not require one.
- Extensive internal mocking may indicate responsibilities or boundaries are misplaced.
- Add framework, platform, security, observability, or operational mechanisms only when they address a current requirement or realistic risk.
