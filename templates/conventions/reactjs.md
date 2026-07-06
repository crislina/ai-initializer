# React Rules

## General Principles

- Follow the React and TypeScript versions configured by the project.
- Follow the existing project structure, naming conventions, formatter, and linting rules.
- Prefer simple, readable components over clever abstractions.
- Keep components focused on one clear responsibility.
- Separate presentation, state management, data access, and business logic where practical.
- Prefer composition over inheritance.
- Do not introduce new libraries when the existing project stack already provides an adequate solution.
- Do not refactor unrelated components as part of a focused feature or bug fix.
- Preserve existing behavior unless the change explicitly requires otherwise.

------

## TypeScript

- Use TypeScript for new React code when the project supports it.
- Avoid `any`.
- Use `unknown` for values whose type is not yet known, then narrow the type safely.
- Define explicit types for component props, API responses, shared state, and reusable functions.
- Prefer inferred types for obvious local variables.
- Avoid unnecessary type assertions.
- Do not use `as` merely to silence a compiler error.
- Avoid non-null assertions unless the invariant is guaranteed and documented.
- Use union types for constrained values.
- Prefer discriminated unions for state with distinct variants.
- Use `interface` or `type` consistently with the project convention.
- Do not duplicate backend-generated contract types manually when generated types are available.
- Keep domain types separate from raw API transport models when their responsibilities differ.
- Use `readonly` for values and structures that should not be mutated.
- Avoid enums when string literal unions are simpler and consistent with the project.

------

## Components

- Use functional components.
- Keep components small, cohesive, and focused.
- Extract a component when it represents a meaningful UI concept, is reused, has independent behavior, or materially improves readability.
- Do not extract trivial markup into separate components without a clear benefit.
- Avoid components that combine data fetching, complex business logic, and large presentation trees.
- Keep page-level components responsible for composition and coordination.
- Keep reusable UI components independent from page-specific business logic.
- Use meaningful component names.
- Use PascalCase for component names.
- Keep one primary component per file unless closely related small components are clearer together.
- Avoid defining components inside other components unless there is a specific reason.
- Do not mutate props.
- Prefer explicit props over passing large generic configuration objects.
- Avoid excessive boolean props that create many behavior combinations.
- Use variant props or separate components when behavior differs substantially.
- Prefer `children` for natural composition.
- Avoid wrapper components that provide no meaningful behavior or styling abstraction.

------

## Props

- Define props explicitly.
- Use descriptive prop names.
- Avoid vague names such as `data`, `item`, `value`, or `handler` when a more specific name is available.
- Prefix event callback props with `on`, such as `onSave` or `onSelectionChange`.
- Do not pass entire domain objects when the component only requires a few fields, unless doing so clearly improves maintainability.
- Avoid prop drilling across many levels.
- Use component composition, local context, or an approved state-management approach when data must cross distant component boundaries.
- Do not introduce global state solely to avoid passing one or two props.
- Provide sensible defaults only when they represent valid product behavior.
- Avoid optional props whose absence produces ambiguous behavior.

------

## State

- Keep state as local as possible.
- Lift state only when multiple components need a shared source of truth.
- Do not store values in state when they can be derived from props or other state.
- Avoid duplicated state.
- Avoid keeping synchronized copies of the same data in multiple places.
- Prefer immutable state updates.
- Do not mutate arrays or objects held in React state.
- Use functional state updates when the next value depends on the previous value.
- Group related state when it changes together.
- Keep unrelated state separate.
- Use `useReducer` when state transitions are complex, tightly related, or action-oriented.
- Avoid global state for temporary UI concerns such as a single dialog or local form.
- Clearly distinguish server state, application state, form state, URL state, and local component state.
- Store filter, search, pagination, or tab state in the URL when users should be able to bookmark, refresh, or share it.
- Do not store sensitive information in browser state unless explicitly required and appropriately protected.

------

## Hooks

- Follow the Rules of Hooks.
- Call hooks only at the top level of React components or custom hooks.
- Do not call hooks conditionally.
- Use custom hooks to reuse meaningful stateful behavior.
- Name custom hooks with the `use` prefix.
- Keep custom hooks focused on one concern.
- Do not create custom hooks merely to wrap one trivial built-in hook.
- Return a clear and stable interface from custom hooks.
- Avoid custom hooks with excessive arguments or unrelated responsibilities.
- Do not hide major side effects behind misleading hook names.
- Clean up subscriptions, timers, observers, and event listeners.
- Avoid stale closures by managing dependencies correctly.
- Do not suppress hook dependency lint rules without a clear documented reason.

