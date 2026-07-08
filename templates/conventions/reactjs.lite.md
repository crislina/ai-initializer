# React and TypeScript Rules Lite

## Rule Priority

- **Guardrails** are hard constraints for small React apps, demos, prototypes, and personal tools.
- **Quality Gates** define minimum verification before reporting completion.
- **Conventions** are defaults. Follow the repository's existing style when it is clear and sound.

------

## Guardrails

- Do not use `any` to bypass type safety.
- Do not silence TypeScript, lint, or hook dependency errors without addressing the underlying issue.
- Do not put secrets or credentials in frontend source code or frontend environment variables.
- Do not treat frontend validation, route guards, or hidden UI controls as security boundaries.
- Do not render untrusted HTML without an approved sanitization boundary.
- Do not expose raw backend exceptions, stack traces, or sensitive payloads to users or logs.
- Do not mutate React props or state.
- Do not call hooks conditionally or outside React components and custom hooks.
- Do not disable relevant tests or checks merely to make the build pass.

------

## Quality Gates

Before reporting React work as complete:

- TypeScript type checking should pass when configured.
- Repository-required linting, formatting, tests, and production build should pass when available.
- New user-visible behavior should be manually smoke-tested.
- Loading, empty, validation, and error states should be handled when the feature needs them.
- Failed, skipped, or unavailable verification steps must be reported accurately.

------

## Conventions

### Components and State

- Use functional components and hooks.
- Keep components centered on one main UI responsibility.
- Keep state as local as practical and derive values instead of duplicating them.
- Use immutable state updates.
- Keep page components focused on composition and coordination.
- Extract components only when they represent a meaningful UI concept, are reused, or improve readability.

### TypeScript and Data

- Define explicit types for public component props, API responses, shared state, and reusable functions.
- Use `unknown` for unknown input and narrow it safely.
- Avoid unnecessary assertions and non-null assertions.
- Keep raw transport data and UI-ready data separate when their shapes differ.

### Effects and API Calls

- Use effects only to synchronize with external systems.
- Keep dependency lists correct and clean up subscriptions, timers, listeners, and cancellable requests.
- Use the project's standard API-client approach.
- Avoid scattering raw API calls and duplicated error handling across presentation components.
- Handle loading, success, empty, and error states explicitly.

### UI and Testing

- Use semantic buttons for actions and links for navigation.
- Ensure interactive elements are keyboard accessible and have accessible names.
- Preserve form input after recoverable failures and prevent accidental duplicate submission.
- Test user-visible behavior through interactions when the project has a practical test setup.
