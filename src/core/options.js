export function normalizeAi(value) {
  const input = String(value || "").trim().toLowerCase();

  const aliases = {
    claude: "claude",
    codex: "codex",
    chatgpt: "codex",
    openai: "codex",
    cline: "cline",
  };

  const normalized = aliases[input];

  if (!normalized) {
    throw new Error(`Unsupported AI: ${value}`);
  }

  return normalized;
}

export function normalizeBackend(value) {
  const input = String(value || "").trim().toLowerCase();

  const aliases = {
    java: "java",
    jdk: "java",
    python: "python",
    py: "python",
    none: "none",
    no: "none",
    n: "none",
  };

  const normalized = aliases[input];

  if (!normalized) {
    throw new Error(`Unsupported backend language: ${value}`);
  }

  return normalized;
}

export function normalizeFramework(value) {
  const input = String(value || "").trim().toLowerCase();

  const aliases = {
    spring: "spring",
    springboot: "spring",
    "spring-boot": "spring",
    "spring boot": "spring",
    none: "none",
    no: "none",
    n: "none",
  };

  const normalized = aliases[input];

  if (!normalized) {
    throw new Error(`Unsupported backend framework: ${value}`);
  }

  return normalized;
}

export function normalizeFrontend(value) {
  const input = String(value || "").trim().toLowerCase();

  const aliases = {
    react: "react",
    reactjs: "react",
    "react.js": "react",
    none: "none",
    no: "none",
    n: "none",
  };

  const normalized = aliases[input];

  if (!normalized) {
    throw new Error(`Unsupported frontend framework: ${value}`);
  }

  return normalized;
}

export function normalizeDatabase(value) {
  const input = String(value || "").trim().toLowerCase();

  const aliases = {
    postgresql: "postgresql",
    postgres: "postgresql",
    pg: "postgresql",
    psql: "postgresql",
    none: "none",
    no: "none",
    n: "none",
  };

  const normalized = aliases[input];

  if (!normalized) {
    throw new Error(`Unsupported database: ${value}`);
  }

  return normalized;
}

export function normalizeLevel(value) {
  const input = String(value || "").trim().toLowerCase();

  const aliases = {
    lite: "lite",
    light: "lite",
    simple: "lite",
    standard: "standard",
    std: "standard",
  };

  const normalized = aliases[input];

  if (!normalized) {
    throw new Error(`Unsupported convention level: ${value}`);
  }

  return normalized;
}

export function buildStack({ backend, framework, frontend, database }) {
  const stack = ["ai"];

  if (backend === "java") {
    stack.push("java");
  }

  if (backend === "python") {
    stack.push("python");
  }

  if (framework === "spring") {
    stack.push("spring");
  }

  if (frontend === "react") {
    stack.push("react");
  }

  if (database === "postgresql") {
    stack.push("postgresql");
  }

  if (stack.some((item) => ["java", "python", "spring", "react"].includes(item))) {
    stack.push("testing");
  }

  return Array.from(new Set(stack));
}
