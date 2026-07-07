# PostgreSQL Rules

## Rule Priority

- **Guardrails** are hard constraints unless an explicit repository or operational requirement justifies an exception.
- **Quality Gates** define what must be verified before PostgreSQL work is reported as complete.
- **Conventions** are default design and implementation preferences.
- **Heuristics** are review signals, not automatic failures.
- **Conditional Guidance** applies only when the relevant PostgreSQL capability or operational scenario is in scope.

------

## Guardrails

- Use parameterized queries; never concatenate untrusted input into SQL.
- Preserve critical data invariants with database constraints rather than application checks alone.
- Do not use a pre-check followed by an insert or update as the sole concurrency or uniqueness guarantee.
- Do not modify migrations that have already been applied outside disposable local environments.
- Do not make manual production schema changes outside the approved migration and operational process.
- Do not expose SQL, schema names, constraint internals, database errors, or sensitive query parameters to clients.
- Do not store global instants in ambiguous timestamp types.
- Do not run the application with a PostgreSQL superuser or grant broad permissions without a justified operational need.
- Do not hold transactions open across user interaction or slow external calls.
- Do not rely on unspecified row order.
- Do not add indexes, partitioning, JSONB, soft deletion, triggers, or denormalization merely as future-proofing.
- Do not claim PostgreSQL-specific locking, SQL, migration, or query-plan behavior was verified using only H2 or another materially different database.

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
- Failed, skipped, or unavailable verification steps must be reported accurately.

------

## Conventions

### General Design

- Follow the PostgreSQL version, naming, schema, ownership, and migration conventions established by the repository.
- Treat the schema as an application contract.
- Prefer clear, maintainable SQL and schema design over clever compression.
- Keep integrity as close to the data as practical while avoiding frequently changing workflow logic in constraints.
- Prefer normalized relational design unless denormalization solves a demonstrated need.
- Keep changes backward-compatible when old and new application versions may run together.

### Naming

- Prefer lowercase `snake_case` identifiers.
- Avoid quoted mixed-case identifiers and reserved keywords.
- Use descriptive names and consistent singular or plural table naming.
- Name indexes and constraints so their purpose is clear.
- Follow existing primary-key and foreign-key naming conventions.
- When no convention exists, names such as `pk_<table>`, `fk_<table>_<column>`, `uk_<table>_<columns>`, `ck_<table>_<rule>`, and `idx_<table>_<columns>` are reasonable defaults.

### Schemas and Ownership

- Use schemas only for meaningful domain, ownership, or security boundaries.
- Keep schema usage and object ownership explicit and consistent.
- Qualify object names in migrations and administrative scripts when ambiguity or search-path risk exists.
- Avoid unsafe mutable `search_path` assumptions.
- Separate migration, application, read-only, reporting, and administrative roles where practical.

### Tables and Relationships

- Give each table one clear responsibility.
- Define a primary key for application tables unless the domain provides a better justified model.
- Use foreign keys for relational integrity where practical.
- Make nullability and defaults deliberate.
- Use `NULL` rather than magic values for missing data.
- Choose delete behavior deliberately; do not default to cascading deletion.
- Index foreign-key columns when joins, lookups, updates, or deletes make the index useful.
- Avoid generic entity-attribute-value designs and delimited multi-value text columns unless requirements justify them.

### Data Types

- Use native PostgreSQL types that match the domain.
- Use `boolean` for true/false values, `date` for calendar dates, and `uuid` for UUIDs.
- Prefer `timestamptz` for global instants and document intentionally local wall-clock timestamps.
- Use exact numeric types for money and other precision-sensitive values.
- Use `text` when no meaningful maximum exists and `varchar(n)` only when the limit is a domain rule.
- Prefer `jsonb` for queryable JSON documents, but keep frequently filtered, joined, constrained, or updated fields as normal columns.
- Use identity columns rather than legacy serial types for new schemas when supported and consistent.
- Use PostgreSQL enum types cautiously when values are expected to evolve.

### Constraints

- Use `NOT NULL`, unique, check, foreign-key, exclusion, and partial unique constraints where they express stable invariants.
- Align application validation with database constraints.
- Handle case-insensitive uniqueness explicitly, such as with normalized data or an expression-based unique index.
- Use partial unique indexes for conditional uniqueness where appropriate.
- Give constraints descriptive names and translate violations into stable application errors.

### Indexes

- Add indexes for real query, join, sorting, uniqueness, and lifecycle patterns.
- Evaluate read benefit against write cost, storage, vacuum, and maintenance overhead.
- Design multicolumn index order around actual predicates and ordering.
- Use partial, expression, covering, GIN, GiST, SP-GiST, or BRIN indexes only when their access pattern fits the workload.
- Avoid duplicate or overlapping indexes.
- Use operationally safe index creation for large tables when required.
- Verify important indexes with representative query plans.

### SQL Queries

- Select only required columns in application queries.
- Use explicit joins, readable aliases, parameterized input, and explicit ordering.
- Use `EXISTS` when only existence is required.
- Avoid applying functions or implicit casts to indexed columns unless the matching index strategy supports them.
- Use common table expressions when they improve clarity or enable recursive logic, not automatically for performance.
- Keep pagination stable and deterministic.
- Prefer keyset pagination for deep or latency-sensitive navigation over large changing datasets.

### Transactions and Concurrency

- Keep transactions short and scoped to one coherent unit of work.
- Group changes atomically when they must succeed or fail together.
- Choose isolation and locking based on the actual consistency requirement.
- Access rows in a consistent order when one operation locks multiple records.
- Use constraints, atomic statements, version checks, `SELECT ... FOR UPDATE`, or equivalent shared mechanisms for concurrent correctness.
- Use `NOWAIT` and `SKIP LOCKED` only when their failure or skipping semantics match the workflow.
- Retry serialization failures or deadlocks only when the complete transaction is safe and idempotent.
- Remember that a PostgreSQL transaction remains failed after an error until rollback.

