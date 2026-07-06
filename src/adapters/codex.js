import { buildEntry } from "./shared.js";

export const codexAdapter = {
  id: "codex",
  displayName: "Codex",
  entryFile: "AGENTS.md",

  generateEntry({ conventionFiles }) {
    return buildEntry({
      title: "AGENTS.md",
      assistantName: "Codex",
      conventionFiles,
    });
  },
};
