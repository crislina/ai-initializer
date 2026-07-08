# Python Rules Lite

## Rule Priority

- **Guardrails** are hard constraints for small Python projects, demos, personal tools, and scripts.
- **Quality Gates** define minimum verification before reporting completion.
- **Conventions** are defaults. Follow the repository's existing style when it is clear and sound.

------

## Guardrails

- Do not catch and silently ignore exceptions.
- Do not use mutable objects as default argument values.
- Do not use bare `except:` outside a deliberate top-level boundary.
- Do not build SQL, shell commands, paths, or code from untrusted input through unsafe string concatenation.
- Do not use `eval`, `exec`, unsafe deserialization, or shell execution with untrusted input.
- Do not hardcode secrets, credentials, tokens, or machine-specific paths.
- Do not expose raw exceptions, stack traces, SQL, file paths, or sensitive values to users.
- Do not disable tests, type checks, linting, or security checks merely to make the project pass.

------

## Quality Gates

Before reporting Python work as complete:

- Run the relevant tests when a test setup exists.
- Run formatting, linting, or type checks required by the repository when available.
- Exercise the changed command, function, API, or script path at least once when practical.
- Failed, skipped, or unavailable verification steps must be reported accurately.

------

## Conventions

### Python Style

- Follow the configured Python version, formatter, linter, and naming conventions.
- Prefer clear, idiomatic Python over clever compression.
- Use descriptive `snake_case` names for functions and variables, `PascalCase` for classes, and uppercase names for true constants.
- Prefer early returns and straightforward control flow.
- Avoid import-time I/O and surprising global mutable state.

### Structure

- Keep modules and functions centered on one main responsibility.
- Avoid generic `utils.py`, `helpers.py`, or `common.py` dumping grounds.
- Use classes when state, lifecycle, or a stable abstraction boundary justifies them.
- Use explicit parameters or constructors rather than hidden globals.

### Errors, Config, and I/O

- Catch exceptions only to recover, translate, add context, or clean up.
- Preserve useful error context without leaking sensitive internals.
- Load environment-specific configuration from environment variables, config files, or approved secret stores.
- Use context managers for files, database sessions, network clients, and other resources.
- Use safe serializers and explicit schemas for untrusted input.

### Testing

- Test observable behavior rather than private implementation details.
- Cover the main success path and important failure paths.
- Keep tests deterministic and independent of local machine state.
- Mock external boundaries rather than internal implementation details.
