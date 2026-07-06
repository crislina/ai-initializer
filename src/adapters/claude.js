import { buildEntry } from "./shared.js";

export const claudeAdapter = {
  id: "claude",
  displayName: "Claude",
  entryFile: "CLAUDE.md",

  generateEntry({ conventionFiles }) {
    return buildEntry({
      title: "CLAUDE.md",
      assistantName: "Claude",
      conventionFiles,
    });
  },
};
