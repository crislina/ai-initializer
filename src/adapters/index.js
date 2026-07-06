import { claudeAdapter } from "./claude.js";
import { codexAdapter } from "./codex.js";
import { clineAdapter } from "./cline.js";

const adapters = [claudeAdapter, codexAdapter, clineAdapter];

export function listAdapters() {
  return adapters.map(({ id, displayName, entryFile }) => ({
    id,
    displayName,
    entryFile,
  }));
}

export function getAdapter(id) {
  const adapter = adapters.find((item) => item.id === id);

  if (!adapter) {
    throw new Error(`Unknown adapter: ${id}`);
  }

  return adapter;
}
