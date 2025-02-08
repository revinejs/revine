import inquirer from "inquirer";
import { execSync } from "child_process";
import { logInfo, logError } from "../utils/logger.js";

/**
 * Check if Git is installed on the system.
 * @returns {boolean} true if Git exists, false otherwise.
 */
function checkGitInstalled() {
  try {
    execSync("git --version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

/**
 * Initialize a Git repository in the project directory.
 * @param projectDir - The directory where the project was set up.
 */
export default async function initGit(projectDir: string) {
  if (!checkGitInstalled()) {
    logError(
      "Git is not installed. Please install Git to use version control."
    );
    return;
  }

  const { initializeGit } = await inquirer.prompt([
    {
      type: "confirm",
      name: "initializeGit",
      message: "Do you want to initialize a Git repository?",
      default: true,
    },
  ]);

  if (initializeGit) {
    const { commitMessage } = await inquirer.prompt([
      {
        type: "input",
        name: "commitMessage",
        message: "Enter the initial commit message:",
        default: "chore: initial setup from revine",
      },
    ]);

    try {
      execSync("git init", { cwd: projectDir, stdio: "inherit" });
      execSync("git add .", { cwd: projectDir, stdio: "inherit" });
      execSync(`git commit -m "${commitMessage}"`, {
        cwd: projectDir,
        stdio: "inherit",
      });
      logInfo("Git repository initialized and initial commit created.");
    } catch (error) {
      logError("Failed to initialize Git repository or create commit.");
    }
  }
}
