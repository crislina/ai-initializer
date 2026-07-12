import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { conventionFileSpecsFor } from "./stack.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, "../..");

function writeSafe(filePath, content, force) {
  if (fs.existsSync(filePath) && !force) {
    console.log(`skip  ${path.relative(process.cwd(), filePath)} already exists`);
    return;
  }

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
  console.log(`write ${path.relative(process.cwd(), filePath)}`);
}

function upsertEntry(filePath, content) {
  const startMarker = "<!-- ai-convention-init:start -->";
  const endMarker = "<!-- ai-convention-init:end -->";

  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`write ${path.relative(process.cwd(), filePath)}`);
    return;
  }

  const existing = fs.readFileSync(filePath, "utf8");
  const start = existing.indexOf(startMarker);
  const end = existing.indexOf(endMarker);

  if (start !== -1 && end !== -1 && end > start) {
    const afterEnd = end + endMarker.length;
    const next = `${existing.slice(0, start)}${content.trimEnd()}${existing.slice(afterEnd)}`;
    fs.writeFileSync(filePath, next, "utf8");
    console.log(`update ${path.relative(process.cwd(), filePath)} generated block`);
    return;
  }

  const separator = existing.trimStart().length ? "\n\n" : "";
  fs.writeFileSync(filePath, `${content.trimEnd()}${separator}${existing}`, "utf8");
  console.log(`insert ${path.relative(process.cwd(), filePath)} generated block`);
}

function readTemplate(relativePath) {
  return fs.readFileSync(path.join(packageRoot, "templates", relativePath), "utf8");
}

function buildProjectConfig({ adapter, stack, level }) {
  const techStack = stack.filter((item) => item !== "ai" && item !== "testing");
  const stackBlock = techStack.length
    ? `techStack:\n${techStack.map((item) => `  - ${item}`).join("\n")}`
    : "techStack: []";

  return `assistant: ${adapter.id}
ruleLevel: ${level}

${stackBlock}
`;
}

export function generate({ adapter, stack, level = "standard", force, cwd }) {
  const conventionFileSpecs = conventionFileSpecsFor(stack, level);
  const conventionFiles = conventionFileSpecs.map((file) => file.output);
  const entry = adapter.generateEntry({ conventionFiles, stack });

  writeSafe(path.join(cwd, "ai-convention.yaml"), buildProjectConfig({ adapter, stack, level }), force);
  upsertEntry(path.join(cwd, adapter.entryFile), entry);

  for (const file of conventionFileSpecs) {
    writeSafe(
      path.join(cwd, "conventions", file.output),
      readTemplate(path.join("conventions", file.source)),
      force
    );
  }
}
