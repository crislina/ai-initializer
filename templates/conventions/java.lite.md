# Java Rules Lite

## Rule Priority

- **Guardrails** are hard constraints for small Java projects, CLI tools, demos, and personal utilities.
- **Quality Gates** define minimum verification before reporting completion.
- **Conventions** are defaults. Follow the repository's existing style when it is clear and sound.

------

## Guardrails

- Do not hardcode secrets, credentials, tokens, environment-specific URLs, or machine-specific paths.
- Do not expose raw exceptions, stack traces, file paths, credentials, or sensitive internals to users.
- Do not catch and silently ignore exceptions.
- Do not use string concatenation to build SQL, shell commands, file paths, or code from untrusted input.
- Do not introduce hidden global mutable state for behavior that must be predictable or testable.
- Do not disable tests, validation, linting, formatting, or build checks merely to make the project pass.
- Do not make broad rewrites, package reorganizations, or dependency changes unless they are needed for the task.

------

## Quality Gates

Before reporting Java work as complete:

- Java compilation must pass when a compile command is available.
- Relevant tests must pass when a test setup exists.
- Formatting, linting, static analysis, or build checks required by the repository should pass.
- The changed CLI command, library function, or runtime path should be smoke-tested when practical.
- Failed, skipped, or unavailable verification steps must be reported accurately.

------

## Conventions

### Java Style

- Follow the Java version, formatter, naming, and static-analysis configuration defined by the project.
- Use meaningful class, method, variable, and package names.
- Keep visibility as restrictive as practical.
- Prefer simple, readable code over clever stream chains or unnecessary abstractions.
- Prefer immutable values where practical.
- Return empty collections instead of `null`.
- Avoid mutable static state.

### Structure

- Follow the existing package structure rather than reorganizing the project.
- Keep modules, classes, and methods centered on one primary responsibility.
- Avoid generic `util` packages for unrelated behavior.
- Extract helpers only when they make the main flow easier to understand or remove real duplication.
- Use interfaces when they represent a real boundary or multiple implementations, not automatically for every class.

### Errors, Configuration, and Resources

- Catch exceptions only to recover, translate, add useful context, or clean up.
- Preserve useful error context without leaking sensitive internals.
- Load environment-specific configuration from arguments, environment variables, config files, or approved secret stores.
- Use try-with-resources for files, streams, network clients, database connections, and other closeable resources.
- Validate external input before using it in important logic.

### CLI Behavior

- Keep command parsing separate from core business behavior.
- Provide clear options, exit codes, and safe actionable error messages.
- Avoid interactive prompts in automation paths unless explicitly requested.
- Do not print secrets or sensitive data in logs or console output.

### Testing

- Add or update focused tests when behavior changes and the project has a practical test setup.
- Test observable behavior rather than private implementation details.
- Cover the main success path and important failure paths.
- Keep tests deterministic and independent of local machine state.
