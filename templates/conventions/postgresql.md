# PostgreSQL Rules

## General Principles

- Follow the PostgreSQL version configured by the project.
- Do not use features unavailable in the project’s supported PostgreSQL version.
- Follow the existing schema, naming, migration, and ownership conventions.
- Prefer clear and maintainable SQL over clever or overly compact queries.
- Treat the database schema as an important application contract.
- Keep data integrity enforced as close to the data as practical.
- Use application validation and database constraints together.
- Do not rely solely on application code to preserve critical data invariants.
- Make schema changes through the project’s approved migration tool.
- Do not make manual production schema changes outside the approved operational process.
- Keep changes backward-compatible when applications may be deployed gradually.

------

## Naming

- Use consistent naming across schemas, tables, columns, indexes, constraints, and sequences.
- Prefer lowercase `snake_case` names.
- Avoid quoted mixed-case identifiers.
- Use plural or singular table names consistently with the existing project convention.
- Use descriptive names.
- Avoid unexplained abbreviations.
- Use consistent primary key names, such as `id` or `<entity>_id`, according to project convention.
- Name foreign key columns consistently with the referenced entity.
- Use names that describe the business meaning rather than implementation history.
- Avoid reserved keywords as identifiers.
- Keep identifier lengths readable.
- Use descriptive constraint and index names.

Suggested patterns when no project convention exists:

- `pk_<table>`
- `fk_<table>_<column>`
- `uk_<table>_<columns>`
- `ck_<table>_<rule>`
- `idx_<table>_<columns>`

------

## Schemas

- Use schemas to create meaningful ownership or domain boundaries when justified.
- Do not create schemas solely to add hierarchy.
- Avoid placing every application object in the default `public` schema without considering project security and ownership conventions.
- Keep schema usage consistent.
- Set explicit object ownership.
- Avoid giving application roles ownership of database objects unless required by the operational model.
- Use explicit search paths where ambiguity or security concerns exist.
- Do not rely on an unsafe mutable `search_path`.
- Qualify object names in migrations and administrative scripts where practical.

------

## Tables

- Give each table a clear responsibility.
- Avoid storing unrelated concepts in the same table.
- Prefer normalized schemas by default.
- Denormalize only for a demonstrated performance, reporting, or operational need.
- Document deliberate denormalization and its synchronization strategy.
- Define a primary key for application tables unless there is a clear reason not to.
- Use foreign keys for relational integrity where practical.
- Make nullability deliberate.
- Do not mark columns nullable merely to simplify a migration.
- Use database defaults only when the default represents valid domain or operational behavior.
- Avoid using placeholder values such as empty strings, zero, or magic dates instead of `NULL`.
- Keep audit columns consistent where required, such as `created_at`, `updated_at`, `created_by`, and `updated_by`.
- Do not add audit columns automatically when the project does not need them.
- Avoid generic entity-attribute-value table designs unless flexibility genuinely outweighs validation and query complexity.
- Avoid storing multiple values in one delimited text column.
- Prefer relational child tables or appropriate array and JSON types based on clear query requirements.

------

## Data Types

- Choose the narrowest type that correctly represents the domain without creating artificial limits.
- Prefer native PostgreSQL types over encoding structured values as text.
- Use `boolean` for true or false values.
- Use `date` for calendar dates without time.
- Use `time` only when a time-of-day value is independent of a date and timezone.
- Prefer `timestamp with time zone` (`timestamptz`) for actual instants in time.
- Store timestamps in a consistent timezone, normally UTC at the application boundary.
- Do not use `timestamp without time zone` for global instants unless the domain intentionally represents local wall-clock time.
- Use `numeric` or `decimal` for exact monetary or precision-sensitive values.
- Do not use floating-point types for exact currency calculations.
- Define numeric precision and scale when business limits are meaningful.
- Use `text` when no meaningful maximum length exists.
- Use `varchar(n)` only when the maximum length is a real domain constraint.
- Do not use arbitrary small varchar limits merely by habit.
- Use `uuid` for UUID values rather than text.
- Use `jsonb` rather than `json` for queryable JSON documents unless preservation of the exact original representation is required.
- Use arrays only when the values naturally belong to one row and relational querying is limited.
- Use PostgreSQL enum types cautiously because changing and removing values can complicate deployments.
- Prefer lookup tables or text with check constraints when values evolve frequently.
- Use generated identity columns rather than legacy serial types for new schema design where supported and consistent with the project.
- Do not store IP addresses, networks, ranges, or geometric values as text when PostgreSQL provides a suitable native type.

