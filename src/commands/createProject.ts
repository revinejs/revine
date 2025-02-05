import path from "path";
import { fileURLToPath } from "url";
import { updatePackageJson } from "../config/package.js";
import { updateReadme } from "../config/readme.js";
import { installDependencies } from "../installers/dependencies.js";
import { askForTailwindSetup } from "../prompts/tailwind.js";
import { setupTailwind } from "../setup/tailwind.js";
import { copyTemplate } from "../utils/file.js";
import { logError, logInfo } from "../utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createProject(
  projectName: string,
  options: { force?: boolean }
) {
  // Calculate directories. (Assumes the "template" folder is two levels above this file.)
  const templateDir = path.join(__dirname, "../../template");
  const projectDir = path.resolve(projectName);
  const isCurrentDir = [".", "./"].includes(projectName);

  try {
    logInfo(`Creating project in ${projectDir}...`);
    await copyTemplate(templateDir, projectDir, options.force);

    // Determine the final project name
    const finalProjectName = isCurrentDir
      ? path.basename(projectDir)
      : projectName;

    // Update package.json with the project name and ESM configuration.
    // Also add Tailwind dependencies if requested.
    const packageJsonPath = path.join(projectDir, "package.json");
    const useTailwind = await askForTailwindSetup();
    await updatePackageJson(packageJsonPath, finalProjectName, { useTailwind });

    // Update README.md with the project name.
    const readmePath = path.join(projectDir, "README.md");
    await updateReadme(readmePath, finalProjectName);

    // Install dependencies.
    logInfo("\nInstalling dependencies...");
    await installDependencies(projectDir);

    // If Tailwind is selected, perform its setup.
    if (useTailwind) {
      await setupTailwind(projectDir);
    }

    logInfo(`\nSuccess! Created project at ${projectDir}`);
    logInfo("\nStart developing with:");
    if (!isCurrentDir) console.log(`  cd ${projectName}`);
    console.log("  npm run dev\n");
  } catch (error) {
    logError("Error during project creation:", error);
    process.exit(1);
  }
}
