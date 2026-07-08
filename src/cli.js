import { select, confirm } from "@inquirer/prompts";
import { getAdapter, listAdapters } from "./adapters/index.js";
import { generate } from "./core/generator.js";
import {
  normalizeAi,
  normalizeBackend,
  normalizeFramework,
  normalizeFrontend,
  normalizeDatabase,
  normalizeLevel,
  buildStack,
} from "./core/options.js";

function parseArgs(argv) {
  const args = {};

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (["--ai", "--assistant", "--target", "-a", "-t"].includes(arg)) {
      args.ai = argv[++i];
    } else if (["--backend", "-b"].includes(arg)) {
      args.backend = argv[++i];
    } else if (["--framework", "--backend-framework"].includes(arg)) {
      args.framework = argv[++i];
    } else if (["--frontend", "-f"].includes(arg)) {
      args.frontend = argv[++i];
    } else if (["--database", "--db", "-d"].includes(arg)) {
      args.database = argv[++i];
    } else if (["--level", "--tier", "--profile"].includes(arg)) {
      args.level = argv[++i];
    } else if (["--force"].includes(arg)) {
      args.force = true;
    } else if (["--yes", "-y"].includes(arg)) {
      args.yes = true;
    } else if (["--help", "-h"].includes(arg)) {
      args.help = true;
    }
  }

  return args;
}

function printHelp() {
  console.log(`ai-convention-init

Usage:
  npx ai-convention-init

  npx ai-convention-init \\
    --ai claude \\
    --backend java \\
    --framework spring \\
    --frontend react \\
    --database postgresql \\
    --level standard

Options:
  --ai, -a              AI: claude, codex, cline
  --backend, -b         Backend language: java, python, none
  --framework           Backend framework: spring, none
  --frontend, -f        Frontend framework: react, none
  --database, --db, -d  Database: postgresql, none
  --level               Convention level: lite, standard
  --force               Overwrite existing generated files
  --yes, -y             Skip confirmation
  --help, -h            Show help
`);
}

async function collectOptions(args) {
  const ai = args.ai
    ? normalizeAi(args.ai)
    : await select({
        message: "Which AI will be used for this project?",
        choices: listAdapters().map((adapter) => ({
          name: adapter.displayName,
          value: adapter.id,
          description: `Generates ${adapter.entryFile}`,
        })),
      });

  const backend = args.backend
    ? normalizeBackend(args.backend)
    : await select({
        message: "Backend language",
        choices: [
          { name: "Java", value: "java" },
          { name: "Python", value: "python" },
          { name: "None", value: "none" },
        ],
      });

  let framework = "none";

  if (backend === "java") {
    framework = args.framework
      ? normalizeFramework(args.framework)
      : await select({
          message: "Backend framework",
          choices: [
            { name: "Spring Boot", value: "spring" },
            { name: "None", value: "none" },
          ],
        });
  }

  const frontend = args.frontend
    ? normalizeFrontend(args.frontend)
    : await select({
        message: "Frontend framework",
        choices: [
          { name: "React", value: "react" },
          { name: "None", value: "none" },
        ],
      });

  const database = args.database
    ? normalizeDatabase(args.database)
    : await select({
        message: "Database",
        choices: [
          { name: "PostgreSQL", value: "postgresql" },
          { name: "None", value: "none" },
        ],
      });

  const level = args.level
    ? normalizeLevel(args.level)
    : await select({
        message: "Convention level",
        choices: [
          {
            name: "Lite",
            value: "lite",
            description: "Small projects, demos, personal tools, and script-like repositories",
          },
          {
            name: "Standard",
            value: "standard",
            description: "Formal business projects with end-to-end change discipline",
          },
        ],
      });

  const stack = buildStack({ backend, framework, frontend, database });

  return {
    adapter: getAdapter(ai),
    backend,
    framework,
    frontend,
    database,
    level,
    stack,
    force: Boolean(args.force),
    yes: Boolean(args.yes),
  };
}

function printSummary(options) {
  console.log("\nConfiguration\n");
  console.log(`AI:        ${options.adapter.displayName}`);
  console.log(`Backend:   ${options.backend === "none" ? "None" : options.backend}`);
  console.log(`Framework: ${options.framework === "none" ? "None" : options.framework}`);
  console.log(`Frontend:  ${options.frontend === "none" ? "None" : options.frontend}`);
  console.log(`Database:  ${options.database === "none" ? "None" : options.database}`);
  console.log(`Level:     ${options.level}`);
  console.log(`Stack:     ${options.stack.join(", ")}`);
}

export async function runCli() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    return;
  }

  try {
    const options = await collectOptions(args);

    printSummary(options);

    const shouldGenerate = options.yes || await confirm({
      message: "Generate AI convention files?",
      default: true,
    });

    if (!shouldGenerate) {
      console.log("Cancelled.");
      return;
    }

    generate({
      adapter: options.adapter,
      stack: options.stack,
      level: options.level,
      force: options.force,
      cwd: process.cwd(),
    });

    console.log(`\nDone. Next step: open ${options.adapter.entryFile} and add project-specific overrides.`);
  } catch (error) {
    console.error(`\nError: ${error.message}`);
    process.exit(1);
  }
}