------

## Primary Keys

- Use stable primary keys.
- Do not use mutable business values as primary keys unless immutability is guaranteed by the domain.
- Prefer application-consistent identifiers such as bigint identity or UUID.
- Consider index locality and write patterns when selecting UUID generation strategies.
- Do not expose sequential identifiers publicly when enumeration presents a security or business concern.
- Keep public identifiers separate from internal keys when the domain requires it.
- Avoid composite primary keys unless the relationship or domain naturally requires them.
- When using composite keys, keep their order aligned with common query patterns.

------

## Foreign Keys

- Use foreign key constraints to preserve relational integrity.
- Match the foreign key column type exactly with the referenced key type.
- Index foreign key columns when joins, lookups, updates, or deletes require it.
- Remember that PostgreSQL does not automatically create an index on the referencing foreign key column.
- Choose delete behavior deliberately.
- Do not use cascading deletion by default.
- Be cautious with long cascade chains.
- Keep ownership relationships clear.
- Avoid circular foreign key dependencies where practical.
- Add foreign keys safely for large existing tables using an operationally appropriate validation strategy.

------

## Constraints

- Use `NOT NULL` for required data.
- Use unique constraints for business values that must be unique.
- Use check constraints for stable row-level invariants.
- Use foreign key constraints for relationships.
- Keep application validation aligned with database constraints.
- Give constraints descriptive names.
- Do not depend solely on frontend or API validation.
- Consider case sensitivity when defining uniqueness.
- Use an expression-based unique index when uniqueness is based on normalized data such as `lower(email)`.
- Consider partial unique indexes for conditional uniqueness.
- Avoid complex check constraints that duplicate frequently changing business workflows.
- Use exclusion constraints for non-overlapping ranges or schedules when appropriate.
- Handle constraint violations explicitly in the application.
- Do not return raw database constraint errors directly to API clients.

------

## Indexes

- Add indexes based on real query patterns.
- Do not add an index to every column.
- Consider read benefit against write cost, storage, maintenance, and vacuum overhead.
- Index columns commonly used in selective filters, joins, stable sorting, uniqueness checks, and foreign key operations.
- Use multicolumn indexes when query predicates commonly use the indexed columns together.
- Order multicolumn index columns according to actual filtering and sorting patterns.
- Remember that a multicolumn index does not automatically replace every single-column index.
- Use covering indexes with included columns only when they materially reduce table access.
- Use partial indexes when queries repeatedly target a stable subset of rows.
- Use expression indexes for repeated indexed expressions.
- Use GIN indexes for appropriate `jsonb`, array, or full-text search workloads.
- Use GiST or SP-GiST for supported range, geometric, nearest-neighbor, or specialized queries where appropriate.
- Use BRIN indexes for very large, naturally ordered tables where block correlation is high.
- Avoid duplicate and overlapping indexes.
- Review unused indexes before removing them.
- Confirm that an index is genuinely unused across a representative period.
- Consider index creation impact on large production tables.
- Use concurrent index operations where operationally required and supported by the migration process.
- Be aware that concurrent index creation cannot run inside a normal transaction block.
- Verify query plans after adding important indexes.

------

## SQL Queries