------

## Effects

- Use `useEffect` only to synchronize React with an external system.
- Do not use effects for values that can be calculated during rendering.
- Do not use effects to synchronize one piece of React state with another unless unavoidable.
- Avoid chains of effects that trigger one another.
- Keep each effect focused on one synchronization concern.
- Include all required dependencies.
- Do not disable exhaustive dependency checks merely to stop repeated execution.
- Make effect cleanup explicit when registering listeners, subscriptions, timers, or asynchronous work.
- Prevent outdated asynchronous responses from overwriting newer state.
- Use an abort signal or equivalent cancellation mechanism for cancellable requests.
- Avoid fetching data directly in multiple components when the project provides a standard server-state or data-fetching layer.
- Do not place event-driven logic in an effect when it can run directly from the event handler.

------

## Memoization

- Do not use `useMemo`, `useCallback`, or `React.memo` by default.
- Use memoization only when measurement shows a meaningful problem, referential stability is required, or a calculation is genuinely expensive.
- Do not add memoization merely to satisfy perceived best practice.
- Keep dependency lists accurate.
- Remove memoization that adds complexity without measurable benefit.
- Prefer simpler component boundaries before adding broad memoization.

------

## Data Fetching

- Use the project’s standard data-fetching approach.
- Do not introduce a second server-state library without a clear reason.
- Keep API access in dedicated client, service, or query modules.
- Do not scatter raw `fetch` or HTTP client calls across presentation components.
- Use typed request and response models.
- Handle loading, empty, success, and error states explicitly.
- Avoid treating an empty successful result as an error.
- Cancel or ignore outdated requests where race conditions are possible.
- Do not retry permanent failures such as validation or authorization errors.
- Use bounded retries for transient failures only.
- Avoid duplicate requests for the same data.
- Use caching according to product freshness requirements.
- Invalidate or update cached data after mutations.
- Do not rely on stale data when correctness requires an immediate refresh.
- Keep transport error details out of user-facing messages.
- Map technical failures to clear and safe UI messages.
- Preserve correlation or trace identifiers when useful for support.

------

## API Clients

- Centralize base URLs, shared headers, authentication behavior, timeouts, and error handling.
- Do not hardcode API URLs inside components.
- Do not include secrets in frontend source code or frontend environment variables.
- Treat all frontend environment variables as publicly visible.
- Use a shared API client where the project provides one.
- Keep endpoint-specific functions focused and typed.
- Translate raw API errors into stable frontend error types.
- Do not expose raw stack traces or internal server messages to users.
- Handle authentication expiration consistently.
- Avoid silent failures.
- Do not log sensitive request or response payloads.
- Use request cancellation where supported.
- Avoid coupling UI components directly to backend response shapes when mapping improves clarity or stability.

------

## Forms

- Use the project’s standard form-management approach.
- Keep simple forms simple.
- Do not introduce a form library for a trivial one-field form unless the project already standardizes on one.
- Use controlled or uncontrolled inputs consistently.
- Keep form state separate from unrelated page state.
- Validate input on both client and server.
- Treat client-side validation as user feedback, not a security boundary.
- Display validation errors close to the relevant field.
- Provide a form-level error for failures not associated with one field.
- Preserve user input after recoverable submission failures.
- Disable or otherwise protect against accidental duplicate submissions.
- Do not permanently disable the submit button when the user needs feedback about invalid input.
- Show clear submission progress.
- Handle asynchronous validation carefully to avoid race conditions.
- Normalize input only when it is part of the product contract.
- Do not silently alter meaningful user input.
- Use appropriate input types, autocomplete attributes, and input modes.
- Associate labels with form controls.
- Use fieldsets and legends for related groups of controls where appropriate.

------

## Event Handling

