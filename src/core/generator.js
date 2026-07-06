import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { conventionFilesFor } from "./stack.js";

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

export function generate({ adapter, stack, force, cwd }) {
  const conventionFiles = conventionFilesFor(stack);
  const entry = adapter.generateEntry({ conventionFiles, stack });

  writeSafe(path.join(cwd, adapter.entryFile), entry, force);

  for (const file of conventionFiles) {
    writeSafe(
      path.join(cwd, "conventions", file),
      readTemplate(path.join("conventions", file)),
      force
    );
  }
}
