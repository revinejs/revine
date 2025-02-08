import { defineConfig } from "vite";
import { generateRevineViteConfig } from "./generateConfig";

// Vite supports async config. We can do:
export default defineConfig(async () => {
  // Merge defaults + user overrides
  return await generateRevineViteConfig();
});