- Select only the columns required.
- Avoid `SELECT *` in application queries.
- Use explicit joins.
- Avoid implicit comma joins.
- Use meaningful aliases.
- Keep aliases readable.
- Use parameterized queries.
- Never concatenate untrusted input into SQL.
- Avoid unnecessary subqueries when a clear join or common table expression is more readable.
- Use common table expressions when they improve clarity or are needed for recursive logic.
- Do not assume a common table expression always improves performance.
- Use `EXISTS` when checking for the existence of related rows.
- Avoid retrieving full rows solely to test existence.
- Use `IN` and `EXISTS` according to semantics and query-plan behavior.
- Avoid applying functions to indexed columns in filters unless an appropriate expression index exists.
- Avoid implicit type conversions that prevent index usage.
- Specify ordering when result order matters.
- Do not rely on insertion order or physical table order.
- Use stable ordering for pagination.
- Keep SQL formatting consistent and readable.
- Add comments only for non-obvious query intent or database-specific workarounds.

------

## Pagination

- Do not return unbounded result sets.
- Use pagination for collections that can grow large.
- Define a maximum page size.
- Use stable and deterministic ordering.
- Offset pagination is acceptable for small or moderate datasets and shallow navigation.
- Prefer keyset or cursor pagination for large tables, deep pagination, frequently changing datasets, or latency-sensitive queries.
- Use a unique tiebreaker in pagination ordering.
- Ensure cursor fields match the sort order.
- Avoid large offsets in performance-sensitive queries.
- Keep pagination behavior consistent with the API contract.

------

## Joins

- Use joins that reflect the intended relationship.
- Use `INNER JOIN` when a related row is required.
- Use `LEFT JOIN` when absence of a related row is valid.
- Do not use `LEFT JOIN` by default.
- Avoid joining large tables without selective filters or appropriate indexes.
- Watch for row multiplication in one-to-many joins.
- Do not use `DISTINCT` merely to hide an incorrect join.
- Aggregate intentionally when joining multiple child collections.
- Verify query cardinality assumptions.
- Review execution plans for complex multi-table joins.
- Keep join predicates explicit and type-compatible.

------

## Aggregation

- Use aggregate functions intentionally.
- Group by the minimum columns required by the result.
- Avoid grouping by unnecessary large text or JSON values.
- Filter rows with `WHERE` before aggregation where possible.
- Use `HAVING` for conditions on aggregate results.
- Use window functions when detail rows and aggregate context are both needed.
- Avoid repeated correlated aggregate subqueries when one grouped query is clearer and more efficient.
- Be explicit about null behavior in aggregate functions.
- Use `FILTER` clauses when they improve conditional aggregate readability.

------

## Transactions

- Keep transactions short.
- Do not hold transactions open while waiting for user interaction.
- Avoid slow remote calls inside database transactions.
- Group changes atomically when they must succeed or fail together.
- Do not combine unrelated operations in one transaction merely for convenience.
- Choose isolation levels based on actual consistency requirements.
- Do not increase isolation level without understanding contention and retry implications.
- Handle serialization failures and deadlocks with safe bounded retries where appropriate.
- Keep retrying transactions idempotent.
- Access tables and rows in a consistent order to reduce deadlocks.
- Do not catch and ignore database failures while continuing a transaction.
- Remember that a PostgreSQL transaction remains failed after an error until rollback.
- Use savepoints only when partial recovery is intentionally designed.
- Monitor long-running and idle-in-transaction sessions.
- Do not use autocommit assumptions as a substitute for explicit transaction design.

------

## Locking and Concurrency

- Use database locking only when required by correctness.
- Prefer optimistic concurrency controls when conflicts are infrequent.
- Use version columns or conditional updates to detect conflicting modifications.
- Use `SELECT ... FOR UPDATE` when rows must be locked before a coordinated update.
- Use `NOWAIT` or `SKIP LOCKED` only when their behavior matches the workflow.
- `SKIP LOCKED` is appropriate for queue-like work distribution, not general user-facing consistency.
- Keep locked sections short.
- Lock rows in a consistent order.
- Avoid table-level locks in application workflows.
- Understand that even ordinary updates acquire locks.
- Protect against duplicate processing with constraints or atomic updates rather than only application checks.
- Do not use advisory locks without clear ownership, timeout, and release semantics.

------

## Upserts

