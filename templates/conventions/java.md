# Java Rules

## Rule Priority

- **Guardrails** are hard constraints unless an explicit repository requirement justifies an exception.
- **Quality Gates** define what must be verified before Java work is reported as complete.
- **Conventions** are default implementation preferences and should follow established repository style when it differs and remains sound.
- Explicit requirements and repository-specific instructions take precedence.

------

## Guardrails

- Do not hardcode secrets, credentials, tokens, environment-specific URLs, or operational configuration in business code.
- Do not expose raw internal exceptions, stack traces, file paths, SQL, class names, credentials, or sensitive implementation details to users or clients.
- Do not catch and silently ignore exceptions.
- Do not build SQL, shell commands, paths, serialized data, or code from untrusted input through unsafe string concatenation.
- Do not rely on Java `synchronized`, static locks, local files, or process-local state for guarantees that must hold across processes or instances.
- Do not introduce hidden global mutable state.
- Do not weaken tests, linting, formatting, static analysis, or security checks merely to make the build pass.
- Do not add a dependency when the JDK or existing stack already provides an adequate solution.

------

## Quality Gates

Before reporting Java work as complete:

- Java compilation must pass.
- Relevant automated tests must pass.
- Repository-required formatting, linting, static analysis, and build checks must pass.
- Packaging or production-build checks must pass when the project is distributed or deployed as a package, executable, service, or image.
- Public behavior and important failure paths must have test coverage proportional to risk.
- Failed, skipped, or unavailable verification steps must be reported accurately.

------

## Conventions

### Java Style

- Follow the Java version, formatter, and static-analysis configuration defined by the project.
- Use meaningful class, method, variable, and package names.
- Keep visibility as restrictive as practical.
- Use `final` for required dependencies and values that should not change.
- Prefer immutable objects and records for simple immutable data carriers when appropriate.
- Prefer readability over compressing logic into a single expression.
- Prefer loops over streams when streams obscure stateful or side-effecting logic.
- Avoid mutable static state.

### Structure and Responsibilities

- Follow the repository's existing package structure.
- Keep application orchestration, domain behavior, I/O, persistence, parsing, formatting, and external integrations clearly separated.
- Keep modules, classes, and methods centered on one primary responsibility.
- Avoid generic `util` packages for unrelated behavior.
- Use interfaces for multiple implementations, real module boundaries, public extension points, or established repository conventions.
- Do not create interfaces solely for unit testing.

### Null and Data Modeling

- Use `Optional<T>` for return values when absence is expected and meaningful.
- Do not use `Optional` as a field, DTO property, or method parameter.
- Return empty collections instead of `null`.
- Avoid `Optional.get()` unless presence has already been established.
- Prefer immutable DTOs, records, enums, and value objects where they clarify the domain.
- Keep serialization models separate from internal domain models when their responsibilities differ.

### Errors, Logging, and Configuration

- Use specific exception types for expected validation, domain, persistence, and integration failures.
- Catch exceptions only to recover, translate, add necessary context, or perform cleanup.
- Preserve the original cause when translating exceptions.
- Log unexpected failures once at the handling boundary.
- Use parameterized logging and avoid logging full payloads or sensitive values.
- Load configuration from arguments, environment variables, files, or approved secret stores.
- Validate required configuration at startup.

### Resource Management and I/O

- Use try-with-resources for files, streams, database connections, network clients, locks, and other closeable resources.
- Close or release resources promptly.
- Avoid slow external work while holding locks, transactions, or scarce connections.
- Validate file paths, archive contents, redirects, and subprocess arguments that come from external input.
- Use process execution APIs with argument lists and avoid shell execution for untrusted input.

### CLI, Batch, and Library Behavior

- Keep command parsing separate from business behavior.
- Provide clear commands, options, exit codes, and help text.
- Avoid interactive prompts in automation paths unless explicitly requested.
- Make batch jobs resumable or idempotent when partial failure is realistic.
- Keep public library APIs stable and document breaking changes.
- Avoid printing secrets, tokens, or sensitive payloads to logs or console output.

### Testing

- Use JUnit 5 unless the project specifies otherwise.
- Test observable behavior rather than private implementation details.
- Keep tests deterministic and independent of execution order.
- Mock external boundaries rather than the class under test or simple value objects.
- Cover success, validation, boundary, error, regression, resource cleanup, and retry behavior.
- Use integration tests when filesystem, database, process, network, serialization, or cross-component behavior is the risk.
