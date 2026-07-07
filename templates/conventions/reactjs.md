# React and TypeScript Rules

## Rule Priority

- **Guardrails** are hard constraints unless an explicit repository requirement justifies an exception.
- **Quality Gates** define what must be verified before React work is reported as complete.
- **Conventions** are default implementation preferences and should follow established repository style when it differs and remains sound.
- **Heuristics** are review signals, not automatic failures.
- **Conditional Guidance** applies only when the relevant frontend capability is used.

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
- Package-by-feature and package-by-type are both valid; choose one consistent with the repository and project scale.
- Keep presentation, state, data access, mapping, and business behavior clearly separated.
- Keep feature-specific code with the feature that owns it.
- Put code in shared areas only when it is genuinely reused.
- Avoid `common`, `shared`, or `utils` dumping grounds.
- Do not reorganize an established project merely to match a template.

### TypeScript

- Define explicit types for public component props, API contracts, shared state, and reusable functions.
- Use `unknown` for unknown input and narrow it safely.
- Prefer inference for obvious local values.
- Avoid unnecessary assertions and non-null assertions.
- Use unions and discriminated unions for constrained and stateful variants.
- Keep domain models separate from raw transport models when their responsibilities differ.
- Prefer readonly data where mutation is not intended.
- Use the repository's established `type` or `interface` convention.

### Components

- Use functional components.
- Keep each component centered on one primary UI responsibility.
- Keep page components focused on composition and coordination.
- Extract components when they represent meaningful UI concepts, are reused, own independent behavior, or materially improve readability.
- Keep trivial markup together when extraction would fragment the flow.
- Prefer composition and explicit props.
- Avoid excessive boolean props that create many behavioral combinations.
- Use semantic names and one primary component per file unless closely related small components are clearer together.

### State

- Keep state as local as practical and lift it only when multiple consumers need one source of truth.
- Derive values instead of duplicating them in state.
- Keep server state, URL state, form state, application state, and local UI state conceptually distinct.
- Use immutable and functional updates when the next value depends on previous state.
- Use `useReducer` when transitions are complex and action-oriented.
- Keep bookmarkable, refreshable, or shareable filters, tabs, and pagination in the URL.
- Avoid global state for local, temporary UI behavior.

### Hooks and Effects

- Use custom hooks for meaningful reusable stateful behavior.
- Keep hooks focused and expose a clear interface.
- Use effects only to synchronize with external systems.
- Prefer rendering calculations and event handlers over state-synchronizing effects.
- Clean up subscriptions, timers, observers, listeners, and cancellable requests.
- Prevent stale asynchronous results from overwriting newer state.
- Keep dependency lists correct and avoid chains of effects.

### Data Access and API Clients

- Use the project's standard data-fetching and API-client approach.
- Centralize base URLs, shared headers, authentication behavior, timeouts, cancellation, and transport-error handling.
- Keep endpoint functions focused and typed.
- Map raw transport failures to stable frontend error types and safe user messages.
- Handle loading, empty, success, and error states explicitly.
- Cancel or ignore stale requests where races are possible.
- Retry only safe transient failures with bounded behavior.
- Update or invalidate server state after mutations according to product consistency needs.

### Forms

- Keep simple forms simple and use the repository's established form approach.
- Validate on both client and server; treat client validation as user feedback.
- Associate labels and errors with their controls.
- Show field-level errors near fields and a form-level error for non-field failures.
- Preserve input after recoverable failures.
- Prevent duplicate submission and show submission progress.
- Normalize input only when normalization is part of the product contract.
- Use appropriate input types, autocomplete attributes, input modes, fieldsets, and legends.

### Rendering and Events

- Keep render logic declarative.
- Prefer early returns and named conditions over deeply nested JSX or ternaries.
- Keep substantial business logic out of JSX and event handlers.
- Use semantic buttons for actions and links for navigation.
- Keep list keys stable and meaningful.
- Handle null, partial, loading, empty, and error states intentionally.
- Do not mutate data during rendering.

### Styling

- Follow the styling system and design tokens already used by the project.
- Avoid broad global selectors and fragile DOM-dependent styling.
- Support responsive layouts, text expansion, and consistent interaction states.
- Do not use color as the only means of communication.
- Avoid fixed dimensions that cause clipping or overflow.

### Accessibility

- Prefer semantic HTML and native controls.
- Ensure every interactive element is keyboard accessible and visibly focusable.
- Provide accessible names, labels, logical headings, and meaningful alternative text.
- Use ARIA only when native semantics are insufficient.
- Manage and restore focus for dialogs and other modal interactions.
- Associate validation errors with inputs and announce important asynchronous status changes when appropriate.
- Respect contrast and reduced-motion requirements.

### Navigation and Routing

