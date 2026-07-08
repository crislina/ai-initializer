# General Engineering Rules Lite

## Rule Priority

- **Guardrails** are hard constraints for small projects, demos, personal tools, and script-like repositories.
- **Quality Gates** define the minimum checks before work is reported as complete.
- **Conventions** are defaults. Follow the existing repository style when it is clear and sound.
- Explicit user requirements and repository instructions take precedence.

------

## Guardrails

- Do not replace requested behavior with a shortcut that only looks similar.
- Do not claim completion when the main requirement is missing or unverified.
- Do not hardcode secrets, credentials, tokens, or machine-specific paths.
- Do not expose raw exceptions, stack traces, SQL, credentials, or sensitive internals to users.
- Do not delete, disable, or weaken meaningful tests merely to make a check pass.
- Do not make broad rewrites, reorganizations, or dependency changes unless they are needed for the task.
- Do not leave fake implementations, core-path TODOs, or placeholder behavior as if the work is done.

------

## Quality Gates

Before reporting completion:

- Check the implementation against the user's requested behavior.
- Run the most relevant available test, lint, type-check, build, or smoke command.
- If a verification step cannot be run, say so plainly.
- Review the final change for unrelated edits, debug output, temporary files, local data, and secrets.
- Summarize what was verified and what remains unverified.

------

## Conventions

### Implementation

- Make the smallest coherent change that solves the task.
- Preserve the existing file layout, naming style, and dependency choices.
- Prefer simple, readable code over clever abstractions.
- Keep business behavior out of random utility functions when a clear home already exists.
- Validate external input before using it in important logic.
- Handle expected failure cases with clear, safe messages.
- Keep configuration outside source code when values vary by environment.

### Structure

- Keep related code near the feature that owns it.
- Avoid creating generic `utils`, `helpers`, or shared folders for one-off code.
- Extract a helper only when it makes the main flow easier to understand or removes real duplication.
- Avoid introducing a new framework or library when the existing stack is enough.

### Testing

- Add or update focused tests when behavior changes and the project already has a practical test setup.
- Test observable behavior rather than private implementation details.
- Cover the main success path and the most likely failure path.
- Keep tests deterministic and independent of local machine state.

### Change Discipline

- Keep unrelated cleanup out of the change.
- Preserve backward compatibility unless a breaking change was requested.
- Be honest about assumptions, skipped checks, and remaining risks.
