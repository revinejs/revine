import path from "path";
import { fileURLToPath } from "url";
import { updatePackageJson } from "../config/package.js";
import { updateReadme } from "../config/readme.js";
import { installDependencies } from "../setup/dependencies.js";
import { askForTailwindSetup, initiateProject } from "../prompts/index.js";
import { setupTailwind } from "../setup/tailwind.js";
import { copyTemplate } from "../utils/file.js";
import { logError, logInfo } from "../utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createProject(
  projectName: string,
  options: { force?: boolean }
) {
  // Calculate directories. This uses "../../template" for your template folder.
  const templateDir = path.join(__dirname, "../../template");
  const projectDir = path.resolve(projectName);
  const isCurrentDir = [".", "./"].includes(projectName);

  try {
    logInfo(`Creating project in ${projectDir}...`);
    // This copies everything, including hidden directories like .revine
    await copyTemplate(templateDir, projectDir, options.force);

    // Derive final project name
    const finalProjectName = isCurrentDir
      ? path.basename(projectDir)
      : projectName;

    // Update package.json (e.g., set name, set "type": "module", add Tailwind deps if chosen)
    const packageJsonPath = path.join(projectDir, "package.json");
    const useTailwind = await askForTailwindSetup();
    await updatePackageJson(packageJsonPath, finalProjectName, { useTailwind });

    // Update README with the project name
    const readmePath = path.join(projectDir, "README.md");
    await updateReadme(readmePath, finalProjectName);

    // Install dependencies
    logInfo("\nInstalling dependencies...");
    await installDependencies(projectDir);

    // If Tailwind is selected, set it up
    if (useTailwind) {
      await setupTailwind(projectDir);
    }

    logInfo(`\nSuccess! Created project at ${projectDir}`);
    logInfo("\nStart developing with:");
    if (!isCurrentDir) console.log(`  cd ${projectName}`);
    console.log("  npm run dev\n");

    // Prompt to initiate project
    await initiateProject(projectDir);
  } catch (error) {
    logError("Error during project creation:", error);
    process.exit(1);
  }
}
