import { merge } from "lodash-es";
import { defaultViteConfig } from "./defaults/vite.js";
import { loadUserConfig } from "./utils/loadUserConfig.js";

interface UserConfig {
  vite?: Record<string, unknown>;
}

export async function generateRevineViteConfig() {
  // Load the user's revine.config.ts
  const userConfig = (await loadUserConfig()) as UserConfig;


  // Merge user "vite" overrides with your default config
  const finalConfig = merge({}, defaultViteConfig, userConfig.vite || {});

  return finalConfig;
}
