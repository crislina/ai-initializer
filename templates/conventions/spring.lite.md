# Spring Rules Lite

## Rule Priority

- **Guardrails** are hard constraints for small Spring projects and demos.
- **Quality Gates** define minimum verification before reporting completion.
- **Conventions** are defaults. Follow the repository's existing Spring style when it is clear and sound.
- Apply the Java rules alongside these Spring-specific rules.

------

## Guardrails

- Do not use field injection.
- Do not access repositories directly from controllers when a service layer already exists or business behavior is involved.
- Do not expose JPA entities directly as public API request or response contracts.
- Do not place transaction boundaries in controllers.
- Do not return raw exceptions, SQL errors, class names, or stack traces through APIs.
- Do not hardcode secrets, credentials, or environment-specific URLs.
- Do not modify previously applied Flyway or Liquibase migrations.
- Do not disable tests, validation, or build checks merely to make the project pass.

------

## Quality Gates

Before reporting Spring work as complete:

- Java compilation must pass when a compile command is available.
- Relevant Spring, controller, service, or repository tests must pass when a test setup exists.
- Formatting, linting, or build checks required by the repository should pass.
- New schema changes must use a new migration file.
- The changed API or runtime flow should be smoke-tested when practical.
- Failed, skipped, or unavailable verification steps must be reported accurately.

------

## Conventions

### Structure

- Keep controllers focused on HTTP concerns, validation, delegation, and response construction.
- Put business behavior in services or domain components.
- Keep repositories focused on database access.
- Follow the existing package structure rather than reorganizing the project.
- Avoid creating layers or packages that the small project does not need.

### Spring Style

- Use constructor injection with required dependencies stored in `final` fields.
- Use `@RestController` for REST APIs.
- Use explicit request and response DTOs.
- Use `@Valid` or `@Validated` where appropriate.
- Keep configuration in properties or environment-backed configuration rather than business code.
- Use `@ConfigurationProperties` for grouped configuration when it is more than a few values.

### Persistence and Transactions

- Use parameterized repository or query APIs.
- Use a service-level transaction when multiple writes must succeed or fail together.
- Keep migrations descriptive and additive where practical.
- Specify ordering when result order matters.
- Avoid loading unbounded data or accidentally causing obvious N+1 query behavior.

### Testing

- Add or update focused tests when behavior changes and the project has a practical test setup.
- Use unit tests for isolated business logic and Spring slice or integration tests for framework behavior when needed.
- Test API-visible success and failure behavior rather than private method details.