### Migrations

- Use the migration tool approved by the repository.
- Keep migrations focused, descriptive, and safe for existing data.
- Use expand-and-contract sequencing when rolling compatibility is required.
- Separate schema expansion, application rollout, large backfill, and cleanup when doing so reduces risk.
- Review lock duration and table size before adding required columns, constraints, or indexes.
- Test compatibility with both old and new application versions when deployments overlap.

### Security

- Apply least privilege.
- Keep credentials out of migrations and source control.
- Restrict network access and broad grants to `PUBLIC`.
- Protect backups, exports, and non-production copies of sensitive data.
- Use encrypted connections and certificate verification according to the deployment model.
- Install only approved extensions.

### Testing

- Test PostgreSQL-specific SQL, constraints, migrations, locking, sequences, JSON/array mappings, and transaction behavior against PostgreSQL.
- Keep database tests isolated and deterministic.
- Test constraint failures and harmful uniqueness races.
- Use realistic data distributions for performance-sensitive behavior.
- Reset test data safely and never depend on unspecified ordering.

### Documentation

- Document non-obvious schema choices, unusual constraints or indexes, intentional denormalization, transaction assumptions, and migration sequencing.
- Keep schema and relationship documentation synchronized where maintained.
- Document recovery, retention, archival, and purge behavior when relevant.

------

## Heuristics

- A table with many unrelated optional columns may be combining multiple concepts.
- Repeated application-side normalization for uniqueness may indicate that a normalized column or expression index is needed.
- Many overlapping indexes may indicate unnecessary write and maintenance cost.
- Large offsets, repeated sorts, or frequent sequential scans on selective queries may indicate an index or pagination redesign.
- A query that requires `DISTINCT` to correct duplicated rows may have an incorrect join or cardinality assumption.
- Frequent lock waits, deadlocks, or serialization failures may indicate inconsistent lock order or an overly broad transaction.
- Large JSON documents that are frequently filtered or partially updated may belong in relational columns or child tables.
- Long or multi-purpose migrations may need to be split into expansion, backfill, validation, and cleanup phases.
- A database function or trigger that contains substantial business workflow may be hiding behavior from the application.
- An index, partition, cache-like materialized view, or denormalized table should solve a measured problem rather than a hypothetical future one.

------

## Conditional Guidance

Apply only when the feature, workload, or existing database uses the relevant capability.

### JSONB

- Define and validate the expected document shape at the application boundary.
- Add targeted GIN or expression indexes for repeated JSON queries.
- Avoid mixing unrelated document types without a discriminator and clear contract.
- Define schema evolution, retention, and size limits for long-lived JSON data.

### Full-Text and Fuzzy Search

- Use PostgreSQL full-text search when its language and ranking behavior fit the requirement.
- Use GIN indexes for search vectors and trigram indexes for suitable fuzzy or substring search.
- Do not expose raw database search syntax to untrusted users.
- Keep ranking, normalization, and language configuration explicit.

### Soft Deletes

- Use soft deletion only when retention, restoration, auditing, or legal requirements justify it.
- Ensure all relevant queries, uniqueness rules, restoration flows, and cleanup behavior account for deleted rows.
- Consider partial unique indexes for active rows.
- Define archival and purge behavior.

### Audit Data

- Distinguish ordinary timestamps from a complete audit trail.
- Keep append-only audit records separate from mutable business state when required.
- Record only necessary actor, action, timestamp, identifiers, and safe context.
- Define retention, access controls, and sensitive-data handling.

### Data Backfills

- Keep large backfills separate from normal application startup.
- Process bounded, resumable, and preferably idempotent batches.
- Track progress, rate-limit impact, and verify counts and invariants.
- Do not remove compatibility code until the backfill and rollout are confirmed.

### Views and Materialized Views

- Use views for stable reusable query abstractions when they improve clarity.
- Use materialized views only when stale results are acceptable.
- Define refresh ownership, frequency, failure handling, and concurrency behavior.
- Do not hide unexpectedly expensive logic behind simple view names.

### Functions and Triggers

- Use functions or triggers only when centralized database enforcement or performance provides a clear benefit.
- Keep behavior focused, documented, schema-qualified where appropriate, and safe under bulk operations.
- Review `SECURITY DEFINER`, volatility, search path, recursion, and write-path performance carefully.

### Partitioning

- Use partitioning only when table size, retention, maintenance, or query patterns justify it.
- Align partition keys with pruning and lifecycle operations.
- Define partition creation, indexing, uniqueness, archival, and retention behavior.
- Avoid excessive partition counts and verify planner behavior.

### Connection and Timeout Management

- Size connection pools against total database capacity across all application instances and tools.
- Configure connection, statement, lock, and idle-transaction timeouts by workload.
- Release connections promptly and avoid retry storms.
- Use external poolers only when their session and transaction behavior matches the application.

### Replication and Read Replicas

- Use replicas only where stale reads are acceptable.
- Route read-after-write and other consistency-sensitive operations to the primary.
- Monitor lag and document failover behavior.
- Do not use replicas to hide inefficient queries.

### Backup and Recovery

- Define and test recovery point and recovery time objectives.
- Verify restoration, not only backup creation.
- Protect backup credentials and storage.
- Include required roles, ownership, extensions, and configuration in recovery planning.

### Operations and Observability

- Monitor connection usage, slow queries, lock waits, deadlocks, long transactions, idle-in-transaction sessions, autovacuum health, table/index growth, and migration failures as relevant.
- Avoid logging every SQL statement or sensitive parameters in production.
- Keep alerts actionable and tied to operational ownership.
