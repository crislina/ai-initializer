# PostgreSQL Rules Standard

## Rule Priority

- **Guardrails** are hard constraints for formal business projects unless an explicit repository or operational requirement justifies an exception.
- **Quality Gates** define what must be verified before PostgreSQL work is reported as complete.
- **Conventions** are default design and implementation preferences.
- **Heuristics** are review signals, not automatic failures.

------

## Guardrails

- Use parameterized queries; never concatenate untrusted input into SQL.
- Preserve critical data invariants with database constraints rather than application checks alone.
- Do not use a pre-check followed by an insert or update as the sole concurrency or uniqueness guarantee.
- Do not modify migrations that have already been applied outside disposable local environments.
- Do not make manual production schema changes outside the approved migration and operational process.
- Do not expose SQL, schema names, constraint internals, database errors, or sensitive query parameters to clients.
- Do not store global instants in ambiguous timestamp types.
- Do not hold transactions open across user interaction or slow external calls.
- Do not rely on unspecified row order.
- Do not add indexes, partitioning, JSONB, soft deletion, triggers, or denormalization merely as future-proofing.

------

## Quality Gates

Before reporting PostgreSQL work as complete:

- Migration validation must pass.
- Every schema change must use a new migration file.
- Migrations must be tested against the supported PostgreSQL version when PostgreSQL-specific behavior is involved.
- New constraints, indexes, and data types must match the required business behavior.
- Important custom queries must have integration coverage when correctness depends on joins, constraints, locking, PostgreSQL-specific SQL, or type mapping.
- Concurrency-sensitive operations must be verified with overlapping transactions and final-state assertions when concurrency is in scope.
- Query ordering must be explicit when application behavior depends on it.
- Important query or index changes must be reviewed with representative data and an execution plan when performance risk is material.
- High-risk migrations must include a safe rollout, recovery, or rollback approach.

------

## Conventions

### General Design

- Follow the PostgreSQL version, naming, schema, ownership, and migration conventions established by the repository.
- Treat the schema as an application contract.
- Prefer clear, maintainable SQL and schema design over clever compression.
- Prefer normalized relational design unless denormalization solves a demonstrated need.
- Keep changes backward-compatible when old and new application versions may run together.

### Naming and Relationships

- Prefer lowercase `snake_case` identifiers.
- Avoid quoted mixed-case identifiers and reserved keywords.
- Use descriptive table, index, and constraint names.
- Give each table one clear responsibility.
- Define primary keys, foreign keys, nullability, defaults, and delete behavior deliberately.
- Index foreign-key columns when joins, lookups, updates, or deletes make the index useful.

### Data Types and Constraints

- Use native PostgreSQL types that match the domain.
- Prefer `timestamptz` for global instants and document intentionally local wall-clock timestamps.
- Use exact numeric types for money and other precision-sensitive values.
- Use `text` when no meaningful maximum exists and `varchar(n)` only when the limit is a domain rule.
- Use `NOT NULL`, unique, check, foreign-key, exclusion, and partial unique constraints where they express stable invariants.
- Align application validation with database constraints and translate violations into stable application errors.

### Indexes and Queries

- Add indexes for real query, join, sorting, uniqueness, and lifecycle patterns.
- Evaluate read benefit against write cost, storage, vacuum, and maintenance overhead.
- Avoid duplicate or overlapping indexes.
- Select only required columns in application queries.
- Use explicit joins, readable aliases, parameterized input, and explicit ordering.
- Keep pagination stable and deterministic.
- Prefer keyset pagination for deep or latency-sensitive navigation over large changing datasets.

### Transactions and Concurrency

- Keep transactions short and scoped to one coherent unit of work.
- Group changes atomically when they must succeed or fail together.
- Choose isolation and locking based on the actual consistency requirement.
- Access rows in a consistent order when one operation locks multiple records.
- Use constraints, atomic statements, version checks, `SELECT ... FOR UPDATE`, or equivalent shared mechanisms for concurrent correctness.
- Retry serialization failures or deadlocks only when the complete transaction is safe and idempotent.

### Migrations

- Use the migration tool approved by the repository.
- Keep migrations focused, descriptive, and safe for existing data.
- Use expand-and-contract sequencing when rolling compatibility is required.
- Separate schema expansion, application rollout, large backfill, and cleanup when doing so reduces risk.
- Review lock duration and table size before adding required columns, constraints, or indexes.
- Test compatibility with both old and new application versions when deployments overlap.

### Security and Testing

- Apply least privilege and keep credentials out of migrations and source control.
- Protect backups, exports, and non-production copies of sensitive data.
- Test PostgreSQL-specific SQL, constraints, migrations, locking, sequences, JSON/array mappings, and transaction behavior against PostgreSQL.
- Keep database tests isolated and deterministic.
- Test constraint failures and harmful uniqueness races when relevant.
