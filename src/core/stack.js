const TIERED_CONVENTIONS = new Set([
  "general",
  "java",
  "spring",
  "python",
  "reactjs",
  "postgresql",
]);

function conventionSourceFile(name, level) {
  return TIERED_CONVENTIONS.has(name) ? `${name}.${level}.md` : `${name}.md`;
}

function conventionOutputFile(name) {
  return `${name}.md`;
}

export function conventionFileSpecsFor(stack, level = "standard") {
  const names = ["general"];

  if (stack.includes("java")) {
    names.push("java");
  }

  if (stack.includes("python")) {
    names.push("python");
  }

  if (stack.includes("spring")) {
    names.push("spring");
  }

  if (stack.includes("react")) {
    names.push("reactjs");
  }

  if (stack.includes("postgresql")) {
    names.push("postgresql");
  }

  return Array.from(new Set(names)).map((name) => ({
    source: conventionSourceFile(name, level),
    output: conventionOutputFile(name),
  }));
}

export function conventionFilesFor(stack, level = "standard") {
  return conventionFileSpecsFor(stack, level).map((file) => file.output);
}
