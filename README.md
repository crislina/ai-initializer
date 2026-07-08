# ai-convention-init

Interactive AI convention initializer for software projects.

It generates project-level AI instruction files and reusable convention files.

## Usage

```bash
npx ai-convention-init
```

You will be prompted to choose:

```text
? Which AI will be used for this project?
❯ Claude
  Codex
  Cline

? Backend language
❯ Java
  Python
  None

? Backend framework
❯ Spring Boot
  None

? Frontend framework
❯ React
  None

? Database
❯ PostgreSQL
  None

? Convention level
❯ Lite
  Standard
```

## Non-interactive Usage

```bash
npx ai-convention-init \
  --ai claude \
  --backend java \
  --framework spring \
  --frontend react \
  --database postgresql \
  --level standard \
  --yes
```

## Generated Files

For Claude:

```text
ai-convention.yaml
CLAUDE.md
conventions/
  general.md
  java.md
  spring.md
  reactjs.md
  postgresql.md
```

The backend framework prompt is shown only when the backend language is Java.

`ai-convention.yaml` records the generated project profile:

```yaml
assistant: claude
ruleLevel: standard

techStack:
  - java
  - spring
  - react
  - postgresql
```

For Codex:

```text
AGENTS.md
conventions/
  ...
```

For Cline:

```text
CLINE.md
conventions/
  ...
```

## Override Priority

1. Current user request
2. Project-specific instructions in the generated entry file
3. Default conventions under `conventions/`
4. Framework defaults

## Philosophy

- Defaults, not frameworks
- Easy to override
- Easy to extend
- One generated entry file per AI
- Shared convention files for stack-specific rules
