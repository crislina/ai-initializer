# React and TypeScript Rules Standard

## Rule Priority

- **Guardrails** are hard constraints for formal React business applications unless an explicit repository requirement justifies an exception.
- **Quality Gates** define what must be verified before React work is reported as complete.
- **Conventions** are default implementation preferences and should follow established repository style when it differs and remains sound.
- **Heuristics** are review signals, not automatic failures.

------

## Guardrails

- Do not use `any` to bypass type safety.
- Do not silence TypeScript, lint, or hook dependency errors without addressing the underlying issue.
- Do not put secrets or credentials in frontend source code or frontend environment variables.
- Do not treat frontend validation, route guards, or hidden UI controls as security or authorization boundaries.
- Do not render untrusted HTML without an approved sanitization boundary.
- Do not expose raw backend exceptions, stack traces, or sensitive payloads to users or logs.
- Do not mutate React props or state.
- Do not call hooks conditionally or outside React components and custom hooks.
- Do not use unstable, random, or reorder-sensitive list keys.
- Do not scatter raw API calls and duplicated transport handling across presentation components.
- Do not introduce a second routing, styling, form, state-management, or server-state library without a clear need.
- Do not disable relevant tests or checks merely to make the build pass.

------

## Quality Gates

Before reporting React work as complete:

- TypeScript type checking must pass.
- Repository-required linting and formatting checks must pass.
- Relevant automated tests must pass.
- The production build must pass.
- New user-visible behavior must cover loading, success, empty, validation, and error states where applicable.
- Important forms must prevent accidental duplicate submission and preserve recoverable user input.
- Shareable URL state must survive refresh and browser back/forward navigation when the feature requires it.
- Interactive controls must be keyboard accessible and have accessible names.
- Critical user journeys must have integration or end-to-end coverage when component tests do not provide sufficient confidence.
- Failed, skipped, or unavailable verification steps must be reported accurately.

------

## Conventions

### Project Structure

- Follow the repository's existing structure, naming, formatter, linting, and import conventions.
- Keep presentation, state, data access, mapping, and business behavior clearly separated.
- Keep feature-specific code with the feature that owns it.
- Put code in shared areas only when it is genuinely reused.
- Avoid `common`, `shared`, or `utils` dumping grounds.
- Do not reorganize an established project merely to match a template.

### TypeScript

- Define explicit types for public component props, API contracts, shared state, and reusable functions.
- Use `unknown` for unknown input and narrow it safely.
- Avoid unnecessary assertions and non-null assertions.
- Use unions and discriminated unions for constrained and stateful variants.
- Keep domain models separate from raw transport models when their responsibilities differ.
- Prefer readonly data where mutation is not intended.

### Components and State

- Use functional components.
- Keep each component centered on one primary UI responsibility.
- Keep page components focused on composition and coordination.
- Prefer composition and explicit props.
- Keep state as local as practical and lift it only when multiple consumers need one source of truth.
- Derive values instead of duplicating them in state.
- Keep server state, URL state, form state, application state, and local UI state conceptually distinct.
- Keep bookmarkable, refreshable, or shareable filters, tabs, and pagination in the URL when appropriate.

### Hooks and Data Access

- Use custom hooks for meaningful reusable stateful behavior.
- Use effects only to synchronize with external systems.
- Clean up subscriptions, timers, observers, listeners, and cancellable requests.
- Prevent stale asynchronous results from overwriting newer state.
- Use the project's standard data-fetching and API-client approach.
- Centralize base URLs, shared headers, authentication behavior, timeouts, cancellation, and transport-error handling.
- Map raw transport failures to stable frontend error types and safe user messages.
- Update or invalidate server state after mutations according to product consistency needs.

### Forms, Routing, and UI States

- Validate on both client and server; treat client validation as user feedback.
- Associate labels and errors with their controls.
- Preserve input after recoverable failures.
- Prevent duplicate submission and show submission progress.
- Preserve direct navigation, refresh, back, and forward behavior.
- Use route protection for usability while enforcing real authorization on the server.
- Distinguish loading, no data, no matches, partial data, and load failure.
- Use error boundaries for unexpected render failures at appropriate application boundaries.

### Accessibility and Styling

- Prefer semantic HTML and native controls.
- Ensure every interactive element is keyboard accessible and visibly focusable.
- Provide accessible names, labels, logical headings, and meaningful alternative text.
- Use ARIA only when native semantics are insufficient.
- Follow the styling system and design tokens already used by the project.
- Support responsive layouts, text expansion, and consistent interaction states.
- Do not use color as the only means of communication.

### Testing and Dependencies

- Use the testing tools already configured by the repository.
- Test behavior through user-visible interactions rather than internal state.
- Prefer accessible roles, labels, and visible text over implementation-specific selectors.
- Mock network boundaries rather than internal implementation details.
- Cover important rendering, interaction, validation, loading, empty, error, retry, permission, and accessibility behavior.
- Use end-to-end tests for critical journeys when lower-level tests cannot provide sufficient confidence.
- Prefer existing dependencies and platform APIs before adding libraries.
