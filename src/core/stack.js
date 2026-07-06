export function conventionFilesFor(stack) {
  const files = ["general.md"];

  if (stack.includes("java") || stack.includes("spring")) {
    files.push("java-spring.md");
  }

  if (stack.includes("react")) {
    files.push("reactjs.md");
  }

  if (stack.includes("postgresql")) {
    files.push("postgresql.md");
  }


  return Array.from(new Set(files));
}