- Use `INSERT ... ON CONFLICT` for atomic insert-or-update behavior where appropriate.
- Define the conflict target explicitly.
- Ensure the relevant unique constraint or index matches the business rule.
- Do not implement upsert behavior as separate select-then-insert operations when concurrency is possible.
- Update only fields that should legitimately change.
- Avoid overwriting newer values unintentionally.
- Keep upsert behavior clear and test concurrent scenarios.

------

## JSONB

- Use `jsonb` for genuinely flexible or externally shaped data.
- Do not use `jsonb` to avoid designing a relational schema.
- Keep frequently filtered, joined, constrained, or updated fields as normal columns.
- Define the expected JSON structure at the application boundary.
- Validate required JSON properties in the application and, where appropriate, with database constraints.
- Use appropriate GIN or expression indexes for repeated JSON queries.
- Avoid indexing the entire JSON document without understanding size and write cost.
- Do not store unbounded arbitrary payloads without retention and size considerations.
- Avoid frequent partial updates to very large JSON documents.
- Document schema evolution for long-lived JSON data.
- Do not mix multiple unrelated document types in one JSON column without a clear discriminator and contract.

------

## Full-Text Search

- Use PostgreSQL full-text search when requirements fit its capabilities.
- Store or generate normalized search vectors consistently.
- Use an appropriate language configuration.
- Add GIN indexes for frequently searched text vectors.
- Avoid broad wildcard searches such as leading `%term%` on large datasets without a suitable indexing strategy.
- Use trigram indexes for appropriate fuzzy or substring search scenarios.
- Keep search ranking and normalization behavior explicit.
- Do not expose raw database search syntax directly to untrusted users.

------

## Soft Deletes

- Use soft deletion only when retention, restoration, auditing, or legal requirements justify it.
- Do not use soft deletion by default.
- Use a clear column such as `deleted_at` when the deletion timestamp matters.
- Ensure all relevant queries consistently exclude deleted rows.
- Consider partial unique indexes that apply only to active rows.
- Define how foreign keys, reporting, restoration, and final cleanup behave.
- Avoid mixing active and deleted semantics silently.
- Provide an archival or purge strategy for long-lived deleted data.
- Test uniqueness and restoration workflows.

------

## Audit Data

- Record audit data only when required.
- Distinguish operational timestamps from a complete audit history.
- Do not assume `updated_at` provides sufficient regulatory auditing.
- Use database triggers for audit behavior only when centralized enforcement is necessary and the operational cost is understood.
- Keep audit records append-only where required.
- Do not store unnecessary sensitive values in audit logs.
- Define retention and access controls for audit data.
- Include actor, action, timestamp, and relevant identifiers when required.
- Keep audit data changes separate from business state where appropriate.

------

## Migrations

- Use the project’s approved migration tool.
- Create a new migration for every schema change.
- Do not edit migrations that have already been deployed.
- Keep migration names descriptive.
- Keep migrations focused.
- Avoid combining unrelated schema changes.
- Make migrations safe for existing data.
- Consider the size of affected tables.
- Avoid long blocking operations during production deployment.
- Separate schema expansion, application rollout, data backfill, and schema cleanup when compatibility is required.
- Use an expand-and-contract approach for breaking changes.
- Add nullable columns or safe defaults before requiring new application behavior.
- Backfill data in controlled batches for large tables.
- Do not add a required column with an expensive default to a very large table without reviewing version-specific behavior and lock impact.
- Validate constraints separately when this reduces operational risk.
- Create large indexes using an operationally safe method.
- Do not assume all migration tools run every statement in the same transaction.
- Include rollback or recovery guidance for high-risk migrations.
- Test migrations against representative schema and data volumes.
- Verify migration compatibility with both the previous and new application versions during rolling deployment.

------

## Data Backfills

- Keep large backfills separate from normal application startup.
- Process data in bounded batches.
- Make backfills resumable.
- Make backfills idempotent where practical.
- Track progress explicitly.
- Avoid one massive transaction.
- Rate-limit backfills to protect production workloads.
- Use stable selection criteria.
- Avoid repeatedly scanning already processed rows.
- Define failure recovery and restart behavior.
- Verify counts and invariants after completion.
- Do not remove old columns or compatibility code until the backfill and application rollout are confirmed complete.

