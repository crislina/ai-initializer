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
  writeSafe(path.join(cwd, adapter.entryFile), entry, force);

  for (const file of conventionFileSpecs) {
    writeSafe(
      path.join(cwd, "conventions", file.output),
      readTemplate(path.join("conventions", file.source)),
      force
    );
  }
}
