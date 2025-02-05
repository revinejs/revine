// .revine/bundler/generateConfig.ts
import { merge } from 'lodash-es';
import { defaultViteConfig } from './defaults/vite.js';
import { loadUserConfig } from './utils/loadUserConfig.js';
import tailwindcss from '@tailwindcss/vite';   // For direct plugin usage

export async function generateRevineViteConfig() {
  // Load the user's revine.config.ts
  const userConfig = await loadUserConfig();

  // Merge user "vite" overrides with your default config
  const finalConfig = merge({}, defaultViteConfig, userConfig.vite || {});

  // Insert the Tailwind plugin, if desired, automatically or conditionally:
  // finalConfig.plugins.push(tailwindcss());

  return finalConfig;
}
