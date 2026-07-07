# Python Rules

## Rule Priority

- **Guardrails** are hard constraints unless an explicit repository requirement justifies an exception.
- **Quality Gates** define what must be verified before Python work is reported as complete.
- **Conventions** are default implementation preferences and should follow established repository style when it differs and remains sound.
- **Heuristics** are review signals, not automatic failures.
- **Conditional Guidance** applies only when the relevant Python capability is used.

------

## Guardrails

- Do not catch and silently ignore exceptions.
- Do not use mutable objects as default argument values.
- Do not use bare `except:` or broad exception handling outside a deliberate system boundary.
- Do not build SQL, shell commands, paths, or code from untrusted input through unsafe string concatenation.
- Do not use `eval`, `exec`, unsafe deserialization, or shell execution with untrusted input.
- Do not hardcode secrets, credentials, tokens, or environment-specific endpoints.
- Do not rely on process-local locks or memory for guarantees that must hold across processes or instances.
- Do not expose raw internal exceptions, stack traces, SQL, file paths, or sensitive values to clients.
- Do not perform blocking I/O directly inside an async event loop.
- Do not weaken type checking, tests, linting, or security checks merely to make the build pass.
- Do not modify previously applied database migrations.
- Do not introduce hidden global mutable state.

------

## Quality Gates

Before reporting Python work as complete:

- The project must run on the configured Python version.
- Repository-required formatting, linting, and static type checks must pass.
- Relevant automated tests must pass.
- Packaging or production-build checks must pass when the project is distributed or deployed as a package or image.
- New migrations must validate and use new migration files.
- Public behavior and important failure paths must have test coverage.
- Async, concurrency, transaction, and multi-process guarantees must be verified with realistic execution when they are in scope.
- Security-sensitive parsing, serialization, command execution, and file handling must have focused verification.
- Failed, skipped, or unavailable verification steps must be reported accurately.

------

## Conventions

### Python Style

- Follow the Python version, formatter, linter, type checker, and naming conventions configured by the repository.
- Prefer clear, idiomatic Python over clever compression.
- Keep modules, classes, and functions centered on one primary responsibility.
- Use descriptive `snake_case` names for functions and variables, `PascalCase` for classes, and uppercase names for true constants.
- Keep visibility intentional and use leading underscores for internal implementation details.
- Prefer early returns and straightforward control flow.
- Avoid deeply nested expressions, comprehensions, and chained calls when a loop or named intermediate value is clearer.

### Project Structure

- Follow the repository's existing package structure.
- Package-by-feature and package-by-type are both valid; choose one consistently.
- Keep domain behavior, application orchestration, transport, persistence, mapping, and integrations clearly separated.
- Avoid generic `utils.py`, `helpers.py`, or `common.py` dumping grounds.
- Keep feature-specific code with the feature that owns it.
- Expose clear public package boundaries and avoid circular imports.

### Type Hints

- Add type hints to public functions, reusable components, domain models, and non-trivial internal APIs.
- Prefer precise built-in and standard-library types.
- Use `Any` only at unavoidable untyped boundaries and narrow it promptly.
- Use protocols for behavioral interfaces when inheritance is unnecessary.
- Use dataclasses, named tuples, typed dictionaries, or validation models according to the data's role.
- Prefer explicit optionality and avoid using `None` for multiple unrelated meanings.
- Keep runtime validation separate from static typing concerns.

### Functions and Classes

- Prefer small cohesive functions, but do not fragment simple linear logic.
- Use classes when state, lifecycle, polymorphism, or a stable abstraction boundary justifies them.
- Prefer functions and modules for stateless behavior.
- Use dataclasses for simple structured data when appropriate.
- Keep constructors free from heavy I/O and surprising side effects.
- Use dependency injection through explicit parameters or constructors rather than hidden globals or service locators.
- Prefer composition over deep inheritance.

### Data and Immutability