- Use clear event handler names such as `handleSubmit` and `handleDelete`.
- Use `onSubmit`, `onDelete`, or equivalent names for callback props.
- Keep event handlers focused.
- Move complex business logic out of JSX.
- Do not use inline handlers when they contain substantial logic.
- Prevent duplicate actions when an operation is already in progress.
- Do not use `preventDefault` or `stopPropagation` without understanding the interaction impact.
- Ensure keyboard interaction works for custom controls.
- Use semantic buttons for actions instead of clickable `div` or `span` elements.

------

## Rendering

- Keep render logic declarative.
- Avoid deeply nested JSX.
- Extract complex conditions into clearly named variables.
- Prefer early returns for loading, error, or unavailable states when they improve readability.
- Avoid nested ternary expressions.
- Use stable and meaningful keys for lists.
- Do not use array indexes as keys when items can be inserted, removed, or reordered.
- Do not generate random keys during rendering.
- Do not mutate collections while rendering.
- Keep expensive computation out of render paths unless it is small or intentionally memoized.
- Handle null, empty, loading, and partial data states intentionally.
- Avoid rendering raw HTML.
- Use `dangerouslySetInnerHTML` only with trusted and sanitized content.

------

## Styling

- Follow the styling system already used by the project.
- Do not introduce another styling approach without a clear reason.
- Reuse existing design tokens, spacing, typography, and components.
- Avoid hardcoded colors, sizes, and spacing when design tokens are available.
- Keep styles close to the component or feature according to project convention.
- Avoid overly broad global CSS selectors.
- Do not rely on fragile DOM nesting for styling.
- Use responsive layouts intentionally.
- Test common viewport sizes.
- Avoid fixed dimensions that cause clipping or overflow.
- Support text expansion where localization is possible.
- Keep visual state consistent for hover, focus, active, disabled, loading, success, and error conditions.
- Do not use color as the only way to communicate meaning.

------

## Accessibility

- Use semantic HTML.
- Use native HTML elements before building custom equivalents.
- Every interactive element must be keyboard accessible.
- Use `button` for actions and `a` for navigation.
- Provide accessible names for controls and icons.
- Associate labels with inputs.
- Use heading levels in a logical order.
- Provide meaningful alternative text for informative images.
- Use empty alternative text for decorative images.
- Ensure visible keyboard focus.
- Do not remove focus outlines without providing an accessible replacement.
- Manage focus when opening and closing dialogs.
- Keep keyboard focus inside modal dialogs while they are open where appropriate.
- Restore focus after closing a dialog.
- Use ARIA only when semantic HTML is insufficient.
- Do not add redundant or incorrect ARIA attributes.
- Announce important asynchronous status changes where appropriate.
- Ensure error messages are associated with the relevant input.
- Maintain sufficient color contrast.
- Respect reduced-motion preferences for non-essential animation.

------

## Navigation and Routing

- Use the routing library already configured by the project.
- Keep route definitions centralized or consistently organized.
- Use navigation components rather than manually changing browser location.
- Preserve browser back and forward behavior.
- Keep shareable page state in the URL where appropriate.
- Handle unknown routes with a clear not-found page.
- Protect restricted routes, but do not rely on frontend route guards as the authorization boundary.
- Avoid embedding permission-sensitive data in the frontend bundle.
- Support direct navigation and page refresh for valid routes.
- Use lazy loading for large route-level bundles where it materially improves performance.

------

## Error Handling

- Handle expected UI and API failures explicitly.
- Use error boundaries for unexpected rendering failures at appropriate application boundaries.
- Do not use error boundaries as a replacement for normal error handling.
- Provide users with clear recovery actions where possible.
- Avoid generic messages such as “Something went wrong” when a safe and useful explanation is available.
- Do not expose raw backend exception messages.
- Preserve technical diagnostic information in approved monitoring tools rather than displaying it to users.
- Log unexpected errors once through the project’s monitoring mechanism.
- Avoid repeatedly logging the same error from multiple components.
- Handle chunk-loading and network failures gracefully when relevant.
- Keep critical navigation and recovery options available after a failure.

------

## Loading and Empty States

- Show loading indicators when operations are not immediate.
- Avoid unnecessary full-page loading states for small local updates.
- Preserve existing content during background refresh where appropriate.
- Use skeletons only when they improve perceived continuity.
- Ensure loading indicators are accessible.
- Distinguish between no data, no matching results, load failure, and loading.
- Provide an appropriate next action for empty states.
- Avoid flashing empty states before loading has completed.

