# PostgreSQL Rules Lite

## Rule Priority

- **Guardrails** are hard constraints for small projects, demos, and script-like database work.
- **Quality Gates** define minimum verification before reporting completion.
- **Conventions** are defaults. Follow the repository's existing schema and migration style when it is clear and sound.

------

## Guardrails

- Use parameterized queries; never concatenate untrusted input into SQL.
- Do not modify migrations that have already been applied outside disposable local environments.
- Do not expose SQL, schema names, database errors, credentials, or sensitive query parameters to clients.
- Do not rely on unspecified row order.
- Do not store secrets in migrations, seed files, or source code.
- Do not add indexes, triggers, JSONB, partitioning, or denormalization merely as future-proofing.

------

## Quality Gates

Before reporting PostgreSQL work as complete:

- Every schema change must use a new migration file when the project uses migrations.
- Migration validation or a local migration run should pass when available.
- Important queries should be exercised with representative input.
- Query ordering must be explicit when behavior depends on it.
- Failed, skipped, or unavailable verification steps must be reported accurately.

------

## Conventions

### Schema Design

- Follow existing naming, schema, and migration conventions.
- Prefer lowercase `snake_case` identifiers.
- Give each table one clear responsibility.
- Make nullability and defaults deliberate.
- Use foreign keys and unique constraints for important data relationships and uniqueness rules where practical.

### Queries

- Select only required columns.
- Use readable aliases, explicit joins, and explicit ordering.
- Use `EXISTS` when only existence is required.
- Use database-backed pagination for data that may grow.
- Avoid exposing database-specific query syntax directly to users.

### Migrations

- Keep migrations focused and descriptive.
- Prefer additive changes when existing data or shared environments are involved.
- Avoid destructive changes without an explicit plan.
- Review table size and lock risk before changing large tables.

### Safety

- Keep transactions short.
- Group related writes atomically when they must remain consistent.
- Use constraints rather than application checks alone for critical invariants.
- Report manual or unverified database steps clearly.
