import inquirer from "inquirer";
import { execSync } from "child_process";
import { logInfo } from "../utils/logger.js";

/**
 * Ask the user if they want to run the project after setup is complete.
 * If the user confirms, it will run `npm run dev` or the equivalent command.
 * @param projectDir - The directory where the project was set up.
 */
export default async function runProject(projectDir: string) {
  const { runProject } = await inquirer.prompt([
    {
      type: "confirm",
      name: "runProject",
      message: "Do you want to run the project now?",
      default: true,
    },
  ]);

  if (runProject) {
    logInfo("Running your Revine project on dev server...");

    try {
      execSync("npm run dev", { cwd: projectDir, stdio: "inherit" });
    } catch (error) {
      logInfo(
        "Failed to start the project. You can manually run `npm run dev`."
      );
    }
  }
}
