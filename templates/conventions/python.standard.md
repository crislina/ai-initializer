# Python Rules Standard

## Rule Priority

- **Guardrails** are hard constraints for formal Python business projects unless an explicit repository requirement justifies an exception.
- **Quality Gates** define what must be verified before Python work is reported as complete.
- **Conventions** are default implementation preferences and should follow established repository style when it differs and remains sound.
- **Heuristics** are review signals, not automatic failures.

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

------

## Conventions

### Python Style and Structure

- Follow the Python version, formatter, linter, type checker, and naming conventions configured by the repository.
- Prefer clear, idiomatic Python over clever compression.
- Keep modules, classes, and functions centered on one primary responsibility.
- Package-by-feature and package-by-type are both valid; choose one consistently.
- Keep domain behavior, application orchestration, transport, persistence, mapping, and integrations clearly separated.
- Avoid generic `utils.py`, `helpers.py`, or `common.py` dumping grounds.

### Type Hints and Data Models

- Add type hints to public functions, reusable components, domain models, and non-trivial internal APIs.
- Use `Any` only at unavoidable untyped boundaries and narrow it promptly.
- Use dataclasses, typed dictionaries, validation models, or domain classes according to the data's role.
- Prefer explicit optionality and avoid using `None` for multiple unrelated meanings.
- Keep serialization models separate from persistence or domain models when their responsibilities differ.

### Functions, Classes, and Configuration

- Prefer small cohesive functions, but do not fragment simple linear logic.
- Use classes when state, lifecycle, polymorphism, or a stable abstraction boundary justifies them.
- Use dependency injection through explicit parameters or constructors rather than hidden globals or service locators.
- Keep constructors free from heavy I/O and surprising side effects.
- Load environment-specific configuration from environment variables, configuration files, or approved secret stores.
- Validate required configuration at startup.

### Exceptions and Logging

- Use specific exception types for expected domain, validation, persistence, and integration failures.
- Catch exceptions only to recover, translate, add necessary context, or perform cleanup.
- Preserve the original cause using exception chaining when translating.
- Centralize transport-level exception mapping in web applications.
- Return stable error codes and safe messages from public APIs.
- Log unexpected failures once at the handling boundary.
- Avoid logging full payloads or sensitive values.

### Persistence, Transactions, and APIs

- Keep persistence access separate from transport concerns.
- Use parameterized database access and explicit transaction boundaries.
- Group related writes atomically when they must remain consistent.
- Keep transactions short and avoid external calls inside them where practical.
- Use database constraints as final protection for critical invariants.
- Translate expected constraint and concurrency failures into stable application errors.
- Use explicit request and response models for public APIs.
- Validate external input at the boundary and business rules in the application or domain layer.

### Resource Management and Time

- Use context managers for files, locks, database sessions, network clients, and other resources.
- Close or release resources promptly.
- Avoid slow external work while holding locks, transactions, or scarce connections.
- Use timezone-aware datetimes for global instants.
- Inject or wrap the current-time source when business rules depend on time.

### Testing

- Use the repository's established test framework and conventions.
- Test observable behavior rather than private implementation details.
- Keep tests deterministic, isolated, and independent of execution order.
- Mock external boundaries rather than internal implementation details.
- Cover success, validation, boundaries, important errors, regressions, and rollback behavior.
- Use integration tests for database mappings, framework configuration, serialization, and external contracts where those are the risk.
- Use real overlapping tasks, threads, processes, or transactions when concurrency guarantees are in scope.