------

## Performance

- Measure before optimizing.
- Avoid unnecessary re-renders caused by unstable props or duplicated state.
- Split large route-level bundles where appropriate.
- Lazy-load heavy features that are not required for the initial render.
- Avoid shipping large libraries for small functionality.
- Optimize large lists with pagination, windowing, or incremental rendering when needed.
- Avoid loading full datasets into the browser when server-side filtering or pagination is available.
- Optimize images and use appropriate formats and sizes.
- Avoid blocking the main thread with expensive synchronous work.
- Move heavy processing to a worker only when justified.
- Do not sacrifice maintainability for minor theoretical performance gains.
- Track important user-facing performance metrics where the project supports it.

------

## Security

- Do not store secrets in frontend code.
- Do not assume environment variables in the frontend are private.
- Escape untrusted content.
- Avoid rendering unsanitized HTML.
- Do not build authorization decisions solely in the frontend.
- Hide unavailable actions for usability, but enforce access control on the server.
- Avoid storing long-lived authentication tokens in insecure browser storage when a safer project-approved approach exists.
- Follow the project’s authentication and session-management model.
- Protect state-changing operations against cross-site request forgery where applicable.
- Do not log tokens, credentials, personal data, or sensitive payloads.
- Validate redirect targets to prevent open redirects.
- Use dependency versions approved by the project.
- Do not disable security tooling merely to make the build pass.

------

## Testing

- Use the testing tools already configured by the project.
- Prefer tests that reflect how users interact with the interface.
- Test observable behavior rather than internal implementation details.
- Query elements by accessible role, label, or visible text where practical.
- Avoid testing internal component state directly.
- Avoid relying heavily on CSS selectors or implementation-specific test IDs.
- Use test IDs only when semantic queries are not practical.
- Cover rendering, user interactions, validation, loading, empty, error, permission-dependent, and important accessibility behavior.
- Mock network boundaries rather than internal functions where practical.
- Avoid excessive snapshot testing.
- Use snapshots only for stable, intentionally reviewed output.
- Add regression tests for fixed defects.
- Keep tests deterministic.
- Avoid arbitrary sleep-based waits.
- Await visible application behavior.
- Do not make tests depend on execution order.
- Use end-to-end tests for critical user journeys.
- Test prevention of duplicate submissions and preservation of form values after recoverable failures.
- Test server field errors, state conflicts, retry behavior, and stale-response handling where those states are supported.
- Test that shareable URL state survives refresh and back/forward navigation.


------

## File and Feature Structure

Follow the existing project structure. When no clear structure exists, group code by feature for medium or large applications.

```text
src/
├── app/
│   ├── routing/
│   ├── providers/
│   └── configuration/
├── features/
│   └── orders/
│       ├── api/
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       ├── types/
│       └── utils/
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── api/
│   ├── types/
│   └── utils/
└── main.tsx
```

- Keep feature-specific code inside its feature.
- Put code in `shared` only when it is genuinely reused across multiple features.
- Avoid turning `shared`, `common`, or `utils` into dumping grounds.
- Keep API functions, types, tests, and components near the feature that owns them.
- Avoid importing internal feature implementation details from unrelated features.
- Expose a clear public boundary when features depend on one another.
- Do not reorganize an established project solely to match this example.

------

## Imports

- Follow the project’s import ordering rules.
- Prefer stable configured path aliases over deeply nested relative imports.
- Do not introduce path aliases without updating the build, test, and editor configuration consistently.
- Avoid circular imports.
- Avoid importing from another feature’s internal files.
- Use package or feature public exports where the project defines them.
- Do not create broad barrel files that cause circular dependencies or oversized bundles.
- Remove unused imports.
- Avoid importing entire libraries when smaller supported imports are available.

------

## Documentation

- Document reusable components with non-obvious behavior.
- Document required props, constraints, side effects, and accessibility expectations where they are not clear from types.
- Keep examples for shared UI components where the project uses a component catalog.
- Do not add comments that merely restate JSX.
- Explain unusual browser workarounds and link them to a relevant issue where possible.
- Keep user-facing text and behavior documentation synchronized with the implementation.