- Use the repository's routing library and organization.
- Preserve direct navigation, refresh, back, and forward behavior.
- Keep shareable page state in the URL when appropriate.
- Provide a clear not-found experience.
- Use route protection for usability while enforcing real authorization on the server.
- Lazy-load large route-level bundles only when it materially helps.

### Error, Loading, and Empty States

- Handle expected API and UI failures explicitly.
- Use error boundaries for unexpected render failures at appropriate application boundaries.
- Provide safe explanations and useful recovery actions.
- Distinguish loading, no data, no matches, partial data, and load failure.
- Preserve existing content during background refresh when appropriate.
- Log unexpected failures once through the approved monitoring boundary.

### Performance

- Measure before optimizing.
- Avoid duplicated state, unstable props, and unnecessary large browser datasets.
- Use pagination, incremental rendering, or windowing for genuinely large lists.
- Lazy-load heavy features when initial-load cost justifies it.
- Avoid large libraries for small functionality.
- Prefer maintainability over minor theoretical gains.

### Testing

- Use the testing tools already configured by the repository.
- Test behavior through user-visible interactions rather than internal state.
- Prefer accessible roles, labels, and visible text over implementation-specific selectors.
- Mock network boundaries rather than internal implementation details.
- Keep tests deterministic and await visible behavior instead of arbitrary sleeps.
- Cover important rendering, interaction, validation, loading, empty, error, retry, permission, and accessibility behavior.
- Add regression tests for fixed defects.
- Use end-to-end tests for critical journeys when lower-level tests cannot provide sufficient confidence.
- Test duplicate-submission prevention, recoverable form state, stale-response handling, and URL-state behavior when relevant.

### Imports and Dependencies

- Follow repository import ordering and path alias conventions.
- Avoid circular imports and imports from another feature's private internals.
- Use public feature exports where established.
- Avoid broad barrel files that create cycles or oversized bundles.
- Remove unused imports and avoid importing entire libraries when smaller supported imports exist.
- Prefer existing dependencies and platform APIs before adding libraries.

### Documentation

- Document reusable components, side effects, accessibility expectations, and browser workarounds when types and code are not sufficient.
- Keep component examples and user-facing behavior documentation synchronized.
- Avoid comments that merely restate JSX.

------

## Heuristics

- Review a component when it mixes data fetching, complex business rules, many state transitions, and a large presentation tree.
- Many boolean props may indicate that variants or separate components would be clearer.
- Prop drilling across several unrelated levels may indicate a composition, context, or state-boundary problem.
- Repeated raw API error handling may indicate that transport mapping belongs in a shared client boundary.
- Multiple effects that update one another may indicate derived state or event logic was modeled incorrectly.
- A large page component may need decomposition when size comes from mixed concerns rather than cohesive presentation.
- Repeated pagination, sorting, URL parsing, or form-error mapping may justify a focused hook or support module.
- Extensive `useMemo`, `useCallback`, or `React.memo` may indicate premature optimization.
- A custom hook that only wraps one trivial built-in hook may add indirection without value.
- Add state-management, form, UI, or server-state libraries only when they address a current requirement or established project standard.

------

## Conditional Guidance

Apply only when the feature or existing repository uses the relevant capability.

### Memoization

- Use `useMemo`, `useCallback`, and `React.memo` only for measured cost, expensive work, or required referential stability.
- Keep dependencies correct and remove memoization that adds complexity without benefit.

### Advanced Server-State Management

- Use the repository's established query library.
- Define freshness, retries, invalidation, optimistic updates, and conflict behavior explicitly.
- Do not maintain a second manual cache for the same server data.

### Global State

- Introduce global state only for genuinely cross-cutting application state.
- Keep local UI and form state local.
- Define ownership, update boundaries, persistence, and reset behavior.

### Authentication and Security

- Follow the repository's session and token model.
- Avoid insecure long-lived browser storage when safer approved options exist.
- Protect state-changing operations against CSRF where applicable.
- Validate redirects and avoid logging tokens or sensitive data.
- Keep authorization enforcement on the server.

### Internationalization

- Keep user-facing text externalized according to project convention.
- Support text expansion, locale-aware formatting, pluralization, and right-to-left layout when required.
- Do not construct translatable sentences from fragmented strings.

### Large Lists and Virtualization

- Use pagination or incremental loading before rendering unbounded datasets.
- Apply windowing only when list size and rendering cost justify it.
- Preserve keyboard navigation, focus, and accessibility semantics.

### Component Libraries and Design Systems

- Reuse approved components and tokens.
- Keep wrappers focused on meaningful product behavior or consistency.
- Do not create parallel primitives that compete with the existing design system.

### Monitoring

- Report unexpected frontend failures through the approved monitoring boundary.
- Include safe release, route, and correlation context where useful.
- Avoid duplicate reporting and sensitive payloads.