- Avoid shared mutable defaults and unintended aliasing.
- Prefer immutable values for configuration and domain data where practical.
- Copy or normalize external mutable input at boundaries when ownership matters.
- Use enums or literal types for constrained values.
- Keep serialization models separate from persistence or domain models when their responsibilities differ.

### Exceptions and Error Handling

- Use specific exception types for expected domain, validation, persistence, and integration failures.
- Catch exceptions only to recover, translate, add necessary context, or perform cleanup.
- Preserve the original cause using exception chaining when translating.
- Centralize transport-level exception mapping in web applications.
- Return stable error codes and safe messages from public APIs.
- Log unexpected failures once at the handling boundary.
- Use context managers and `finally` for reliable cleanup.

### Logging

- Use the standard logging framework or the repository's approved structured logger.
- Use parameterized logging rather than preformatted string concatenation for deferred messages.
- Include useful identifiers such as correlation ID, entity ID, operation, and outcome.
- Avoid logging full payloads or sensitive values.
- Use log levels consistently and avoid duplicate logging across layers.

### Configuration

- Load environment-specific configuration from environment variables, configuration files, or approved secret stores.
- Use typed configuration models when configuration is substantial.
- Validate required configuration at startup.
- Keep safe defaults limited to local or test environments.
- Avoid import-time configuration side effects that make tests or startup order fragile.

### Resource Management

- Use context managers for files, locks, database sessions, network clients, and other resources.
- Close or release resources promptly.
- Avoid slow external work while holding locks, transactions, or scarce connections.
- Define ownership and lifecycle for long-lived clients and executors.

### Persistence and Transactions

- Keep persistence access separate from transport concerns.
- Use parameterized database access and explicit transaction boundaries.
- Group related writes atomically when they must remain consistent.
- Keep transactions short and avoid external calls inside them where practical.
- Use database constraints as final protection for critical invariants.
- Translate expected constraint and concurrency failures into stable application errors.
- Do not use a pre-insert existence check as the sole uniqueness guarantee.
- Use consistent lock order when one operation coordinates multiple records.

### APIs and Serialization

- Use explicit request and response models for public APIs.
- Validate external input at the boundary and business rules in the application or domain layer.
- Keep internal implementation details out of public responses.
- Use consistent date, time, enum, pagination, and error formats.
- Prefer timezone-aware datetime values for actual instants.
- Do not serialize arbitrary Python objects or internal model state directly.

### Date and Time

- Use timezone-aware datetimes for global instants.
- Prefer UTC internally unless the domain requires local civil time.
- Inject or wrap the current-time source when business rules depend on time.
- Use explicit time zones when converting dates and intervals.
- Avoid mixing naive and aware datetimes.
- Test exact boundaries, calendar transitions, and daylight-saving behavior when relevant.

### Testing

- Use the repository's established test framework and conventions.
- Test observable behavior rather than private implementation details.
- Keep tests deterministic, isolated, and independent of execution order.
- Use fixtures for clear setup and lifecycle management without building an opaque fixture framework.
- Mock external boundaries rather than internal implementation details.
- Cover success, validation, boundaries, important errors, regressions, and rollback behavior.
- Use integration tests for database mappings, framework configuration, serialization, and external contracts where those are the risk.
- Use real overlapping tasks, threads, processes, or transactions when concurrency guarantees are in scope.

### Dependencies and Packaging

- Use the repository's dependency and environment tooling.
- Pin or constrain dependencies according to repository policy.
- Keep runtime and development dependencies separated.
- Do not add a library when the standard library or existing stack is adequate.
- Review maintenance, security, license, platform, and transitive impact before adding dependencies.
- Keep package metadata, entry points, and supported Python versions accurate.

### Documentation

- Document public APIs, configuration, non-obvious behavior, side effects, retries, transaction boundaries, and known limitations where relevant.
- Use docstrings for public modules, classes, and functions when the repository convention expects them.
- Explain why, not obvious syntax.
- Keep examples and documentation synchronized with behavior.

------

## Heuristics

