import path from "path";
import fs from "fs-extra";
import { updateViteConfig } from "../config/vite.js";
import { logInfo } from "../utils/logger.js";

export async function setupTailwind(projectDir: string) {
  logInfo("\nSetting up Tailwind CSS...");

  // Point to the hidden Vite config
  const viteConfigPath = path.join(
    projectDir,
    ".revine",
    "bundler",
    "vite.config.ts"
  );

  // Now use existing updateViteConfig logic on this new path
  await updateViteConfig(viteConfigPath);

  // Creating the CSS directory and file that imports Tailwind
  const cssDir = path.join(projectDir, "src", "styles");
  await fs.ensureDir(cssDir);
  await fs.writeFile(
    path.join(cssDir, "global.css"),
    "@import 'tailwindcss';\n"
  );

  // Prepend the CSS import to src/main.tsx
  const rootTsxPath = path.join(projectDir, "src", "root.tsx");
  const mainContent =
    `import './styles/global.css';\n` +
    (await fs.readFile(rootTsxPath, "utf-8"));
  await fs.writeFile(rootTsxPath, mainContent);
}