------

## Views and Materialized Views

- Use views to provide stable, reusable query abstractions when justified.
- Do not hide highly expensive logic behind innocently named views.
- Understand view expansion and query planning behavior.
- Use materialized views for expensive reusable results that can tolerate staleness.
- Define refresh frequency and ownership.
- Use concurrent refresh where required and supported by an appropriate unique index.
- Do not treat a materialized view as real-time data unless refresh semantics guarantee it.
- Monitor refresh duration and failure.
- Keep downstream dependencies documented.

------

## Functions and Triggers

- Use database functions and triggers when centralized database enforcement or performance provides a clear benefit.
- Do not move ordinary application business logic into the database by default.
- Keep functions focused and documented.
- Define volatility correctly.
- Use schema-qualified references where appropriate.
- Review security-definer functions carefully.
- Set safe search paths for security-definer functions.
- Avoid hidden trigger behavior that surprises application developers.
- Name triggers clearly.
- Prevent recursive trigger behavior unless intentionally designed.
- Test trigger behavior for inserts, updates, deletes, bulk operations, and migrations.
- Monitor performance impact on write-heavy tables.

------

## Roles and Permissions

- Apply least privilege.
- Separate migration, application, read-only, reporting, and administrative roles where practical.
- Do not run the application as a superuser.
- Do not make the application role the owner of all database objects unless required.
- Grant permissions explicitly.
- Avoid broad grants to `PUBLIC`.
- Restrict schema creation rights.
- Rotate credentials through the approved secret-management process.
- Do not store credentials in migrations or source control.
- Review default privileges for newly created objects.
- Use row-level security only when requirements justify the added complexity.
- Test row-level security using the actual application role and session context.
- Do not rely solely on row-level security policies without understanding bypass roles and ownership behavior.

------

## Security

- Use parameterized queries.
- Never concatenate untrusted input into SQL.
- Do not expose database errors directly to clients.
- Do not return SQL text, schema names, table names, constraint internals, or stack traces through APIs.
- Protect backups and exports as sensitive data.
- Encrypt connections where required.
- Verify server certificates according to the deployment security model.
- Restrict network access to the database.
- Avoid installing unapproved extensions.
- Review extension privileges and maintenance status.
- Keep PostgreSQL minor versions patched according to operational policy.
- Mask or anonymize sensitive production data used in non-production environments.
- Do not log sensitive query parameters.
- Apply retention and deletion requirements consistently.

------

## Performance and Query Plans

- Use `EXPLAIN` to inspect query plans.
- Use `EXPLAIN ANALYZE` carefully because it executes the query.
- Do not run write statements with `EXPLAIN ANALYZE` in production without understanding the impact.
- Compare estimated and actual row counts.
- Investigate large estimation errors.
- Check scan types, join strategies, sorting, temporary files, and buffer usage where available.
- Do not assume a sequential scan is always bad.
- Do not force index use through query tricks without understanding the planner.
- Keep table statistics current.
- Increase statistics targets only for columns that need better distribution estimates.
- Test performance with representative data volumes and distributions.
- Avoid optimizing only against an empty development database.
- Track slow and high-frequency queries.
- Prioritize total system impact, not only single-query latency.

------

## Vacuum and Table Health

- Allow autovacuum to operate effectively.
- Do not disable autovacuum globally.
- Tune autovacuum for high-churn tables when default behavior is insufficient.
- Monitor dead tuples, table bloat, transaction ID age, and vacuum progress.
- Avoid long-running transactions that prevent cleanup.
- Avoid idle-in-transaction sessions.
- Understand that updates create new row versions.
- Use appropriate fill factors only when evidence supports them.
- Use manual vacuum operations deliberately.
- Do not use `VACUUM FULL` casually because it requires strong locking and rewrites the table.
- Plan table and index maintenance according to workload and availability requirements.

------

## Partitioning