- A module or class with many unrelated operations may have accumulated multiple responsibilities.
- Many function parameters may indicate a request object, configuration model, or domain value object would be clearer.
- Repeated dictionaries with implicit keys may indicate a typed model or dataclass is needed.
- Extensive use of `Any`, assertions, or type-ignore comments may indicate an unclear boundary or missing type model.
- Deep inheritance, metaprogramming, decorators, or dynamic dispatch may add more complexity than value.
- Import-time I/O or mutable globals may make startup and tests fragile.
- Many mocks of internal functions may indicate that responsibilities or boundaries are misplaced.
- Repeated mapping, validation, pagination, or error translation may justify a focused component.
- A synchronous API used from many async paths may require an async client or explicit executor boundary.
- Add frameworks, task queues, ORMs, validation libraries, or dependency-injection containers only when they address a current requirement or established project standard.

------

## Conditional Guidance

Apply only when the feature or existing repository uses the relevant capability.

### AsyncIO

- Use async only for genuinely concurrent I/O workloads.
- Use async-compatible libraries throughout the call path.
- Do not call blocking I/O directly from the event loop.
- Bound concurrency with semaphores, pools, queues, or worker limits.
- Propagate cancellation and clean up tasks and resources.
- Use structured task management where supported.

### Web Frameworks

- Keep route handlers focused on transport validation, context, delegation, and response mapping.
- Keep business rules outside framework handlers.
- Centralize exception mapping, authentication context, and cross-cutting request behavior.
- Use the framework's dependency and lifecycle mechanisms deliberately.
- Do not return ORM entities or arbitrary model internals directly.

### ORMs and Migrations

- Keep ORM models focused on persistence responsibilities.
- Avoid accidental N+1 queries and unbounded relationship loading.
- Use eager loading, projections, or explicit queries when required by the access pattern.
- Keep migrations additive and safe for existing data.
- Test ORM mappings and custom queries against the target database when behavior is database-specific.

### Data Processing

- Prefer vectorized or streaming processing when datasets justify it.
- Avoid loading unbounded data into memory.
- Process large workloads in bounded batches and make long-running jobs resumable.
- Define missing-data, type-conversion, and duplicate-row behavior explicitly.
- Validate input schemas and output invariants.

### Background Jobs and Queues

- Keep job entry points small and delegate business behavior.
- Design for retries, duplicate delivery, idempotency, and partial failure.
- Configure bounded workers and explicit timeouts.
- Preserve correlation context and define dead-letter or failure handling.
- Do not rely on in-memory scheduling or locks for distributed guarantees.

### CLI Applications

- Use clear commands, options, exit codes, and help text.
- Validate input and produce safe actionable errors.
- Keep command parsing separate from business behavior.
- Avoid interactive prompts in automation paths unless explicitly requested.
- Support non-zero exit codes for failures.

### Serialization and Deserialization

- Use safe serializers and explicit schemas for untrusted input.
- Do not use `pickle`, unsafe YAML loaders, or arbitrary object deserialization across trust boundaries.
- Version long-lived event or storage formats.
- Reject unknown or invalid fields according to the contract.

### Scientific and Numeric Code

- Define precision, units, missing values, and numerical tolerances explicitly.
- Use numerically stable algorithms and compare floating-point values with appropriate tolerances.
- Seed randomness in deterministic tests.
- Validate results against known cases or reference implementations.

### Security

- Use approved cryptographic libraries and algorithms.
- Validate file paths, archive contents, redirects, and subprocess arguments.
- Use `subprocess` with argument lists and avoid `shell=True` for untrusted input.
- Limit upload size, decompression ratio, and temporary-file exposure where relevant.
- Keep dependencies patched according to repository policy.

### Observability

- Use structured logs, metrics, and tracing according to the repository's operational model.
- Keep metric labels low-cardinality.
- Preserve correlation context through async tasks, jobs, and integrations.
- Avoid duplicate reporting and sensitive payloads.
