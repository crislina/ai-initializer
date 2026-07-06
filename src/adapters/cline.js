import { buildEntry } from "./shared.js";

export const clineAdapter = {
  id: "cline",
  displayName: "Cline",
  entryFile: "CLINE.md",

  generateEntry({ conventionFiles }) {
    return buildEntry({
      title: "CLINE.md",
      assistantName: "Cline",
      conventionFiles,
    });
  },
};