- Use partitioning only when table size, retention, maintenance, or query patterns justify it.
- Do not partition small tables merely as a future-proofing measure.
- Choose partition keys aligned with common filters and lifecycle operations.
- Ensure queries include partition-key predicates where pruning is expected.
- Define how new partitions are created.
- Define retention and archival behavior.
- Add required indexes and constraints to partitions consistently.
- Understand uniqueness limitations across partitions.
- Avoid excessive partition counts.
- Monitor planning overhead.
- Test inserts, updates across partition boundaries, and maintenance workflows.
- Do not assume partitioning automatically improves all queries.

------

## Connection Management

- Use connection pooling.
- Keep pool size aligned with database capacity and application concurrency.
- Do not configure each application instance with an excessively large pool.
- Account for total connections across all instances, jobs, reporting tools, and administrative users.
- Set connection, statement, and idle transaction timeouts appropriately.
- Release connections promptly.
- Do not perform slow external work while holding a database connection.
- Monitor pool exhaustion and wait time.
- Fail clearly when the database is unavailable.
- Avoid retry loops that cause connection storms.
- Use external poolers only when their transaction and session behavior is compatible with the application.

------

## Timeouts

- Configure statement timeouts according to workload class.
- Configure lock timeouts for operations that should fail rather than wait indefinitely.
- Configure idle-in-transaction timeouts.
- Do not rely only on application HTTP timeouts while the database query continues running.
- Use different timeout policies for interactive requests, background jobs, reporting, and migrations where appropriate.
- Handle timeout failures explicitly.
- Do not automatically retry expensive timed-out queries without correcting the underlying cause.

------

## Replication and Read Replicas

- Use read replicas only when stale reads are acceptable for the operation.
- Do not assume read-after-write consistency on a replica.
- Route consistency-sensitive reads to the primary.
- Handle replica lag explicitly.
- Do not use replicas to hide inefficient queries.
- Monitor replication delay and replay health.
- Keep failover behavior documented and tested.
- Avoid application logic that depends on a specific replica.
- Understand sequence and transaction behavior during failover.
- Do not run migrations independently against replicas.

------

## Backup and Recovery

- Ensure important databases have tested backup and recovery procedures.
- Do not treat the existence of backup files as proof that recovery works.
- Test restoration periodically.
- Define recovery point and recovery time objectives.
- Protect backup credentials and storage.
- Encrypt backups where required.
- Retain backups according to business and regulatory needs.
- Document point-in-time recovery requirements.
- Verify that extensions, roles, ownership, and configuration needed for restoration are included.
- Do not use logical dumps as the only recovery strategy for large critical systems without reviewing recovery-time implications.

------

## Testing

- Test SQL and migrations against PostgreSQL, not only an in-memory substitute.
- Use a PostgreSQL-compatible test environment such as containers when supported.
- Add integration tests for custom queries, constraints, important index-dependent behavior, migrations, transaction behavior, concurrency-sensitive workflows, and JSON or array mappings.
- Test constraint failures.
- Test uniqueness under concurrent operations where duplicates would be harmful.
- Use realistic data distributions for performance-sensitive tests.
- Avoid depending on unspecified row order.
- Keep tests isolated.
- Reset data safely between tests.
- Do not use production data directly in automated tests.

------

## Observability

- Monitor connection usage.
- Monitor slow queries.
- Monitor lock waits and deadlocks.
- Monitor long-running transactions.
- Monitor idle-in-transaction sessions.
- Monitor replication lag where applicable.
- Monitor autovacuum health, dead tuples, table growth, and index growth.
- Monitor migration duration and failures.
- Use database logs carefully to avoid exposing sensitive parameters.
- Track the application operation associated with important queries through safe correlation context.
- Avoid logging every SQL statement in production unless required for controlled troubleshooting.
- Make alerts actionable and tied to operational ownership.

------

## Documentation

- Document non-obvious schema decisions.
- Document intentional denormalization.
- Document unusual indexes, constraints, functions, triggers, partitioning, and retention rules.
- Document migration sequencing when multiple deployments are required.
- Keep entity relationship documentation aligned with the schema where maintained.
- Document important consistency and transaction assumptions.
- Document recovery, archival, and purge behavior for critical data.
